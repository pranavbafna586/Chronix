"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedPlans } from "@/components/diet-plan/generated-plans";
import { SelectedPlan } from "@/components/diet-plan/selected-plan";

const dietaryPreferences = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "keto", label: "Keto" },
  { id: "low-carb", label: "Low Carb" },
  { id: "none", label: "None (No specific preference)" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary (Minimal or no physical activity)" },
  {
    value: "light",
    label: "Lightly Active (Light exercise or walking 1-3 days/week)",
  },
  {
    value: "moderate",
    label: "Moderately Active (Moderate exercise 3-5 days/week)",
  },
  { value: "very", label: "Very Active (Intense exercise 6-7 days/week)" },
];

const healthGoals = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "weight-gain", label: "Weight Gain" },
  { value: "muscle-building", label: "Muscle Building" },
  { value: "general-wellness", label: "General Wellness" },
];

const formSchema = z.object({
  activityLevel: z.string(),
  dietaryPreferences: z.array(z.string()),
  allergies: z.string(),
  avoidFoods: z.string(),
  healthGoal: z.string(),
  planDuration: z.number().min(1).max(7),
  budget: z.number().min(0),
});

export function DietPlanForm() {
  const [step, setStep] = useState<"form" | "plans" | "selected">("form");
  const [generatedPlans, setGeneratedPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityLevel: "",
      dietaryPreferences: [],
      allergies: "",
      avoidFoods: "",
      healthGoal: "",
      planDuration: 7,
      budget: 100,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate API call to generate plans
    const mockPlans = [
      {
        id: 1,
        name: "Balanced Nutrition Plan",
        calories: 2000,
        macros: { protein: 30, carbs: 40, fat: 30 },
        cost: 80,
        meals: Array.from({ length: values.planDuration }, (_, i) => ({
          day: i + 1,
          breakfast: "Oatmeal with fruits",
          lunch: "Grilled chicken salad",
          dinner: "Salmon with quinoa",
          snacks: ["Almonds", "Greek yogurt"],
        })),
      },
      {
        id: 2,
        name: "High Protein Plan",
        calories: 2200,
        macros: { protein: 40, carbs: 30, fat: 30 },
        cost: 95,
        meals: Array.from({ length: values.planDuration }, (_, i) => ({
          day: i + 1,
          breakfast: "Protein smoothie",
          lunch: "Turkey wrap",
          dinner: "Lean beef stir-fry",
          snacks: ["Protein bar", "Cottage cheese"],
        })),
      },
      {
        id: 3,
        name: "Plant-Based Plan",
        calories: 1800,
        macros: { protein: 25, carbs: 50, fat: 25 },
        cost: 70,
        meals: Array.from({ length: values.planDuration }, (_, i) => ({
          day: i + 1,
          breakfast: "Tofu scramble",
          lunch: "Chickpea curry",
          dinner: "Lentil pasta",
          snacks: ["Trail mix", "Hummus with vegetables"],
        })),
      },
    ];

    setGeneratedPlans(mockPlans);
    setStep("plans");
  }

  if (step === "plans") {
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
      meals: {
        day: number;
        breakfast: string;
        lunch: string;
        dinner: string;
        snacks: string[];
      }[];
    }

    return (
      <GeneratedPlans
        plans={generatedPlans as Plan[]}
        onSelect={(plan: Plan) => {
          setSelectedPlan(plan);
          setStep("selected");
        }}
        onBack={() => setStep("form")}
      />
    );
  }

  if (step === "selected") {
    return <SelectedPlan plan={selectedPlan} onBack={() => setStep("plans")} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="activityLevel"
          render={({ field }) => (
            <FormItem className="text-lg">
              <FormLabel>What is your daily activity level?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {activityLevels.map((level) => (
                    <FormItem
                      key={level.value}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={level.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {level.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryPreferences"
          render={() => (
            <FormItem className="text-lg">
              <FormLabel>
                Do you follow any specific dietary preferences?
              </FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {dietaryPreferences.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="dietaryPreferences"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked: boolean) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem className="text-lg">
              <FormLabel>
                Do you have any food allergies or intolerances?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any allergies (e.g., peanuts, lactose)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avoidFoods"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are there any foods you'd like to avoid?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List foods to avoid (e.g., spicy food, mushrooms)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your primary health goal?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {healthGoals.map((goal) => (
                    <FormItem
                      key={goal.value}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={goal.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {goal.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many days should the plan cover?</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Slider
                    min={1}
                    max={7}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  <div className="text-center font-medium">
                    {field.value} days
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your weekly grocery budget?</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    className="pl-7"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Generate Plan
        </Button>
      </form>
    </Form>
  );
}
