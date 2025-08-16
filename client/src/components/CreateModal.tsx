import { useState } from 'react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'ADMIN' | 'MANAGER' | 'VIEWER';
}

const CreateModal = ({ isOpen, onClose, userRole }: CreateModalProps) => {
  const [activeTab, setActiveTab] = useState<'tournament' | 'match'>('tournament');
  const [tournamentName, setTournamentName] = useState('');
  const [matchData, setMatchData] = useState({
    title: '',
    teamA: '',
    teamB: '',
    date: '',
    time: ''
  });

  if (!isOpen) return null;

  const handleCreateTournament = () => {
    if (!tournamentName.trim()) return;
    
    console.log('Crear torneo:', tournamentName);
    // TODO: Implementar creación de torneo
    onClose();
  };

  const handleCreateMatch = () => {
    if (!matchData.title.trim() || !matchData.teamA.trim() || !matchData.teamB.trim()) return;
    
    console.log('Crear partido:', matchData);
    // TODO: Implementar creación de partido
    onClose();
  };

  const canCreateTournament = true; // Cualquiera puede crear un torneo/sala
  const canCreateMatch = userRole === 'ADMIN' || userRole === 'MANAGER';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-t-xl rounded-t-2xl sm:rounded-b-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 rounded-t-2xl sm:rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Crear Nuevo</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tournament')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tournament'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🏆 Torneo/Sala
            </button>
            <button
              onClick={() => setActiveTab('match')}
              disabled={!canCreateMatch}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'match' && canCreateMatch
                  ? 'bg-white text-blue-600 shadow-sm'
                  : canCreateMatch
                  ? 'text-gray-600 hover:text-gray-800'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              ⚽ Partido
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'tournament' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  🏆 Crear Torneo/Sala
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Crea tu propia sala de fútbol y compártela con tus amigos. 
                  Automáticamente serás el administrador.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Torneo/Sala
                </label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="Ej: Liga Barrio Norte 2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-blue-600 text-lg mr-2">ℹ️</span>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">¿Qué sucede al crear una sala?</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Te conviertes en ADMINISTRADOR</li>
                      <li>• Obtienes un link para compartir</li>
                      <li>• Otros se unen como VIEWERS</li>
                      <li>• Puedes crear partidos y gestionar el torneo</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateTournament}
                disabled={!tournamentName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                🏆 Crear Torneo/Sala
              </button>
            </div>
          )}

          {activeTab === 'match' && (
            <div className="space-y-6">
              {canCreateMatch ? (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      ⚽ Crear Partido
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Agrega un nuevo partido al torneo actual.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Partido
                    </label>
                    <input
                      type="text"
                      value={matchData.title}
                      onChange={(e) => setMatchData({...matchData, title: e.target.value})}
                      placeholder="Ej: FECHA 1 - SEMIFINAL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Equipo A
                      </label>
                      <input
                        type="text"
                        value={matchData.teamA}
                        onChange={(e) => setMatchData({...matchData, teamA: e.target.value})}
                        placeholder="EQUIPO NEGRO"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Equipo B
                      </label>
                      <input
                        type="text"
                        value={matchData.teamB}
                        onChange={(e) => setMatchData({...matchData, teamB: e.target.value})}
                        placeholder="EQUIPO BLANCO"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={matchData.date}
                        onChange={(e) => setMatchData({...matchData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora
                      </label>
                      <input
                        type="time"
                        value={matchData.time}
                        onChange={(e) => setMatchData({...matchData, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateMatch}
                    disabled={!matchData.title.trim() || !matchData.teamA.trim() || !matchData.teamB.trim()}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    ⚽ Crear Partido
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🔒</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Permisos Insuficientes
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Solo los ADMINISTRADORES y MANAGERS pueden crear partidos.
                    Como VIEWER, puedes crear un torneo/sala para convertirte en administrador.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
