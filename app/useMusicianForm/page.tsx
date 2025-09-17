import RegisterForm from "@/components/registerformMusician/registerForm";
import { RiMusicAiLine } from "react-icons/ri";

export default function MyStudioPage() {
  return (
    <div>
         <div className="bg-sky-800 text-white py-12 px-4 text-center">
                      <div className="max-w-2xl mx-auto">
                          <div className="flex justify-center mb-4">
                              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                                  <RiMusicAiLine size={60} className="text-sky-700" />
                              </div>
                          </div>
                          <h1 className="text-2xl md:text-3xl font-semibold">
                              Registra tu cuenta de usuario músico
                          </h1>
                          <p className="mt-2 text-sm md:text-base text-gray-200">
                              Únete a StudioConnect y comienza a reservar increíbles
                              estudios de grabación!
                          </p>
                      </div>
                  </div>
        <RegisterForm />
    </div>
  );
}
