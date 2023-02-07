import { Router } from 'express';
import { getRecords } from '../controller/record.js';

export const recordAPI = Router();
recordAPI.route('/records').get(getRecords);
