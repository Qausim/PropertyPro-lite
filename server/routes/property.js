import { Router } from 'express';

import * as propertyController from '../controllers/property';
import checkAuth from '../middleware/check-auth';
import imageUploader from '../middleware/image-upload';

const router = Router();

router.post('/', checkAuth, imageUploader, propertyController.createProperty);
router.get('/', checkAuth, propertyController.getProperties);


export default router;
