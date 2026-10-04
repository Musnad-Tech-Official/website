"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { LuTriangleAlert, LuInfo, LuTrash2, LuLoader } from "react-icons/lu";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  variant?: "destructive" | "warning" | "info" | "default";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  hideCancel = false,
  variant = "destructive",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <LuTrash2 className="w-5 h-5 text-destructive" />;
      case "warning":
        return <LuTriangleAlert className="w-5 h-5 text-amber-500" />;
      case "info":
        return <LuInfo className="w-5 h-5 text-sky-500" />;
      case "default":
      default:
        return <LuInfo className="w-5 h-5 text-primary" />;
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case "destructive":
        return "bg-destructive/10 border-destructive/20";
      case "warning":
        return "bg-amber-500/10 border-amber-500/20";
      case "info":
        return "bg-sky-500/10 border-sky-500/20";
      case "default":
      default:
        return "bg-primary/10 border-primary/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-start" showCloseButton={false}>
        <div className="flex items-start gap-3.5 sm:gap-4 text-start">
          <div
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 mt-0.5 shadow-2xs",
              getIconBg()
            )}
          >
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0 space-y-1 text-start">
            <DialogHeader className="text-start space-y-1 p-0 mb-0">
              <DialogTitle className="text-base font-bold text-foreground text-start">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-start">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <DialogFooter className="mt-5 flex-row justify-end gap-2 pt-2 border-t border-border/40">
          {!hideCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-xl px-4 text-xs font-medium cursor-pointer"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "primary"}
            size="sm"
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-xl px-4 text-xs font-semibold gap-1.5 cursor-pointer shadow-2xs"
          >
            {isLoading && <LuLoader className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
