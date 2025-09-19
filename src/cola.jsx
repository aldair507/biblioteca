import { useState } from "react";

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(solicitud) {
    this.queue.push(solicitud);
    this.queue.sort((a, b) => {
      if (b.prioridad === a.prioridad) {
        return a.timestamp - b.timestamp;
      }
      return b.prioridad - a.prioridad;
    });
  }

  dequeue() {
    return this.queue.shift();
  }
}

export default function DashboardBiblioteca() {
  const [cola] = useState(new PriorityQueue());
  const [solicitudes, setSolicitudes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("Estudiante");

  const rolesPrioridad = {
    Administrador: 4,
    Profesor: 3,
    Bibliotecario: 2,
    Estudiante: 1,
  };

  const agregarSolicitud = (e) => {
    e.preventDefault();

    const nuevaSolicitud = {
      usuario: nombre,
      rol,
      prioridad: rolesPrioridad[rol],
      timestamp: Date.now(),
    };

    cola.enqueue(nuevaSolicitud);
    setSolicitudes([...cola.queue]); // actualiza el estado
    setNombre("");
  };

  const prestarLibro = () => {
    const siguiente = cola.dequeue();
    if (!siguiente) return alert("No hay solicitudes en la cola");
    setSolicitudes([...cola.queue]);
    alert(`📖 Se presta el libro a: ${siguiente.usuario} (${siguiente.rol})`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        📚 Sistema de Solicitudes de Libros
      </h1>

      {/* Formulario */}
      <form
        onSubmit={agregarSolicitud}
        className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-md"
      >
        <input
          className="border p-2 rounded-md"
          type="text"
          placeholder="Nombre del usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded-md"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          {Object.keys(rolesPrioridad).map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Agregar Solicitud
        </button>
      </form>

      {/* Tabla de la cola */}
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

      {/* Botón para prestar libro */}
      <button
        onClick={prestarLibro}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        📖 Prestar al siguiente en la cola
      </button>
    </div>
  );
}
