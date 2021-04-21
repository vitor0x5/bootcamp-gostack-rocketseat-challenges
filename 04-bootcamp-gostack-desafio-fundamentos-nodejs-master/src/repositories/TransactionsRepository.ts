import Transaction from '../models/Transaction';


interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {

    const balance = this.transactions.reduce((accumulator: Balance, currentTransaction: Transaction): Balance => {
      if(currentTransaction.type === 'income'){
        accumulator.total +=  currentTransaction.value;
        accumulator.income += currentTransaction.value;
      } else {
        accumulator.total -= currentTransaction.value;
        accumulator.outcome += currentTransaction.value;
      }
      return accumulator;
    }, {
      income: 0,
      outcome: 0,
      total: 0,
    });

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>) {

    const transaction = new Transaction({
      title, 
      value, 
      type
    });

    this.transactions.push(transaction);
    return transaction;
  };
}

export default TransactionsRepository;
