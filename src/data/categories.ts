import type { LicenseCategory } from './types';

export const categories: LicenseCategory[] = [
  { id: 'automobile', title: 'ኦቶሞቢል', subtitle: 'Automobile / Private', icon: '🚗' },
  { id: 'public_1', title: 'ህዝብ 1ኛ ደረጃ', subtitle: 'Public Level 1', icon: '🚐' },
  { id: 'public_2', title: 'ህዝብ 2ኛ ደረጃ', subtitle: 'Public Level 2', icon: '🚌' },
  { id: 'public_3', title: 'ህዝብ 3ኛ ደረጃ', subtitle: 'Public Level 3', icon: '🚍' },
  { id: 'freight_1', title: 'ጭነት 1ኛ ደረጃ', subtitle: 'Freight Level 1', icon: '🛻' },
  { id: 'freight_2', title: 'ጭነት 2ኛ ደረጃ', subtitle: 'Freight Level 2', icon: '🚛' },
  { id: 'freight_3', title: 'ጭነት 3ኛ ደረጃ', subtitle: 'Freight Level 3', icon: '🚚' },
];
