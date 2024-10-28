"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Edit2, RotateCcw, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import useAuthRedirect from "../../utils/useAuthRedirect";
import { useFeatureStore } from "@/app/store/feature";
import { useEndPointStore } from "@/app/store/endpoint";

export function FeatureDetailsPage({ id }) {
  useAuthRedirect();

  const feature = useFeatureStore((state) => state.feature);
  const get_feature = useFeatureStore((state) => state.getSingleFeature);
  const patch_feature = useFeatureStore((state) => state.patchFeature);
  const add_endpoint_feature = useEndPointStore(
    (state) => state.addEndPointFeature,
  );
  const delete_endpoint_feature = useEndPointStore(
    (state) => state.deleteEndPointFeature,
  );
  const get_drop_endpoints = useEndPointStore(
    (state) => state.getDropEndPoints,
  );
  const drop_endpoints = useEndPointStore((state) => state.drop_endpoints);
  const [editForm, setEditForm] = useState(feature);
  const [isEditing, setIsEditing] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState(null);

  useEffect(() => {
    console.log(id);
    get_feature(id);
    get_drop_endpoints();
  }, [get_feature, get_drop_endpoints, id]);

  const handleEdit = () => {
    setEditForm(feature);
    setIsEditing(true);
  };

  const handleSave = () => {
    patch_feature(editForm, 1, 1);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSelect = (e) => {
    let newValue = drop_endpoints.filter((endpoint) => endpoint.id == e)[0]
      .name;
    setNewEndpoint(newValue);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddEndpoint = (e) => {
    e.preventDefault();
    add_endpoint_feature(e.target.endpoint.value, id);
  };

  const handleDeleteEndpoint = (endpoint_id) => {
    delete_endpoint_feature(endpoint_id, id);
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <Link href="/features" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Features
        </Button>
      </Link>
      <div className="w-full flex flex-row items-stretch p-5">
        <div className=" w-1/2">
          <h1 className="text-3xl font-bold mb-6">Feature Details</h1>
        </div>
        <div className="w-1/2 mb-6 flex flex-col items-end">
          <Button onClick={() => get_feature(id)} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-8 overflow-hidden">
        <CardHeader className="bg-amber-50">
          <CardTitle className="flex justify-between items-center">
            <span className="text-2xl text-amber-800">Feature Information</span>
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
                <p className="text-gray-700">{feature?.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Description
                </h3>
                <p className="text-gray-700">{feature?.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Status</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${feature?.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {feature?.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="usecases" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        </TabsList>
        <TabsContent value="usecases">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Feature Endpoint Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Easily assign and manage user roles within the system
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Permission Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Create custom permission sets for granular access control.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="endpoints">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-800">Add New Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEndpoint} className="space-y-4">
                <div>
                  <Label htmlFor="endpointName">Endpoint Name</Label>
                  <Select
                    onValueChange={handleSelect}
                    className="text-black mitest"
                    name="endpoint"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select a endpoint"
                        className="text-black"
                      >
                        {newEndpoint}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {drop_endpoints?.map((endpoint) => (
                        <SelectItem
                          className="text-black"
                          key={"ep" + endpoint?.id}
                          value={endpoint?.id}
                          name={endpoint?.name}
                        >
                          {endpoint.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit">Add Endpoint</Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            {feature?.endpoints?.map((endpoint) => (
              <div
                key={endpoint.id}
                className="flex justify-between items-center p-3 bg-amber-50 rounded-lg"
              >
                <div>
                  <strong className="text-amber-800">{endpoint.name}</strong>
                  <p className="text-gray-600 text-sm">{endpoint.url}</p>
                </div>
                <div>
                  {/* <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEndpoint(endpoint.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
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
                            handleDeleteEndpoint(endpoint.id);
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FeatureDetailsPage;
