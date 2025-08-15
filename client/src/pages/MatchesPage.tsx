const MatchesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">
            🏟️ Partidos
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center py-12">
            <span className="text-6xl mb-4 block">🏟️</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Gestión de Partidos
            </h2>
            <p className="text-gray-600">
              Aquí podrás gestionar todos tus partidos de fútbol.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (En desarrollo - Próximamente)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchesPage;
