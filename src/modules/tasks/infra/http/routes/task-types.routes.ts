import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import TaskTypesController from '../controllers/TaskTypesController';

const taskTypesRouter = Router();
taskTypesRouter.use(ensureAuthenticated);

const taskTypesController = new TaskTypesController();

taskTypesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
    },
  }),
  taskTypesController.index,
);

taskTypesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      description: Joi.string().required(),
    },
  }),
  taskTypesController.create,
);

taskTypesRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      description: Joi.string().required(),
    },
  }),
  taskTypesController.update,
);

taskTypesRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  taskTypesController.edit,
);

taskTypesRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  taskTypesController.delete,
);

export default taskTypesRouter;
