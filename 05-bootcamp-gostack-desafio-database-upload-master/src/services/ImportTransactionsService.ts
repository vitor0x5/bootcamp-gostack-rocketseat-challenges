import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';
import configUpload from '../config/upload'

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const filePath = path.resolve(configUpload.destination, fileName);

    const csvJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);

    const transactionsArray = csvJson.map(async (transaction) => {
      const {title, type, value, category} = transaction;

      const transactionCreated = await createTransactionService.execute({
        title,
        type,
        value,
        category,
      });
      return transactionCreated;
    })

    const transactions =  Promise.all(transactionsArray);

    return transactions;
  }
}

export default ImportTransactionsService;
