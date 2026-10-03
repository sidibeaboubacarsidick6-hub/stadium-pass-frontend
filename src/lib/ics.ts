/**
 * Génère un fichier .ics (iCalendar) et le télécharge.
 * Compatible Google Calendar, Apple Calendar, Outlook.
 */

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toICalDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

export interface IcsEvent {
  title: string;
  description: string;
  location: string;
  startAt: string;      // ISO
  durationHours?: number; // défaut 2h
}

export function downloadIcs(event: IcsEvent, filename = 'match.ics') {
  const start = new Date(event.startAt);
  const end = new Date(start.getTime() + (event.durationHours ?? 2) * 3600 * 1000);

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Stadium Pass//FR',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@stadiumpass`,
    `DTSTAMP:${toICalDate(new Date().toISOString())}`,
    `DTSTART:${toICalDate(start.toISOString())}`,
    `DTEND:${toICalDate(end.toISOString())}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
