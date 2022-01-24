// /************************************************************************/
// /********************************Examples********************************/
// /************************************************************************/

// export const payGrades = {
//   low: '1',
//   average: '2',
//   high: '3'
// } as const;

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// type t = typeof payGrades;
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// type payGradeType = keyof t; // 'low' | 'average' | 'high'
// type payValueType = t[keyof t]; // '1' | '2' | '3'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const hisPay: payValueType = '3'; // okay
// // const myPay: payValueType = '4'; // error

// // Tech module constants
// export const TechStaffPayGrades = {
//   low: 'T1',
//   average: 'T2',
//   high: 'T3'
// } as const;

// // Admin module constants
// export const AdminStaffPayGrades = {
//   low: 'A1',
//   average: 'A2',
//   high: 'A3'
// } as const;

// // import both constants file
// type allPayGrades = typeof TechStaffPayGrades | typeof AdminStaffPayGrades;
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// type allPayValues = allPayGrades[keyof allPayGrades]; // "T1" | "T2" | "T3" | "A1" | "A2" | "A3"

// /************************************************************************/
// /********************************App Specific****************************/
// /************************************************************************/

// export const CREATE_BOOK = 'UPDATE_BOOK';
// export const READ_BOOK = 'READ_BOOK';
// export const UPDATE_BOOK = 'UPDATE_BOOK';
// export const DELETE_BOOK = 'UPDATE_BOOK';

// export const SHOW_USERS = 'SHOW_USERS';
