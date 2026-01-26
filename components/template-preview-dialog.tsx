"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconX, IconExternalLink } from "@tabler/icons-react";

interface TemplatePreviewDialogProps {
  templateId: string;
  templateName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewDialog({
  templateId,
  templateName,
  open,
  onOpenChange,
}: TemplatePreviewDialogProps) {
  const previewUrl = `/api/preview/${templateId}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0 gap-0 translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] flex flex-col [&>button]:hidden">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            {templateName} Template Preview
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(previewUrl, "_blank")}
              className="gap-2"
            >
              <IconExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden min-h-0">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title={`${templateName} FAQ Template Preview`}
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
