"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CreateReportModal,
  type ReportData,
} from "@/components/reports/create-report-modal";
import { ReportCard } from "@/components/reports/report-card";
import { ReportDetailModal } from "@/components/reports/report-detail-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReportsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [editingReport, setEditingReport] = useState<ReportData | undefined>(
    undefined
  );
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  const handleSave = (data: ReportData) => {
    if (editingReport) {
      setReports(
        reports.map((report) => (report.id === data.id ? data : report))
      );
      setEditingReport(undefined);
    } else {
      setReports([...reports, data]);
    }
  };

  const handleEdit = (report: ReportData) => {
    setEditingReport(report);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (reportId: string) => {
    setDeletingReportId(reportId);
  };

  const confirmDelete = () => {
    if (deletingReportId) {
      setReports(reports.filter((report) => report.id !== deletingReportId));
      setDeletingReportId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-5 w-6" />
          Create
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClick={setSelectedReport}
          />
        ))}
      </div>

      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingReport(undefined);
        }}
        onSave={handleSave}
        initialData={editingReport}
      />

      <ReportDetailModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <AlertDialog
        open={!!deletingReportId}
        onOpenChange={() => setDeletingReportId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this report?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              report and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
