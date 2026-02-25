-- notices 테이블의 content/description 컬럼 기본값 제약조건 삭제 후 nvarchar(MAX)로 변경

-- 1. content 컬럼의 기본값 제약조건 동적 삭제
DECLARE @content_constraint NVARCHAR(256);
SELECT @content_constraint = d.name
FROM sys.default_constraints d
JOIN sys.columns c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id
JOIN sys.tables t ON c.object_id = t.object_id
WHERE t.name = 'notices' AND c.name = 'content';

IF @content_constraint IS NOT NULL
  EXEC('ALTER TABLE [notices] DROP CONSTRAINT [' + @content_constraint + ']');

-- 2. description 컬럼의 기본값 제약조건 동적 삭제
DECLARE @desc_constraint NVARCHAR(256);
SELECT @desc_constraint = d.name
FROM sys.default_constraints d
JOIN sys.columns c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id
JOIN sys.tables t ON c.object_id = t.object_id
WHERE t.name = 'notices' AND c.name = 'description';

IF @desc_constraint IS NOT NULL
  EXEC('ALTER TABLE [notices] DROP CONSTRAINT [' + @desc_constraint + ']');

-- 3. 컬럼 타입 변경
ALTER TABLE [notices] ALTER COLUMN [content] NVARCHAR(MAX) NOT NULL;
ALTER TABLE [notices] ALTER COLUMN [description] NVARCHAR(MAX) NOT NULL;

-- 4. 기본값 제약조건 재생성
ALTER TABLE [notices] ADD CONSTRAINT [notices_content_df] DEFAULT '' FOR [content];
ALTER TABLE [notices] ADD CONSTRAINT [notices_description_df] DEFAULT '' FOR [description];
