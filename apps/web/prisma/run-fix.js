// notices 테이블 content/description 컬럼을 nvarchar(MAX)로 변경하는 스크립트
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('1. content 컬럼 기본값 제약조건 삭제...');
    await prisma.$executeRawUnsafe(`
      DECLARE @c NVARCHAR(256);
      SELECT @c = d.name
      FROM sys.default_constraints d
      JOIN sys.columns c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id
      JOIN sys.tables t ON c.object_id = t.object_id
      WHERE t.name = 'notices' AND c.name = 'content';
      IF @c IS NOT NULL EXEC('ALTER TABLE [notices] DROP CONSTRAINT [' + @c + ']');
    `);

    console.log('2. description 컬럼 기본값 제약조건 삭제...');
    await prisma.$executeRawUnsafe(`
      DECLARE @d NVARCHAR(256);
      SELECT @d = d.name
      FROM sys.default_constraints d
      JOIN sys.columns c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id
      JOIN sys.tables t ON c.object_id = t.object_id
      WHERE t.name = 'notices' AND c.name = 'description';
      IF @d IS NOT NULL EXEC('ALTER TABLE [notices] DROP CONSTRAINT [' + @d + ']');
    `);

    console.log('3. content 컬럼 타입을 nvarchar(MAX)로 변경...');
    await prisma.$executeRawUnsafe(`ALTER TABLE [notices] ALTER COLUMN [content] NVARCHAR(MAX) NOT NULL`);

    console.log('4. description 컬럼 타입을 nvarchar(MAX)로 변경...');
    await prisma.$executeRawUnsafe(`ALTER TABLE [notices] ALTER COLUMN [description] NVARCHAR(MAX) NOT NULL`);

    console.log('5. content 기본값 제약조건 재생성...');
    await prisma.$executeRawUnsafe(`ALTER TABLE [notices] ADD CONSTRAINT [notices_content_df] DEFAULT '' FOR [content]`);

    console.log('6. description 기본값 제약조건 재생성...');
    await prisma.$executeRawUnsafe(`ALTER TABLE [notices] ADD CONSTRAINT [notices_description_df] DEFAULT '' FOR [description]`);

    console.log('완료! notices 테이블 content/description 컬럼이 nvarchar(MAX)로 변경되었습니다.');
  } catch (err) {
    console.error('오류 발생:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
