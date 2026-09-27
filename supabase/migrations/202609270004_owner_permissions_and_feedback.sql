create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('change','feature','bug','other')),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new' check (status in ('new','reviewing','planned','closed')),
  created_at timestamptz not null default now()
);
alter table public.suggestions enable row level security;
create policy "suggestions own create" on public.suggestions for insert with check (user_id=auth.uid());
create policy "suggestions own read" on public.suggestions for select using (user_id=auth.uid());

drop policy if exists "sources members create" on public.sources;
create policy "sources owners create" on public.sources for insert with check (public.has_group_role(group_id,array['owner']::public.group_role[]) and uploader_id=auth.uid());
drop policy if exists "materials members create" on public.materials;
create policy "materials owners create" on public.materials for insert with check (public.has_group_role(group_id,array['owner']::public.group_role[]) and creator_id=auth.uid());
drop policy if exists "materials author update" on public.materials;
create policy "materials owners update" on public.materials for update using (public.has_group_role(group_id,array['owner']::public.group_role[]));
drop policy if exists "group source uploads" on storage.objects;
create policy "group owner source uploads" on storage.objects for insert to authenticated with check (bucket_id='source-files' and public.has_group_role((storage.foldername(name))[2]::uuid,array['owner']::public.group_role[]));
