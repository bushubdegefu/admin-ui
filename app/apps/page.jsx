"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
import useAuthRedirect from "../utils/useAuthRedirect";
import { useAppStore } from "../store/app";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";

function AppsPage() {
  useAuthRedirect();
  const apps = useAppStore((state) => state.filtered_apps);
  const get_apps = useAppStore((state) => state.getApps);
  const patch_app = useAppStore((state) => state.patchApp);
  const post_app = useAppStore((state) => state.postApp);
  const delete_app = useAppStore((state) => state.deleteApp);
  const totalPages = useAppStore((state) => state.pages);
  const setFilter = useAppStore((state) => state.setFilterValue);
  const searchTerm = useAppStore((state) => state.filter);
  const [newApp, setNewApp] = useState({
    name: "",
    description: "",
    active: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [columnWidths, setColumnWidths] = useState({
    id: 10,
    name: 15,
    description: 40,
    active: 15,
    actions: 20,
  });

  const handleResize = (columnName) => (newSize) => {
    setColumnWidths((prev) => ({ ...prev, [columnName]: newSize }));
  };

  useEffect(() => {
    get_apps(currentPage, pageSize);
  }, [currentPage, pageSize, get_apps]);

  useEffect(() => {}, [apps, currentPage, pageSize]);

  const handleNewAppChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewApp((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewApp = (e) => {
    e.preventDefault();
    post_app(newApp, currentPage, pageSize);
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
    patch_app(editForm, currentPage, pageSize);
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
      </div>

      {/* Resizable Attempt */}
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
                defaultSize={columnWidths.active}
                onResize={handleResize("active")}
              >
                <div className="w-full px-4 py-1 border-b-2">Active</div>
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
            {apps.map((app) => (
              <div className="w-full flex flex-row items-stretch" key={app.id}>
                <div
                  style={{ width: `${columnWidths.id}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {app.id}
                  </div>
                </div>
                {/* <ResizableHandle /> */}
                <div
                  style={{ width: `${columnWidths.name}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {editingId === app.id ? (
                      <Input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      app.name
                    )}
                  </div>
                </div>
                {/* <ResizableHandle /> */}
                <div
                  style={{ width: `${columnWidths.description}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {editingId === app.id ? (
                      <Textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                      />
                    ) : (
                      app.description
                    )}
                  </div>
                </div>
                {/* <ResizableHandle /> */}
                <div
                  style={{ width: `${columnWidths.active}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {editingId === app.id ? (
                      <Checkbox
                        className="bg-amber-400"
                        name="active"
                        checked={editForm.active}
                        onCheckedChange={(checked) =>
                          setEditForm((prev) => ({
                            ...prev,
                            active: checked,
                          }))
                        }
                      />
                    ) : (
                      <Checkbox
                        className="bg-amber-400"
                        checked={app.active}
                        disabled
                      />
                    )}
                  </div>
                </div>
                {/* <ResizableHandle /> */}
                <div
                  style={{ width: `${columnWidths.actions}%` }}
                  className="overflow-hidden"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {editingId === app.id ? (
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
                          onClick={() => handleEdit(app)}
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
                                  delete_app(app.id, currentPage, pageSize);
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
              {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((size) => (
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

export default AppsPage;
