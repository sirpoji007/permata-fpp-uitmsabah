export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  slogan?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  imageUrl?: string;
}

// FIX: Add GeneratedImage interface for generated image data.
export interface GeneratedImage {
  data: string;
  mimeType: string;
}
