import type { Question } from './types';

/** Shared dummy stems; each is repeated per section (A–E) when building a category. */
export type QuestionTemplate = Omit<Question, 'id' | 'category' | 'section'>;

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  { question: 'What does a red octagonal sign indicate?', options: ['Yield', 'Stop', 'No entry', 'Speed limit'], correctAnswerIndex: 1, explanation: 'A red octagonal sign is the universal stop sign. You must come to a complete stop.' },
  { question: 'What should you do at a flashing yellow light?', options: ['Stop completely', 'Proceed with caution', 'Speed up', 'Turn around'], correctAnswerIndex: 1, explanation: 'A flashing yellow light means proceed with caution and be alert for hazards.' },
  { question: 'A triangular sign with a red border indicates:', options: ['Mandatory instruction', 'Warning or hazard', 'Information', 'Speed limit'], correctAnswerIndex: 1, explanation: 'Triangular signs with red borders are warning signs alerting you to potential hazards ahead.' },
  { question: 'Who has right of way at an uncontrolled intersection?', options: ['Vehicle from the left', 'Vehicle from the right', 'The larger vehicle', 'The faster vehicle'], correctAnswerIndex: 1, explanation: 'At uncontrolled intersections, the vehicle approaching from the right generally has priority.' },
  { question: 'What is the safe following distance rule?', options: ['1-second rule', '2-second rule', '5-second rule', '10-second rule'], correctAnswerIndex: 1, explanation: 'The 2-second rule helps maintain a safe following distance under normal conditions.' },
  { question: 'When is it legal to overtake?', options: ['On a curve', 'Near a crossing', 'On a straight road with clear visibility', 'At an intersection'], correctAnswerIndex: 2, explanation: 'Overtaking is only safe on straight roads with clear visibility and no oncoming traffic.' },
  { question: 'What must you do before changing lanes?', options: ['Honk your horn', 'Flash headlights', 'Check mirrors and signal', 'Speed up'], correctAnswerIndex: 2, explanation: 'Always check mirrors, blind spots, and signal before changing lanes.' },
  { question: 'Seat belts should be worn by:', options: ['Only the driver', 'Front passengers only', 'All occupants', 'Only on highways'], correctAnswerIndex: 2, explanation: 'All vehicle occupants must wear seat belts at all times for safety.' },
  { question: 'What does the engine oil warning light mean?', options: ['Engine overheating', 'Low oil pressure', 'Dead battery', 'Low fuel'], correctAnswerIndex: 1, explanation: 'The oil warning light indicates low oil pressure. Stop and check oil level immediately.' },
  { question: 'What should you do if your vehicle skids?', options: ['Brake hard', 'Steer into the skid', 'Accelerate', 'Turn sharply opposite'], correctAnswerIndex: 1, explanation: 'Steer gently in the direction of the skid to regain control of the vehicle.' },
];
