import Image from "next/image";

export function HomeContent() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto ">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">
          Book <span className="text-blue-600">Appointment</span> with your
          Favourite <span className="text-blue-600">Doctors</span>
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Access personalized Chronix services anytime, anywhere. Whether you
          need a routine check-up or specialized care, find and schedule
          appointments with trusted doctors across various specialties. Take
          charge of your health with a smooth booking process and expert medical
          guidance tailored to your needs.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Explore Now
        </button>
      </div>
      <div className="relative aspect-square">
        <div className="m-5 w-full h-full bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
          <Image
            src="/image.png"
            alt="Chronix"
            className="w-full h-full object-cover rounded-2xl"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
