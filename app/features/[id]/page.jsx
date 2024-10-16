"use client";

import React, { useState } from "react";
// import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Edit2, Save, Trash2 } from "lucide-react";
import Link from "next/link";

// Mock data - in a real application, you'd fetch this data based on the feature ID
const mockFeatureDetails = {
  id: 1,
  name: "Feature 1",
  description:
    "Detailed description for Feature 1. This feature provides enhanced functionality for user management, including role-based access control and advanced permission settings.",
  active: true,
  useCases: [
    {
      id: 1,
      title: "User Role Management",
      description: "Easily assign and manage user roles within the system.",
    },
    {
      id: 2,
      title: "Permission Customization",
      description: "Create custom permission sets for granular access control.",
    },
  ],
  endpoints: [
    { id: 1, name: "Get User Roles", url: "/api/feature1/user-roles" },
    {
      id: 2,
      name: "Update Permissions",
      url: "/api/feature1/update-permissions",
    },
  ],
};

export default function FeatureDetailsPage({ params }) {
  // const router = useRouter()
  const id = params.id;
  const [feature, setFeature] = useState(mockFeatureDetails);
  const [originalFeature, setOriginalFeature] = useState(mockFeatureDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({ name: "", url: "" });

  const handleEdit = () => {
    setOriginalFeature({ ...feature });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send an API request to update the feature
  };

  const handleCancel = () => {
    setFeature({ ...originalFeature });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeature((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddEndpoint = (e) => {
    e.preventDefault();
    const newId = Math.max(...feature.endpoints.map((e) => e.id)) + 1;
    setFeature((prev) => ({
      ...prev,
      endpoints: [...prev.endpoints, { id: newId, ...newEndpoint }],
    }));
    setNewEndpoint({ name: "", url: "" });
  };

  const handleDeleteEndpoint = (id) => {
    setFeature((prev) => ({
      ...prev,
      endpoints: prev.endpoints.filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <Link href="/features" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Features
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Feature Details</h1>

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
                  value={feature.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={feature.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  name="active"
                  checked={feature.active}
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
                <p className="text-gray-700">{feature.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Description
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Status</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${feature.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {feature.active ? "Active" : "Inactive"}
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
            {feature.useCases.map((useCase) => (
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
        <TabsContent value="endpoints">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-amber-800">Add New Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEndpoint} className="space-y-4">
                <div>
                  <Label htmlFor="endpointName">Endpoint Name</Label>
                  <Input
                    id="endpointName"
                    value={newEndpoint.name}
                    onChange={(e) =>
                      setNewEndpoint((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endpointUrl">Endpoint URL</Label>
                  <Input
                    id="endpointUrl"
                    value={newEndpoint.url}
                    onChange={(e) =>
                      setNewEndpoint((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button type="submit">Add Endpoint</Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            {feature.endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="flex justify-between items-center p-3 bg-amber-50 rounded-lg"
              >
                <div>
                  <strong className="text-amber-800">{endpoint.name}</strong>
                  <p className="text-gray-600 text-sm">{endpoint.url}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEndpoint(endpoint.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
