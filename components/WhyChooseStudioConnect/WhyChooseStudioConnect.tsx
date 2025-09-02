import { FaMapMarkerAlt, FaRegCheckSquare, FaShieldAlt } from "react-icons/fa";

export default function WhyChooseStudioConnect() {
  return (
    <section className="bg-black text-white py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
          ¿Por qué elegir StudioConnect?
        </h2>
        <p className="text-gray-300 text-sm md:text-base mb-8 md:mb-12">
          Todo lo que necesitas para encontrar y reservar el estudio perfecto
        </p>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          <div className="flex flex-col items-center text-center">
            <FaMapMarkerAlt className="text-2xl md:text-4xl text-sky-700 mb-3 md:mb-4" />
            <h3 className="text-sm md:text-lg font-semibold">
              Fácil búsqueda de ubicación
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2 px-2">
              Mapas interactivos y búsqueda basada en la ubicación para encontrar
              estudios cerca de usted
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaRegCheckSquare className="text-2xl md:text-4xl text-sky-700 mb-3 md:mb-4" />
            <h3 className="text-sm md:text-lg font-semibold">
              Reserva Instantánea
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2 px-2">
              Disponibilidad en tiempo real y confirmación de reserva instantánea.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaShieldAlt className="text-2xl md:text-4xl text-sky-700 mb-3 md:mb-4" />
            <h3 className="text-sm md:text-lg font-semibold">Pagos seguros</h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2 px-2">
              Procesamiento de pagos seguro y protegido con múltiples opciones de
              pago
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}