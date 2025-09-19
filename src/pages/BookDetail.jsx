import BookTable from "../components/BookTable";
import { useLibrary } from "../context/LibraryContext";

export default function Libros() {
  const { books, users, requestBook, returnBook } = useLibrary();

  // 📌 Simulamos que el usuario actual es el ID 1 (Juan)
  const usuarioActual = users.find((u) => u.id === 1);

  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold">📚 Libros Disponibles</h1>

      {/* Datos del usuario actual */}
      <div className="bg-white shadow p-4 rounded-xl">
        <p>
          👤 <span className="font-semibold">{usuarioActual?.name}</span> (
          {usuarioActual?.role})
        </p>
        <p>
          📖 Libros solicitados:{" "}
          <span className="font-semibold">
            {usuarioActual?.history?.length ?? 0}
          </span>
        </p>
      </div>

      {/* Tabla de libros */}
      <BookTable
        books={books} // ✅ Pasamos los libros para que la tabla los muestre
        onRequestBook={(idLibro) => requestBook(idLibro, usuarioActual.id)}
        onDeliverBook={(idLibro) => returnBook(idLibro)}
      />

      {/* Historial del usuario */}
      <div className="bg-white shadow p-4 rounded-xl">
        <h2 className="text-lg font-bold mb-2">📜 Historial</h2>
        {usuarioActual?.history?.length > 0 ? (
          <ul className="list-disc pl-5">
            {usuarioActual.history.map((h, index) => (
              <li key={index}>
                Libro #{h.bookId} –{" "}
                <span
                  className={
                    h.estado === "pendiente"
                      ? "text-yellow-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {h.estado}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No has solicitado ningún libro todavía.</p>
        )}
      </div>
    </div>
  );
}
