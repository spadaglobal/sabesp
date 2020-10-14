import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import ReviewImageController from '../controllers/ReviewImageController';
import ReviewsController from '../controllers/ReviewsController';

const reviewsRouter = Router();
reviewsRouter.use(ensureAuthenticated);

const reviewsController = new ReviewsController();
const reviewImageController = new ReviewImageController();
const upload = multer(uploadConfig);

reviewsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      lv_id: Joi.string(),
      lv_pos_id: Joi.string(),
      requirement_id: Joi.string().required(),
    },
  }),
  reviewsController.index,
);

reviewsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      observation: Joi.string(),
      value: Joi.string().required(),
      requirement_id: Joi.string().required(),
      reason_id: Joi.string(),
      lv_id: Joi.string(),
      lv_pos_id: Joi.string(),
    },
  }),
  reviewsController.create,
);

reviewsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      observation: Joi.string(),
      value: Joi.string().required(),
      requirement_id: Joi.string().required(),
      reason_id: Joi.string(),
      lv_id: Joi.string(),
      lv_pos_id: Joi.string(),
    },
  }),
  reviewsController.update,
);

reviewsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  reviewsController.edit,
);

reviewsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  reviewsController.delete,
);

reviewsRouter.patch(
  '/:id',
  ensureAuthenticated,
  upload.single('file'),
  reviewImageController.update,
);

export default reviewsRouter;
