import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(request: Request): Promise<Transaction> {
    const {title, value, type, category} = request;

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome'){
      if(balance.total < value){
        throw new AppError('Invalid Balance');
      }
    }

    let categoryExists = await categoriesRepository.findOne({where: { title: category}});
    let category_id = categoryExists?.id;

    if(!categoryExists) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);
      
      category_id = newCategory.id;
    };

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    })

    await transactionsRepository.save(transaction);

    return transaction;

  }
}

export default CreateTransactionService;
