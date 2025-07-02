import React, { useState } from 'react';
import { Header } from './components/Header';
import { MedicationCard } from './components/MedicationCard';
import { MedicationForm } from './components/MedicationForm';
import { ConfigPanel } from './components/ConfigPanel';
import { useMedications } from './hooks/useMedications';
import { Medication } from './types/medication';
import { Search, Loader, Pill } from 'lucide-react';

function App() {
  const {
    medications,
    config,
    loading,
    error,
    createMedication,
    updateMedication,
    deleteMedication,
    updateConfig,
    sendNotification,
    clearError,
  } = useMedications();

  const [showForm, setShowForm] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddMedication = () => {
    setEditingMedication(undefined);
    setShowForm(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setShowForm(true);
  };

  const handleSubmitMedication = async (medicationData: Omit<Medication, 'id'>) => {
    try {
      if (editingMedication) {
        await updateMedication(editingMedication.id, { ...medicationData, id: editingMedication.id });
      } else {
        await createMedication(medicationData);
      }
      setShowForm(false);
      setEditingMedication(undefined);
    } catch (err) {
      console.error('Error submitting medication:', err);
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        await deleteMedication(id);
      } catch (err) {
        console.error('Error deleting medication:', err);
      }
    }
  };

  const handleSendNotification = async (medication: Medication) => {
    try {
      await sendNotification(medication);
      alert(`Notificação enviada para: ${medication.name}`);
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const handleUpdateConfig = async (newConfig: typeof config) => {
    try {
      await updateConfig(newConfig);
      alert('Configuração atualizada com sucesso!');
    } catch (err) {
      console.error('Error updating config:', err);
    }
  };

  // Filter medications based on search
  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando medicamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddMedication={handleAddMedication}
        onOpenConfig={() => setShowConfig(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">Medicamentos</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar medicamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredMedications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onEdit={handleEditMedication}
                  onDelete={handleDeleteMedication}
                  onSendNotification={handleSendNotification}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum medicamento encontrado' : 'Nenhum medicamento cadastrado'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca.'
                  : 'Adicione seu primeiro medicamento para começar.'
                }
              </p>
            </div>
          )}
        </div>

        {config.notificationEndpointUrl && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Endpoint configurado:</strong> {config.notificationEndpointUrl}
            </p>
          </div>
        )}
      </main>

      <MedicationForm
        medication={editingMedication}
        onSubmit={handleSubmitMedication}
        onCancel={() => {
          setShowForm(false);
          setEditingMedication(undefined);
        }}
        isOpen={showForm}
      />

      <ConfigPanel
        config={config}
        onUpdateConfig={handleUpdateConfig}
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />
    </div>
  );
}

export default App;