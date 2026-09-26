create extension if not exists "pgcrypto";
create extension if not exists "vector";

create type public.group_role as enum ('owner', 'moderator', 'member');
create type public.source_status as enum ('queued', 'processing', 'ready', 'failed', 'archived');
create type public.material_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Student',
  avatar_url text,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  name text not null check (char_length(name) between 3 and 80),
  subject text not null,
  description text,
  term text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.group_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table public.group_invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  code text not null unique,
  token_hash text,
  created_by uuid not null references public.profiles(id),
  expires_at timestamptz,
  max_uses integer,
  use_count integer not null default 0,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id),
  title text not null,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes between 1 and 26214400),
  status public.source_status not null default 'queued',
  page_count integer,
  language text,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  page_number integer not null default 1,
  chunk_index integer not null,
  content text not null,
  token_count integer,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  unique(source_id, page_number, chunk_index)
);

create index source_chunks_source_idx on public.source_chunks(source_id);
create index source_chunks_search_idx on public.source_chunks using gin(to_tsvector('english', content));

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  creator_id uuid not null references public.profiles(id),
  type text not null check (type in ('reviewer', 'flashcards', 'quiz', 'practice_test', 'slide_deck')),
  title text not null,
  description text,
  status public.material_status not null default 'draft',
  settings jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.materials(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'submitted', 'abandoned')),
  answers jsonb not null default '{}'::jsonb,
  score numeric,
  max_score numeric,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create table public.content_reports (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id),
  entity_type text not null,
  entity_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), new.raw_user_meta_data->>'avatar_url');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_group_member(target_group uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.group_members where group_id = target_group and user_id = auth.uid());
$$;
create or replace function public.has_group_role(target_group uuid, allowed public.group_role[]) returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.group_members where group_id = target_group and user_id = auth.uid() and role = any(allowed));
$$;

create or replace function public.create_group_with_owner(name text, subject text, description text default null) returns uuid language plpgsql security definer set search_path = public as $$
declare new_group uuid; invite_code text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.groups(owner_id, name, subject, description) values(auth.uid(), name, subject, description) returning id into new_group;
  insert into public.group_members(group_id, user_id, role) values(new_group, auth.uid(), 'owner');
  invite_code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 6));
  insert into public.group_invites(group_id, code, created_by, expires_at) values(new_group, invite_code, auth.uid(), now() + interval '30 days');
  return new_group;
end; $$;

create or replace function public.join_group_by_code(invite_code text) returns uuid language plpgsql security definer set search_path = public as $$
declare selected public.group_invites%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into selected from public.group_invites where code = upper(invite_code) and revoked_at is null and (expires_at is null or expires_at > now()) and (max_uses is null or use_count < max_uses) for update;
  if selected.id is null then raise exception 'This join code is invalid or expired'; end if;
  insert into public.group_members(group_id, user_id, role) values(selected.group_id, auth.uid(), 'member') on conflict do nothing;
  update public.group_invites set use_count = use_count + 1 where id = selected.id;
  return selected.group_id;
end; $$;

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_invites enable row level security;
alter table public.sources enable row level security;
alter table public.source_chunks enable row level security;
alter table public.materials enable row level security;
alter table public.attempts enable row level security;
alter table public.content_reports enable row level security;

create policy "profiles self read" on public.profiles for select using (id = auth.uid());
create policy "profiles self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "groups members read" on public.groups for select using (public.is_group_member(id));
create policy "groups leaders update" on public.groups for update using (public.has_group_role(id, array['owner','moderator']::public.group_role[]));
create policy "members members read" on public.group_members for select using (public.is_group_member(group_id));
create policy "members leaders manage" on public.group_members for all using (public.has_group_role(group_id, array['owner','moderator']::public.group_role[]));
create policy "invites leaders manage" on public.group_invites for all using (public.has_group_role(group_id, array['owner','moderator']::public.group_role[]));
create policy "sources members read" on public.sources for select using (public.is_group_member(group_id));
create policy "sources members create" on public.sources for insert with check (public.is_group_member(group_id) and uploader_id = auth.uid());
create policy "sources owner update" on public.sources for update using (uploader_id = auth.uid() or public.has_group_role(group_id, array['owner','moderator']::public.group_role[]));
create policy "chunks members read" on public.source_chunks for select using (exists(select 1 from public.sources s where s.id = source_id and public.is_group_member(s.group_id)));
create policy "materials group read" on public.materials for select using (public.is_group_member(group_id) and (status = 'published' or creator_id = auth.uid() or public.has_group_role(group_id, array['owner','moderator']::public.group_role[])));
create policy "materials members create" on public.materials for insert with check (public.is_group_member(group_id) and creator_id = auth.uid());
create policy "materials author update" on public.materials for update using (creator_id = auth.uid() or public.has_group_role(group_id, array['owner','moderator']::public.group_role[]));
create policy "attempts private" on public.attempts for select using (user_id = auth.uid());
create policy "attempts private create" on public.attempts for insert with check (user_id = auth.uid());
create policy "attempts private update" on public.attempts for update using (user_id = auth.uid());
create policy "reports own create" on public.content_reports for insert with check (reporter_id = auth.uid() and public.is_group_member(group_id));
create policy "reports leaders read" on public.content_reports for select using (reporter_id = auth.uid() or public.has_group_role(group_id, array['owner','moderator']::public.group_role[]));

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values ('source-files', 'source-files', false, 26214400, array['application/pdf','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','text/markdown']) on conflict (id) do nothing;
create policy "group source uploads" on storage.objects for insert to authenticated with check (bucket_id = 'source-files' and public.is_group_member((storage.foldername(name))[2]::uuid));
create policy "group source reads" on storage.objects for select to authenticated using (bucket_id = 'source-files' and public.is_group_member((storage.foldername(name))[2]::uuid));
