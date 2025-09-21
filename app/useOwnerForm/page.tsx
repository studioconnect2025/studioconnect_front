
import OwnerRegisterForm from "@/components/registerformOwner/registerFormOwner";
import { FaBuilding } from "react-icons/fa";

export default function MyStudioPage() {
  return (
    <div>
          <div className="bg-sky-800 text-white py-12 px-4 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                    <FaBuilding size={50} className="text-sky-700" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  Registrate como Owner de estudio
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-200">
                  Únete a nuestra red de estudios de grabación profesionales y conéctate con músicos de todo el mundo.
                </p>
              </div>
            </div>
        <OwnerRegisterForm />
    </div>
  );
}