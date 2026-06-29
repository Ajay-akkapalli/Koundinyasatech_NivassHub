export type MaintenanceStatus = 'Open' | 'In Progress' | 'Resolved';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MaintenanceRequest {
  id: string;
  title: string;
  category: string;
  flat: string;
  reportedBy: string;
  reportedDate: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  assignedTo: string | null;
  resolvedDate: string | null;
  description: string;
}
