import { Search, MapPin } from 'lucide-react';

export const BannerSearch = () => {
  return (
    <div className="text-black p-4 sm:p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-medium">
        Encuentra tu estudio ideal
      </h2>
      <h3 className="text-sm sm:text-base md:text-lg text-center mb-6 mt-2 sm:mt-4">
        Busca y filtra estudios por ubicación, equipamiento y disponibilidad.
      </h3>
      <div className="bg-white flex flex-col sm:flex-row flex-wrap justify-center items-start p-4 sm:p-6 mt-6 sm:mt-10 mb-10 rounded-md shadow-md gap-4 sm:gap-8">
        {/* Location */}
        <div className="flex flex-col w-full sm:w-62">
          <label htmlFor="location" className="mb-2 font-medium">Locación</label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="location"
              type="text"
              placeholder="Ciudad,direccion"
              className="border rounded-md p-2 pl-1 w-full"
            />
          </div>
        </div>

        {/* Studio Type */}
        <div className="flex flex-col w-full sm:w-62">
          <label htmlFor="studio" className="mb-2 font-medium">Tipo de estudio</label>
          <select id="studio" className="border rounded-md p-3 pl-1 w-full">
            <option value="">Todos los tipos</option>
            <option value="bsas">Tipo A</option>
            <option value="cordoba">Tipo B</option>
            <option value="rosario">Tipo C</option>
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col w-full sm:w-62">
          <label htmlFor="date" className="mb-2 font-medium">Fecha</label>
          <input
            id="date"
            type="date"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Search Button */}
        <div className="flex flex-col w-full sm:w-48 mt-2 sm:mt-0">
          <div className="mb-2 h-6"></div>
          <div className="relative">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-white w-5 h-5" />
            <button className="bg-sky-800 p-2  text-white rounded-md w-full">Buscar</button>
          </div>
        </div>

      </div>
    </div>
  );
};
