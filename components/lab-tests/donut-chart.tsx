"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { motion } from "framer-motion";

interface DonutChartProps {
  value: number;
  onSegmentClick: (segment: string) => void;
}

export function DonutChart({ value, onSegmentClick }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const data = [
    { name: "Risk", value: value },
    { name: "Remaining", value: 100 - value },
  ];

  const COLORS = ["#3b82f6", "#e5e7eb"];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative w-32 h-32"
    >
      <PieChart width={128} height={128}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx={64}
          cy={64}
          innerRadius={40}
          outerRadius={60}
          paddingAngle={2}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onClick={(_, index) => onSegmentClick(data[index].name.toLowerCase())}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-semibold"
        >
          {value}%
        </motion.span>
      </div>
    </motion.div>
  );
}
