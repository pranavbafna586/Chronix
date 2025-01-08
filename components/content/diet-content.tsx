import { DietPlanForm } from "@/components/diet-plan/diet-plan-form"

export default function DietPlanPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Your Diet Plan</h1>
      <DietPlanForm />
    </div>
  )
}

