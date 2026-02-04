import React from "react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type PdfPreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url?: string | null;
  title?: string | null;
};

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ open, onOpenChange, url, title }) => {
  const canPreview = Boolean(url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden">
        <div className="flex h-full flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="truncate">{title || "PDF Preview"}</DialogTitle>
            <DialogDescription className="truncate">
              {canPreview ? "Previewing inside the app" : "No preview available"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 px-6 pb-4">
            {canPreview ? (
              <iframe
                title={title || "PDF preview"}
                src={String(url)}
                className="h-full w-full rounded-md border bg-background"
              />
            ) : (
              <div className="h-full w-full rounded-md border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                Missing PDF URL
              </div>
            )}
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (!url) return;
                window.open(String(url), "_blank");
              }}
              disabled={!url}
            >
              Download
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
