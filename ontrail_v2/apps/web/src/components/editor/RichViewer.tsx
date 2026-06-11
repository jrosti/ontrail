import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichViewerProps {
  html: string;
  className?: string;
}

export function RichViewer({ html, className }: RichViewerProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight, Link.configure({ openOnClick: true })],
    content: html,
    editable: false,
  });

  if (!editor) return null;

  return <EditorContent editor={editor} className={className} />;
}
