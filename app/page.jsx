import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full  bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/favicon.svg"
              height={40}
              width={40}
              alt="Blue Admin Logo"
              className="h-10 w-10 mr-3"
            />
            <h1 className="text-2xl font-bold text-amber-800">Blue Admin</h1>
          </div>
          <nav>
            <a href="/login">
              <Button
                variant="ghost"
                className="text-amber-600 hover:text-amber-800"
              >
                Login
              </Button>
            </a>
            <a href="/signup">
              <Button className="ml-4 bg-amber-600 hover:bg-amber-700">
                Sign Up
              </Button>
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-800 mb-4">
            Streamline Your API Management & IAM
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Blue Admin: Your all-in-one solution for API governance and identity
            management
          </p>
          <a href="/apps">
            <Button className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
              Demo
            </Button>
          </a>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">
                API Lifecycle Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Efficiently manage your APIs from creation to retirement,
                ensuring optimal performance and security.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">
                Identity Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Securely manage user identities, roles, and access rights across
                your entire ecosystem.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Implement fine-grained access controls to protect your APIs and
                data from unauthorized access.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-amber-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  API Version Control
                </h3>
                <p>
                  Manage multiple versions of your APIs with ease, ensuring
                  backward compatibility and smooth transitions.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Role-Based Access Control (RBAC)
                </h3>
                <p>
                  Define and manage roles with specific permissions to control
                  access to your APIs and resources.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">API Analytics</h3>
                <p>
                  Gain insights into API usage, performance metrics, and user
                  behavior to optimize your services.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Single Sign-On (SSO)
                </h3>
                <p>
                  Implement SSO across your applications for a seamless and
                  secure user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            We are working on exciting new integrations to enhance your API
            management and IAM experience!
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Microsoft Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Seamlessly integrate with Microsoft accounts for secure
                  authentication and identity management.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Google OAuth 2.0
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Enable easy sign-in and access control with Google OAuth 2.0,
                  expanding your authentication options.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            Ready to Optimize Your API Management?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of companies that trust Blue Admin for their API and
            identity needs.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
            Start Your Free Trial
          </Button>
        </section>
      </main>

      <footer className="bg-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Blue Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
