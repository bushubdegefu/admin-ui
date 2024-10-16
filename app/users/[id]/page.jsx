"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit2, Save, Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";

// Mock data - in a real application, you'd fetch this data based on the user ID
const mockUserDetails = {
  id: 1,
  email: "user1@example.com",
  uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  disabled: false,
  roles: [
    { id: 1, name: "superuser" },
    { id: 2, name: "admin" },
    { id: 3, name: "standard" },
  ],
  useCases: [
    {
      id: 1,
      title: "User Administration",
      description: "Manage user accounts and permissions",
    },
    {
      id: 2,
      title: "Content Management",
      description: "Create, edit, and publish content",
    },
  ],
};

export default function UserDetailsPage({ params }) {
  // const id = params.id;
  const [user, setUser] = useState(mockUserDetails);
  const [originalUser, setOriginalUser] = useState(mockUserDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [newRole, setNewRole] = useState({ name: "" });

  const [newPassword, setNewPassword] = useState({
    password: "",
    confirm_password: "",
  });

  const handleEdit = () => {
    setOriginalUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send an API request to update the user
  };

  const handleCancel = () => {
    setUser({ ...originalUser });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    const newId = Math.max(...user.roles.map((f) => f.id)) + 1;
    setUser((prev) => ({
      ...prev,
      roles: [...prev.roles, { id: newId, ...newRole }],
    }));
    setNewRole({ name: "" });
  };

  const handleDeleteRole = (id) => {
    setUser((prev) => ({
      ...prev,
      roles: prev.roles.filter((f) => f.id !== id),
    }));
  };

  const handleAttachApp = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      password: { ...newPassword },
    }));
    setNewPassword({ password: "", confirm_password: "" });
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <Link href="/users" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      <Card className="mb-8 overflow-hidden">
        <CardHeader className="bg-amber-50">
          <CardTitle className="flex justify-between items-center">
            <span className="text-2xl text-amber-800">User Information</span>
            {isEditing ? (
              <div className="space-x-2">
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            ) : (
              <Button onClick={handleEdit} variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input id="id" name="id" value={user.id} readOnly />
              </div>
              <div>
                <Label htmlFor="name">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="uuid">UUID</Label>
                <Input id="uuid" name="uuid" value={user.uuid} readOnly />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="disabled"
                  name="disabled"
                  checked={user.disabled}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { name: "disabled", type: "checkbox", checked },
                    })
                  }
                />
                <Label htmlFor="disabled">Disabled</Label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">ID</h3>
                <p className="text-gray-700">{user.id}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Email</h3>
                <p className="text-gray-700">{user.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">UUID</h3>
                <p className="text-gray-700">{user.uuid}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Disabled
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${user.disabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {user.disabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="app">Operations</TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-800">Associated Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddRole} className="mb-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New role name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ name: e.target.value })}
                    required
                  />
                  <Button type="submit">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.id}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="usecases">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {user.useCases.map((useCase) => (
              <Card key={useCase.id} className="bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-amber-800">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="app">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-800">
                Password Change/Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button type="submit">Reset Password</Button>
              <br />
              <form onSubmit={handleAttachApp} className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="New Password">New Password</Label>
                  <Input
                    id="New Password"
                    value={newPassword.password}
                    onChange={(e) =>
                      setNewApp((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Confirm Password">Confirm Password</Label>
                  <Input
                    id="Confirm Password"
                    value={newPassword.confirm_password}
                    onChange={(e) =>
                      setNewApp((prev) => ({
                        ...prev,
                        confirm_password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
