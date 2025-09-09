export default function MyStudioHeader() {
  return (
    <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Nombre de mi estudio</h2>
          <p className="text-sm text-gray-500">Ubicación • Ciudad, Provincia</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-lg text-white shadow"
                  style={{backgroundColor: "#015E88"}}>
            Editar datos del estudio
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">
            Editar salas
          </button>
        </div>
      </div>
    </section>
  );
}
