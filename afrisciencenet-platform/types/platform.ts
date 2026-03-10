export type SearchGroup = 'equipment' | 'researchers' | 'institutions' | 'funding' | 'collaborations' | 'projects' | 'datasets';

export interface AnalyticsSnapshot {
  users: number;
  equipmentPending: number;
  fundingPending: number;
  collaborationPending: number;
  bookingsPending: number;
}
