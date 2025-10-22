export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  type: 'Warehouse' | 'Distribution' | 'Storage' | 'Processing';
  status: 'Active' | 'Maintenance' | 'Inactive';
  capacity: number;
  currentOccupancy: number;
  manager: string;
  lastInspection: string;
  nextInspection: string;
  certifications: string[];
  notes: string;
}

export type FacilityFormData = Omit<Facility, 'id'>;