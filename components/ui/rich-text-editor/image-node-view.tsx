"use client";

import * as React from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import {
  LuTrash2,
  LuUpload,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuLoader,
  LuPencil,
} from "react-icons/lu";
import { uploadImageAction } from "@/lib/storage/actions";

export function ImageNodeView(props: NodeViewProps) {
  const { node, updateAttributes, deleteNode, selected } = props;
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) || "";
  const align = (node.attrs.align as "left" | "center" | "right") || "center";

  // Handle replacing image via file picker
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData, "article-media");
      if (res.success && res.url) {
        updateAttributes({ src: res.url });
      } else {
        alert(res.error || "Failed to update image.");
      }
    } catch (err: unknown) {
      alert((err as Error).message || "Upload error.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Handle editing image URL or alt text directly
  const handleEditUrl = () => {
    const newUrl = window.prompt("Enter new image URL:", src);
    if (newUrl && newUrl.trim() !== "") {
      updateAttributes({ src: newUrl.trim() });
    }
  };

  const alignClasses = {
    left: "mr-auto text-left",
    center: "mx-auto text-center",
    right: "ml-auto text-right",
  };

  return (
    <NodeViewWrapper className={`relative my-6 group block ${alignClasses[align]}`}>
      {/* Hidden file input for replacing this image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceFile}
        className="hidden"
      />

      <div
        className={`relative inline-block max-w-full rounded-2xl transition-all duration-200 overflow-hidden ${
          selected
            ? "ring-3 ring-primary ring-offset-2 ring-offset-background shadow-lg"
            : "hover:ring-2 hover:ring-primary/50"
        }`}
      >
        {/* The Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="rounded-2xl max-w-full max-h-[600px] object-contain border border-border/80 bg-muted/20"
        />

        {/* Uploading Spinner Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white z-20">
            <div className="flex items-center gap-2 bg-black/70 px-4 py-2 rounded-xl text-xs font-semibold">
              <LuLoader className="w-4 h-4 animate-spin text-primary" />
              <span>Updating image...</span>
            </div>
          </div>
        )}

        {/* Floating Action Bar (visible on hover or when image is selected) */}
        <div className="absolute top-3 end-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1.5 p-1 bg-black/80 backdrop-blur-md rounded-xl text-white shadow-xl border border-white/10">
          {/* Replace from computer */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 hover:bg-white/20 rounded-lg text-xs transition-colors cursor-pointer"
            title="Replace image (Upload)"
          >
            <LuUpload className="w-3.5 h-3.5" />
          </button>

          {/* Edit URL */}
          <button
            type="button"
            onClick={handleEditUrl}
            className="p-1.5 hover:bg-white/20 rounded-lg text-xs transition-colors cursor-pointer"
            title="Edit image URL"
          >
            <LuPencil className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/20 mx-0.5" />

          {/* Align Left */}
          <button
            type="button"
            onClick={() => updateAttributes({ align: "left" })}
            className={`p-1.5 hover:bg-white/20 rounded-lg text-xs transition-colors cursor-pointer ${
              align === "left" ? "bg-white/30 text-white font-bold" : "text-white/80"
            }`}
            title="Align Left"
          >
            <LuAlignLeft className="w-3.5 h-3.5" />
          </button>

          {/* Align Center */}
          <button
            type="button"
            onClick={() => updateAttributes({ align: "center" })}
            className={`p-1.5 hover:bg-white/20 rounded-lg text-xs transition-colors cursor-pointer ${
              align === "center" ? "bg-white/30 text-white font-bold" : "text-white/80"
            }`}
            title="Align Center"
          >
            <LuAlignCenter className="w-3.5 h-3.5" />
          </button>

          {/* Align Right */}
          <button
            type="button"
            onClick={() => updateAttributes({ align: "right" })}
            className={`p-1.5 hover:bg-white/20 rounded-lg text-xs transition-colors cursor-pointer ${
              align === "right" ? "bg-white/30 text-white font-bold" : "text-white/80"
            }`}
            title="Align Right"
          >
            <LuAlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/20 mx-0.5" />

          {/* Delete Image */}
          <button
            type="button"
            onClick={deleteNode}
            className="p-1.5 hover:bg-red-600/90 rounded-lg text-xs transition-colors cursor-pointer text-red-300 hover:text-white"
            title="Delete Image"
          >
            <LuTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
