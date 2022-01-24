// /* eslint max-classes-per-file: 0 */

// import Logger from '../utilities/logger.utility';

// type Payment = {
//   clientId: string;
//   amount: number;
// };

// interface PaymentMethod {
//   charge(): Payment;
// }

// class CreditCardPayment implements PaymentMethod {
//   payment: Payment;

//   constructor(payment: Payment) {
//     this.payment = payment;
//   }

//   charge(): Payment {
//     Logger.log('Charging payment with credit card');
//     return this.payment;
//   }
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// class DebitCardPayment implements PaymentMethod {
//   payment: Payment;

//   constructor(payment: Payment) {
//     this.payment = payment;
//   }

//   charge(): Payment {
//     Logger.log('Charging payment with debit card');
//     return this.payment;
//   }
// }

// class PaymentStrategy {
//   strategy: PaymentMethod;

//   constructor(strategy: PaymentMethod) {
//     this.strategy = strategy;
//   }

//   charge(): Payment {
//     return this.strategy.charge();
//   }
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// class Main {
//   public static run() {
//     const creditCardPayment = new CreditCardPayment({ clientId: '123', amount: 100 });
//     const payment = new PaymentStrategy(creditCardPayment);
//     payment.charge();
//   }
// }
