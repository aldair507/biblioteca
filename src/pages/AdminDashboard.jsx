import { useState } from "react";
import RequestForm from "../components/RequestForm";
// pages/AdminDashboard.jsx
import { useLibrary } from "../context/LibraryContext";
import RequestTable from "../components/RequestTable";
import PriorityQueue from "../utils/PriorityQueue";
import DashboardCard from "../components/DashboardCard";
import UserTable from "../components/UserTable";
import BookTable from "../components/BookTable.jsx";

export default function AdminDashboard() {
  const [cola] = useState(new PriorityQueue());
  const [solicitudes, setSolicitudes] = useState([]);
  const { users, books } = useLibrary();
  const agregarSolicitud = (solicitud) => {
    cola.enqueue(solicitud);
    setSolicitudes([...cola.queue]);
  };

  const prestarLibro = () => {
    const siguiente = cola.dequeue();
    if (!siguiente) return alert("No hay solicitudes en la cola");
    setSolicitudes([...cola.queue]);
    alert(`📖 Libro prestado a: ${siguiente.usuario} (${siguiente.rol})`);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">📚 Panel del Bibliotecario</h1>
      <RequestForm onAddRequest={agregarSolicitud} />
      <RequestTable solicitudes={solicitudes} />
      <button
        onClick={prestarLibro}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        📖 Prestar al siguiente en la cola
      </button>
       <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">Panel del Bibliotecario</h1>

      {/* Métricas principales */}
      <div className="grid grid-cols-3 gap-4">
        <DashboardCard title="Usuarios" value={users.length} />
        <DashboardCard title="Libros" value={books.length} />
        <DashboardCard
          title="Libros Prestados"
          value={books.filter(b => !b.available).length}
        />
      </div>

      {/* Tabla de usuarios */}
      <UserTable users={users} />

      {/* Tabla de libros con disponibilidad */}
      <BookTable books={books} />
    </div>
    </div>
  );
}
