import { Medication, NotificationConfig } from '../types/medication';

export class BackendService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Helper method to make HTTP requests
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle empty responses (like DELETE)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  // 1. Criar um novo medicamento
  async createMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
    console.log('Backend Service: POST /medications', medication);
    return await this.makeRequest<Medication>('/medications', {
      method: 'POST',
      body: JSON.stringify(medication),
    });
  }

  // 2. Listar todos os medicamentos
  async getMedications(): Promise<Medication[]> {
    console.log('Backend Service: GET /medications');
    return await this.makeRequest<Medication[]>('/medications');
  }

  // 3. Atualizar um medicamento
  async updateMedication(id: string, medication: Medication): Promise<Medication> {
    console.log('Backend Service: PUT /medications/' + id, medication);
    return await this.makeRequest<Medication>(`/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medication),
    });
  }

  // 4. Remover um medicamento
  async deleteMedication(id: string): Promise<void> {
    console.log('Backend Service: DELETE /medications/' + id);
    await this.makeRequest<void>(`/medications/${id}`, {
      method: 'DELETE',
    });
  }

  // 5. Buscar configuração do endpoint de notificação
  async getConfig(): Promise<NotificationConfig> {
    console.log('Backend Service: GET /config');
    return await this.makeRequest<NotificationConfig>('/config');
  }

  // 6. Atualizar configuração do endpoint de notificação
  async updateConfig(config: NotificationConfig): Promise<NotificationConfig> {
    console.log('Backend Service: PUT /config', config);
    return await this.makeRequest<NotificationConfig>('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
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
      console.warn('Backend Service: Notification endpoint not configured');
      return;
    }

    try {
      console.log(`Backend Service: Notification Call: POST ${currentConfig.notificationEndpointUrl}`, notificationPayload);
      
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

      console.log('Backend Service: Notification sent successfully');
    } catch (error) {
      console.error('Backend Service: Failed to send notification:', error);
      // Don't throw error to avoid breaking the UI
    }
  }

  // Health check method to test backend connectivity
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000,
      } as RequestInit);
      return response.ok;
    } catch {
      return false;
    }
  }
}