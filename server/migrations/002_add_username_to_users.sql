ALTER TABLE users
  ADD COLUMN username VARCHAR(80) NULL AFTER name;

UPDATE users
SET username = CASE
  WHEN email = 'admin@wayratrail.com' THEN 'admin'
  ELSE CONCAT(LOWER(SUBSTRING_INDEX(email, '@', 1)), '-', id)
END
WHERE username IS NULL OR username = '';

ALTER TABLE users
  MODIFY COLUMN username VARCHAR(80) NOT NULL;

ALTER TABLE users
  ADD UNIQUE KEY users_username_unique (username);
