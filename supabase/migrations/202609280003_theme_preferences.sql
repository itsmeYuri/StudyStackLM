alter table public.profiles add column if not exists theme_mode text not null default 'system' check (theme_mode in ('light','dark','system'));
alter table public.profiles add column if not exists accent_theme text not null default 'rose' check (accent_theme in ('rose','violet','ocean','forest'));
