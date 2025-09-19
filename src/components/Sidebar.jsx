import { Home, Users, Book } from "lucide-react";

export default function Sidebar({ onChangeView, currentView }) {
  const links = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "solicitudes", label: "Solicitudes", icon: <Users size={20} /> },
    { id: "libros", label: "Libros", icon: <Book size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-6">📚 Biblioteca</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onChangeView(link.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
              currentView === link.id ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {link.icon} {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
