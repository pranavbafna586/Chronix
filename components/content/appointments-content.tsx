"use client"

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Award, Search, X, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const specializations = [
  { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
  { id: 'neurology', name: 'Neurology', icon: '🧠' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
  { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
  { id: 'dermatology', name: 'Dermatology', icon: '🧴' },
]

const allDoctors = [
  { id: 'dr-smith', name: 'Dr. Smith', specialization: 'Cardiology', rating: 4.8, experience: '15 years', city: 'New York', language: 'English', gender: 'Male' },
  { id: 'dr-johnson', name: 'Dr. Johnson', specialization: 'Neurology', rating: 4.9, experience: '20 years', city: 'Los Angeles', language: 'Spanish', gender: 'Female' },
  { id: 'dr-williams', name: 'Dr. Williams', specialization: 'Pediatrics', rating: 4.7, experience: '10 years', city: 'Chicago', language: 'English', gender: 'Male' },
  { id: 'dr-brown', name: 'Dr. Brown', specialization: 'Orthopedics', rating: 4.6, experience: '12 years', city: 'New York', language: 'Mandarin', gender: 'Female' },
  { id: 'dr-davis', name: 'Dr. Davis', specialization: 'Dermatology', rating: 4.5, experience: '8 years', city: 'Los Angeles', language: 'English', gender: 'Male' },
  { id: 'dr-miller', name: 'Dr. Miller', specialization: 'Cardiology', rating: 4.7, experience: '18 years', city: 'Chicago', language: 'Spanish', gender: 'Female' },
]

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

export const AppointmentsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [filters, setFilters] = useState({
    city: '',
    specialty: '',
    language: '',
    gender: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDoctors, setFilteredDoctors] = useState(allDoctors)
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [isBookingComplete, setIsBookingComplete] = useState(false)

  useEffect(() => {
    const filtered = allDoctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCity = filters.city === '' || doctor.city === filters.city
      const matchesSpecialty = filters.specialty === '' || doctor.specialization === filters.specialty
      const matchesLanguage = filters.language === '' || doctor.language === filters.language
      const matchesGender = filters.gender === '' || doctor.gender === filters.gender

      return matchesSearch && matchesCity && matchesSpecialty && matchesLanguage && matchesGender
    })
    setFilteredDoctors(filtered)
  }, [searchTerm, filters])

  const clearFilters = () => {
    setFilters({
      city: '',
      specialty: '',
      language: '',
      gender: '',
    })
    setSearchTerm('')
  }

  const openModal = (doctorId: string) => {
    setIsModalOpen(true)
    setCurrentStep(1)
    setSelectedDoctor(doctorId)
    const doctor = allDoctors.find(d => d.id === doctorId)
    if (doctor) {
      setSelectedSpecialization(doctor.specialization.toLowerCase())
    }
    setSelectedDate(undefined)
    setSelectedTimeSlot('')
    setIsBookingComplete(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentStep(1)
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const confirmAppointment = () => {
    setIsBookingComplete(true)
    // Here you would typically send the booking data to your backend
  }

  return (
    <div className="space-y-6 px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Appointments</h2>
      
      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        <Input
          type="text"
          placeholder="Search doctors or specialties..."
          className="max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-4">
            <Select value={filters.city} onValueChange={(value: string) => setFilters({ ...filters, city: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Chicago">Chicago</SelectItem>
            </SelectContent>
            </Select>
          <Select value={filters.specialty} onValueChange={(value: any) => setFilters({ ...filters, specialty: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec.id} value={spec.name}>{spec.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.language} onValueChange={(value: any) => setFilters({ ...filters, language: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Mandarin">Mandarin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.gender} onValueChange={(value: any) => setFilters({ ...filters, gender: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7v1h14v-1c0-3.866-3.134-7-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-800">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{doctor.city}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Available: Mon - Fri</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => openModal(doctor.id)}>
                Book Appointment
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              Follow the steps below to book your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {/* Step indicators */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2",
                    currentStep >= step
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-300"
                  )}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step content */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Confirm Doctor and Specialization</h3>
                <Card>
                  <CardContent className="p-4">
                    <p><strong>Doctor:</strong> {allDoctors.find(d => d.id === selectedDoctor)?.name}</p>
                    <p><strong>Specialization:</strong> {allDoctors.find(d => d.id === selectedDoctor)?.specialization}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Date</h3>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choose Time Slot</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant="outline"
                      className={cn(
                        "text-sm",
                        selectedTimeSlot === slot && "bg-blue-100 border-blue-600"
                      )}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Confirm Details</h3>
                <Card>
                  <CardContent className="p-4">
                    <p><strong>Doctor:</strong> {allDoctors.find(d => d.id === selectedDoctor)?.name}</p>
                    <p><strong>Specialization:</strong> {allDoctors.find(d => d.id === selectedDoctor)?.specialization}</p>
                    <p><strong>Date:</strong> {selectedDate?.toDateString()}</p>
                    <p><strong>Time:</strong> {selectedTimeSlot}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <Button onClick={nextStep} disabled={
                (currentStep === 2 && !selectedDate) ||
                (currentStep === 3 && !selectedTimeSlot)
              }>
                Next
              </Button>
            ) : (
              <Button onClick={confirmAppointment}>Confirm Appointment</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isBookingComplete} onOpenChange={setIsBookingComplete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Booked!</DialogTitle>
            <DialogDescription>
              Your appointment has been successfully booked.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-xl font-semibold text-center">
              Congratulations! Your appointment is confirmed.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setIsBookingComplete(false)
              closeModal()
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AppointmentsContent;
