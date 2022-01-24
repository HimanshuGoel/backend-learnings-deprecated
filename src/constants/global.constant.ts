export const payGrades = {
  low: '1',
  average: '2',
  high: '3'
} as const;

type t = typeof payGrades;

type payGradeType = keyof t; // 'low' | 'average' | 'high'
type payValueType = t[keyof t]; // '1' | '2' | '3'

export const TechStaffPayGrades = {
  low: 'T1',
  average: 'T2',
  high: 'T3'
} as const;

export const AdminStaffPayGrades = {
  low: 'A1',
  average: 'A2',
  high: 'A3'
} as const;

type allPayGrades = typeof TechStaffPayGrades | typeof AdminStaffPayGrades;
type allPayValues = allPayGrades[keyof allPayGrades]; // "T1" | "T2" | "T3" | "A1" | "A2" | "A3"

export const CREATE_BOOK = 'UPDATE_BOOK';
export const READ_BOOK = 'READ_BOOK';
export const UPDATE_BOOK = 'UPDATE_BOOK';
export const DELETE_BOOK = 'UPDATE_BOOK';

export const SHOW_USERS = 'SHOW_USERS';
