import Router from 'express'
import { ROUTES } from '../../../shared/constant/routes';
import { authMiddleware, organizationController } from '../../DI/resolver';
import { validateRequest } from '../../middlewares/validator';
import { organizationSetupSchema } from '../../validation/organization.validation';

const router = Router();

router.post(ROUTES.ORGANIZATION.SETUP,authMiddleware.authenticate,validateRequest(organizationSetupSchema),organizationController.createOrganization);
router.get(ROUTES.ORGANIZATION.GET,authMiddleware.authenticate,organizationController.getOrganization)
router.put(ROUTES.ORGANIZATION.UPDATE, authMiddleware.authenticate,validateRequest(organizationSetupSchema), organizationController.updateOrganization)

export default router;