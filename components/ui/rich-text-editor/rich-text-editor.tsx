"use client";

import * as React from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlock from "@tiptap/extension-code-block";
import { EditorToolbar } from "./editor-toolbar";
import { uploadImageAction } from "@/lib/storage/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./image-node-view";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
        parseHTML: (element) => element.getAttribute("data-align") || "center",
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

export interface RichTextEditorProps {
  /**
   * HTML string or ProseMirror JSONContent
   */
  value?: string | JSONContent;
  /**
   * Callback fired whenever content changes
   */
  onChange?: (html: string, json: JSONContent) => void;
  /**
   * Placeholder when editor is empty
   */
  placeholder?: string;
  /**
   * Writing direction
   */
  dir?: "rtl" | "ltr" | "auto";
  /**
   * Minimum height of the editor area (e.g. "300px")
   */
  minHeight?: string;
  /**
   * Whether the editor is interactive or read-only
   */
  editable?: boolean;
  /**
   * Custom image upload handler. If not provided, defaults to Supabase Storage ('article-media' bucket).
   */
  onUploadImage?: (file: File) => Promise<string>;
  /**
   * Storage bucket for Supabase uploads
   */
  storageBucket?: string;
  /**
   * Additional wrapper class names
   */
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here, or paste text, code, or images directly...",
  dir = "auto",
  minHeight = "280px",
  editable = true,
  onUploadImage,
  storageBucket = "article-media",
  className,
}: RichTextEditorProps) {
  const isRtl = dir === "rtl";
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Upload helper for pasted, dropped, or selected images
  const handleUploadImage = React.useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploading(true);
      setUploadError(null);
      try {
        if (onUploadImage) {
          const customUrl = await onUploadImage(file);
          return customUrl;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadImageAction(formData, storageBucket);
        if (res.success && res.url) {
          return res.url;
        } else {
          setUploadError(res.error || "Failed to upload image.");
          return null;
        }
      } catch (err: unknown) {
        setUploadError((err as Error).message || "Error uploading image.");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadImage, storageBucket]
  );

  const editor = useEditor({
    immediatelyRender: false, // Prevents SSR hydration mismatch in Next.js
    editable,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
        underline: false,
      }),
      Underline,
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "bg-muted/70 text-foreground p-4 rounded-xl font-mono text-xs my-4 overflow-x-auto border border-border/80 shadow-xs text-left",
          dir: "ltr",
          style: "direction: ltr; text-align: left;",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:opacity-80 transition-opacity",
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML(), ed.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none focus:outline-none p-4 text-foreground text-sm sm:text-base leading-relaxed",
          "[&_pre]:text-left [&_pre]:[direction:ltr] [&_code]:[direction:ltr]",
          isRtl && "text-end"
        ),
        style: `min-height: ${minHeight}; direction: ${dir};`,
      },
      // 1. Handle pasting images directly from the clipboard
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              handleUploadImage(file).then((url) => {
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              });
              return true;
            }
          }
        }
        return false;
      },
      // 2. Handle dragging & dropping images onto the editor
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files || []);
        const imageFile = files.find((f) => f.type.startsWith("image/"));
        if (imageFile) {
          event.preventDefault();
          handleUploadImage(imageFile).then((url) => {
            if (url && editor) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          });
          return true;
        }
        return false;
      },
    },
  });

  // Keep content synced if value changes externally
  React.useEffect(() => {
    if (!editor) return;
    const isSame =
      typeof value === "string"
        ? editor.getHTML() === value
        : JSON.stringify(editor.getJSON()) === JSON.stringify(value);

    if (!isSame && value !== undefined) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // File picker handler for toolbar image button
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const url = await handleUploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }

    // Reset input
    e.target.value = "";
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs transition-all focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary",
        className
      )}
    >
      {/* Hidden file input for toolbar image click */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Editor Toolbar */}
      {editable && (
        <EditorToolbar
          editor={editor}
          onImageUploadRequest={() => fileInputRef.current?.click()}
          isUploadingImage={isUploading}
          isRtl={isRtl}
        />
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="p-2 border-b border-border/60 bg-muted/20">
          <Alert variant="destructive" onClose={() => setUploadError(null)} className="py-2 px-3 text-xs">
            <AlertDescription className="text-xs font-medium">
              {uploadError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="relative">
        {isUploading && (
          <div className="absolute top-2 end-2 z-10 bg-primary text-primary-foreground px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-md animate-in fade-in-50">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{isRtl ? "جاري رفع الصورة إلى Supabase..." : "Uploading image to Supabase..."}</span>
          </div>
        )}

        <EditorContent editor={editor} />
      </div>

      {/* Footer Info: Word & Character Count */}
      {editor && (
        <div className="px-4 py-2 border-t border-border/40 bg-muted/10 text-[11px] text-muted-foreground flex items-center justify-between select-none">
          <span className="font-mono">
            {isRtl ? "محرر مسند الثري (Tiptap)" : "Musnad Rich Text Editor (Tiptap)"}
          </span>
          <span className="font-mono">
            {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length}{" "}
            {isRtl ? "كلمة" : "words"} · {editor.getText().length} {isRtl ? "حرف" : "characters"}
          </span>
        </div>
      )}
    </div>
  );
}
