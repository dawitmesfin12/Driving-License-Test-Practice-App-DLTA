export type LicenseCategoryId =
  | 'automobile'
  | 'public_1'
  | 'public_2'
  | 'public_3'
  | 'freight_1'
  | 'freight_2'
  | 'freight_3';

/** Question bank is split into sections (A–E) per license type. */
export type QuestionSectionId = 'A' | 'B' | 'C' | 'D' | 'E';

export type Question = {
  id: number;
  category: LicenseCategoryId;
  /** Section within this license type (A, B, C, …). */
  section: QuestionSectionId;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export type LicenseCategory = {
  id: LicenseCategoryId;
  title: string;
  subtitle: string;
  icon: string;
};
