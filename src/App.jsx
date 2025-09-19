import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Libros from "./pages/BookDetail.jsx";
import { LibraryProvider } from "./context/LibraryContext";
import { useState } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <LibraryProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar onChangeView={setCurrentView} currentView={currentView} />
        {currentView === "dashboard" && <AdminDashboard />}
        {currentView === "libros" && <Libros />}
        {currentView === "solicitudes" && <UserDashboard />}
      </div>
    </LibraryProvider>
  );
}
