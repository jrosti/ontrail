import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Icon } from '../ui/Icon';

interface RichEditorProps {
  value: string;
  onChange: (html: string, text: string) => void;
  placeholder?: string;
}

export function RichEditor({ value, onChange, placeholder = 'Write something…' }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
  });

  if (!editor) return null;

  const btn = (active: boolean, onClick: () => void, title: string, children: React.ReactNode) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 8,
        border: 0,
        background: active ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-dim)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 2,
          padding: '6px 8px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)',
          flexWrap: 'wrap',
        }}
      >
        {btn(
          editor.isActive('bold'),
          () => editor.chain().focus().toggleBold().run(),
          'Bold',
          <strong style={{ fontSize: 14, fontFamily: 'var(--font-display)' }}>B</strong>,
        )}
        {btn(
          editor.isActive('italic'),
          () => editor.chain().focus().toggleItalic().run(),
          'Italic',
          <em style={{ fontSize: 14, fontFamily: 'serif' }}>I</em>,
        )}
        {btn(
          editor.isActive('underline'),
          () => editor.chain().focus().toggleUnderline().run(),
          'Underline',
          <span style={{ fontSize: 13, textDecoration: 'underline' }}>U</span>,
        )}
        {btn(
          editor.isActive('highlight'),
          () => editor.chain().focus().toggleHighlight().run(),
          'Highlight',
          <Icon name="flame" size={14} />,
        )}
        <div style={{ width: 1, background: 'var(--border)', margin: '4px 2px' }} />
        {btn(
          editor.isActive('bulletList'),
          () => editor.chain().focus().toggleBulletList().run(),
          'Bullet list',
          <Icon name="menu" size={14} />,
        )}
        {btn(
          editor.isActive('orderedList'),
          () => editor.chain().focus().toggleOrderedList().run(),
          'Ordered list',
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>1.</span>,
        )}
        {btn(
          editor.isActive('blockquote'),
          () => editor.chain().focus().toggleBlockquote().run(),
          'Quote',
          <span style={{ fontSize: 18, lineHeight: 1 }}>"</span>,
        )}
        <div style={{ width: 1, background: 'var(--border)', margin: '4px 2px' }} />
        {btn(
          editor.isActive('heading', { level: 2 }),
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          'Heading 2',
          <span style={{ fontSize: 11, fontWeight: 700 }}>H2</span>,
        )}
        {btn(
          editor.isActive('heading', { level: 3 }),
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          'Heading 3',
          <span style={{ fontSize: 11, fontWeight: 700 }}>H3</span>,
        )}
        {btn(
          false,
          () => editor.chain().focus().undo().run(),
          'Undo',
          <Icon name="chevron" size={14} style={{ transform: 'rotate(180deg)' }} />,
        )}
        {btn(
          false,
          () => editor.chain().focus().redo().run(),
          'Redo',
          <Icon name="chevron" size={14} />,
        )}
      </div>
      <EditorContent
        editor={editor}
        style={{
          padding: '12px 14px',
          minHeight: 120,
          outline: 'none',
          fontSize: 14.5,
          lineHeight: 1.6,
          color: 'var(--text)',
          background: 'var(--surface-2)',
        }}
      />
    </div>
  );
}
