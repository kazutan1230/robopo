-- 1. furigana を NULL に更新
UPDATE player
SET furigana = NULL
WHERE id >= 73;

-- 2. name に a, b, c... を順に代入（小文字アルファベット26文字まで）
WITH indexed_players AS (
  SELECT id,
         ROW_NUMBER() OVER (ORDER BY id) AS rownum
  FROM player
  WHERE id >= 73
)
UPDATE player
SET name = CHR(96 + indexed_players.rownum)  -- 97 = 'a'
FROM indexed_players
WHERE player.id = indexed_players.id
  AND indexed_players.rownum <= 26;
