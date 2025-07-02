import { Medication, NotificationConfig } from '../types/medication';

// Simulate API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MemoryService {
  private medications: Medication[] = [];
  private config: NotificationConfig = {
    notificationEndpointUrl: ''
  };

  // 1. Criar um novo medicamento
  async createMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
    await delay(300);
    const newMedication: Medication = {
      ...medication,
      id: crypto.randomUUID(),
    };
    this.medications.push(newMedication);
    console.log('Memory Service: POST /medications', newMedication);
    return newMedication;
  }

  // 2. Listar todos os medicamentos
  async getMedications(): Promise<Medication[]> {
    await delay(200);
    console.log('Memory Service: GET /medications');
    return [...this.medications];
  }

  // 3. Atualizar um medicamento
  async updateMedication(id: string, medication: Medication): Promise<Medication> {
    await delay(300);
    const index = this.medications.findIndex(med => med.id === id);
    if (index === -1) throw new Error('Medication not found');
    
    this.medications[index] = { ...medication, id };
    console.log('Memory Service: PUT /medications/' + id, medication);
    return this.medications[index];
  }

  // 4. Remover um medicamento
  async deleteMedication(id: string): Promise<void> {
    await delay(200);
    const index = this.medications.findIndex(med => med.id === id);
    if (index === -1) throw new Error('Medication not found');
    
    this.medications.splice(index, 1);
    console.log('Memory Service: DELETE /medications/' + id);
  }

  // 5. Buscar configuração do endpoint de notificação
  async getConfig(): Promise<NotificationConfig> {
    await delay(150);
    console.log('Memory Service: GET /config');
    return { ...this.config };
  }

  // 6. Atualizar configuração do endpoint de notificação
  async updateConfig(config: NotificationConfig): Promise<NotificationConfig> {
    await delay(200);
    this.config = { ...config };
    console.log('Memory Service: PUT /config', config);
    return { ...this.config };
  }

  // Simular chamada para endpoint de notificação
  async sendNotification(medication: Medication): Promise<void> {
    const notificationPayload = {
      message: `Hora do medicamento: ${medication.name}`,
      medication: medication,
      timestamp: new Date().toISOString()
    };

    // Get current config to know the endpoint
    const currentConfig = await this.getConfig();
    
    if (!currentConfig.notificationEndpointUrl) {
      console.warn('Memory Service: Notification endpoint not configured');
      return;
    }

    try {
      console.log(`Memory Service: Notification Call: POST ${currentConfig.notificationEndpointUrl}`, notificationPayload);
      
      const response = await fetch(currentConfig.notificationEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPayload),
      });

      if (!response.ok) {
        throw new Error(`Notification failed: ${response.status}`);
      }

      console.log('Memory Service: Notification sent successfully');
    } catch (error) {
      console.error('Memory Service: Failed to send notification:', error);
      // Don't throw error to avoid breaking the UI
    }
  }

  // Clear all data (useful for testing)
  async clearAll(): Promise<void> {
    this.medications = [];
    this.config = { notificationEndpointUrl: '' };
    console.log('Memory Service: All data cleared');
  }

  // Get current data count
  getDataCount(): { medications: number } {
    return {
      medications: this.medications.length
    };
  }
}

export const memoryService = new MemoryService();