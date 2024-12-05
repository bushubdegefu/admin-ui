"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useLogInStore } from "../store/login";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// import { redirect, usePathname } from "next/navigation";

export default function Component() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const login = useLogInStore((state) => state.setToken);
  const loggein = useLogInStore((state) => state.blue_admin_token);

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    login({
      email: username,
      password,
      grant_type: "authorization_code",
      token: "token",
    });
  }

  useEffect(() => {
    if (loggein) {
      redirect("/apps");
    }
  }, [loggein]);

  return (
    <div className="min-h-screen w-full min-w-96 overflow-hidden bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-amber-900">
            Blue Admin
          </h2>

          <Button onClick={() => setIsOpen(true)}>
            Basic Demo Information{" "}
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Important Demo Information
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <ul className="list-disc pl-5 space-y-2 text-amber-700">
                  <li>Super user password will reset every hour</li>
                  <li>You can only delete newly added entries</li>
                  <li>
                    The role-based authentication middleware is turned off for
                    demonstration purposes
                  </li>
                  <li>username: superuser@mail.com</li>
                  <li>password: default@123</li>
                </ul>
              </DialogDescription>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  I Understand
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <p className="mt-2 text-sm text-amber-700">
            Granular and Secure API Management
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="username"
                className="block text-sm font-medium text-amber-800"
              >
                Email
              </Label>
              <div className="mt-1">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-amber-800"
              >
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
        <div className="text-center text-sm text-amber-700">
          <p>
            Blue Admin provides secure access management for your API ecosystem.
          </p>
          <p className="mt-1">
            Streamline your API authentication and authorization processes.
          </p>
        </div>
      </div>
    </div>
  );
}
