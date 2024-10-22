"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Edit2,
  Save,
  X,
  Trash2,
  // Drop,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAppPageStore } from "../store/pagestore";
import { useRoleStore } from "../store/role";

export function PageRow({ page, columnWidths }) {
  const [view, setView] = useState(false);
  const patch_page = useAppPageStore((state) => state.patchPage);
  const delete_page = useAppPageStore((state) => state.deletePage);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (page) => {
    setEditingId(page.id);
    setEditForm(page);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    patch_page(editForm, currentPage, pageSize);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <>
      <div className="w-full flex flex-row items-stretch">
        <div
          style={{ width: `${columnWidths.id}%` }}
          className="overflow-hidden border-r-2"
        >
          <div className="w-full h-full px-4 py-1 border-b-2">{page.id}</div>
        </div>

        <div
          style={{ width: `${columnWidths.name}%` }}
          className="overflow-hidden border-r-2"
        >
          <div className="w-full h-full px-4 py-1 border-b-2">
            {editingId === page.id ? (
              <Input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
              />
            ) : (
              page.name
            )}
          </div>
        </div>

        <div
          style={{ width: `${columnWidths.description}%` }}
          className="overflow-hidden border-r-2"
        >
          <div className="w-full h-full px-4 py-1 border-b-2">
            {editingId === page.id ? (
              <Textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
              />
            ) : (
              page.description
            )}
          </div>
        </div>

        <div
          style={{ width: `${columnWidths.active}%` }}
          className="overflow-hidden border-r-2"
        >
          <div className="w-full h-full px-4 py-1 border-b-2">
            {editingId === page.id ? (
              <Checkbox
                className="bg-amber-400"
                name="active"
                checked={editForm.active}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({
                    ...prev,
                    active: checked,
                  }))
                }
              />
            ) : (
              <Checkbox
                className="bg-amber-400"
                checked={page.active}
                disabled
              />
            )}
          </div>
        </div>

        <div
          style={{ width: `${columnWidths.actions}%` }}
          className="overflow-hidden"
        >
          <div className="w-full h-full px-4 py-1 border-b-2">
            <div className="flex space-x-2">
              {editingId === page.id ? (
                <>
                  <Button
                    className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                    size="sm"
                    variant="outline"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    className="text-amber-600 hover:text-amber-100 hover:bg-amber-800"
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(page)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
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
                            delete_page(page.id, currentPage, pageSize);
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              <Button
                className="text-amber-600 hover:text-amber-100 hover:bg-amber-800"
                size="sm"
                variant="outline"
                onClick={() => setView(!view)}
              >
                {view ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <RoleManagement page_id={page.id} page_roles={page.roles} view={view} />
    </>
  );
}

export default function RoleManagement({ page_id, page_roles, roles, view }) {
  const [newRole, setNewRole] = useState({ name: "", role: "" });
  const roleOptions = useRoleStore((state) => state.drop_roles);
  const [newRoleOption, setNewRoleOption] = useState(null);

  const handleSelect = (e) => {
    let newValue = roleOptions.filter((role) => role.id == e)[0].name;
    setNewRoleOption(newValue);
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRole.name && newRole.role) {
      setRoles([...roles, { id: roles.length + 1, ...newRole }]);
      setNewRole({ name: "", role: "" });
    }
  };

  const handleDeleteRole = (id) => {
    console.log(page_id);
    console.log(page_roles);
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <div className={view ? "container mx-auto p-4" : "hidden"}>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Add Role Form */}
        <div className="w-full flex items-center md:w-1/3 bg-amber-50 p-6 rounded-lg border border-amber-200 h-full">
          <form onSubmit={handleAddRole} className="w-full h-full">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">
              Add New Role
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role" className="text-amber-800">
                  Role
                </Label>
                <Select
                  value={newRole.role}
                  onValueChange={(value) => {
                    handleSelect(value);
                    setNewRole({ ...newRole, role: value });
                  }}
                >
                  <SelectTrigger className="border-amber-200 focus:ring-amber-500 focus:border-amber-500">
                    <SelectValue placeholder="Select a role">
                      {" "}
                      {newRoleOption}{" "}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={"rp" + option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Add Role
              </Button>
            </div>
          </form>
        </div>

        {/* Role List */}
        <div className="w-full md:w-2/3 h-full">
          <div className="bg-white p-6 rounded-lg border border-amber-200">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">
              Role List
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="px-4 py-2 text-left text-amber-800">Role</th>
                    <th className="px-4 py-2 text-left text-amber-800">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page_roles?.map((role) => (
                    <tr key={role.id} className="border-b border-amber-100">
                      <td className="px-4 py-2">{role.name}</td>
                      <td className="px-4 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
