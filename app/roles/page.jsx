"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink, PlusCircle, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import useAuthRedirect from "../utils/useAuthRedirect";
import { useRoleStore } from "../store/role";
import { useAppStore } from "../store/app";
import { useToast } from "@/hooks/use-toast";
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

export default function RolesPage() {
  useAuthRedirect();
  const { toast } = useToast();
  const roles = useRoleStore((state) => state.filtered_roles);
  const get_roles = useRoleStore((state) => state.getRoles);
  const get_app_roles = useRoleStore((state) => state.getAppRoles);
  const post_role = useRoleStore((state) => state.postRole);
  const delete_role = useRoleStore((state) => state.deleteRole);
  const drop_apps = useAppStore((state) => state.drop_apps);
  const get_drop_apps = useAppStore((state) => state.getDropApps);
  const [currentApp, setCurrentApp] = useState(null);
  const pagination = roles?.length ? roles?.length : 1;
  const totalPages = useRoleStore((state) => state.pages);
  const setFilter = useRoleStore((state) => state.setFilterValue);
  const searchTerm = useRoleStore((state) => state.filter);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    active: false,
  });

  useEffect(() => {
    get_drop_apps();
  }, [get_drop_apps]);

  useEffect(() => {
    get_roles(currentPage, pageSize);
  }, [currentPage, pageSize, get_roles]);

  const handleAppSelect = (value) => {
    setCurrentApp(value);
    if (value != 0) {
      let cur_app = drop_apps.filter((dapp) => dapp.id == value)[0];
      get_app_roles(cur_app?.uuid, currentPage, pageSize);
    } else {
      get_roles(currentPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    post_role(newRole);
    // setNewRole({ name: "", description: "", active: false });
  };

  const handleNewRoleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRole((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full flex flex-row items-stretch p-5">
        <div className=" w-1/2">
          <h1 className="text-2xl font-bold mb-4">Roles</h1>
        </div>
        <div className="w-1/2 mb-6 flex flex-col items-end">
          <Button
            onClick={() => get_roles(currentPage, pageSize)}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Role Form */}
      <form
        onSubmit={handleAddRole}
        className="mb-8 p-4 bg-amber-50 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              name="name"
              value={newRole.name}
              onChange={handleNewRoleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-description">Description</Label>
            <Input
              id="new-description"
              name="description"
              value={newRole.description}
              onChange={handleNewRoleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-active"
              name="active"
              checked={newRole.active}
              onCheckedChange={(checked) =>
                setNewRole((prev) => ({ ...prev, active: checked }))
              }
            />
            <Label htmlFor="new-active">Active</Label>
          </div>
        </div>
        <Button type="submit" className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Role
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
          <Select name="current_app" onValueChange={handleAppSelect}>
            <SelectTrigger className="border-amber-300 w-[180px]">
              <SelectValue value={currentApp} placeholder="App" />
            </SelectTrigger>
            <SelectContent className="hover:text-black hover:bg-amber-50">
              <SelectItem className="text-black" value={0}>
                All
              </SelectItem>
              {drop_apps?.map((app) => (
                <SelectItem
                  className="text-black"
                  key={"dapnew" + app?.id}
                  value={app?.id}
                >
                  {app?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.id}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {role.description}
                </TableCell>
                <TableCell>
                  <Checkbox
                    className="bg-amber-400"
                    checked={role.active}
                    disabled
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-1">
                    <Link href={`/roles/${role.id}`} passHref>
                      <Button
                        className="border-amber-400 text-amber-800 hover:bg-amber-50"
                        variant="ghost"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </Link>
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
                            This action cannot be undone. This will permanently
                            delete and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-amber-200 text-amber-800 hover:bg-amber-50">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              delete_role(role.id, currentPage, pageSize);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          {Math.min(currentPage * pageSize, pagination)} of {pagination} entries
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
