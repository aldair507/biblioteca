// context/LibraryContext.jsx
import { createContext, useContext, useState } from "react";

const LibraryContext = createContext();
export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  const [users, setUsers] = useState([
    { id: 1, name: "Juan", role: "usuario", priority: 1, history: [] },
    { id: 2, name: "Ana", role: "bibliotecario", priority: 5, history: [] }
  ]);

  const [books, setBooks] = useState([
    { id: 1, title: "El Quijote", available: false, requests: [] },
    { id: 2, title: "Cien años de soledad", available: true, requests: [] }
  ]);
  // 🟢 Solicitar libro (por prioridad)
  const solicitarLibro = (bookId, userId) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === bookId
          ? {
              ...book,
              solicitudes: [...book.solicitudes, userId].sort(
                (a, b) =>
                  users.find(u => u.id === b).prioridad -
                  users.find(u => u.id === a).prioridad
              )
            }
          : book
      )
    );

    // Agregamos al historial como "pendiente"
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              historial: [
                ...u.historial,
                { libro: bookId, estado: "pendiente" }
              ]
            }
          : u
      )
    );
  };

  // 🔄 Entregar libro → pasa al siguiente en la cola de prioridad
  const entregarLibro = (bookId) => {
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === bookId) {
          if (book.solicitudes.length > 0) {
            const siguienteUsuarioId = book.solicitudes[0];

            // ✅ Actualizamos historial de ese usuario a "entregado"
            setUsers(prevUsers =>
              prevUsers.map(u =>
                u.id === siguienteUsuarioId
                  ? {
                      ...u,
                      historial: u.historial.map(h =>
                        h.libro === bookId && h.estado === "pendiente"
                          ? { ...h, estado: "entregado" }
                          : h
                      )
                    }
                  : u
              )
            );

            return {
              ...book,
              disponible: false,
              solicitudes: book.solicitudes.slice(1) // quitamos al que ya recibió
            };
          }

          return { ...book, disponible: true }; // si no hay solicitudes → queda libre
        }
        return book;
      })
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        users,
        books,
        solicitarLibro,
        entregarLibro
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
