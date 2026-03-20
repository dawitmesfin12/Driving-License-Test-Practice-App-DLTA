import { QUESTION_TEMPLATES } from './question-templates';
import type { LicenseCategoryId, Question, QuestionSectionId } from './types';

const SECTIONS: QuestionSectionId[] = ['A', 'B', 'C', 'D', 'E'];

/**
 * Builds all questions for one license category: 5 sections × 10 templates = 50 questions.
 * IDs are sequential starting at `idBase` (must be unique across categories).
 */
export function buildQuestionsForCategory(
  category: LicenseCategoryId,
  idBase: number,
): Question[] {
  const out: Question[] = [];
  let offset = 0;
  for (const section of SECTIONS) {
    for (const t of QUESTION_TEMPLATES) {
      out.push({
        ...t,
        id: idBase + offset,
        category,
        section,
      });
      offset += 1;
    }
  }
  return out;
}
