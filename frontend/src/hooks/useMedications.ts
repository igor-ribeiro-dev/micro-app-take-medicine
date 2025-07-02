import { useState, useEffect } from 'react';
import { Medication, NotificationConfig } from '../types/medication';
import { apiService } from '../services/api';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [config, setConfig] = useState<NotificationConfig>({ notificationEndpointUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMedications();
    loadConfig();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMedications();
      setMedications(data);
    } catch (err) {
      setError('Erro ao carregar medicamentos');
      console.error('Error loading medications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    try {
      const configData = await apiService.getConfig();
      setConfig(configData);
    } catch (err) {
      console.error('Error loading config:', err);
    }
  };

  const createMedication = async (medicationData: Omit<Medication, 'id'>) => {
    try {
      const newMedication = await apiService.createMedication(medicationData);
      setMedications(prev => [...prev, newMedication]);
      return newMedication;
    } catch (err) {
      setError('Erro ao criar medicamento');
      throw err;
    }
  };

  const updateMedication = async (id: string, medicationData: Medication) => {
    try {
      const updatedMedication = await apiService.updateMedication(id, medicationData);
      setMedications(prev => prev.map(med => med.id === id ? updatedMedication : med));
      return updatedMedication;
    } catch (err) {
      setError('Erro ao atualizar medicamento');
      throw err;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await apiService.deleteMedication(id);
      setMedications(prev => prev.filter(med => med.id !== id));
    } catch (err) {
      setError('Erro ao excluir medicamento');
      throw err;
    }
  };

  const updateConfig = async (newConfig: NotificationConfig) => {
    try {
      const updatedConfig = await apiService.updateConfig(newConfig);
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      setError('Erro ao atualizar configuração');
      throw err;
    }
  };

  const sendNotification = async (medication: Medication) => {
    try {
      await apiService.sendNotification(medication);
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  return {
    medications,
    config,
    loading,
    error,
    createMedication,
    updateMedication,
    deleteMedication,
    updateConfig,
    sendNotification,
    clearError: () => setError(null),
  };
};