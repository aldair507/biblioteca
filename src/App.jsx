import React, { useState, useEffect } from "react";
import { Book, User, Calendar, AlertCircle, Users, Crown, GraduationCap, BookOpen, Clock, Loader } from "lucide-react";
import { getBooks, getRequests, getRoles, getUsers } from "./api/api";

// =====================================================
// SERVICIOS - Usando tu API existente
// =====================================================

class LibraryAPI {
  static async getBooks() {
    return await getBooks();
  }

  static async getUsers() {
    return await getUsers();
  }

  static async getRoles() {
    return await getRoles();
  }

  static async getReservations() {
    const requests = await getRequests();
    return requests.filter(req => req.estado === 'pendiente');
  }

  static async getLoans() {
    const requests = await getRequests();
    return requests.filter(req => req.estado === 'Prestado');
  }

  static async createLoan(loanData) {
    // Aquí debes implementar la llamada a tu API para crear un préstamo
    console.log("Crear préstamo:", loanData);
    return {
      success: true,
      data: { id: Date.now(), ...loanData }
    };
  }

  static async createReservation(reservationData) {
    // Aquí debes implementar la llamada a tu API para crear una reserva
    console.log("Crear reserva:", reservationData);
    return {
      success: true,
      data: { id: Date.now(), ...reservationData }
    };
  }

  static async returnLoan(loanId) {
    // Aquí debes implementar la llamada a tu API para devolver un libro
    console.log("Devolver préstamo:", loanId);
    return {
      success: true,
      data: { loanId, returnedAt: new Date().toISOString() }
    };
  }
}

// =====================================================
// HOOKS PERSONALIZADOS
// =====================================================

const useApiData = (apiCall, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, setData, loading, error };
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (type, message, duration = 4000) => {
    const id = Date.now();
    const notification = { id, type, message };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  return { notifications, showNotification };
};

// =====================================================
// UTILIDADES
// =====================================================

const DateUtils = {
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  },
  
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  },
  
  isOverdue: (dueDate) => {
    return new Date(dueDate) < new Date();
  }
};

const ReservationUtils = {
  sortByPriority: (reservations, roles) => {
    return [...reservations].sort((a, b) => {
      // Buscar el role_id en el usuario y obtener la prioridad del rol
      const userA = a.user || a; // Adaptar según tu estructura
      const userB = b.user || b;
      
      const roleA = roles.find(r => r.id === userA.role_id);
      const roleB = roles.find(r => r.id === userB.role_id);
      
      const priorityA = roleA ? roleA.prioridad : 5;
      const priorityB = roleB ? roleB.prioridad : 5;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return new Date(a.created_at) - new Date(b.created_at);
    });
  },

  getUserPosition: (reservations, userId, roles) => {
    const sortedReservations = ReservationUtils.sortByPriority(reservations, roles);
    return sortedReservations.findIndex(r => r.user_id === userId) + 1;
  }
};

// =====================================================
// COMPONENTE PRINCIPAL CORREGIDO
// =====================================================

export default function LibrarySystemBackendReady() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ROLE_CONFIG, setROLE_CONFIG] = useState({});
  
  // APIs con hooks personalizados
  const { data: books, setData: setBooks, loading: booksLoading } = useApiData(LibraryAPI.getBooks);
  const { data: users, loading: usersLoading } = useApiData(LibraryAPI.getUsers);
  const { data: roles, loading: rolesLoading } = useApiData(LibraryAPI.getRoles);
  const { data: reservations, setData: setReservations } = useApiData(LibraryAPI.getReservations);
  const { data: loans, setData: setLoans } = useApiData(LibraryAPI.getLoans);
  
  const { notifications, showNotification } = useNotifications();

  // Configurar ROLE_CONFIG cuando se cargan los roles
  useEffect(() => {
    if (roles.length > 0) {
      const config = {};
      roles.forEach(role => {
        config[role.id] = {
          id: role.id,
          name: role.rol,
          priority: role.prioridad,
          maxLoans: role.prioridad === 1 ? 10 : role.prioridad === 2 ? 8 : role.prioridad === 3 ? 6 : 4,
          loanPeriod: role.prioridad === 1 ? 30 : role.prioridad === 2 ? 21 : role.prioridad === 3 ? 21 : 14,
          maxRenewals: role.prioridad === 1 ? 5 : role.prioridad === 2 ? 3 : role.prioridad === 3 ? 3 : 1,
          color: role.prioridad === 1 ? "bg-purple-100 text-purple-800 border-purple-200" :
                 role.prioridad === 2 ? "bg-blue-100 text-blue-800 border-blue-200" :
                 role.prioridad === 3 ? "bg-green-100 text-green-800 border-green-200" :
                 "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: role.prioridad === 1 ? Crown :
                role.prioridad === 2 ? Users :
                role.prioridad === 3 ? GraduationCap : User
        };
      });
      setROLE_CONFIG(config);
    }
  }, [roles]);

  // Establecer usuario por defecto
  useEffect(() => {
    if (users.length > 0 && !currentUser) {
      setCurrentUser(users[0]);
    }
  }, [users, currentUser]);

  // =====================================================
  // LÓGICA DE NEGOCIO ADAPTADA
  // =====================================================

  const validateLoanRequest = async (bookId, userId) => {
    const book = books.find(b => b.id === bookId);
    const user = users.find(u => u.id === userId);
    
    if (!book || !user) {
      throw new Error('Libro o usuario no encontrado');
    }

    const userRoleConfig = ROLE_CONFIG[user.role_id];
    if (!userRoleConfig) {
      throw new Error('Configuración de rol no encontrada');
    }

    const userLoans = loans.filter(l => l.user_id === userId);
    const userReservations = reservations.filter(r => r.user_id === userId);

    if (userLoans.some(loan => loan.book_id === bookId)) {
      throw new Error(`Ya tienes prestado "${book.titulo}"`);
    }

    if (userLoans.length >= userRoleConfig.maxLoans) {
      throw new Error(`Límite de préstamos alcanzado (${userRoleConfig.maxLoans} máximo)`);
    }

    if (userReservations.some(res => res.book_id === bookId)) {
      throw new Error(`Ya tienes una reserva activa para "${book.titulo}"`);
    }

    return { book, user, userRoleConfig };
  };

  const handleLoanRequest = async (bookId) => {
    if (!currentUser || isLoading) return;
    
    setIsLoading(true);
    try {
      const { book, user, userRoleConfig } = await validateLoanRequest(bookId, currentUser.id);

      // Calcular disponibilidad
      const bookLoans = loans.filter(l => l.book_id === bookId);
      const isAvailable = bookLoans.length === 0;

      if (isAvailable) {
        // Crear préstamo directo
        const loanData = {
          book_id: book.id,
          user_id: user.id,
          estado: 'Prestado'
        };

        const response = await LibraryAPI.createLoan(loanData);
        
        if (response.success) {
          setLoans(prev => [...prev, response.data]);
          showNotification('success', `✅ Préstamo aprobado: "${book.titulo}"`);
        }
      } else {
        // Crear reserva
        const reservationData = {
          book_id: book.id,
          user_id: user.id,
          estado: 'pendiente'
        };

        const response = await LibraryAPI.createReservation(reservationData);
        
        if (response.success) {
          const bookReservations = reservations.filter(r => r.book_id === bookId);
          const newReservations = [...bookReservations, response.data];
          const position = ReservationUtils.getUserPosition(newReservations, user.id, roles);
          
          setReservations(prev => [...prev, response.data]);
          
          showNotification('info', 
            `📋 Agregado a reservas en posición #${position} (${userRoleConfig.name})`
          );
        }
      }
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    setIsLoading(true);
    try {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;

      const response = await LibraryAPI.returnLoan(loanId);
      
      if (response.success) {
        setLoans(prev => prev.filter(l => l.id !== loanId));
        
        // Buscar siguiente reserva
        const bookReservations = reservations.filter(r => r.book_id === loan.book_id);
        const sortedReservations = ReservationUtils.sortByPriority(bookReservations, roles);
        const nextReservation = sortedReservations[0];

        if (nextReservation) {
          // Asignar a siguiente usuario
          const nextUser = users.find(u => u.id === nextReservation.user_id);
          const nextUserRoleConfig = ROLE_CONFIG[nextUser.role_id];
          
          const newLoanData = {
            book_id: loan.book_id,
            user_id: nextUser.id,
            estado: 'Prestado'
          };

          const newLoanResponse = await LibraryAPI.createLoan(newLoanData);
          
          setLoans(prev => [...prev, newLoanResponse.data]);
          setReservations(prev => prev.filter(r => r.id !== nextReservation.id));
          
          showNotification('info', 
            `📢 "${loan.bookTitle || books.find(b => b.id === loan.book_id)?.titulo}" asignado a ${nextUser.nombre} (${nextUserRoleConfig.name})`
          );
        } else {
          showNotification('success', `📚 Libro devuelto y disponible`);
        }
      }
    } catch (error) {
      showNotification('error', 'Error al devolver el libro');
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // RENDER ADAPTADO
  // =====================================================

  if (usersLoading || booksLoading || rolesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando sistema bibliotecario...</p>
        </div>
      </div>
    );
  }

  // Datos derivados
  const currentUserLoans = currentUser ? loans.filter(l => l.user_id === currentUser.id) : [];
  const currentUserReservations = currentUser ? reservations.filter(r => r.user_id === currentUser.id) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sistema Bibliotecario</h1>
                <p className="text-gray-600 text-sm">Conectado a MySQL</p>
              </div>
            </div>
            
            {currentUser && ROLE_CONFIG[currentUser.role_id] && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-gray-800">{currentUser.nombre}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${ROLE_CONFIG[currentUser.role_id].color}`}>
                      {ROLE_CONFIG[currentUser.role_id].name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Selector de Usuario */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Usuario Activo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {users.map((user) => {
              const roleData = ROLE_CONFIG[user.role_id];
              if (!roleData) return null;
              
              const Icon = roleData.icon;
              return (
                <button
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  disabled={isLoading}
                  className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors disabled:opacity-50 ${
                    currentUser?.id === user.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" />
                    <span className={`text-xs px-2 py-1 rounded-full ${roleData.color}`}>
                      {roleData.name}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-gray-800">{user.nombre}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Prioridad {roleData.priority} • {roleData.maxLoans} libros máx
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catálogo */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Catálogo de Libros
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((book) => {
                    const bookLoans = loans.filter(l => l.book_id === book.id);
                    const available = bookLoans.length === 0;
                    
                    return (
                      <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{book.titulo}</h3>
                            <p className="text-gray-600 text-sm">{book.autor}</p>
                            <p className="text-xs text-gray-500">Literatura</p>
                            <p className="text-xs text-gray-400 mt-1">ID: {book.id}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${available ? 'text-green-600' : 'text-red-600'}`}>
                              {available ? 'Disponible' : 'Prestado'}
                            </p>
                            <p className="text-xs text-gray-500">1 copia total</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => handleLoanRequest(book.id)}
                            disabled={isLoading || !currentUser}
                            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                              available
                                ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                                : 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-400'
                            } disabled:cursor-not-allowed`}
                          >
                            {isLoading ? '⏳ Procesando...' : 
                             available ? '📚 Solicitar Préstamo' : '📋 Hacer Reserva'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Usuario */}
          <div className="space-y-6">
            {/* Mis Préstamos */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-blue-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-600" />
                  Mis Préstamos ({currentUserLoans.length})
                </h3>
              </div>
              <div className="p-4">
                {currentUserLoans.length === 0 ? (
                  <p className="text-gray-600 text-sm">No tienes préstamos activos.</p>
                ) : (
                  <div className="space-y-3">
                    {currentUserLoans.map((loan) => {
                      const book = books.find(b => b.id === loan.book_id);
                      if (!book) return null;
                      
                      return (
                        <div key={loan.id} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800 text-sm">{book.titulo}</h4>
                              <p className="text-xs text-gray-600">{book.autor}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  Prestado: {new Date(loan.created_at).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleReturnBook(loan.id)}
                              disabled={isLoading}
                              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
                            >
                              Devolver
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mis Reservas */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-yellow-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Mis Reservas ({currentUserReservations.length})
                </h3>
              </div>
              <div className="p-4">
                {currentUserReservations.length === 0 ? (
                  <p className="text-gray-600 text-sm">No tienes reservas pendientes.</p>
                ) : (
                  <div className="space-y-3">
                    {currentUserReservations.map((reservation) => {
                      const book = books.find(b => b.id === reservation.book_id);
                      if (!book) return null;
                      
                      const bookReservations = reservations.filter(r => r.book_id === reservation.book_id);
                      const position = ReservationUtils.getUserPosition(bookReservations, currentUser.id, roles);
                      const roleData = ROLE_CONFIG[currentUser.role_id];
                      
                      return (
                        <div key={reservation.id} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                          <h4 className="font-medium text-gray-800 text-sm">{book.titulo}</h4>
                          <p className="text-xs text-gray-600">{book.autor}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-yellow-700 font-medium">
                              Posición: #{position}
                            </span>
                            {roleData && (
                              <span className={`text-xs px-2 py-1 rounded-full ${roleData.color}`}>
                                {roleData.name}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vista Global */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Estado Global del Sistema
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Préstamos Globales */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Préstamos Activos ({loans.length})</h3>
                {loans.length === 0 ? (
                  <p className="text-gray-600 text-sm">No hay préstamos activos.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {loans.map((loan) => {
                      const book = books.find(b => b.id === loan.book_id);
                      const user = users.find(u => u.id === loan.user_id);
                      const roleData = ROLE_CONFIG[user?.role_id];
                      
                      if (!book || !user || !roleData) return null;
                      
                      return (
                        <div key={loan.id} className="p-3 border rounded-lg bg-green-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm text-gray-800">{book.titulo}</p>
                              <p className="text-xs text-gray-600">{user.nombre}</p>
                              <p className="text-xs text-gray-500">
                                Prestado: {new Date(loan.created_at).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${roleData.color}`}>
                              {roleData.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reservas Globales */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Cola de Reservas ({reservations.length})</h3>
                {reservations.length === 0 ? (
                  <p className="text-gray-600 text-sm">No hay reservas pendientes.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {books.filter(book => reservations.some(r => r.book_id === book.id)).map(book => {
                      const bookReservations = reservations.filter(r => r.book_id === book.id);
                      const sortedReservations = ReservationUtils.sortByPriority(bookReservations, roles);
                      
                      return (
                        <div key={book.id} className="border rounded-lg p-3 bg-yellow-50">
                          <h4 className="font-medium text-sm text-gray-800 mb-2">{book.titulo}</h4>
                          <div className="space-y-1">
                            {sortedReservations.map((reservation, index) => {
                              const user = users.find(u => u.id === reservation.user_id);
                              const roleData = ROLE_CONFIG[user?.role_id];
                              
                              if (!user || !roleData) return null;
                              
                              return (
                                <div key={reservation.id} className="flex justify-between items-center text-xs">
                                  <span>#{index + 1} {user.nombre}</span>
                                  <span className={`px-2 py-1 rounded-full ${roleData.color}`}>
                                    {roleData.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              <p className="text-gray-700">Procesando...</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-6 py-4 rounded-lg shadow-lg text-white max-w-sm transform transition-all duration-300 ${
              notification.type === "success" ? "bg-green-500" :
              notification.type === "error" ? "bg-red-500" :
              notification.type === "warning" ? "bg-yellow-500" :
              "bg-blue-500"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}