import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { protect } from '../middleware/auth';
import {
  leadValidation,
  updateLeadValidation,
} from '../middleware/validate';
import { handleValidationErrors } from '../middleware/validationHandler';

const router = Router();

// All lead routes require authentication
router.use(protect);

router.get('/stats', getLeadStats);
router.get('/export/csv', exportLeadsCSV);

router
  .route('/')
  .get(getLeads)
  .post(leadValidation, handleValidationErrors, createLead);

router
  .route('/:id')
  .get(getLeadById)
  .put(updateLeadValidation, handleValidationErrors, updateLead)
  .delete(deleteLead);

export default router;
