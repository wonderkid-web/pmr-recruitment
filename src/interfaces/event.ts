import { Member } from "./member";

// Interface untuk Event
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // Tanggal dalam format ISO 8601 string
    location: string;
    participants: EventMember[]; // Daftar peserta event
    created_at: string; // Format ISO 8601 string
    updated_at: string; // Format ISO 8601 string
  }
  
  // Interface untuk EventMember (Menghubungkan Member dengan Event)
  export interface EventMember {
    id: string;
    memberId: string;
    eventId: string;
    joined_at: string; // Waktu bergabung
    member: Member; // Data member yang berpartisipasi dalam event
  }