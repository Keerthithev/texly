import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getTemplates, addTemplate, updateTemplate, deleteTemplate } from '../controllers/templateController.js';
const router = express.Router();

router.get('/', authenticate, getTemplates);
router.post('/', authenticate, addTemplate);
router.put('/:id', authenticate, updateTemplate);
router.delete('/:id', authenticate, deleteTemplate);

export default router;
