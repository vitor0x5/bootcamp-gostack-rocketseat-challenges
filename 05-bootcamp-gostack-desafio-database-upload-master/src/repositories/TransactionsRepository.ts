import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    const transactions = await this.find();

    const balance = transactions.reduce((accumulator: Balance, currentTransaction: Transaction): Balance => {
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
}

export default TransactionsRepository;
