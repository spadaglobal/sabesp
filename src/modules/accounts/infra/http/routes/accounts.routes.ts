import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import AccountsController from '../controllers/AccountsController';

const accountsRouter = Router();
accountsRouter.use(ensureAuthenticated);

const accountsController = new AccountsController();

accountsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      name: Joi.string(),
    },
  }),
  accountsController.index,
);

accountsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      type: Joi.string().required(),
      task_type_id: Joi.string().required(),
      code: Joi.string().required(),
      tasks_ids: Joi.array().required(),
      group_id: Joi.string().required(),
    },
  }),
  accountsController.create,
);

accountsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      type: Joi.string().required(),
      task_type_id: Joi.string().required(),
      code: Joi.string().required(),
      tasks_ids: Joi.array().required(),
      group_id: Joi.string().required(),
    },
  }),
  accountsController.update,
);

accountsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  accountsController.edit,
);

accountsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  accountsController.delete,
);

export default accountsRouter;
