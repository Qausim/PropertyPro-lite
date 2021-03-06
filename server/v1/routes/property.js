import { Router } from 'express';

import * as propertyController from '../controllers/property';
import checkAuth from '../middleware/check_auth';
import imageUploader from '../middleware/image_upload';
import validatePropertyId from '../middleware/validate_property_id';
import serverErrorHandlerMiddleware from '../middleware/server_error_handler';


const router = Router();

router.post('/', checkAuth, imageUploader, serverErrorHandlerMiddleware,
  propertyController.createProperty);

router.get('/', checkAuth, propertyController.getProperties);

router.get('/:propertyId', checkAuth, validatePropertyId,
  propertyController.getPropertyById);

router.patch('/:propertyId/sold', checkAuth, validatePropertyId,
  propertyController.markPropertyAsSold);

router.patch('/:propertyId', checkAuth, validatePropertyId,
  imageUploader, serverErrorHandlerMiddleware, propertyController.updateProperty);

router.delete('/:propertyId', checkAuth, validatePropertyId,
  propertyController.deleteProperty);


export default router;
