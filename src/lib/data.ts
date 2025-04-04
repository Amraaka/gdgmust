// /src/lib/data.ts
import eventsData from '@/data/events.json';
import membersData from '@/data/community.json';

export async function getEvents() {
  // Currently returns local JSON
  // Later will fetch from API endpoint
  return eventsData;
}

export async function getMembers() {
  return membersData;
}