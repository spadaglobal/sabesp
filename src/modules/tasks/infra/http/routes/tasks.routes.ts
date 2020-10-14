import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import TaskDisableController from '../controllers/TaskDisableController';
import TasksController from '../controllers/TasksController';

const tasksRouter = Router();
tasksRouter.use(ensureAuthenticated);

const tasksController = new TasksController();
const taskDisableController = new TaskDisableController();

tasksRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      name: Joi.string(),
      type: Joi.string().valid('executed', 'accepted'),
    },
  }),
  tasksController.index,
);

tasksRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      description: Joi.string().required(),
      type: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  tasksController.create,
);

tasksRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      description: Joi.string().required(),
      type: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  tasksController.update,
);

tasksRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  tasksController.edit,
);

tasksRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  taskDisableController.update,
);

export default tasksRouter;
