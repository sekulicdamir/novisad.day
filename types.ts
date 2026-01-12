
export type Locale = 'sr' | 'hr' | 'me' | 'en' | 'ru' | 'de' | 'uk' | 'tr' | 'es' | 'zh-HK' | 'zh-CN' | 'ja' | 'hi';

export interface Translations {
  [key: string]: {
    [key in Locale]?: string;
  };
}

export interface PriceVariation {
  id: string;
  persons: string; // e.g., "1-2"
  price: number;
}

export interface Tour {
  id: string;
  title: { [key in Locale]?: string };
  subtitle: { [key in Locale]?: string };
  shortDescription: { [key in Locale]?: string };
  longDescription: { [key in Locale]?: string };
  images: string[];
  included: { [key in Locale]?: string[] };
  duration: { [key in Locale]?: string };
  maxPeople: number;
  priceVariations: PriceVariation[];
  isAvailable: boolean;
  isFeatured: boolean;
  seo: {
    metaTitle: { [key in Locale]?: string };
    metaDescription: { [key in Locale]?: string };
  };
}

export interface BlogPost {
  id: string;
  title: { [key in Locale]?: string };
  author: string;
  date: string;
  image: string;
  summary: { [key in Locale]?: string };
  content: { [key in Locale]?: string };
}

export type InquiryStatus = 'New' | 'In Progress' | 'Completed';

export interface Inquiry {
  id: string;
  date: string;
  email: string;
  phone: string;
  tourName: string;
  message: string;
  status: InquiryStatus;
  startLocation: string;
  endLocation: string;
}

export interface SiteSettings {
  heroImage: string;
}

export interface LogEntry {
  id: string;
  entryDate: string;
  entryTime: string;
  numberOfPeople: string;
  tourName: string;
  startLocation: string;
  endLocation: string;
  bookingDate: string;
  bookingTime: string;
  email: string;
  phone: string;
  message: string;
}
