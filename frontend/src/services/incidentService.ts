import type { Incident, Alert, DashboardSummary } from '../types/alert';
import { INITIAL_INCIDENTS, INITIAL_DASHBOARD_SUMMARY } from '../mocks/mock-data';

class IncidentStore {
  private incidents: Incident[] = [...INITIAL_INCIDENTS];
  private dashboardSummary: DashboardSummary = { ...INITIAL_DASHBOARD_SUMMARY };
  private listeners: (() => void)[] = [];

  constructor() {
    const saved = localStorage.getItem('cyberguard_incidents_store');
    if (saved) {
      try {
        this.incidents = JSON.parse(saved);
      } catch {
        this.incidents = [...INITIAL_INCIDENTS];
      }
    }
  }

  private persist() {
    localStorage.setItem('cyberguard_incidents_store', JSON.stringify(this.incidents));
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getAll(): Incident[] {
    return [...this.incidents];
  }

  public getById(id: string): Incident | undefined {
    return this.incidents.find((inc) => inc.id === id);
  }

  public createFromAlert(alert: Alert, title?: string): Incident {
    const newIncident: Incident = {
      id: `inc-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || `${alert.threat_type.toUpperCase().replace('_', ' ')} Threat Detection (${alert.details?.target || alert.alert_id})`,
      status: 'Open',
      severity: alert.risk_tier,
      assigned_to: 'Alex Vance (SOC Analyst)',
      opened_at: new Date().toISOString(),
      summary: `Automated detection event processed via CyberGuard AI pipeline. Risk score: ${(alert.risk_score * 100).toFixed(0)}%.`,
      alerts: [alert],
      recommended_action: alert.recommended_action
    };

    this.incidents.unshift(newIncident);
    this.persist();
    return newIncident;
  }

  public approve(id: string, notes?: string): Incident | null {
    const incident = this.incidents.find((inc) => inc.id === id);
    if (!incident) return null;

    incident.status = 'Contained';
    incident.closed_at = new Date().toISOString();
    if (notes) incident.notes = notes;
    this.persist();
    return incident;
  }

  public dismiss(id: string, notes?: string): Incident | null {
    const incident = this.incidents.find((inc) => inc.id === id);
    if (!incident) return null;

    incident.status = 'Dismissed';
    incident.closed_at = new Date().toISOString();
    if (notes) incident.notes = notes;
    this.persist();
    return incident;
  }

  public escalate(id: string, notes?: string): Incident | null {
    const incident = this.incidents.find((inc) => inc.id === id);
    if (!incident) return null;

    incident.status = 'Escalated';
    incident.severity = 'Critical';
    if (notes) incident.notes = notes;
    this.persist();
    return incident;
  }

  public getDashboardSummary(): DashboardSummary {
    const criticalCount = this.incidents.filter((i) => i.severity === 'Critical').length;
    const highCount = this.incidents.filter((i) => i.severity === 'High').length;
    const medCount = this.incidents.filter((i) => i.severity === 'Medium').length;

    const criticalOpen = this.incidents.find((i) => i.status === 'Open' && i.severity === 'Critical');

    return {
      ...this.dashboardSummary,
      total_events: 180 + this.incidents.length,
      by_severity: {
        Critical: criticalCount,
        High: highCount,
        Medium: medCount,
        Low: 45,
        Safe: 48
      },
      recent_incidents: this.incidents.slice(0, 8),
      attention_band: criticalOpen
        ? {
            incident_id: criticalOpen.id,
            title: criticalOpen.title,
            severity: criticalOpen.severity,
            time: 'Active now',
            summary: criticalOpen.summary || 'Uncontained critical incident pending authorization.'
          }
        : null
    };
  }

  public resetDemoData() {
    this.incidents = [...INITIAL_INCIDENTS];
    this.persist();
  }
}

export const incidentService = new IncidentStore();
