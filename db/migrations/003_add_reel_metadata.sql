-- Add reel metadata columns: location, tags, views.
ALTER TABLE media ADD COLUMN location TEXT;
ALTER TABLE media ADD COLUMN tags TEXT;
ALTER TABLE media ADD COLUMN views TEXT;
