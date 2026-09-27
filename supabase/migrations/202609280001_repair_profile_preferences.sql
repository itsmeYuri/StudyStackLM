alter table public.profiles add column if not exists reduce_motion boolean not null default false;
alter table public.profiles add column if not exists large_study_text boolean not null default false;
