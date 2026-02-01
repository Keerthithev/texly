import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getContacts, addContact, updateContact, deleteContact } from '../controllers/contactController.js';
const router = express.Router();

router.get('/', authenticate, getContacts);
router.post('/', authenticate, addContact);
router.put('/:id', authenticate, updateContact);
router.delete('/:id', authenticate, deleteContact);

// Bulk upload (CSV/Excel) and group management would be added here

export default router;
