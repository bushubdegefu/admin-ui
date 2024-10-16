"use client";

// Use usePathname for catching route name.
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  LayoutGrid,
  Zap,
  UserCheck,
  Users,
  Link,
  UserPlus,
  Menu,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Apps", icon: LayoutGrid, href: "/apps" },
  { name: "Features", icon: Zap, href: "/features" },
  { name: "Roles", icon: UserCheck, href: "/roles" },
  { name: "Users", icon: Users, href: "/users" },
  { name: "Endpoints", icon: Link, href: "/endpoints" },
];

export const LayoutProvider = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ item, isMobile }) => {
    return (
      <a href={item.href}>
        <Button
          variant="ghost"
          className={`w-full justify-start ${isMobile ? "px-2" : "px-4"} ${
            pathname == item.href ? "bg-amber-200 text-amber-900" : ""
          }`}
          onClick={() => setSelectedItem(item.name)}
        >
          <item.icon className={`${isMobile ? "mr-2" : "mr-4"} h-4 w-4`} />
          {item.name}
        </Button>
      </a>
    );
  };

  const NavContent = ({ isMobile }) => (
    <>
      {navItems.map((item) => (
        <NavItem key={item.name} item={item} isMobile={isMobile} />
      ))}
      <a href="/signup">
        <Button
          variant="outline"
          className={`w-full justify-start ${isMobile ? "mt-4 px-2" : "mt-6 px-4"}`}
        >
          <UserPlus className={`${isMobile ? "mr-2" : "mr-4"} h-4 w-4`} />
          Add User
        </Button>
      </a>
    </>
  );

  if (pathname === "/" || pathname == "/login") {
    return (
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <div className="flex w-full h-screen bg-gray-100">{children}</div>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <div className="flex h-screen">
            {/* Sidebar for larger screens */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-amber-50 border-r border-amber-200">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-amber-800">
                  Blue Admin
                </h2>
              </div>
              <ScrollArea className="flex-1">
                <nav className="space-y-2 p-4">
                  <NavContent />
                </nav>
              </ScrollArea>
            </aside>

            {/* Navbar for mobile screens */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-amber-50 border-b border-amber-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-800">Blue Admin</h2>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-amber-50 p-0">
                  <ScrollArea className="h-full">
                    <nav className="space-y-2 p-4">
                      <NavContent isMobile />
                    </nav>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </header>

            {/* Main content area */}
            <main className="flex-1 p-6 md:p-8 overflow-auto">
              <div className="md:hidden h-16" />{" "}
              {/* Spacer for mobile header */}
              {children}
            </main>
          </div>
        </body>
      </html>
    );
  }
};
