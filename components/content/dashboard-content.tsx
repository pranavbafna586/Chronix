"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
// import { DonutChart } from "@/components/ui/chart";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const monthlyData = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 3200 },
  { name: "Apr", value: 2800 },
  { name: "May", value: 2000 },
  { name: "Jun", value: 3800 },
];

const revenueData = [
  { month: "Jan", earning: 2400, expense: 1398 },
  { month: "Feb", earning: 3000, expense: 1800 },
  { month: "Mar", earning: 3200, expense: 2200 },
  { month: "Apr", earning: 2800, expense: 1900 },
  { month: "May", earning: 2000, expense: 1500 },
  { month: "Jun", earning: 3800, expense: 2100 },
];

const salesData = [
  { name: "Apparel", value: 12150, color: "hsl(var(--primary))" },
  { name: "Electronics", value: 24900, color: "hsl(var(--primary))" },
  { name: "FMCG", value: 12750, color: "hsl(var(--primary))" },
  { name: "Other Sales", value: 50200, color: "hsl(var(--primary))" },
];

export default function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Top Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Ratings Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Ratings</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold">13k</h2>
              <span className="text-sm font-medium text-green-500">+15.6%</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground bg-purple-100 w-fit px-3 py-1 rounded-full">
              Year of 2025
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
              <Image
                src="/women.png"
                alt="Woman illustration"
                width={128}
                height={128}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sessions Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Sessions</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold">24.5k</h2>
              <span className="text-sm font-medium text-red-500">-20%</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground bg-gray-100 w-fit px-3 py-1 rounded-full">
              Last Week
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
              <Image
                src="/men.png"
                alt="Man illustration"
                width={128}
                height={128}
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">
                Transactions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total 48.5% Growth 😎 this month
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-purple-100 rounded-lg">
              <span className="text-sm text-muted-foreground">Sales</span>
              <span className="text-xl font-bold">245k</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-100 rounded-lg">
              <span className="text-sm text-muted-foreground">Users</span>
              <span className="text-xl font-bold">12.5k</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-100 rounded-lg">
              <span className="text-sm text-muted-foreground">Product</span>
              <span className="text-xl font-bold">1.54k</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Sales Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Total Sales</CardTitle>
              <p className="text-sm text-muted-foreground">$21,845</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Report Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Revenue Report
            </CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Bar
                  dataKey="earning"
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="expense" fill="#e5e5e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Overview Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Sales Overview
            </CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              {/* <DonutChart
                data={salesData}
                width={200}
                height={200}
                innerRadius={60}
                outerRadius={80}
              /> */}
            </div>
            <div className="mt-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold">100k</div>
                <div className="text-sm text-muted-foreground">
                  Weekly Sales
                </div>
              </div>
              <div className="space-y-2">
                {salesData.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
