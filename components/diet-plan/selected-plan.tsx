"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Plan {
  id: number;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  cost: number;
  meals: Array<{
    day: number;
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  }>;
}

interface SelectedPlanProps {
  plan: Plan;
  onBack: () => void;
}

export function SelectedPlan({ plan, onBack }: SelectedPlanProps) {
  const [downloading, setDownloading] = useState(false);

  const downloadPDF = () => {
    setDownloading(true);
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor("#333");
    doc.text(plan.name, 20, 20);

    // Add summary
    doc.setFontSize(12);
    doc.setTextColor("#555");
    doc.text(`Calories: ${plan.calories}`, 20, 35);
    doc.text(`Weekly Cost: ₹${plan.cost}`, 20, 45);
    doc.text(
      `Macros - Protein: ${plan.macros.protein}%, Carbs: ${plan.macros.carbs}%, Fat: ${plan.macros.fat}%`,
      20,
      55
    );

    // Add meals
    let yPos = 75;
    plan.meals.forEach((meal) => {
      doc.setFontSize(14);
      doc.setTextColor("#333");
      doc.text(`Day ${meal.day}`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor("#555");
      doc.text(`Breakfast: ${meal.breakfast}`, 30, yPos);
      yPos += 10;
      doc.text(`Lunch: ${meal.lunch}`, 30, yPos);
      yPos += 10;
      doc.text(`Dinner: ${meal.dinner}`, 30, yPos);
      yPos += 10;
      doc.text(`Snacks: ${meal.snacks.join(", ")}`, 30, yPos);
      yPos += 20;

      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save("diet-plan.pdf");
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Plans
        </Button>
        <Button onClick={downloadPDF} disabled={downloading}>
          {downloading ? "Generating PDF..." : "Download Plan"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>
            {plan.calories} calories | ₹{plan.cost}/week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Protein</div>
                <div className="text-2xl">{plan.macros.protein}%</div>
              </div>
              <div>
                <div className="font-medium">Carbs</div>
                <div className="text-2xl">{plan.macros.carbs}%</div>
              </div>
              <div>
                <div className="font-medium">Fat</div>
                <div className="text-2xl">{plan.macros.fat}%</div>
              </div>
            </div>

            <div className="space-y-6">
              {plan.meals.map((meal) => (
                <div key={meal.day} className="space-y-4">
                  <h3 className="text-lg font-semibold">Day {meal.day}</h3>
                  <div className="grid gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">Breakfast</div>
                      <div>{meal.breakfast}</div>
                    </div>
                    <div>
                      <div className="font-medium">Lunch</div>
                      <div>{meal.lunch}</div>
                    </div>
                    <div>
                      <div className="font-medium">Dinner</div>
                      <div>{meal.dinner}</div>
                    </div>
                    <div>
                      <div className="font-medium">Snacks</div>
                      <div>{meal.snacks.join(", ")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
