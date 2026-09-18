ALTER TABLE attachments ADD COLUMN file_path VARCHAR(500) NULL;
UPDATE attachments SET file_path = '' WHERE file_path IS NULL;
ALTER TABLE attachments DROP COLUMN file_content;
ALTER TABLE attachments MODIFY COLUMN file_path VARCHAR(500) NOT NULL;
