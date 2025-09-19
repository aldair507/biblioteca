import { useState } from "react";

export default function RequestForm({ onAddRequest }) {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("Estudiante");
  const [libro, setLibro] = useState("");

  const rolesPrioridad = {
    Administrador: 4,
    Profesor: 3,
    Bibliotecario: 2,
    Estudiante: 1,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRequest({
      usuario: nombre,
      rol,
      libro,
      prioridad: rolesPrioridad[rol],
      timestamp: Date.now(),
    });
    setNombre("");
    setLibro("");
  };

  return (
    <form
      onSubmit={handleSubmit}
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

      <input
        className="border p-2 rounded-md"
        type="text"
        placeholder="Nombre del libro"
        value={libro}
        onChange={(e) => setLibro(e.target.value)}
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
        Solicitar Libro
      </button>
    </form>
  );
}
