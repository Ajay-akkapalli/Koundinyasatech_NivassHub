export interface Profile {
  name: string;
  flat: string;
  block: string;
  phone: string;
  email: string;
  members: string;
  vehicleNo: string;
}

export interface AppSettings {
  pushNotifications: boolean;
  visitorAlerts: boolean;
  maintenanceAlerts: boolean;
  paymentReminders: boolean;
  darkMode: boolean;
  soundEnabled: boolean;
}
