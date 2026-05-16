import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validate';
import { handleValidationErrors } from '../middleware/validationHandler';

const router = Router();

router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

export default router;
