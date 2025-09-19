// components/BookTable.jsx
import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import { Card, CardContent } from "./ui/card"; 

export default function BookTable({ books }) {
  const { users } = useLibrary();
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <Card className="shadow rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Libros</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Título</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Solicitudes</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{book.title}</td>
                <td className="p-2">
                  {book.available ? (
                    <span className="text-green-600 font-semibold">Disponible</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Prestado</span>
                  )}
                </td>
                <td className="p-2">{book.requests.length} en cola</td>
                <td className="p-2 text-center">
                  {book.requests.length > 0 && (
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Ver Cola
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal simple para mostrar la cola de solicitudes */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
              <h3 className="text-lg font-bold mb-4">
                Solicitudes para {selectedBook.title}
              </h3>
              <ul className="space-y-2">
                {selectedBook.requests.map((userId, idx) => {
                  const user = users.find(u => u.id === userId);
                  return (
                    <li key={idx} className="p-2 bg-gray-100 rounded-lg">
                      {user.name} ({user.role}) - Prioridad {user.priority}
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => setSelectedBook(null)}
                className="mt-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
