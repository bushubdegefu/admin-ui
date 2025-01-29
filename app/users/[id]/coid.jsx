"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit2,
  Save,
  Trash2,
  PlusCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import useAuthRedirect from "../../utils/useAuthRedirect";
import { useUserStore } from "@/app/store/user";
import { useRoleStore } from "@/app/store/role";
// import { useUserStore } from "@/app/store/user";
// import { useRouter } from "next/navigation";

export function UserDetailsPage({ id }) {
  const user = useUserStore((state) => state.user);
  const get_user = useUserStore((state) => state.getSingleUser);
  const [editForm, setEditForm] = useState(user);
  const patch_user = useUserStore((state) => state.patchUser);
  const add_user_role = useUserStore((state) => state.addUserRole);
  const delete_user_role = useUserStore((state) => state.deleteUserRole);
  const update_password = useUserStore((state) => state.changePassword);
  const get_drop_roles = useRoleStore((state) => state.getDropRoles);
  const drop_roles = useRoleStore((state) => state.drop_roles);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRole, setNewRole] = useState(null);
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    get_user(id);
    get_drop_roles();
  }, [get_user, get_drop_roles, id]);

  const handleEdit = () => {
    setEditForm({ ...user });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send an API request to update the user
    patch_user(editForm, 1, 1);
    get_user(id);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSelect = (e) => {
    let newValue = drop_roles.filter((role) => role.id == e)[0].name;
    setNewRole(newValue);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    add_user_role(id, e.target.role.value, 1, 1);
    get_user(id);
  };

  const handleDeleteRole = (role_id) => {
    delete_user_role(id, role_id);
    get_user(id);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setNewPassword({ password: "", confirm_password: "" });
    if (newPassword.password == newPassword.confirm_password) {
      update_password(
        { email: user.email, password: newPassword.password },
        false,
        1,
        1,
      );
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <Link href="/users" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </Link>
      <div className="w-full flex flex-row items-stretch p-5">
        <div className=" w-1/2">
          <h1 className="text-3xl font-bold mb-6">User Details</h1>
        </div>
        <div className="w-1/2 mb-6 flex flex-col items-end">
          <Button onClick={() => get_user(id)} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
                <Input id="id" name="id" value={user?.id} readOnly />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editForm?.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="name">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={editForm?.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="uuid">UUID</Label>
                <Input id="uuid" name="uuid" value={editForm?.uuid} readOnly />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="disabled"
                  name="disabled"
                  checked={editForm?.disabled}
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
                <p className="text-gray-700">{user?.id}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Name</h3>
                <p className="text-gray-700">{user?.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Email</h3>
                <p className="text-gray-700">{user?.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">UUID</h3>
                <p className="text-gray-700">{user?.uuid}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Disabled
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${user?.disabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {user?.disabled ? "Active" : "Inactive"}
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
                  <Select
                    onValueChange={handleSelect}
                    className="text-black mitest"
                    name="role"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select a role"
                        className="text-black"
                      >
                        {newRole}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {drop_roles?.map((role) => (
                        <SelectItem
                          className="text-black"
                          key={"rl" + role?.id}
                          value={role?.id}
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {user?.roles?.map((role) => (
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
            <Card className="bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Update User Privileges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Manage user accounts and permissions
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Manage Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Reset Update Password</p>
              </CardContent>
            </Card>
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
              <Button
                onClick={() =>
                  update_password(
                    { email: user.email, password: "nothing" },
                    true,
                    1,
                    1,
                  )
                }
              >
                Reset Password
              </Button>
              <br />
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="New Password">New Password</Label>
                  <Input
                    id="New Password"
                    value={newPassword.password}
                    onChange={(e) =>
                      setNewPassword((prev) => ({
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
                      setNewPassword((prev) => ({
                        ...prev,
                        confirm_password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
