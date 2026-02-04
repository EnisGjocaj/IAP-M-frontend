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

type ReferencePreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | null;
  url?: string | null;
  page?: number | null;
  excerpt?: string | null;
};

export const ReferencePreviewModal: React.FC<ReferencePreviewModalProps> = ({
  open,
  onOpenChange,
  title,
  url,
  page,
  excerpt,
}) => {
  const iframeUrl = url ? `${String(url)}${page ? `#page=${page}` : ""}` : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden">
        <div className="flex h-full flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="truncate">{title || "Reference"}</DialogTitle>
            <DialogDescription className="truncate">
              {page ? `Opening at page ${page}` : "Preview"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 px-6 pb-4">
            <div className="lg:col-span-2 h-full">
              {iframeUrl ? (
                <iframe
                  title={title || "PDF"}
                  src={iframeUrl}
                  className="h-full w-full rounded-md border bg-background"
                />
              ) : (
                <div className="h-full w-full rounded-md border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                  Missing PDF URL
                </div>
              )}
            </div>

            <div className="h-full rounded-md border bg-background p-4 overflow-auto">
              <div className="text-sm font-medium text-foreground mb-2">Referenced text</div>
              <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{excerpt || "—"}</div>
            </div>
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
