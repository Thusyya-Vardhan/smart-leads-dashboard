import { Router } from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead } from '../controllers/leadController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

// All routes protected
router.use(protect);

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead); // only admin can delete

export default router;