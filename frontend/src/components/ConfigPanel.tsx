import React, { useState } from 'react';
import { Settings, Save, Globe, Server, Database, Trash2 } from 'lucide-react';
import { NotificationConfig } from '../types/medication';
import { apiService } from '../services/api';
import { memoryService } from '../services/memoryService';

interface ConfigPanelProps {
  config: NotificationConfig;
  onUpdateConfig: (config: NotificationConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onUpdateConfig,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState(config);
  const serviceInfo = apiService.getServiceInfo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    onClose();
  };

  const handleClearMemoryData = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados da memória? Esta ação não pode ser desfeita.')) {
      try {
        await memoryService.clearAll();
        alert('Dados da memória limpos com sucesso!');
        window.location.reload(); // Reload to refresh the UI
      } catch (error) {
        console.error('Error clearing memory data:', error);
        alert('Erro ao limpar dados da memória');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Configurações
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Server className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Status do Serviço</span>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tipo:</span>
                <span className={`font-medium ${
                  serviceInfo.type === 'backend' 
                    ? (serviceInfo.connected ? 'text-green-600' : 'text-red-600')
                    : 'text-blue-600'
                }`}>
                  {serviceInfo.displayName}
                </span>
              </div>
              {serviceInfo.baseUrl && (
                <div className="flex justify-between">
                  <span>URL:</span>
                  <span className="font-mono text-xs">{serviceInfo.baseUrl}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${serviceInfo.connected ? 'text-green-600' : 'text-red-600'}`}>
                  {serviceInfo.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>

          {/* Environment Variables Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Configuração via .env</span>
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <div><code>VITE_SERVICE_TYPE</code>: memory | backend</div>
              <div><code>VITE_API_BASE_URL</code>: URL do backend</div>
            </div>
          </div>

          {/* Memory Service Actions */}
          {serviceInfo.type === 'memory' && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Serviço de Memória</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-yellow-600">
                  Dados armazenados na memória do navegador
                </p>
                <button
                  onClick={handleClearMemoryData}
                  className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-2 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Limpar Dados da Memória</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint de Notificação
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.notificationEndpointUrl}
                  onChange={(e) => setFormData({ notificationEndpointUrl: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="https://meu-endpoint.com/notify"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                URL para onde as notificações serão enviadas
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};