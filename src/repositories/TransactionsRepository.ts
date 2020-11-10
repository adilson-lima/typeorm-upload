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

    const transactions =  await this.find()

    const balance: Balance = transactions.reduce((balance:Balance, transaction:Transaction)=>{
       balance.income = transaction.type === 'income' ? balance.income += transaction.value  : balance.income
       balance.outcome = transaction.type === 'outcome' ? balance.outcome += transaction.value  : balance.outcome
       balance.total = transaction.type === 'income' ? balance.total += transaction.value : balance.total -= transaction.value

       return balance
    },{
      income:0,
      outcome:0,
      total:0
    })
    
    return balance
  }
}

export default TransactionsRepository;
