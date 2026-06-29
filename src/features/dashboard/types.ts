export interface DashboardStats {
  totalResidents: number;
  totalFlats: number;
  activeVisitors: number;
  monthlyMaintenanceCollection: number;
  pendingComplaints: number;
  occupancyRate: number;
}

export type ActivityType = 'visitor' | 'maintenance' | 'payment' | 'notice' | 'amenity';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
  icon: string;
}
