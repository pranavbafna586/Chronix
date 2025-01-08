import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import type { ReportData } from "./create-report-modal";

interface ReportCardProps {
  report: ReportData;
  onEdit: (report: ReportData) => void;
  onDelete: (reportId: string) => void;
  onClick: (report: ReportData) => void;
}

export function ReportCard({
  report,
  onEdit,
  onDelete,
  onClick,
}: ReportCardProps) {
  return (
    <Card
      className="relative cursor-pointer hover:shadow-md transition-shadow aspect-square flex flex-col"
      onClick={() => onClick(report)}
    >
      <div className="absolute right-2 top-2 z-10 flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(report);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(report.id!);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg line-clamp-1">{report.title}</CardTitle>
        <CardDescription className="line-clamp-1">
          {report.filename}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative flex-grow mb-2">
          <Image
            src={report.imageUrl || "/placeholder.svg"}
            alt={report.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {report.description}
        </p>
      </CardContent>
    </Card>
  );
}
