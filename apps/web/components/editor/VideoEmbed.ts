/** TipTap 커스텀 노드 - 영상 임베드 (YouTube/Vimeo/직접 URL) */
import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

function normalizeVideoUrl(url: string): string {
  const ytWatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;

  const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (ytEmbed) return url;

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return url;
}

function isDirectVideo(src: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
}

export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  addCommands() {
    return {
      setVideoEmbed:
        (attrs: { src: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src: normalizeVideoUrl(attrs.src) },
          });
        },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-video-embed]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const src = (HTMLAttributes.src as string) || '';

    if (isDirectVideo(src)) {
      return [
        'div',
        { 'data-video-embed': '', style: 'max-width:100%;' },
        ['video', mergeAttributes({ src, controls: 'true', style: 'max-width:100%;' })],
      ];
    }

    return [
      'div',
      {
        'data-video-embed': '',
        style:
          'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;',
      },
      [
        'iframe',
        mergeAttributes({
          src,
          frameborder: '0',
          allowfullscreen: 'true',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          style:
            'position:absolute;top:0;left:0;width:100%;height:100%;border:none;',
        }),
      ],
    ];
  },
});
