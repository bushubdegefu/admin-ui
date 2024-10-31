"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data for the table
const initialData = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

export default function ToastExample() {
  const { toast } = useToast();
  const [data, setData] = useState(initialData);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    toast({
      variant: "destructive",
      title: "Item Deleted",
      description: `Item with ID ${id} has been removed.`,
    });
  };

  const handleUpdate = (id) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, name: item.name + " (Updated)" } : item,
    );
    setData(updatedData);
    toast({
      title: "Item Updated",
      description: `Item with ID ${id} has been updated.`,
    });
  };

  const handleCreate = () => {
    const newId = Math.max(...data.map((item) => item.id)) + 1;
    const newItem = {
      id: newId,
      name: `New User ${newId}`,
      email: `user${newId}@example.com`,
    };
    setData([...data, newItem]);
    toast({
      title: "Item Created",
      description: "A new item has been added to the table.",
    });
  };

  return (
    <div className="p-8 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">
        Toast Examples with Amber Theme
      </h1>

      <div className="mb-6 space-x-4">
        <Button
          onClick={handleCreate}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          Create Item
        </Button>
      </div>

      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead className="text-amber-800">ID</TableHead>
            <TableHead className="text-amber-800">Name</TableHead>
            <TableHead className="text-amber-800">Email</TableHead>
            <TableHead className="text-amber-800">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-amber-900">{item.id}</TableCell>
              <TableCell className="text-amber-900">{item.name}</TableCell>
              <TableCell className="text-amber-900">{item.email}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleUpdate(item.id)}
                  className="mr-2 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Update
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-amber-800">
          Additional Toast Examples
        </h2>
        <Button
          onClick={() => {
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
              action: (
                <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
              ),
            });
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          Show Toast with Action
        </Button>
        <Button
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "There was a problem with your request.",
            });
          }}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Show Error Toast
        </Button>
      </div>

      <Toaster />
    </div>
  );
}
