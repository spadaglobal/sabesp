import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import RequirementsController from '../controllers/RequirementsController';

const requirementsRouter = Router();
requirementsRouter.use(ensureAuthenticated);

const requirementsController = new RequirementsController();

requirementsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      parent_id: Joi.string(),
      lv_id: Joi.string(),
    },
  }),
  requirementsController.index,
);

requirementsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      task_type_ids: Joi.array(),
      parent_id: Joi.string(),
    },
  }),
  requirementsController.create,
);

requirementsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      title: Joi.string().required(),
      task_type_ids: Joi.array(),
      parent_id: Joi.string(),
    },
  }),
  requirementsController.update,
);

requirementsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  requirementsController.edit,
);

requirementsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  requirementsController.delete,
);

export default requirementsRouter;
