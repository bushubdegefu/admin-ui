"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Edit2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const mockApps = [
  {
    id: 1,
    name: "App 1",
    description: "Description for App 1",
    active: true,
  },
  {
    id: 2,
    name: "App 2",
    description: "Description for App 2",
    active: false,
  },
  {
    id: 3,
    name: "App 3",
    description: "Description for App 3",
    active: true,
  },
  {
    id: 4,
    name: "App 4",
    description: "Description for App 4",
    active: true,
  },
  {
    id: 5,
    name: "App 5",
    description: "Description for App 5",
    active: false,
  },
  {
    id: 6,
    name: "App 6",
    description: "Description for App 6",
    active: true,
  },
  {
    id: 7,
    name: "App 7",
    description: "Description for App 7",
    active: true,
  },
  {
    id: 8,
    name: "App 8",
    description: "Description for App 8",
    active: false,
  },
  {
    id: 9,
    name: "App 9",
    description: "Description for App 9",
    active: true,
  },
  {
    id: 10,
    name: "App 10",
    description: "Description for App 10",
    active: false,
  },
];

export default function AppsPage() {
  const [apps, setApps] = useState(mockApps);
  const [newApp, setNewApp] = useState({
    name: "",
    description: "",
    active: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedApps, setPaginatedApps] = useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedApps(apps.slice(startIndex, endIndex));
  }, [apps, currentPage, pageSize]);

  const totalPages = Math.ceil(apps.length / pageSize);

  const handleNewAppChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewApp((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewApp = (e) => {
    e.preventDefault();
    const id = apps.length > 0 ? Math.max(...apps.map((app) => app.id)) + 1 : 1;
    setApps((prev) => [...prev, { id, ...newApp }]);
    setNewApp({ name: "", description: "", active: false });
  };

  const handleEdit = (app) => {
    setEditingId(app.id);
    setEditForm(app);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setApps((prev) =>
      prev.map((app) => (app.id === editingId ? editForm : app)),
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Apps Management</h1>

      {/* Add New App Form */}
      <form
        onSubmit={handleAddNewApp}
        className="mb-8 p-4 bg-amber-50 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Add New App</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              name="name"
              value={newApp.name}
              onChange={handleNewAppChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-description">Description</Label>
            <Input
              id="new-description"
              name="description"
              value={newApp.description}
              onChange={handleNewAppChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-active"
              name="active"
              checked={newApp.active}
              onCheckedChange={(checked) =>
                setNewApp((prev) => ({ ...prev, active: checked }))
              }
            />
            <Label htmlFor="new-active">Active</Label>
          </div>
        </div>
        <Button type="submit" className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add App
        </Button>
      </form>

      {/* Apps Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedApps.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.id}</TableCell>
              <TableCell>
                {editingId === app.id ? (
                  <Input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  app.name
                )}
              </TableCell>
              <TableCell>
                {editingId === app.id ? (
                  <Input
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                ) : (
                  app.description
                )}
              </TableCell>
              <TableCell>
                {editingId === app.id ? (
                  <Checkbox
                    className="bg-amber-400"
                    name="active"
                    checked={editForm.active}
                    onCheckedChange={(checked) =>
                      setEditForm((prev) => ({ ...prev, active: checked }))
                    }
                  />
                ) : (
                  <Checkbox
                    className="bg-amber-400"
                    checked={app.active}
                    disabled
                  />
                )}
              </TableCell>
              <TableCell>
                {editingId === app.id ? (
                  <div className="flex space-x-2">
                    <Button
                      className="bg-amber-400"
                      size="sm"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      className="border-amber-400 border-2"
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      className="border-amber-400 border-2"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(app)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white border-amber-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-amber-800">
                            Are you sure you want to delete this?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            This action cannot be undone. This will permanently
                            delete and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-amber-200 text-amber-800 hover:bg-amber-50">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={null}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">Rows per page:</p>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[3, 5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, apps.length)} of {apps.length}{" "}
          entries
        </p>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {[...Array(totalPages).keys()].map((page) => (
            <Button
              key={page + 1}
              size="sm"
              variant={currentPage === page + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
