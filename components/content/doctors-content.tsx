export function DoctorsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Our Doctors</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full mb-4" />
            <h3 className="font-semibold">Dr. Johnson</h3>
            <p className="text-sm text-gray-600">Neurologist</p>
            <button className="mt-4 w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

