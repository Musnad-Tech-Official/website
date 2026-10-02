"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
  LuCode,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuPilcrow,
  LuList,
  LuListOrdered,
  LuQuote,
  LuSquareCode,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuLink,
  LuUnlink,
  LuImage,
  LuMinus,
  LuUndo,
  LuRedo,
  LuLoader,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUploadRequest: () => void;
  isUploadingImage?: boolean;
  isRtl?: boolean;
}

export function EditorToolbar({
  editor,
  onImageUploadRequest,
  isUploadingImage = false,
  isRtl = false,
}: EditorToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt(isRtl ? "أدخل رابط URL:" : "Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const buttonClass = (isActive: boolean, disabled = false) =>
    cn(
      "h-8 w-8 inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer select-none",
      isActive
        ? "bg-primary/15 text-primary border border-primary/30"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent",
      disabled && "opacity-40 cursor-not-allowed"
    );

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-border/70 bg-muted/20 rounded-t-xl text-xs">
      {/* 1. History */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={buttonClass(false, !editor.can().undo())}
        title={isRtl ? "تراجع (Ctrl+Z)" : "Undo (Ctrl+Z)"}
      >
        <LuUndo className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={buttonClass(false, !editor.can().redo())}
        title={isRtl ? "إعادة (Ctrl+Y)" : "Redo (Ctrl+Y)"}
      >
        <LuRedo className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border/60 mx-1" />

      {/* 2. Headings & Paragraph */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass(editor.isActive("paragraph"))}
        title={isRtl ? "فقرة عادية" : "Normal Text"}
      >
        <LuPilcrow className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        title={isRtl ? "عنوان رئيسي 1" : "Heading 1"}
      >
        <LuHeading1 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title={isRtl ? "عنوان فرعي 2" : "Heading 2"}
      >
        <LuHeading2 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        title={isRtl ? "عنوان فرعي 3" : "Heading 3"}
      >
        <LuHeading3 className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border/60 mx-1" />

      {/* 3. Text Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title={isRtl ? "غامق (Ctrl+B)" : "Bold (Ctrl+B)"}
      >
        <LuBold className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title={isRtl ? "مائل (Ctrl+I)" : "Italic (Ctrl+I)"}
      >
        <LuItalic className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
        title={isRtl ? "تسطير (Ctrl+U)" : "Underline (Ctrl+U)"}
      >
        <LuUnderline className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        title={isRtl ? "يتوسطه خط" : "Strikethrough"}
      >
        <LuStrikethrough className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive("code"))}
        title={isRtl ? "كود مدمج" : "Inline Code"}
      >
        <LuCode className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border/60 mx-1" />

      {/* 4. Text Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={buttonClass(editor.isActive({ textAlign: "left" }))}
        title={isRtl ? "محاذاة لليسار" : "Align Left"}
      >
        <LuAlignLeft className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={buttonClass(editor.isActive({ textAlign: "center" }))}
        title={isRtl ? "محاذاة للوسط" : "Align Center"}
      >
        <LuAlignCenter className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={buttonClass(editor.isActive({ textAlign: "right" }))}
        title={isRtl ? "محاذاة لليمين" : "Align Right"}
      >
        <LuAlignRight className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={buttonClass(editor.isActive({ textAlign: "justify" }))}
        title={isRtl ? "ضبط النص" : "Justify"}
      >
        <LuAlignJustify className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border/60 mx-1" />

      {/* 5. Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title={isRtl ? "قائمة نقطية" : "Bullet List"}
      >
        <LuList className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title={isRtl ? "قائمة مرقمة" : "Numbered List"}
      >
        <LuListOrdered className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border/60 mx-1" />

      {/* 6. Blocks: Quote, Code block, Divider */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive("blockquote"))}
        title={isRtl ? "اقتباس" : "Blockquote"}
      >
        <LuQuote className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive("codeBlock"))}
        title={isRtl ? "كتلة كود برمجية" : "Code Block"}
      >
        <LuSquareCode className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
        title={isRtl ? "خط فاصل" : "Horizontal Divider"}
      >
        <LuMinus className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border/60 mx-1" />

      {/* 7. Links & Images */}
      <button
        type="button"
        onClick={setLink}
        className={buttonClass(editor.isActive("link"))}
        title={isRtl ? "إضافة رابط" : "Add Link"}
      >
        <LuLink className="w-3.5 h-3.5" />
      </button>
      {editor.isActive("link") && (
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={buttonClass(false)}
          title={isRtl ? "إزالة الرابط" : "Remove Link"}
        >
          <LuUnlink className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Image Upload Trigger */}
      <button
        type="button"
        onClick={onImageUploadRequest}
        disabled={isUploadingImage}
        className={buttonClass(false, isUploadingImage)}
        title={isRtl ? "إدراج أو لصق صورة (يمكنك لصقها مباشرة أيضاً)" : "Insert Image (or paste from clipboard directly)"}
      >
        {isUploadingImage ? (
          <LuLoader className="w-3.5 h-3.5 animate-spin text-primary" />
        ) : (
          <LuImage className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
