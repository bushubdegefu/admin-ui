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
import { useUserStore } from "../store/user";
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
import { useUtilStore } from "../store/utilstore";

export default function UsersPage() {
  useAuthRedirect();
  const users = useUserStore((state) => state.filtered_users);
  const get_users = useUserStore((state) => state.getUsers);
  const delete_user = useUserStore((state) => state.deleteUser);
  const totalPages = useUserStore((state) => state.pages);
  const setFilter = useUserStore((state) => state.setFilterValue);
  const searchTerm = useUserStore((state) => state.filter);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = useUtilStore((state) => state.size);
  const setPageSize = useUtilStore((state) => state.setSize);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    disabled: false,
  });

  useEffect(() => {
    get_users(currentPage, pageSize);
  }, [currentPage, pageSize, get_users]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const handleNewUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full flex flex-row items-stretch p-5">
        <div className=" w-1/2">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
        </div>
        <div className="w-1/2 mb-6 flex flex-col items-end">
          <Button
            onClick={() => get_users(currentPage, pageSize)}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

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

      {/* Users Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Disabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.uuid}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Checkbox
                    className="bg-amber-400"
                    checked={user.disabled}
                    disabled
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-1">
                    <Link href={`/users/${user.id}`} passHref>
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
                              delete_user(user.id, currentPage, pageSize);
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
              {[5, 15, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, users.length)} of {users.length}{" "}
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
