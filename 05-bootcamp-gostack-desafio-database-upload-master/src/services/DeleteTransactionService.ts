import AppError from '../errors/AppError';

import { getRepository } from "typeorm";
import Transaction from './../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    if(!(await transactionsRepository.findOne(id))) {
      throw new AppError('Transaction not found.', 404);
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
