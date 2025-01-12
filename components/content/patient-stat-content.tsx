"use client";

import { useState, useMemo } from "react";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample patient data
type Priority = "low" | "medium" | "high";

const patients: {
  id: string;
  name: string;
  age: number;
  condition: string;
  info: string;
  priority: Priority;
  label: string;
}[] = [
  {
    id: "PAT-8782",
    name: "John Smith",
    age: 45,
    condition: "Hypertension",
    info: "Regular blood pressure monitoring required, last reading 140/90",
    priority: "high",
    label: "Chronic",
  },
  {
    id: "PAT-7878",
    name: "Sarah Johnson",
    age: 32,
    condition: "Diabetes Type 2",
    info: "Blood sugar levels stabilizing with current medication",
    priority: "medium",
    label: "Managed",
  },
  {
    id: "PAT-7839",
    name: "Michael Brown",
    age: 58,
    condition: "Coronary Artery Disease",
    info: "Scheduled for quarterly checkup next week",
    priority: "high",
    label: "Critical",
  },
  {
    id: "PAT-5562",
    name: "Emily Davis",
    age: 28,
    condition: "Asthma",
    info: "Mild symptoms, responding well to inhaler",
    priority: "low",
    label: "Stable",
  },
  {
    id: "PAT-8686",
    name: "Robert Wilson",
    age: 62,
    condition: "Arthritis",
    info: "Physical therapy sessions ongoing",
    priority: "medium",
    label: "Chronic",
  },
  {
    id: "PAT-1280",
    name: "Lisa Anderson",
    age: 41,
    condition: "Migraine",
    info: "Frequency of episodes reducing with new medication",
    priority: "low",
    label: "Managed",
  },
  {
    id: "PAT-7262",
    name: "David Martinez",
    age: 55,
    condition: "COPD",
    info: "Requires regular oxygen therapy",
    priority: "high",
    label: "Critical",
  },
  {
    id: "PAT-1138",
    name: "Jennifer Taylor",
    age: 37,
    condition: "Anxiety Disorder",
    info: "Responding well to therapy and medication",
    priority: "medium",
    label: "Stable",
  },
  {
    id: "PAT-7184",
    name: "William Turner",
    age: 49,
    condition: "Lower Back Pain",
    info: "Physical therapy recommended",
    priority: "low",
    label: "Mild",
  },
  {
    id: "PAT-5160",
    name: "Patricia Moore",
    age: 68,
    condition: "Osteoporosis",
    info: "Regular bone density monitoring",
    priority: "medium",
    label: "Chronic",
  },
];

const priorityMap = {
  low: { label: "Low Priority", className: "text-green-700 bg-green-100" },
  medium: {
    label: "Medium Priority",
    className: "text-yellow-700 bg-yellow-100",
  },
  high: { label: "High Priority", className: "text-red-700 bg-red-100" },
};

export default function PatientDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  // Sorting function
  const sortData = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  // Custom sorting function for priority
  const sortByPriority = (
    a: { priority: keyof typeof priorityOrder },
    b: { priority: keyof typeof priorityOrder }
  ) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  };

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = patients.filter(
      (patient) =>
        (priorityFilter === "all" || patient.priority === priorityFilter) &&
        Object.values(patient).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (sortConfig !== null) {
      filtered.sort((a: any, b: any) => {
        if (sortConfig.key === "priority") {
          return (
            sortByPriority(a, b) *
            (sortConfig.direction === "ascending" ? 1 : -1)
          );
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [patients, searchTerm, sortConfig, priorityFilter]);

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-300">
            Patient Management Dashboard
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor and manage your patients' conditions and treatments
          </p>
        </div>
        <Avatar className="h-12 w-12 ring-2 ring-gray-500 dark:ring-gray-400 shadow-md">
          <AvatarImage src="https://github.com/shadcn.png" alt="Doctor" />
          <AvatarFallback className="bg-blue-200 text-blue-800">
            DR
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Input
            placeholder="Search patients..."
            className="max-w-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="ml-auto bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 shadow-md"
          >
            Add Patient
          </Button>
        </div>
        <div className="rounded-md border border-blue-200 dark:border-blue-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
              <TableRow>
                <TableHead className="w-[80px]">
                  <Button
                    variant="ghost"
                    onClick={() => sortData("id")}
                    className="flex items-center gap-1 text-blue-700 dark:text-blue-300"
                  >
                    Sr No
                    <CaretSortIcon className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("name")}
                    className="flex items-center gap-1 text-blue-700 dark:text-blue-300"
                  >
                    Patient
                    <CaretSortIcon className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("condition")}
                    className="flex items-center gap-1 text-blue-700 dark:text-blue-300"
                  >
                    Disease
                    <CaretSortIcon className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => sortData("priority")}
                    className="flex items-center gap-1 text-blue-700 dark:text-blue-300"
                  >
                    Priority
                    <CaretSortIcon className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((patient, index) => (
                <TableRow
                  key={patient.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 dark:text-gray-300">
                          {patient.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                        >
                          {patient.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        {patient.info}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                    >
                      {patient.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`font-medium px-2 py-1 rounded-full ${
                        priorityMap[patient.priority].className
                      }`}
                    >
                      {priorityMap[patient.priority].label}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 text-gray-700 dark:text-gray-300">
          <div className="text-sm">
            Showing {filteredAndSortedData.length} patients
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select defaultValue="10">
                <SelectTrigger className="w-[70px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page 1 of 1
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {"<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {">"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
