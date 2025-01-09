"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

interface RadialChartProps {
  score: number;
  remark: string;
  lastReading: string;
}

export function RadialChart({ score, remark, lastReading }: RadialChartProps) {
  const data = [
    {
      name: "Mental Fitness Score",
      score: score,
      fill: "hsl(var(--chart-1))",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Mental Fitness Score</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer
          config={{
            score: {
              label: "Mental Fitness Score",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px] w-full"
        >
          <RadialBarChart
            width={200}
            height={200}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarRadiusAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              background
              dataKey="score"
              cornerRadius={30}
              fill="var(--color-score)"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-primary font-bold text-2xl"
            >
              {score}
            </text>
          </RadialBarChart>
        </ChartContainer>
        <div className="mt-2 text-center">
          <p className="text-lg font-semibold">{remark}</p>
          <p className="text-xs text-muted-foreground">
            Last Reading: {lastReading}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
