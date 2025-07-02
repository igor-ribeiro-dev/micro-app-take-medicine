export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
}

export interface NotificationConfig {
  notificationEndpointUrl: string;
}