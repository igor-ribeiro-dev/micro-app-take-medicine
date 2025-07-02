import { Medication, NotificationConfig } from '../types/medication';
import { memoryService } from './memoryService';
import { BackendService } from './backendService';

// Environment configuration
const SERVICE_TYPE = import.meta.env.VITE_SERVICE_TYPE || 'memory'; // 'memory' | 'backend'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Service interface for consistent API
interface ServiceInterface {
  createMedication(medication: Omit<Medication, 'id'>): Promise<Medication>;
  getMedications(): Promise<Medication[]>;
  updateMedication(id: string, medication: Medication): Promise<Medication>;
  deleteMedication(id: string): Promise<void>;
  getConfig(): Promise<NotificationConfig>;
  updateConfig(config: NotificationConfig): Promise<NotificationConfig>;
  sendNotification(medication: Medication): Promise<void>;
}

class ApiService implements ServiceInterface {
  private service: ServiceInterface;
  private backendService?: BackendService;
  private serviceType: string;
  private backendConnected: boolean = false;

  constructor() {
    this.serviceType = SERVICE_TYPE;
    
    if (this.serviceType === 'backend') {
      this.backendService = new BackendService(API_BASE_URL);
      this.service = this.backendService;
      // Check connectivity on initialization
      this.checkBackendHealth();
    } else {
      this.service = memoryService;
    }

    console.log(`🔧 API Service initialized with: ${this.serviceType.toUpperCase()}`);
    if (this.serviceType === 'backend') {
      console.log(`🌐 Backend URL: ${API_BASE_URL}`);
    }
  }

  private async checkBackendHealth(): Promise<void> {
    if (this.backendService) {
      try {
        this.backendConnected = await this.backendService.healthCheck();
        console.log(`🏥 Backend health check: ${this.backendConnected ? '✅ Connected' : '❌ Disconnected'}`);
      } catch (error) {
        this.backendConnected = false;
        console.log('🏥 Backend health check: ❌ Failed');
      }
    }
  }

  // Direct delegation to the configured service (no fallback)
  async createMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
    return await this.service.createMedication(medication);
  }

  async getMedications(): Promise<Medication[]> {
    return await this.service.getMedications();
  }

  async updateMedication(id: string, medication: Medication): Promise<Medication> {
    return await this.service.updateMedication(id, medication);
  }

  async deleteMedication(id: string): Promise<void> {
    return await this.service.deleteMedication(id);
  }

  async getConfig(): Promise<NotificationConfig> {
    return await this.service.getConfig();
  }

  async updateConfig(config: NotificationConfig): Promise<NotificationConfig> {
    return await this.service.updateConfig(config);
  }

  async sendNotification(medication: Medication): Promise<void> {
    return await this.service.sendNotification(medication);
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    if (this.serviceType === 'backend' && this.backendService) {
      this.backendConnected = await this.backendService.healthCheck();
      return this.backendConnected;
    }
    return true; // Memory service is always "healthy"
  }

  // Get current service information
  getServiceInfo(): {
    type: string;
    baseUrl?: string;
    connected: boolean;
    displayName: string;
  } {
    return {
      type: this.serviceType,
      baseUrl: this.serviceType === 'backend' ? API_BASE_URL : undefined,
      connected: this.serviceType === 'backend' ? this.backendConnected : true,
      displayName: this.serviceType === 'backend' 
        ? 'Backend API'
        : 'Memory Service'
    };
  }

  // Force refresh backend connection status
  async refreshConnection(): Promise<void> {
    if (this.serviceType === 'backend') {
      await this.checkBackendHealth();
    }
  }
}

export const apiService = new ApiService();