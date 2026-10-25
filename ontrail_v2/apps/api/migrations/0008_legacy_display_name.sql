-- The display name shown in the app is the Hanko username once the user has one. The name a
-- user had before that (legacy `onuser` display name, or the name derived at first login) is
-- kept here instead of being overwritten, and stays the shown name until a Hanko username exists.
alter table users add column if not exists legacy_display_name text;
