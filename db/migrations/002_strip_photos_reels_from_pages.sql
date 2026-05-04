-- Strip legacy photos[] / reels[] arrays from pages.data JSON.
-- Photos and reels now live in the dedicated `media` table.
UPDATE pages
SET data = json_remove(data, '$.photos', '$.reels')
WHERE slug IN ('travel', 'beauty');
