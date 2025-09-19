export default function RequestTable({ solicitudes }) {
  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">📋 Cola de Solicitudes</h2>
      {solicitudes.length === 0 ? (
        <p className="text-gray-500">No hay solicitudes en espera</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Usuario</th>
              <th>Rol</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{s.usuario}</td>
                <td>{s.rol}</td>
                <td>{s.prioridad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
