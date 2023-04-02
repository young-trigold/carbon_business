import { Router } from 'express';
import { addRecord, deleteRecord, getRecords, updateRecord } from '../controller/record.js';
import { auth } from '../middlewares/auth.js';

export const recordAPI = Router();
recordAPI.route('/records').get(getRecords).post(addRecord);
recordAPI.route('/records/:id').put(auth, updateRecord).delete(auth, deleteRecord);
