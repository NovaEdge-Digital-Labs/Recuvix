"use client";

import React, { useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Image as ImageIcon,
    Code,
    Quote,
    List,
    Undo,
    Redo
} from 'lucide-react';

interface BlogEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/5 bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-md">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                icon={<Bold className="w-4 h-4" />}
                label="Bold"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                icon={<Italic className="w-4 h-4" />}
                label="Italic"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
                icon={<Heading2 className="w-4 h-4" />}
                label="H2"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive('heading', { level: 3 })}
                icon={<Heading3 className="w-4 h-4" />}
                label="H3"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                icon={<List className="w-4 h-4" />}
                label="Bullet List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                icon={<Quote className="w-4 h-4" />}
                label="Quote"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                active={editor.isActive('codeBlock')}
                icon={<Code className="w-4 h-4" />}
                label="Code"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarButton
                onClick={addLink}
                active={editor.isActive('link')}
                icon={<LinkIcon className="w-4 h-4" />}
                label="Link"
            />
            <ToolbarButton
                onClick={addImage}
                icon={<ImageIcon className="w-4 h-4" />}
                label="Image"
            />
            <div className="flex-grow" />
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                icon={<Undo className="w-4 h-4" />}
                label="Undo"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                icon={<Redo className="w-4 h-4" />}
                label="Redo"
            />
        </div>
    );
};

const ToolbarButton = ({ onClick, active, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${active
                ? 'bg-accent text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        title={label}
        type="button"
    >
        {icon}
    </button>
);

const BlogEditor: React.FC<BlogEditorProps> = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-accent underline cursor-pointer',
                },
            }),
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-zinc-900 rounded-lg p-4 font-mono text-sm text-accent my-4 border border-zinc-800',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-zinc max-w-none min-h-[500px] p-6 focus:outline-none focus:ring-0',
            },
        },
    });

    return (
        <div className="w-full bg-zinc-950 border border-white/5 rounded-xl overflow-hidden focus-within:border-accent/30 transition-colors">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default BlogEditor;
