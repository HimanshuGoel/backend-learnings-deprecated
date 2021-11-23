type Payment = {
  clientId: string;
  amount: number;
};

interface PaymentMethod {
  charge(): Payment;
}

class CreditCardPayment implements PaymentMethod {
  payment: Payment;

  constructor(payment: Payment) {
    this.payment = payment;
  }

  charge(): Payment {
    console.log('Charging payment with credit card');
    return this.payment;
  }
}

class DebitCardPayment implements PaymentMethod {
  payment: Payment;

  constructor(payment: Payment) {
    this.payment = payment;
  }

  charge(): Payment {
    console.log('Charging payment with debit card');
    return this.payment;
  }
}

class paymentStrategy {
  strategy: PaymentMethod;

  constructor(strategy: PaymentMethod) {
    this.strategy = strategy;
  }

  charge(): Payment {
    return this.strategy.charge();
  }
}

class Main {
  static run() {
    const creditCardPayment = new CreditCardPayment({ clientId: '123', amount: 100 });
    const payment = new paymentStrategy(creditCardPayment);
    payment.charge();
  }
}
