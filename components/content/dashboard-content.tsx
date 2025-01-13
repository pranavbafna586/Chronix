"use client";
import React from "react";
import { Users, Activity, Heart } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const monthlyData = [
  { month: "January", patients: 186, appointments: 80 },
  { month: "February", patients: 305, appointments: 200 },
  { month: "March", patients: 237, appointments: 120 },
  { month: "April", patients: 73, appointments: 190 },
  { month: "May", patients: 209, appointments: 130 },
  { month: "June", patients: 214, appointments: 140 },
];

const departmentData = [
  { department: "Cardiology", patients: 275, fill: "#FF6B6B" },
  { department: "Neurology", patients: 200, fill: "#4ECDC4" },
  { department: "Pediatrics", patients: 287, fill: "#45B7D1" },
  { department: "Orthopedics", patients: 173, fill: "#96CEB4" },
  { department: "Other", patients: 190, fill: "#FFEEAD" },
];

const chartConfig = {
  patients: {
    label: "Patients",
    color: "#6366F1",
  },
  appointments: {
    label: "Appointments",
    color: "#22C55E",
  },
};

const colors = {
  areaGradient: {
    start: "#6366F1",
    end: "#818CF8",
  },
  bar: "#22C55E",
};

export default function Dashboard() {
  const totalPatients = React.useMemo(() => {
    return departmentData.reduce((acc, curr) => acc + curr.patients, 0);
  }, []);

  return (
    <div className="p-6 space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">1,224</div>
            <p className="text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Daily Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">45</div>
            <p className="text-red-500">-3% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Patient Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">94%</div>
            <p className="text-green-600">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Patient Trends</CardTitle>
            <CardDescription>Monthly patient visits</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart data={monthlyData} margin={{ left: 12, right: 12 }}>
                <defs>
                  <linearGradient
                    id="patientGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={colors.areaGradient.start}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={colors.areaGradient.end}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                  stroke="#9CA3AF"
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="patients"
                  stroke={colors.areaGradient.start}
                  fill="url(#patientGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={monthlyData}>
                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  stroke="#9CA3AF"
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="appointments" fill={colors.bar} radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="items-center">
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>
              Patient distribution by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={departmentData}
                  dataKey="patients"
                  nameKey="department"
                  innerRadius={60}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-indigo-600 text-3xl font-bold"
                            >
                              {totalPatients}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-gray-500"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
