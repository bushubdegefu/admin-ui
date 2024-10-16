"use client";

import React, { useState } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

const mockUsers = [
  {
    id: 1,
    uuid: "6e43a0b3-9b74-4f07-ae2b-1d72e1a15ed9",
    email: "user1@example.com",
    disabled: false,
  },
  {
    id: 2,
    uuid: "eb3f0950-d174-41d7-9c91-20285bc5f4b8",
    email: "user2@example.com",
    disabled: true,
  },
  {
    id: 3,
    uuid: "c5c913e7-0a61-4b7d-8bfc-1bc6a94f2f3d",
    email: "user3@example.com",
    disabled: false,
  },
  {
    id: 4,
    uuid: "e5d7f68b-b733-41ae-9e8b-6c2b8f61c5b1",
    email: "user4@example.com",
    disabled: true,
  },
  {
    id: 5,
    uuid: "56a42e58-1f55-4e12-a98e-6e69a4cda3f7",
    email: "user5@example.com",
    disabled: false,
  },
  {
    id: 6,
    uuid: "b8cde34e-195b-4d99-855c-e74e4e51ed1e",
    email: "user6@example.com",
    disabled: true,
  },
  {
    id: 7,
    uuid: "a4c70aaf-e6f5-4ef5-bd47-61862c4f0a68",
    email: "user7@example.com",
    disabled: false,
  },
  {
    id: 8,
    uuid: "0c26d4e4-f9ae-4f3d-bcf1-3e00b5c77e6c",
    email: "user8@example.com",
    disabled: true,
  },
  {
    id: 9,
    uuid: "e0bc9d7a-b1cb-4b34-bba0-78a764c01e41",
    email: "user9@example.com",
    disabled: false,
  },
  {
    id: 10,
    uuid: "17e6e99b-94b8-4cbb-bcb9-dbb77b5c16ff",
    email: "user10@example.com",
    disabled: true,
  },
  // Add more mock users here to test pagination
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    disabled: false,
  });

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uuid.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const id = users.length > 0 ? Math.max(...users.map((r) => r.id)) + 1 : 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ name: "", description: "", active: false });
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
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Add User Form */}
      <form
        onSubmit={handleAddUser}
        className="mb-8 p-4 bg-amber-50 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-name">email</Label>
            <Input
              id="new-name"
              name="name"
              value={newUser.email}
              onChange={handleNewUserChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-description"
              name="description"
              value={newUser.password}
              onChange={handleNewUserChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-disabled"
              name="disabled"
              checked={newUser.disabled}
              onCheckedChange={(checked) =>
                setNewUser((prev) => ({ ...prev, disabled: checked }))
              }
            />
            <Label htmlFor="new-active">Disabled</Label>
          </div>
        </div>
        <Button type="submit" className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </form>

      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
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
            {paginatedUsers.map((user) => (
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
              {[2, 5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
        </p>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
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
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
