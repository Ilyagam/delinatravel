export interface Tour {
  id: string;
  slug: string;
  title: string;
  destination: string;
  dates: string;
  short_description: string | null;
  description: string | null;
  price_from: number | null;
  what_included: string[] | null;
  what_excluded: string[] | null;
  program: ProgramDay[] | null;
  accommodation: string | null;
  image_urls: string[] | null;
  is_active: boolean;
  created_at: string;
}

export interface ProgramDay {
  day: number;
  title: string;
  description: string;
}

export interface Application {
  id: string;
  name: string;
  phone: string;
  tour_id: string | null;
  tour_title: string | null;
  message: string | null;
  created_at: string;
}

export interface ApplicationFormData {
  name: string;
  phone: string;
  tour_id?: string;
  tour_title?: string;
  message?: string;
}
