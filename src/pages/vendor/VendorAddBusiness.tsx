import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddBusinessForm from "@/components/AddBusinessForm";
import { Store, Plus } from "lucide-react";

const VendorAddBusiness = () => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Store className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Business
              </h1>
              <p className="text-gray-600 mt-1">
                Register your business and start getting customers
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Plus className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">
                      Step 1
                    </p>
                    <p className="text-lg font-bold text-emerald-800">
                      Business Info
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Store className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Step 2</p>
                    <p className="text-lg font-bold text-blue-800">
                      Services & Media
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Step 3
                    </p>
                    <p className="text-lg font-bold text-purple-800">Go Live</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Form */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Business Registration Form
            </CardTitle>
            <CardDescription className="text-emerald-100">
              Fill in all the details to register your business on our platform
            </CardDescription>
          </CardHeader>
          <div>
            <AddBusinessForm />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VendorAddBusiness;
