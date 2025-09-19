import { Card, CardContent } from "./ui/card"; 
export default function UserTable({ users }) {
  return (
    <Card className="shadow rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Usuarios Registrados</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nombre</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Prioridad</th>
              <th className="p-2">Historial</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">{user.priority}</td>
                <td className="p-2">{user.history.length} libros</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
