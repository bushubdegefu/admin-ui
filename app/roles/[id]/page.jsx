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
import useAuthRedirect from "../../utils/useAuthRedirect";

// Mock data - in a real application, you'd fetch this data based on the role ID
const mockRoleDetails = {
  id: 1,
  name: "Admin",
  description: "Full access to all features and settings",
  active: true,
  features: [
    { id: 1, name: "User Management" },
    { id: 2, name: "Content Editing" },
  ],
  endpoints: [
    { id: 1, name: "Get Users", url: "/api/users" },
    { id: 2, name: "Update Content", url: "/api/content" },
  ],
  app: { id: 1, name: "Main Application" },
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

export default function RoleDetailsPage() {
  // const id = params.id;
  useAuthRedirect();
  const [role, setRole] = useState(mockRoleDetails);
  const [originalRole, setOriginalRole] = useState(mockRoleDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [newFeature, setNewFeature] = useState({ name: "" });
  const [newApp, setNewApp] = useState({ id: "", name: "" });

  const handleEdit = () => {
    setOriginalRole({ ...role });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send an API request to update the role
  };

  const handleCancel = () => {
    setRole({ ...originalRole });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRole((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    const newId = Math.max(...role.features.map((f) => f.id)) + 1;
    setRole((prev) => ({
      ...prev,
      features: [...prev.features, { id: newId, ...newFeature }],
    }));
    setNewFeature({ name: "" });
  };

  const handleDeleteFeature = (id) => {
    setRole((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  const handleAttachApp = (e) => {
    e.preventDefault();
    setRole((prev) => ({
      ...prev,
      app: { ...newApp },
    }));
    setNewApp({ id: "", name: "" });
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <Link href="/roles" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roles
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Role Details</h1>

      <Card className="mb-8 overflow-hidden">
        <CardHeader className="bg-amber-50">
          <CardTitle className="flex justify-between items-center">
            <span className="text-2xl text-amber-800">Role Information</span>
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={role.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={role.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  name="active"
                  checked={role.active}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { name: "active", type: "checkbox", checked },
                    })
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Name</h3>
                <p className="text-gray-700">{role.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Description
                </h3>
                <p className="text-gray-700">{role.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Status</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${role.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {role.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="app">Associated App</TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-800">
                Associated Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFeature} className="mb-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New feature name"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature({ name: e.target.value })}
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
                  {role.features.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell>{feature.id}</TableCell>
                      <TableCell>{feature.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFeature(feature.id)}
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
        <TabsContent value="endpoints">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-800">
                Associated Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {role.endpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell>{endpoint.id}</TableCell>
                      <TableCell>{endpoint.name}</TableCell>
                      <TableCell>{endpoint.url}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="usecases">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {role.useCases.map((useCase) => (
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
              <CardTitle className="text-amber-800">Associated App</CardTitle>
            </CardHeader>
            <CardContent>
              {role.app ? (
                <div className="space-y-2">
                  <p>
                    <strong>App ID:</strong> {role.app.id}
                  </p>
                  <p>
                    <strong>App Name:</strong> {role.app.name}
                  </p>
                </div>
              ) : (
                <p>No app associated with this role.</p>
              )}
              <form onSubmit={handleAttachApp} className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Attach New App</h3>
                <div>
                  <Label htmlFor="appId">App ID</Label>
                  <Input
                    id="appId"
                    value={newApp.id}
                    onChange={(e) =>
                      setNewApp((prev) => ({ ...prev, id: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="appName">App Name</Label>
                  <Input
                    id="appName"
                    value={newApp.name}
                    onChange={(e) =>
                      setNewApp((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <Button type="submit">Attach App</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
