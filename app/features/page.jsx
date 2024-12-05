"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink, PlusCircle, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import useAuthRedirect from "../utils/useAuthRedirect";
import { useFeatureStore } from "../store/feature";
import { useAppStore } from "../store/app";
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

function FeaturesPage() {
  useAuthRedirect();
  const { toast } = useToast();
  // const [features, setFeatures] = useState(mockFeatures);
  const features = useFeatureStore((state) => state.filtered_features);
  const get_features = useFeatureStore((state) => state.getFeatures);
  const get_app_features = useFeatureStore((state) => state.getAppFeatures);
  const post_feature = useFeatureStore((state) => state.postFeature);
  const delete_feature = useFeatureStore((state) => state.deleteFeature);
  const totalPages = useFeatureStore((state) => state.pages);
  const setFilter = useFeatureStore((state) => state.setFilterValue);
  const searchTerm = useFeatureStore((state) => state.filter);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = useUtilStore((state) => state.size);
  const setPageSize = useUtilStore((state) => state.setSize);
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    active: false,
  });
  const [columnWidths, setColumnWidths] = useState({
    id: 10,
    name: 15,
    description: 40,
    active: 15,
    actions: 20,
  });
  const drop_apps = useAppStore((state) => state.drop_apps);
  const get_drop_apps = useAppStore((state) => state.getDropApps);
  const [currentApp, setCurrentApp] = useState(null);
  const pagination = features?.length ? features?.length : 1;

  const handleAppSelect = (value) => {
    setCurrentApp(value);
    if (value != 0) {
      let cur_app = drop_apps.filter((dapp) => dapp.id == value)[0];
      get_app_features(cur_app?.uuid, currentPage, pageSize);
    } else {
      get_features(currentPage, pageSize);
    }
  };

  const refresh = () => {
    if (currentApp != null) {
      let cur_app = drop_apps.filter((dapp) => dapp.id == currentApp)[0];
      get_app_features(cur_app?.uuid, currentPage, pageSize);
    } else {
      get_features(currentPage, pageSize);
    }
  };
  const handleResize = (columnName) => (newSize) => {
    setColumnWidths((prev) => ({ ...prev, [columnName]: newSize }));
  };

  useEffect(() => {
    get_drop_apps();
  }, [get_drop_apps]);

  useEffect(() => {
    get_features(currentPage, pageSize);
  }, [currentPage, pageSize, get_features]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    post_feature(newFeature, currentPage, pageSize);
    setNewFeature({ name: "", description: "", active: false });
  };

  const handleNewFeatureChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFeature((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <div className="w-full flex flex-row items-stretch p-5">
        <div className=" w-1/2">
          <h1 className="text-2xl font-bold mb-4">Features</h1>
        </div>
        <div className="w-1/2 mb-6 flex flex-col items-end">
          <Button onClick={refresh} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Feature Form */}
      <form
        onSubmit={handleAddFeature}
        className="mb-8 p-4 bg-amber-50 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Feature</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              name="name"
              value={newFeature.name}
              onChange={handleNewFeatureChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-description">Description</Label>
            <Input
              id="new-description"
              name="description"
              value={newFeature.description}
              onChange={handleNewFeatureChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-active"
              name="active"
              checked={newFeature.active}
              onCheckedChange={(checked) =>
                setNewFeature((prev) => ({ ...prev, active: checked }))
              }
            />
            <Label htmlFor="new-active">Active</Label>
          </div>
        </div>
        <Button type="submit" className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Feature
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

        <div className="w-full  md:w-3/12 flex justify-start md:justify-end">
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

      {/* Resizable Feature */}
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
            {features?.map((feature) => (
              <div
                className="w-full flex flex-row items-stretch"
                key={feature.id}
              >
                <div
                  style={{ width: `${columnWidths.id}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {feature.id}
                  </div>
                </div>

                <div
                  style={{ width: `${columnWidths.name}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2 overflow-hidden break-words">
                    {feature.name}
                  </div>
                </div>

                <div
                  style={{ width: `${columnWidths.description}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    {feature.description}
                  </div>
                </div>
                <div
                  style={{ width: `${columnWidths.active}%` }}
                  className="overflow-hidden border-r-2"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2 over break-words">
                    <Checkbox
                      className="bg-amber-400"
                      checked={feature.active}
                      disabled
                    />
                  </div>
                </div>

                <div
                  style={{ width: `${columnWidths.actions}%` }}
                  className="overflow-hidden"
                >
                  <div className="w-full h-full px-4 py-1 border-b-2">
                    <div className="flex space-x-1">
                      <Link href={`/features/${feature.id}`} passHref>
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
                                delete_feature(
                                  feature.id,
                                  currentPage,
                                  pageSize,
                                );
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

export default FeaturesPage;
