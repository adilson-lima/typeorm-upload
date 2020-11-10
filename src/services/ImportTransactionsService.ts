import fs from 'fs'
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import { loadCSV } from '../util/load-csv'
import CreateTransactionService from './CreateTransactionService'


interface Request {
  path: string
}


class ImportTransactionsService {
  async execute({ path }: Request): Promise<Transaction[]> {

    const csv = await loadCSV(path)

    if (!csv) {
      throw new AppError('File not found')
    }

    const createTransactionService = new CreateTransactionService()

    const transactions: Transaction[] = []

    for (const line of csv) {
      // title, type, value, category
      const title = line[0]
      const type:any = line[1] 
      const value = Number(line[2])
      const category:any = line[3]

      const transaction: Transaction = await createTransactionService.execute({title, value, type, category})

      transactions.push(transaction)
    }

    const fileExists = await fs.promises.stat(path)
    if(fileExists){
      await fs.promises.unlink(path)
    }

    return transactions
  }
}

export default ImportTransactionsService;
