alter table public.profiles add column if not exists is_admin boolean not null default false;

update public.profiles p
set is_admin = true, updated_at = now()
from auth.users u
where p.id = u.id and lower(u.email) = 'darryljohn017@gmail.com';
