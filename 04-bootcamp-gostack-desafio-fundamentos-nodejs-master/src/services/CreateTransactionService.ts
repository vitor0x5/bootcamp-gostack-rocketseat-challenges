import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({title, value, type}: Transaction) {

    switch (type) {
      case 'income': {
        const transaction = this.transactionsRepository.create({title, value, type});
        return transaction;
      }
      case 'outcome': {
        if (value < this.transactionsRepository.getBalance().total){
          const transaction = this.transactionsRepository.create({title, value, type});
          return transaction;
        } else {
          throw Error('Invalid Balance'); 
        }
      }
    }
  }
}

export default CreateTransactionService;
