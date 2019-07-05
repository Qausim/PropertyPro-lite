import { Router } from 'express';

import * as propertyController from '../controllers/property';
import checkAuth from '../middleware/check_auth';
import imageUploader from '../middleware/image_upload';
import validatePropertyId from '../middleware/validate_property_id';


const router = Router();

router.post('/', checkAuth, imageUploader, propertyController.createProperty);

router.get('/', checkAuth, propertyController.getProperties);

router.get('/:propertyId', checkAuth, validatePropertyId,
  propertyController.getPropertyById);

router.patch('/:propertyId/sold', checkAuth, validatePropertyId,
  propertyController.markPropertyAsSold);

router.patch('/:propertyId', checkAuth, validatePropertyId,
  imageUploader, propertyController.updateProperty);

router.delete('/:propertyId', checkAuth, validatePropertyId,
  propertyController.deleteProperty);


export default router;
