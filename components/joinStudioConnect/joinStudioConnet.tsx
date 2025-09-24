import { FaMusic, FaBuilding} from "react-icons/fa";
import Link from "next/link";

export default function JoinStudioConnect() {
  return (
    <div className="bg-gray-50 flex flex-col items-center">
   

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-10 py-16 mb-6">
        {/* Para músicos */}
        <div className="bg-white transition-transform duration-300 ease-in-out hover:scale-110 shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl gap-3">
            <div className="w-16 h-16 bg-sky-800 rounded-full flex items-center justify-center">
            <FaMusic  size={30} className="text-white mr-1" />
          </div>
          <h2 className="text-xl text-black font-semibold mb-2">Para músicos</h2>
          <p className="text-gray-500 mb-4 text-sm md:text-base">
            Encuentra y reserva el estudio de grabación ideal para tu próximo
            proyecto. Accede a profesionales, equipamientos y espacios.
          </p>
          <ul className="text-gray-700 text-left space-y-2 mb-6">
            <li>✔ Explorar estudios disponibles</li>
            <li>✔ Reserva en tiempo real</li>
            <li>✔ Pagos seguros</li>
            <li>✔ Reseñas y valoraciones</li>
          </ul>
         <Link href="/useMusicianForm"> <button className="bg-sky-800 text-white px-6 py-2 cursor-pointer rounded-lg mt-6 hover:bg-black transition">
            Regístrate como músico
          </button></Link>
        </div>

        {/* Para propietarios */}
        <div className="bg-white transition-transform duration-300 ease-in-out hover:scale-110 shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl gap-3">
          <div className="w-16 h-16 bg-sky-800 rounded-full flex items-center justify-center">
            <FaBuilding  size={30} className="text-white" />
          </div>
          <h2 className="text-xl text-black font-semibold mb-2">
            Para propietarios de estudios
          </h2>
          <p className="text-gray-500 mb-8 text-sm md:text-base">
            Publica tu estudio y conéctate con músicos. Gestiona las reservas y
            haz crecer tu negocio con nuestra plataforma.
          </p>
          <ul className="text-gray-700 text-left space-y-2">
            <li>✔ Lista tu estudio</li>
            <li>✔ Gestionar reservas</li>
            <li>✔ Procesamiento de pagos</li>
            <li>✔ Panel de análisis</li>
          </ul>
          <Link href="/useOwnerForm">
          <button className="bg-sky-800 text-white px-6 py-2 cursor-pointer rounded-lg hover:bg-black transition mt-8">
            Regístrate como propietario de estudio
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}