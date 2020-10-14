import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import LvPosController from '../controllers/LvPosController';

const lvPosRouter = Router();
lvPosRouter.use(ensureAuthenticated);

const lvPosController = new LvPosController();

lvPosRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      user_id: Joi.string(),
      status: Joi.string(),
    },
  }),
  lvPosController.index,
);

lvPosRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      address: Joi.string(),
      contract_id: Joi.string().required(),
      contractor_id: Joi.string().required(),
      date: Joi.date().required(),
      group_id: Joi.string().required(),
      status: Joi.string(),
      lv_id: Joi.string(),
      user_id: Joi.string().required(),
      task_end_id: Joi.string().required(),
      task_start_id: Joi.string().required(),
      time: Joi.date().required(),
      ugr_id: Joi.string().required(),
      observation_first: Joi.string().allow(null),
      observation_fourth: Joi.string().allow(null),
      observation_second: Joi.string().allow(null),
      observation_third: Joi.string().allow(null),
      badge_solo: Joi.string().allow(null, ''),
      badge_capa: Joi.string().allow(null, ''),
    },
  }),
  lvPosController.create,
);

lvPosRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      address: Joi.string(),
      contract_id: Joi.string().required(),
      contractor_id: Joi.string().required(),
      date: Joi.date().required(),
      group_id: Joi.string().required(),
      status: Joi.string(),
      lv_id: Joi.string(),
      user_id: Joi.string().required(),
      task_end_id: Joi.string().required(),
      task_start_id: Joi.string().required(),
      time: Joi.date().required(),
      ugr_id: Joi.string().required(),
      observation_first: Joi.string().allow(null),
      observation_fourth: Joi.string().allow(null),
      observation_second: Joi.string().allow(null),
      observation_third: Joi.string().allow(null),
      badge_solo: Joi.string().allow(null, ''),
      badge_capa: Joi.string().allow(null, ''),
    },
  }),
  lvPosController.update,
);

lvPosRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  lvPosController.edit,
);

lvPosRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  lvPosController.delete,
);

export default lvPosRouter;
