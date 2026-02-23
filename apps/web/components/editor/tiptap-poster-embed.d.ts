/** TipTap PosterEmbed 커스텀 확장 명령어 타입 선언 (모듈 보강) */
import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    posterEmbed: {
      insertPosterEmbed: (attrs: {
        posterId: string;
        html: string;
        css: string;
      }) => ReturnType;
    };
  }
}
