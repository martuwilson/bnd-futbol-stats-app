const DashboardPage = () => {
  // TODO: Implementar GET_ME_QUERY en el backend para obtener datos del usuario

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 📱 Mobile-First Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚽</span>
              </div>
              <h1 className="ml-3 text-lg sm:text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-600 hidden xs:block">
                Hola, Usuario
              </span>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="text-xs sm:text-sm text-red-600 hover:text-red-700 px-2 py-1 rounded"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 📊 Main Content */}
      <main className="px-3 py-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 🎯 Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              ¡Bienvenido a Fútbol Stats App! ⚽
            </h2>
            <p className="text-gray-600 text-sm">
              Gestiona tus estadísticas de fútbol amateur de forma fácil y rápida.
              Optimizado para dispositivos móviles y grupos de WhatsApp.
            </p>
          </div>

          {/* 📊 Stats Grid - Mobile optimized */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4 mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">0</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Partidos</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">0</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Goles</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600">0</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Asistencias</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">0%</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Efectividad</div>
            </div>
          </div>

          {/* 🏆 Placeholder for stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              🏆 Top Goleadores
            </h3>
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <span className="text-3xl sm:text-4xl mb-2 block">⚽</span>
              <p className="text-sm sm:text-base">Aún no hay estadísticas disponibles</p>
              <p className="text-xs sm:text-sm">¡Empieza agregando partidos!</p>
            </div>
          </div>

          {/* 📱 Quick Actions - Mobile optimized */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <button 
              onClick={() => window.location.href = '/matches'}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-left active:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">🏟️</span>
                </div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Ver Partidos</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Gestiona tus partidos</p>
                </div>
                <div className="ml-auto">
                  <span className="text-gray-400 text-lg">›</span>
                </div>
              </div>
            </button>
            <button 
              onClick={() => window.location.href = '/stats'}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-left active:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">📊</span>
                </div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Estadísticas</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Ver rankings completos</p>
                </div>
                <div className="ml-auto">
                  <span className="text-gray-400 text-lg">›</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
