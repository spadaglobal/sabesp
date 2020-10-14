import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import LvsController from '../controllers/LvsController';

const lvsRouter = Router();
lvsRouter.use(ensureAuthenticated);

const lvsController = new LvsController();

lvsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      user_id: Joi.string(),
      status: Joi.string().valid('open', 'ready', 'interactive'),
    },
  }),
  lvsController.index,
);

lvsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      address: Joi.string(),
      contract_id: Joi.string().required(),
      contractor_id: Joi.string().required(),
      date_end: Joi.date().allow(null),
      date_start: Joi.date().required(),
      group_id: Joi.string().required(),
      status: Joi.string().valid('open', 'ready', 'interactive'),
      user_id: Joi.string().required(),
      task_end_id: Joi.string().required(),
      task_start_id: Joi.string().required(),
      task_type_id: Joi.string().required(),
      team_id: Joi.string().required(),
      time_end: Joi.date().allow(null),
      time_start: Joi.date().required(),
      ugr_id: Joi.string().required(),
      no_order: Joi.string().allow(null),
      observation_first: Joi.string().allow(null),
      observation_fourth: Joi.string().allow(null),
      observation_second: Joi.string().allow(null),
      observation_third: Joi.string().allow(null),
      order_id: Joi.string().allow(null),
      location: Joi.string(),
    },
  }),
  lvsController.create,
);

lvsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      address: Joi.string(),
      contract_id: Joi.string().required(),
      contractor_id: Joi.string().required(),
      date_end: Joi.date().allow(null),
      date_start: Joi.date().required(),
      group_id: Joi.string().required(),
      status: Joi.string().valid('open', 'ready', 'interactive'),
      user_id: Joi.string().required(),
      task_end_id: Joi.string().required(),
      task_start_id: Joi.string().required(),
      task_type_id: Joi.string().required(),
      team_id: Joi.string().required(),
      time_end: Joi.date().allow(null),
      time_start: Joi.date().required(),
      ugr_id: Joi.string().required(),
      no_order: Joi.string().allow(null),
      observation_first: Joi.string().allow(null),
      observation_fourth: Joi.string().allow(null),
      observation_second: Joi.string().allow(null),
      observation_third: Joi.string().allow(null),
      location: Joi.string(),
      order_id: Joi.string().allow(null),
    },
  }),
  lvsController.update,
);

lvsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  lvsController.edit,
);

lvsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  lvsController.delete,
);

export default lvsRouter;
