import { promises as fs } from 'fs';
import path from 'path';

// Simple JSON file persistence for issued tickets
// Each ticket record: {
//   eventId, ticketId, name, date, other,
//   issuedAt, hasEntered (bool), enteredAt (iso|null), lastUpdatedAt
// }

const ticketsPath = path.join(process.cwd(), 'tickets.json');

async function ensureFile() {
  try { await fs.access(ticketsPath); } catch { await fs.writeFile(ticketsPath, '[]', 'utf8'); }
}

async function readAll() {
  await ensureFile();
  try {
    const raw = await fs.readFile(ticketsPath, 'utf8');
    const data = JSON.parse(raw || '[]');
    if (Array.isArray(data)) return data;
  } catch {/* ignore */}
  return [];
}

async function writeAll(list) {
  await fs.writeFile(ticketsPath, JSON.stringify(list, null, 2), 'utf8');
}

export async function issueTicket({ eventId, ticketId, name, date, other }) {
  if (!eventId || !ticketId) throw new Error('eventId and ticketId required');
  if (!name || !name.trim()) throw new Error('name required');
  
  const all = await readAll();
  const existing = all.find(t => t.eventId === eventId && t.ticketId === ticketId);
  const now = new Date().toISOString();
  if (existing) {
    if (!existing.hasEntered) {
      existing.name = name.trim();
      existing.date = date || '';
      existing.other = other || '';
      existing.lastUpdatedAt = now;
      await writeAll(all);
    }
    return { created: false, ticket: existing };
  }
  const ticket = { eventId, ticketId, name: name.trim(), date: date || '', other: other || '', issuedAt: now, hasEntered: false, enteredAt: null, lastUpdatedAt: now };
  all.push(ticket);
  await writeAll(all);
  return { created: true, ticket };
}

export async function getTicket(eventId, ticketId) {
  const all = await readAll();
  return all.find(t => t.eventId === eventId && t.ticketId === ticketId) || null;
}

export async function markEntry(eventId, ticketId) {
  const all = await readAll();
  const t = all.find(r => r.eventId === eventId && r.ticketId === ticketId);
  if (!t) return null;
  if (!t.hasEntered) {
    t.hasEntered = true;
    t.enteredAt = new Date().toISOString();
    t.lastUpdatedAt = t.enteredAt;
    await writeAll(all);
    return { updated: true, ticket: t };
  }
  return { updated: false, ticket: t };
}

export async function listTicketsByEvent(eventId) {
  const all = await readAll();
  return all.filter(t => t.eventId === eventId);
}
