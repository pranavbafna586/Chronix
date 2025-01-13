import React, { useState, useEffect } from "react"; // Add useEffect import
import {
  Plus,
  Search,
  Calendar,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TypeScript interfaces
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  labels: string[];
  dueDate: string;
  status: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanContent = () => {
  // State management
  const [columns, setColumns] = useState<Column[]>([
    { id: "1", title: "To Do", tasks: [] },
    { id: "2", title: "In Progress", tasks: [] },
    { id: "3", title: "Done", tasks: [] },
  ]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  // Add new state for column editing
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");

  // Task Modal Form State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    labels: [],
    dueDate: "",
    status: "To Do",
  });

  // Add new handlers for modal cleanup
  const handleCreateTaskModalChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Force cleanup when closing
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      setNewTask({}); // Reset form
    }
    setIsTaskModalOpen(newOpen);
  };

  const handleTaskDetailsModalChange = (newOpen: boolean) => {
    console.log("Task details dialog state changing to:", newOpen);
    if (!newOpen) {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      setSelectedTask(null);
      setIsEditing(false);
      setEditedTask(null);
    }
    setSelectedTask(null);
  };

  useEffect(() => {
    console.log("Task Details Modal state changed:", !!selectedTask);
    if (!selectedTask) {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    };
  }, [selectedTask]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (columnId: string) => {
    setDraggedOverColumn(columnId);
  };

  const handleDrop = (columnId: string) => {
    if (draggedTask) {
      const updatedColumns = columns.map((column) => {
        // Remove from source column
        if (column.tasks.find((task) => task.id === draggedTask.id)) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== draggedTask.id),
          };
        }
        // Add to target column
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, { ...draggedTask, status: column.title }],
          };
        }
        return column;
      });
      setColumns(updatedColumns);
      setDraggedTask(null);
      setDraggedOverColumn(null);
    }
  };

  const handleCreateTask = () => {
    if (newTask.title) {
      const task: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTask.title,
        description: newTask.description || "",
        priority: newTask.priority || "medium",
        labels: newTask.labels || [],
        dueDate: newTask.dueDate || "",
        status: newTask.status || "To Do",
      };

      const updatedColumns = columns.map((column) => {
        if (column.title === task.status) {
          return { ...column, tasks: [...column.tasks, task] };
        }
        return column;
      });

      setColumns(updatedColumns);
      setIsTaskModalOpen(false);
      setNewTask({});
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
    setIsEditing(true);
  };

  const handleUpdateTask = () => {
    if (editedTask) {
      const updatedColumns = columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === editedTask.id ? editedTask : task
        ),
      }));
      setColumns(updatedColumns);
      setIsEditing(false);
      setSelectedTask(null);
      setEditedTask(null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    }));
    setColumns(updatedColumns);
  };

  const handleEditColumn = (columnId: string, newTitle: string) => {
    const updatedColumns = columns.map((column) =>
      column.id === columnId ? { ...column, title: newTitle } : column
    );
    setColumns(updatedColumns);
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Add new column handler
  const handleAddColumn = () => {
    const newColumn: Column = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Column",
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  // Add column name edit handlers
  const handleStartEditColumn = (column: Column) => {
    setEditingColumnId(column.id);
    setEditingColumnTitle(column.title);
  };

  const handleColumnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingColumnTitle(e.target.value);
  };

  const handleColumnTitleSubmit = (columnId: string) => {
    if (editingColumnTitle.trim()) {
      handleEditColumn(columnId, editingColumnTitle.trim());
    }
    setEditingColumnId(null);
    setEditingColumnTitle("");
  };

  // Update the filtering logic for tasks
  const filterTasks = (task: Task, query: string) => {
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.labels.some((label) => label.toLowerCase().includes(query)) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  };

  return (
    <div className="min-h-screen p-6">
      {/* Enhanced Header */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-violet-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Progress Board
          </h1>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tasks, labels, priority..."
                className="pl-10 w-full border-2 border-violet-100 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 rounded-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
            <Button
              onClick={handleAddColumn}
              variant="outline"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Column
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-12rem)] transition-all duration-200 
              ${
                draggedOverColumn === column.id
                  ? "bg-violet-50 border-2 border-violet-200"
                  : ""
              }
              hover:shadow-xl`}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragOver(column.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(column.id);
            }}
          >
            <div className="flex justify-between items-center mb-6">
              {editingColumnId === column.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editingColumnTitle}
                    onChange={handleColumnTitleChange}
                    onBlur={() => handleColumnTitleSubmit(column.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleColumnTitleSubmit(column.id);
                      }
                    }}
                    className="h-8 w-40 px-2 text-lg font-bold"
                    autoFocus
                  />
                </div>
              ) : (
                <h2
                  className="font-bold text-lg text-gray-800 cursor-pointer hover:text-violet-600 transition-colors"
                  onClick={() => handleStartEditColumn(column)}
                >
                  {column.title}
                </h2>
              )}
              <div className="flex items-center gap-2">
                <span className="bg-violet-100 px-3 py-1 rounded-full text-sm text-violet-600 font-medium">
                  {column.tasks.length}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-violet-50 p-1 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleStartEditColumn(column)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Column
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteColumn(column.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Column
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Enhanced Tasks */}
            <div className="space-y-4">
              {column.tasks
                .filter((task) => filterTasks(task, searchQuery))
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="group bg-white border-l-4 border-violet-400 rounded-lg p-4 shadow-md 
                      cursor-move hover:shadow-lg transition-all duration-200 
                      hover:scale-[1.02] hover:border-l-violet-600"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                        {task.title}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="hover:bg-violet-50 p-1 rounded">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 items-center">
                      {task.priority && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      )}

                      {task.dueDate && (
                        <span className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}

                      {task.labels.map((label) => (
                        <span
                          key={label}
                          className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Add Task Button at bottom of column */}
              <button
                onClick={() => {
                  setNewTask({ ...newTask, status: column.title });
                  setIsTaskModalOpen(true);
                }}
                className="w-full py-2 px-3 border-2 border-dashed border-violet-200 rounded-lg
                  text-violet-600 hover:bg-violet-50 hover:border-violet-300
                  transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal Styling */}
      <Dialog open={isTaskModalOpen} onOpenChange={handleCreateTaskModalChange}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-violet-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-violet-800">
              Create New Task
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newTask.description || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full border rounded-md p-2"
                value={newTask.priority || "medium"}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value as Task["priority"],
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="labels">Labels (comma-separated)</Label>
              <Input
                id="labels"
                placeholder="Add labels, separated by commas"
                value={newTask.labels?.join(", ") || ""}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    labels: e.target.value
                      .split(",")
                      .map((label) => label.trim())
                      .filter(Boolean),
                  })
                }
                className="border-2 focus:border-violet-400 focus:ring-violet-200"
              />
              {newTask.labels && newTask.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTask.labels.map((label, index) => (
                    <span
                      key={index}
                      className="bg-violet-100 text-violet-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-2 border-violet-200 hover:bg-violet-50"
              onClick={() => setIsTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              onClick={handleCreateTask}
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Task Details Modal */}
      <Dialog open={!!selectedTask} onOpenChange={handleTaskDetailsModalChange}>
        <DialogContent
          className="sm:max-w-[600px] bg-gradient-to-br from-white to-violet-50 p-0 overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Add click propagation prevention
        >
          <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6">
              <DialogTitle className="text-2xl font-bold text-white m-0 flex items-center justify-between">
                {isEditing ? "Edit Task" : "Task Details"}
              </DialogTitle>
            </div>

            {/* Content with enhanced styling */}
            {selectedTask && (
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="edit-title"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Title
                      </Label>
                      <Input
                        id="edit-title"
                        value={editedTask?.title || ""}
                        onChange={(e) =>
                          setEditedTask((prev) => ({
                            ...prev!,
                            title: e.target.value,
                          }))
                        }
                        className="border-2 focus:border-violet-400 focus:ring-violet-200"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="edit-description"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Description
                      </Label>
                      <Input
                        id="edit-description"
                        value={editedTask?.description || ""}
                        onChange={(e) =>
                          setEditedTask((prev) => ({
                            ...prev!,
                            description: e.target.value,
                          }))
                        }
                        className="border-2 focus:border-violet-400 focus:ring-violet-200"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="edit-priority"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Priority
                      </Label>
                      <select
                        id="edit-priority"
                        value={editedTask?.priority || "medium"}
                        onChange={(e) =>
                          setEditedTask((prev) => ({
                            ...prev!,
                            priority: e.target.value as Task["priority"],
                          }))
                        }
                        className="w-full border-2 rounded-md p-2 focus:border-violet-400 focus:ring-violet-200"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="edit-date"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Due Date
                      </Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={editedTask?.dueDate || ""}
                        onChange={(e) =>
                          setEditedTask((prev) => ({
                            ...prev!,
                            dueDate: e.target.value,
                          }))
                        }
                        className="border-2 focus:border-violet-400 focus:ring-violet-200"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="edit-labels"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Labels (comma-separated)
                      </Label>
                      <Input
                        id="edit-labels"
                        value={editedTask?.labels.join(", ") || ""}
                        onChange={(e) =>
                          setEditedTask((prev) => ({
                            ...prev!,
                            labels: e.target.value
                              .split(",")
                              .map((label) => label.trim()),
                          }))
                        }
                        className="border-2 focus:border-violet-400 focus:ring-violet-200"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="edit-status"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Status
                      </Label>
                      <select
                        id="edit-status"
                        value={editedTask?.status || ""}
                        onChange={(e) =>
                          setEditedTask((prev) => ({
                            ...prev!,
                            status: e.target.value,
                          }))
                        }
                        className="w-full border-2 rounded-md p-2 focus:border-violet-400 focus:ring-violet-200"
                      >
                        {columns.map((column) => (
                          <option key={column.id} value={column.title}>
                            {column.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Title Section */}
                    <div className="border-b pb-4">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {selectedTask.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium
                          ${
                            selectedTask.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : selectedTask.priority === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {selectedTask.priority.charAt(0).toUpperCase() +
                            selectedTask.priority.slice(1)}{" "}
                          Priority
                        </span>
                        {selectedTask.dueDate && (
                          <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            Due{" "}
                            {new Date(
                              selectedTask.dueDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Description
                      </Label>
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        {selectedTask.description || (
                          <span className="text-gray-400 italic">
                            No description provided
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Labels Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Labels
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.labels.length > 0 ? (
                          selectedTask.labels.map((label) => (
                            <span
                              key={label}
                              className="bg-violet-100 text-violet-800 text-sm px-3 py-1 rounded-full
                                flex items-center gap-1 hover:bg-violet-200 transition-colors"
                            >
                              <Tag className="h-3 w-3" />
                              {label}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">
                            No labels added
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Current Status
                      </Label>
                      <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg inline-block font-medium">
                        {selectedTask.status}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer with gradient border */}
            <DialogFooter className="p-6 border-t bg-gray-50">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTask(null);
                    }}
                    className="border-2 border-gray-200 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateTask}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setSelectedTask(null)}
                  className="border-2 border-gray-200 hover:bg-gray-100"
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanContent;
