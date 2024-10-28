"use client";

import React, { useEffect, useState } from "react";

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
  ArrowLeft,
  Edit2,
  Save,
  Trash2,
  PlusCircle,
  RotateCw,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import useAuthRedirect from "../../utils/useAuthRedirect";
import { useRoleStore } from "@/app/store/role";
import { useUserStore } from "@/app/store/user";
import { useAppStore } from "@/app/store/app";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFeatureStore } from "@/app/store/feature";

export function RoleDetailsPage({ id }) {
  useAuthRedirect();
  const role = useRoleStore((state) => state.role);
  const get_role = useRoleStore((state) => state.getSingleRole);
  const [editForm, setEditForm] = useState(role);

  const patch_role = useRoleStore((state) => state.patchRole);
  const add_to_app = useRoleStore((state) => state.addAppToRole);
  const drop_apps = useAppStore((state) => state.drop_apps);
  const drop_features = useFeatureStore((state) => state.drop_features);
  const get_drop_features = useFeatureStore((state) => state.getDropFeatures);
  const endpoints = useRoleStore((state) => state.endpoints);
  const get_role_endpoints = useRoleStore((state) => state.getRoleEndpoints);
  const get_drop_apps = useAppStore((state) => state.getDropApps);
  const add_feature_to_role = useFeatureStore((state) => state.addFeatureRole);
  const delete_feature_to_role = useFeatureStore(
    (state) => state.deleteFeatureRole,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [newFeature, setNewFeature] = useState(null);
  const [newApp, setNewApp] = useState(null);
  const [currentApp, setCurrentApp] = useState(null);

  useEffect(() => {
    get_role(id);
    get_role_endpoints(id);
    get_drop_apps();
    get_drop_features();
  }, [
    get_role,
    get_drop_apps,
    get_role_endpoints,
    setCurrentApp,
    get_drop_features,
    id,
  ]);

  useEffect(() => {
    let cur_app = drop_apps.filter((dapp) => dapp.id == role.app.Int64)[0];
    setCurrentApp(cur_app);
  }, [role, drop_apps]);

  const handleEdit = () => {
    setEditForm({ ...role });
    setIsEditing(true);
  };

  const handleSave = () => {
    patch_role(editForm, 1, 1);
    get_role(id);
    setIsEditing(false);
  };

  const handleAppSelect = (e) => {
    let newValue = drop_apps.filter((app) => app.id == e)[0].name;
    setNewApp(newValue);
  };

  const handleFeatureSelect = (e) => {
    let newValue = drop_features.filter((feature) => feature.id == e)[0].name;
    setNewFeature(newValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    add_feature_to_role(e.target.feature.value, id);
  };

  const handleAttachApp = (e) => {
    e.preventDefault();
    add_to_app(e.target.app.value, id);
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <Link href="/roles" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roles
        </Button>
      </Link>
      <div className="w-full flex flex-row items-stretch p-5">
        <div className=" w-1/2">
          <h1 className="text-3xl font-bold mb-6">Role Details</h1>
        </div>
        <div className="w-1/2 mb-6 flex flex-col items-end">
          <Button onClick={() => get_role(id)} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
                  value={editForm?.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editForm?.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  name="active"
                  checked={editForm?.active}
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
                <p className="text-gray-700">{role?.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Description
                </h3>
                <p className="text-gray-700">{role?.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Status</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${role?.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {role?.active ? "Active" : "Inactive"}
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
                  <Select
                    onValueChange={handleFeatureSelect}
                    className="text-black mitest"
                    name="feature"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select a feature"
                        className="text-black"
                      >
                        {newFeature}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {drop_features?.map((feat) => (
                        <SelectItem
                          className="text-black"
                          key={"rfdpnew" + feat.id}
                          value={feat?.id}
                        >
                          {feat.name}
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
                  {role?.features?.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell>{feature.id}</TableCell>
                      <TableCell>{feature.name}</TableCell>
                      <TableCell className="text-right">
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
                                  delete_feature_to_role(feature.id, id);
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                  {endpoints?.map((endpoint) => (
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
            <Card className="bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Manage Role Privileges, Edit Role
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">View Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  View Endpoints Path role can Access
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="app">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-800">Associated App</CardTitle>
            </CardHeader>
            <CardContent>
              {role?.app.Int64 ? (
                <div className="space-y-2">
                  <p>
                    <strong>App Name:</strong> {currentApp?.name}
                  </p>
                </div>
              ) : (
                <p>No app associated with this role.</p>
              )}
              <form onSubmit={handleAttachApp} className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Attach New App</h3>
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={handleAppSelect}
                    className="text-black mitest"
                    name="app"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select a app"
                        className="text-black"
                      >
                        {newApp}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {drop_apps?.map((app) => (
                        <SelectItem
                          className="text-black"
                          key={"rda" + app?.id}
                          value={app?.id}
                        >
                          {app.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Attach to App</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
