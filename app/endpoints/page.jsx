"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const mockEndpoint = [
  {
    id: 1,
    name: "Endpoint 1",
    description: "Description for Endpoint 1",
    path: "/users/some",
  },
  {
    id: 2,
    name: "Endpoint 2",
    description: "Description for Endpoint 2",
    path: "/products/list",
  },
  {
    id: 3,
    name: "Endpoint 3",
    description: "Description for Endpoint 3",
    path: "/orders/create",
  },
  {
    id: 4,
    name: "Endpoint 4",
    description: "Description for Endpoint 4",
    path: "/customers/details",
  },
  {
    id: 5,
    name: "Endpoint 5",
    description: "Description for Endpoint 5",
    path: "/inventory/check",
  },
  {
    id: 6,
    name: "Endpoint 6",
    description: "Description for Endpoint 6",
    path: "/auth/login",
  },
  {
    id: 7,
    name: "Endpoint 7",
    description: "Description for Endpoint 7",
    path: "/reports/generate",
  },
  {
    id: 8,
    name: "Endpoint 8",
    description: "Description for Endpoint 8",
    path: "/settings/update",
  },
  {
    id: 9,
    name: "Endpoint 9",
    description: "Description for Endpoint 9",
    path: "/notifications/send",
  },
  {
    id: 10,
    name: "Endpoint 10",
    description: "Description for Endpoint 10",
    path: "/feedback/submit",
  },
];

export default function EndpointsPage() {
  const [endpoints, setEndpoints] = useState(mockEndpoint);
  const [newEndpoint, setNewEndpoint] = useState({
    name: "",
    description: "",
    path: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedEndpoints, setPaginatedEndpoints] = useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedEndpoints(endpoints.slice(startIndex, endIndex));
  }, [endpoints, currentPage, pageSize]);

  const totalPages = Math.ceil(endpoints.length / pageSize);

  const handleNewEndpointChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEndpoint((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewEndpoint = (e) => {
    e.preventDefault();
    const id =
      endpoints.length > 0
        ? Math.max(...endpoints.map((endpoint) => endpoint.id)) + 1
        : 1;
    setEndpoints((prev) => [...prev, { id, ...newEndpoint }]);
    setNewEndpoint({ name: "", description: "", active: false });
  };

  const handleEdit = (endpoint) => {
    setEditingId(endpoint.id);
    setEditForm(endpoint);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setEndpoints((prev) =>
      prev.map((endpoint) => (endpoint.id === editingId ? editForm : endpoint)),
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
      <h1 className="text-2xl font-bold mb-4">Endpoints Management</h1>

      {/* Add New Endpoint Form */}
      <form
        onSubmit={handleAddNewEndpoint}
        className="mb-8 p-4 bg-amber-50 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Endpoint</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              name="name"
              value={newEndpoint.name}
              onChange={handleNewEndpointChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-description">Description</Label>
            <Input
              id="new-description"
              name="description"
              value={newEndpoint.description}
              onChange={handleNewEndpointChange}
            />
          </div>
          <div>
            <Label htmlFor="new-Path">Path</Label>
            <Input
              id="new-path"
              name="path"
              value={newEndpoint.path}
              onChange={handleNewEndpointChange}
            />
          </div>
        </div>
        <Button type="submit" className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Endpoint
        </Button>
      </form>

      {/* Endpoints Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEndpoints.map((endpoint) => (
            <TableRow key={endpoint.id}>
              <TableCell>{endpoint.id}</TableCell>
              <TableCell>
                {editingId === endpoint.id ? (
                  <Input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  endpoint.name
                )}
              </TableCell>
              <TableCell>
                {editingId === endpoint.id ? (
                  <Input
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                ) : (
                  endpoint.description
                )}
              </TableCell>
              <TableCell>
                {editingId === endpoint.id ? (
                  <Input
                    name="path"
                    value={editForm.path}
                    onChange={handleEditChange}
                  />
                ) : (
                  endpoint.path
                )}
              </TableCell>
              <TableCell>
                {editingId === endpoint.id ? (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-amber-400"
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
                      onClick={() => handleEdit(endpoint)}
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
              {[2, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, endpoints.length)} of{" "}
          {endpoints.length} entries
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
