/** Poster Code Embed Tiptap Node - posterId, html, css */
// @ts-ignore - Vercel 빌드 시 @tiptap/core Node export 타입 해석 실패 (런타임에는 정상 동작)
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import PosterEmbedContent from './PosterEmbedContent';

function generatePosterId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `poster_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export const PosterEmbed = Node.create({
  name: 'posterEmbed',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      posterId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-poster-id'),
        renderHTML: (attrs: Record<string, string>) =>
          attrs.posterId ? { 'data-poster-id': attrs.posterId } : {},
      },
      html: {
        default: '',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-html') ?? '',
        renderHTML: (attrs: Record<string, string>) =>
          attrs.html ? { 'data-html': attrs.html } : {},
      },
      css: {
        default: '',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-css') ?? '',
        renderHTML: (attrs: Record<string, string>) =>
          attrs.css ? { 'data-css': attrs.css } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: (node: string | HTMLElement) =>
          typeof node !== 'string' &&
          node.getAttribute('data-type') === 'poster-embed'
            ? {}
            : false,
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return ['div', { 'data-type': 'poster-embed', ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PosterEmbedContent);
  },

  addCommands() {
    return {
      insertPosterEmbed:
        (attrs: { posterId: string; html: string; css: string }) =>
        ({ commands }: { commands: { insertContent: (arg: unknown) => boolean } }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              posterId: attrs.posterId,
              html: attrs.html,
              css: attrs.css,
            },
          }),
    };
  },
});

export { generatePosterId };
