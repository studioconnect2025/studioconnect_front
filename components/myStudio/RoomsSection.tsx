export default function RoomsSection() {
  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Mis salas</h3>

      <div className="space-y-4">
        {[1,2,3].map((i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-4 flex items-start justify-between">
            <div>
              <h4 className="font-medium">Sala {i} — Nombre</h4>
              <p className="text-sm text-gray-500">Tipo • m² • Min. x hs • $/hora</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700">
                Editar
              </button>
              <button className="px-3 py-1 rounded-lg text-white"
                      style={{backgroundColor: "#b91c1c"}}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
