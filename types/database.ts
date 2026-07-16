export interface Guest {
  id: string;
  telegramUserId: string;
  telegramUsername?: string | null;
  firstName: string;
  lastName?: string | null;
  registeredAt: string;
  inWeddingGroup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  guestId: string;
  storagePath: string;
  publicUrl: string;
  telegramFileId: string;
  groupMessageId?: string | null;
  caption?: string | null;
  isHidden: boolean;
  uploadedAt: string;
  createdAt: string;
}

export interface PhotoWithGuest extends Photo {
  guest: Guest;
  likeCount?: number;
}

export interface Wish {
  id: string;
  guestId: string;
  message: string;
  createdAt: string;
}

export interface Like {
  id: string;
  photoId: string;
  guestId: string;
  createdAt: string;
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
      wishes: {
        Row: Wish;
        Insert: Omit<Wish, "id" | "createdAt">;
        Update: Partial<Omit<Wish, "id" | "createdAt">>;
      };
      likes: {
        Row: Like;
        Insert: Omit<Like, "id" | "createdAt">;
        Update: Partial<Omit<Like, "id" | "createdAt">>;
      };
    };
  };
};
