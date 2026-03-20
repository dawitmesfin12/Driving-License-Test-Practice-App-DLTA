import type { Question } from '../types';
import { automobileQuestions } from './automobile';
import { freight1Questions } from './freight-1';
import { freight2Questions } from './freight-2';
import { freight3Questions } from './freight-3';
import { public1Questions } from './public-1';
import { public2Questions } from './public-2';
import { public3Questions } from './public-3';

export const questions: Question[] = [
  ...automobileQuestions,
  ...public1Questions,
  ...public2Questions,
  ...public3Questions,
  ...freight1Questions,
  ...freight2Questions,
  ...freight3Questions,
];
