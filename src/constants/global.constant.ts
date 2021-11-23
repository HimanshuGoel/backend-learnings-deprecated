export const payGrades = {
  low: '1',
  average: '2',
  high: '3'
} as const;

type t = typeof payGrades;
type payGradeType = keyof t; // 'low' | 'average' | 'high'
type payValueType = t[keyof t]; // '1' | '2' | '3'

const hisPay: payValueType = '3'; //okay
// const myPay: payValueType = '4'; // error

// Tech module constants
export const TechStaffPayGrades = {
  low: 'T1',
  average: 'T2',
  high: 'T3'
} as const;

// Admin module constants
export const AdminStaffPayGrades = {
  low: 'A1',
  average: 'A2',
  high: 'A3'
} as const;

// import both constants file
type allPayGrades = typeof TechStaffPayGrades | typeof AdminStaffPayGrades;
type allPayValues = allPayGrades[keyof allPayGrades]; //"T1" | "T2" | "T3" | "A1" | "A2" | "A3"
