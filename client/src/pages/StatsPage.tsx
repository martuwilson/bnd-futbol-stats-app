const StatsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">📊 Estadísticas</h1>
          <p className="text-gray-600 mt-1">Análisis y métricas del equipo</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen General</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-blue-600">Partidos Jugados</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-green-600">Victorias</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-yellow-600">Empates</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-red-600">Derrotas</div>
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Jugadores</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">JM</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Juan Pérez</div>
                  <div className="text-sm text-gray-500">Delantero</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">12 goles</div>
                <div className="text-sm text-gray-500">5 asistencias</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">LR</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Luis Rodríguez</div>
                  <div className="text-sm text-gray-500">Mediocampista</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">8 goles</div>
                <div className="text-sm text-gray-500">10 asistencias</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🚧 Próximamente</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Gráficos de rendimiento</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Comparación entre jugadores</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Análisis de partidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
