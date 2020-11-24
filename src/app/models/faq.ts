import { FaqDetails } from "./faqDetails";
export class Faq {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  details: FaqDetails[];
}
