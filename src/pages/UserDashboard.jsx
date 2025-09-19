import { useState } from "react";
import RequestForm from "../components/RequestForm";

export default function UserDashboard({ onAddRequest }) {
  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">👤 Vista del Usuario</h1>
      <p className="mb-4 text-gray-600">
        Aquí puedes solicitar libros. Cuando haya disponibilidad se te notificará
        según tu prioridad.
      </p>
      <RequestForm onAddRequest={onAddRequest} />
    </div>
  );
}
