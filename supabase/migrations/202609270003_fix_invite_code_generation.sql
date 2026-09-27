-- Some hosted Postgres projects expose gen_random_uuid() but not
-- gen_random_bytes(). Recreate the RPC with portable invite generation so
-- existing databases receive the fix without replaying the initial migration.
create or replace function public.create_group_with_owner(
  name text,
  subject text,
  description text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_group uuid;
  invite_code text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.groups(owner_id, name, subject, description)
  values(auth.uid(), name, subject, description)
  returning id into new_group;

  insert into public.group_members(group_id, user_id, role)
  values(new_group, auth.uid(), 'owner');

  loop
    invite_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (
      select 1 from public.group_invites where code = invite_code
    );
  end loop;

  insert into public.group_invites(group_id, code, created_by, expires_at)
  values(new_group, invite_code, auth.uid(), now() + interval '30 days');

  return new_group;
end;
$$;
