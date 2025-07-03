import { Medication, NotificationConfig } from '../types/medication';
import { memoryService } from './memoryService';
import { BackendService } from './backendService';

// Environment detection
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Environment configuration
const SERVICE_TYPE = import.meta.env.VITE_SERVICE_TYPE || 'memory'; // 'memory' | 'backend'

// URL configuration based on environment
function getApiBaseUrl(): string {
  if (isProduction) {
    // In production, use the VITE_API_BASE_URL or default to current origin
    return import.meta.env.VITE_API_BASE_URL || window.location.origin;
  } else {
    // In development, allow custom backend URL or use default
    const customBackendUrl = localStorage.getItem('dev_backend_url');
    return customBackendUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  }
}

const API_BASE_URL = getApiBaseUrl();

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
  private currentApiUrl: string;

  constructor() {
    this.serviceType = SERVICE_TYPE;
    this.currentApiUrl = API_BASE_URL;
    
    if (this.serviceType === 'backend') {
      this.backendService = new BackendService(this.currentApiUrl);
      this.service = this.backendService;
      // Check connectivity on initialization
      this.checkBackendHealth();
    } else {
      this.service = memoryService;
    }

    console.log(`🔧 API Service initialized with: ${this.serviceType.toUpperCase()}`);
    console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    if (this.serviceType === 'backend') {
      console.log(`🌐 Backend URL: ${this.currentApiUrl}`);
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

  // Method to update backend URL (for development)
  async updateBackendUrl(newUrl: string): Promise<boolean> {
    if (!isDevelopment) {
      console.warn('Backend URL can only be changed in development mode');
      return false;
    }

    try {
      // Test the new URL first
      const testService = new BackendService(newUrl);
      const isHealthy = await testService.healthCheck();
      
      if (!isHealthy) {
        throw new Error('Backend health check failed');
      }

      // Update the URL
      this.currentApiUrl = newUrl;
      localStorage.setItem('dev_backend_url', newUrl);
      
      // Recreate the backend service with new URL
      this.backendService = new BackendService(this.currentApiUrl);
      this.service = this.backendService;
      
      // Update connection status
      this.backendConnected = true;
      
      console.log(`🌐 Backend URL updated to: ${this.currentApiUrl}`);
      return true;
    } catch (error) {
      console.error('Failed to update backend URL:', error);
      return false;
    }
  }

  // Method to reset backend URL to default
  resetBackendUrl(): void {
    if (!isDevelopment) {
      console.warn('Backend URL can only be reset in development mode');
      return;
    }

    localStorage.removeItem('dev_backend_url');
    this.currentApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    
    if (this.serviceType === 'backend') {
      this.backendService = new BackendService(this.currentApiUrl);
      this.service = this.backendService;
      this.checkBackendHealth();
    }
    
    console.log(`🌐 Backend URL reset to: ${this.currentApiUrl}`);
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
    environment: string;
    canChangeUrl: boolean;
  } {
    return {
      type: this.serviceType,
      baseUrl: this.serviceType === 'backend' ? this.currentApiUrl : undefined,
      connected: this.serviceType === 'backend' ? this.backendConnected : true,
      displayName: this.serviceType === 'backend' 
        ? 'Backend API'
        : 'Memory Service',
      environment: isProduction ? 'production' : 'development',
      canChangeUrl: isDevelopment && this.serviceType === 'backend'
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