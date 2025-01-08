import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReportData } from "./create-report-modal";

interface ReportDetailModalProps {
  report: ReportData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportDetailModal({
  report,
  isOpen,
  onClose,
}: ReportDetailModalProps) {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{report.title}</DialogTitle>
          <DialogDescription>{report.filename}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative h-[300px] w-full">
            <Image
              src={report.imageUrl || "/placeholder.svg"}
              alt={report.title}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium">Description</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {report.description}
            </p>
          </div>
          {report.file && (
            <div>
              <h4 className="text-sm font-medium">Attached File</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.file.name}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
