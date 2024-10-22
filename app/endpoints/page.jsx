"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Edit2, Save, X, Trash2 } from "lucide-react";

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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useAuthRedirect from "../utils/useAuthRedirect";
import { Textarea } from "@/components/ui/textarea";
import { useEndPointStore } from "../store/endpoint";

function EndpointsPage() {
  useAuthRedirect();
  // const [endpoints, setEndpoints] = useState(mockEndpoint);
  const endpoints = useEndPointStore((state) => state.filtered_endpoints);
  const get_endpoints = useEndPointStore((state) => state.getEndPoints);
  const totalPages = useEndPointStore((state) => state.pages);
  const setFilter = useEndPointStore((state) => state.setFilterValue);
  const searchTerm = useEndPointStore((state) => state.filter);
  const [newEndpoint, setNewEndpoint] = useState({
    name: "",
    description: "",
    route_path: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnWidths, setColumnWidths] = useState({
    id: 10,
    name: 15,
    description: 30,
    path: 25,
    actions: 20,
  });

  const handleResize = (columnName) => (newSize) => {
    setColumnWidths((prev) => ({ ...prev, [columnName]: newSize }));
  };
  useEffect(() => {
    get_endpoints(currentPage, pageSize);
  }, [currentPage, pageSize, get_endpoints]);

  const handleNewEndpointChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEndpoint((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewEndpoint = (e) => {
    e.preventDefault();
    const id = setNewEndpoint({ name: "", description: "", active: false });
    console.log(id);
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
    console.log(editForm);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };
  // console.log(endpoints);
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
              name="route_path"
              value={newEndpoint.route_path}
              onChange={handleNewEndpointChange}
            />
          </div>
        </div>
        <Button type="submit" className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Endpoint
        </Button>
      </form>

      {/* Search Input */}
      <div className="flex space-y-2 flex-col w-full md:flex-row mb-4">
        <div></div>
        <div className="w-full md:w-9/12">
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full md:w-3/12 flex justify-start md:justify-end">
          <Select>
            <SelectTrigger className="border-amber-300 w-[180px]">
              <SelectValue placeholder="App" />
            </SelectTrigger>
            <SelectContent className="hover:text-black hover:bg-amber-50">
              <SelectItem value="light">Blue Admin</SelectItem>
              <SelectItem value="dark">BTM</SelectItem>
              <SelectItem value="system">Blue Article</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resizable  */}
      <div className="w-full">
        <ResizablePanelGroup direction="horizontal">
          <div className="w-full">
            <div className="w-full flex flex-row">
              <ResizablePanel
                defaultSize={columnWidths.id}
                onResize={handleResize("id")}
              >
                <div className="w-full px-4 py-1 border-b-2">ID</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={columnWidths.name}
                onResize={handleResize("name")}
              >
                <div className="w-full px-4 py-1 border-b-2">Name</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={columnWidths.description}
                onResize={handleResize("description")}
              >
                <div className="w-full px-4 py-1 border-b-2">Description</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={columnWidths.path}
                onResize={handleResize("path")}
              >
                <div className="w-full px-4 py-1 border-b-2">Path</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={columnWidths.actions}
                onResize={handleResize("actions")}
              >
                <div className="w-full px-4 py-1 border-b-2">Actions</div>
              </ResizablePanel>
            </div>
          </div>
        </ResizablePanelGroup>
        <div className="w-full">
          <div className="w-full">
            {endpoints.map((endpoint) => (
              <div
                className="w-full flex flex-row items-stretch"
                key={endpoint.id}
              >
                <div
                  style={{ width: `${columnWidths.id}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {endpoint.id}
                  </div>
                </div>

                <div
                  style={{ width: `${columnWidths.name}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2 overflow-hidden break-words">
                    {editingId === endpoint.id ? (
                      <Input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      endpoint.name
                    )}
                  </div>
                </div>

                <div
                  style={{ width: `${columnWidths.description}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {editingId === endpoint.id ? (
                      <Textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                      />
                    ) : (
                      endpoint.description
                    )}
                  </div>
                </div>
                <div
                  style={{ width: `${columnWidths.path}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2 over break-words">
                    {editingId === endpoint.id ? (
                      <Input
                        name="route_path"
                        value={editForm.route_path}
                        onChange={handleEditChange}
                      />
                    ) : (
                      endpoint.route_path
                    )}
                  </div>
                </div>

                <div
                  style={{ width: `${columnWidths.actions}%` }}
                  className="overflow-hidden"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {editingId === endpoint.id ? (
                      <div className="flex space-x-2">
                        <Button
                          className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                          size="sm"
                          variant="outline"
                          onClick={handleSave}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          className="text-amber-600 hover:text-amber-100 hover:bg-amber-800"
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
                          className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(endpoint)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-600 hover:text-amber-100 hover:bg-amber-800"
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
                                This action cannot be undone. This will
                                permanently delete and remove its data from our
                                servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-amber-200 text-amber-800 hover:bg-amber-50">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  delete_app(
                                    endpoint.id,
                                    currentPage,
                                    pageSize,
                                  );
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
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
              {[5, 10, 20, 50].map((size) => (
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
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages).keys()]
            .slice(
              Math.max(0, currentPage - 2),
              Math.min(totalPages, currentPage + 1),
            )
            .map((page) => (
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
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EndpointsPage;
