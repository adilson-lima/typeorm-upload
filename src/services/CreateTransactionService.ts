import { getCustomRepository, getRepository } from 'typeorm'


import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository'



interface Request {
   title: string
   value: number
   type: 'income' | 'outcome' 
   category: string

}

class CreateTransactionService {
  public async execute({ title, value, type, category}: Request): Promise<Transaction> {
     
    const categoryRepository = getRepository(Category)
    
    let categoryFind = await categoryRepository.findOne({where: {title: category}})


    if(!categoryFind){
      categoryFind = categoryRepository.create({
          title: category
        })

        await categoryRepository.save(categoryFind)
    }
    

    const transactionRepository = getCustomRepository(TransactionsRepository)

    const balance = await transactionRepository.getBalance()

    if(type === 'outcome' && value > balance.total){
      throw new AppError('Without balance', 400)
    }
    
    

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryFind
    })

    await transactionRepository.save(transaction)

    return transaction

  }
}

export default CreateTransactionService;
