import { Router } from 'express';
import { getCustomRepository } from 'typeorm'
import multer from 'multer'

import uploadConfig from '../config/upload'

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig)

transactionsRouter.get('/', async (request, response) => {
  
  const transactionRepository = getCustomRepository(TransactionsRepository)

  const transactions = await transactionRepository.find()
  const balance = await transactionRepository.getBalance()

  response.json({transactions, balance})
});

transactionsRouter.post('/', async (request, response) => {
    
  const { title, value, type, category } = request.body

  const createTransaction = new CreateTransactionService()
  const transaction = await createTransaction.execute({ title, value, type, category} )

  response.json(transaction)

});

transactionsRouter.delete('/:id', async (request, response) => {
  
  const id = request.params.id

  const deleteTransactionService = new DeleteTransactionService()
  await deleteTransactionService.execute(id)

  response.status(204).send()

});

transactionsRouter.post('/import', upload.single('file'),async (request, response) => {
   
  const importTransactionsService = new ImportTransactionsService()
  const transactions = await importTransactionsService.execute({
    path: request.file.path
  })

  response.json(transactions)

});

export default transactionsRouter;
