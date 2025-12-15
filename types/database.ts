export interface Guest {
  id: string;
  telegramUserId: string;
  telegramUsername?: string | null;
  firstName: string;
  lastName?: string | null;
  registeredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  guestId: string;
  storagePath: string;
  publicUrl: string;
  telegramFileId: string;
  caption?: string | null;
  uploadedAt: string;
  createdAt: string;
}

export interface PhotoWithGuest extends Photo {
  guest: Guest;
}

export type Database = {
  public: {
    Tables: {
      guests: {
        Row: Guest;
        Insert: Omit<Guest, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Guest, "id" | "createdAt" | "updatedAt">>;
      };
      photos: {
        Row: Photo;
        Insert: Omit<Photo, "id" | "createdAt">;
        Update: Partial<Omit<Photo, "id" | "createdAt">>;
      };
    };
  };
};
