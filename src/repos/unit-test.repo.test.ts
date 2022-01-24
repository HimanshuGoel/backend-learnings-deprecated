// import sinon from 'sinon';

// function isEven(num: number) {
//   return num % 2 === 0 ? true : false;
// }

// describe('Number Tests', () => {
//   describe('isEven', () => {
//     let num;
//     beforeEach(() => {
//       num = 5;
//       // jest.resetAllMocks();
//     });

//     it('Should return true when number is even', () => {
//       expect(isEven(2)).toBe(true);
//     });

//     // it.only('Should return true when number is even', () => {
//     //   expect(isEven(2)).toBe(true);
//     // });

//     // fit('Should return true when number is even', () => {
//     //   expect(isEven(2)).toBe(true);
//     // });

//     it.skip('Should return false when number is false', () => {
//       expect(isEven(5)).toBe(false);
//     });

//     xit('Should return false when number is false', () => {
//       expect(isEven(5)).toBe(false);
//     });

//     xit('Should work with Sinon', () => {
//       let mockObj = sinon.mock(isEven);

//       expect(isEven(5)).toBe(false);
//     });
//   });
// });
