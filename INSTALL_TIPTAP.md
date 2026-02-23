# Tiptap 에디터 패키지 설치

`Module not found: Can't resolve '@tiptap/react'` 오류가 발생하면 아래 명령을 실행하세요.

## 방법 1: 프로젝트 루트에서 설치

```cmd
cd c:\Users\HDEC\aidesignlab_website_final_really
npm install
```

## 방법 2: 워크스페이스에 직접 설치

```cmd
cd c:\Users\HDEC\aidesignlab_website_final_really
npm install --workspace=@aidesignlab/web @tiptap/core @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image
```

## 방법 3: node_modules 초기화 후 재설치

```cmd
cd c:\Users\HDEC\aidesignlab_website_final_really
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm install
```

설치 후 `npm run dev:web`으로 개발 서버를 실행하세요.
