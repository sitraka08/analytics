export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
  /** Paragraphs shown after the list. */
  closing?: readonly string[];
};

export type LegalDocument = {
  title: string;
  /** Part of the title underlined by hand; must appear verbatim in `title`. */
  highlight: string;
  description: string;
  sections: readonly LegalSection[];
};
