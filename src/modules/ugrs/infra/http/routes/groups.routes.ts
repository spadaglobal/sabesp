import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import GroupDisableController from '../controllers/GroupDisableController';
import GroupsController from '../controllers/GroupsController';

const groupsRouter = Router();
groupsRouter.use(ensureAuthenticated);

const groupsController = new GroupsController();
const groupDisableController = new GroupDisableController();

groupsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      name: Joi.string(),
    },
  }),
  groupsController.index,
);

groupsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      enabled: Joi.boolean(),
      ugr_id: Joi.string().required(),
    },
  }),
  groupsController.create,
);

groupsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      enabled: Joi.boolean(),
      ugr_id: Joi.string(),
    },
  }),
  groupsController.update,
);

groupsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  groupsController.edit,
);

groupsRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  groupDisableController.update,
);

export default groupsRouter;
