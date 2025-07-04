import React, { useState, useEffect } from 'react';
import { Pill, Settings, Plus, Wifi, WifiOff, Database, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

interface HeaderProps {
  onAddMedication: () => void;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAddMedication,
  onOpenConfig,
}) => {
  const [serviceInfo, setServiceInfo] = useState(apiService.getServiceInfo());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Initial service info load
    setServiceInfo(apiService.getServiceInfo());
    
    // Check connection if backend
    if (serviceInfo.type === 'backend') {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    setRefreshing(true);
    await apiService.refreshConnection();
    setServiceInfo(apiService.getServiceInfo());
    setRefreshing(false);
  };

  const getStatusIcon = () => {
    if (serviceInfo.type === 'memory') {
      return <Database className="h-3 w-3" />;
    }
    
    if (serviceInfo.connected) {
      return <Wifi className="h-3 w-3" />;
    }
    
    return <WifiOff className="h-3 w-3" />;
  };

  const getStatusColor = () => {
    if (serviceInfo.type === 'memory') {
      return 'text-blue-600';
    }
    
    if (serviceInfo.connected) {
      return 'text-green-600';
    }
    
    return 'text-orange-600';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Medicamentos</h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">Gestão Simplificada de Medicamentos</p>
                <div className="flex items-center space-x-1">
                  <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                    {getStatusIcon()}
                    <span className="text-xs font-medium">{serviceInfo.displayName}</span>
                  </div>
                  {serviceInfo.type === 'backend' && (
                    <button
                      onClick={checkConnection}
                      disabled={refreshing}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Verificar conexão"
                    >
                      <RefreshCw className={`h-3 w-3 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenConfig}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Configurações"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={onAddMedication}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Medicamento</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};