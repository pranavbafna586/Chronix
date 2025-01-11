import { DietPlanForm } from "@/components/diet-plan/diet-plan-form"

export default function DietPlanPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen ">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
        Create Your Personalized Diet Plan
      </h1>
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-violet-100">
        <DietPlanForm />
      </div>
    </div>
  )
}

