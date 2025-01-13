"use client";

import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

interface GeneratedPlansProps {
  plans: Plan[];
  onSelect: (plan: Plan) => void;
  onBack: () => void;
}

export function GeneratedPlans({
  plans,
  onSelect,
  onBack,
}: GeneratedPlansProps) {
  const [orderedPlans, setOrderedPlans] = useState(plans);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedPlans);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedPlans(items);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-violet-200"
        >
          ← Back to Form
        </Button>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="plans">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {orderedPlans.map((plan, index) => (
                <Draggable key={plan.id} draggableId={String(plan.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="transform transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Card className="border-violet-100 shadow-lg hover:shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50">
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>
                            {plan.calories} calories | ₹{plan.cost}/week
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-medium">Protein</div>
                                <div>{plan.macros.protein}%</div>
                              </div>
                              <div>
                                <div className="font-medium">Carbs</div>
                                <div>{plan.macros.carbs}%</div>
                              </div>
                              <div>
                                <div className="font-medium">Fat</div>
                                <div>{plan.macros.fat}%</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {plan.meals.map(
                                (meal: {
                                  day: number;
                                  breakfast: string;
                                  lunch: string;
                                  dinner: string;
                                  snacks: string[];
                                }) => (
                                  <Collapsible key={meal.day}>
                                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 font-medium">
                                      Day {meal.day}
                                      <ChevronDown className="h-5 w-5" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-2 px-4 py-2">
                                      <div>
                                        <div className="font-medium">
                                          Breakfast
                                        </div>
                                        <div>{meal.breakfast}</div>
                                      </div>
                                      <div>
                                        <div className="font-medium">Lunch</div>
                                        <div>{meal.lunch}</div>
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          Dinner
                                        </div>
                                        <div>{meal.dinner}</div>
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          Snacks
                                        </div>
                                        <div>{meal.snacks.join(", ")}</div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                )
                              )}
                            </div>

                            <Button 
                              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white mt-6"
                              onClick={() => onSelect(plan)}
                            >
                              Select This Plan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
