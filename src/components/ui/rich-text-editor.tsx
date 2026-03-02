import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  RemoveFormatting,
  TableIcon,
  Plus,
  Minus,
  Trash2,
  Merge,
  Split,
} from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(({ content, onChange, placeholder, className }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarDivider = () => <div className="mx-0.5 h-5 w-px bg-border self-center" />;

  return (
    <div ref={ref} className={cn('rounded-md border border-input bg-background', className)}>
      {/* Compact Toolbar */}
      <div className="flex flex-wrap gap-0.5 border-b border-border p-1.5">
        {/* Text formatting */}
        <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} aria-label="Bold" className="h-7 w-7 p-0">
          <Bold className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic" className="h-7 w-7 p-0">
          <Italic className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()} aria-label="Strikethrough" className="h-7 w-7 p-0">
          <Strikethrough className="h-3.5 w-3.5" />
        </Toggle>

        <ToolbarDivider />

        {/* Headings */}
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} aria-label="Heading 1" className="h-7 w-7 p-0">
          <Heading1 className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading 2" className="h-7 w-7 p-0">
          <Heading2 className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Heading 3" className="h-7 w-7 p-0">
          <Heading3 className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('paragraph')} onPressedChange={() => editor.chain().focus().setParagraph().run()} aria-label="Paragraph" className="h-7 w-7 p-0">
          <Pilcrow className="h-3.5 w-3.5" />
        </Toggle>

        <ToolbarDivider />

        {/* Lists */}
        <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet List" className="h-7 w-7 p-0">
          <List className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Ordered List" className="h-7 w-7 p-0">
          <ListOrdered className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Quote" className="h-7 w-7 p-0">
          <Quote className="h-3.5 w-3.5" />
        </Toggle>

        <ToolbarDivider />

        {/* Alignment */}
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()} aria-label="Align Left" className="h-7 w-7 p-0">
          <AlignLeft className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()} aria-label="Align Center" className="h-7 w-7 p-0">
          <AlignCenter className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()} aria-label="Align Right" className="h-7 w-7 p-0">
          <AlignRight className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'justify' })} onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()} aria-label="Justify" className="h-7 w-7 p-0">
          <AlignJustify className="h-3.5 w-3.5" />
        </Toggle>

        <ToolbarDivider />

        {/* Link */}
        <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={setLink} aria-label="Add Link" className="h-7 w-7 p-0">
          <LinkIcon className="h-3.5 w-3.5" />
        </Toggle>

        {/* Clear formatting */}
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className="h-7 w-7 p-0">
          <RemoveFormatting className="h-3.5 w-3.5" />
        </Button>

        <ToolbarDivider />

        {/* Table controls */}
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="h-7 w-7 p-0" title="Insert Table">
          <TableIcon className="h-3.5 w-3.5" />
        </Button>
        {editor.isActive('table') && (
          <>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addRowAfter().run()} className="h-7 px-1 text-[10px] gap-0.5" title="Add Row">
              <Plus className="h-3 w-3" />R
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()} className="h-7 px-1 text-[10px] gap-0.5" title="Add Column">
              <Plus className="h-3 w-3" />C
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteRow().run()} className="h-7 px-1 text-[10px] gap-0.5" title="Delete Row">
              <Minus className="h-3 w-3" />R
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteColumn().run()} className="h-7 px-1 text-[10px] gap-0.5" title="Delete Column">
              <Minus className="h-3 w-3" />C
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().mergeCells().run()} className="h-7 w-7 p-0" title="Merge Cells">
              <Merge className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().splitCell().run()} className="h-7 w-7 p-0" title="Split Cell">
              <Split className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteTable().run()} className="h-7 w-7 p-0 text-destructive hover:text-destructive" title="Delete Table">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}

        <ToolbarDivider />

        {/* Undo/Redo */}
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="h-7 w-7 p-0">
          <Undo className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="h-7 w-7 p-0">
          <Redo className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
