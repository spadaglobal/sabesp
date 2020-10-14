import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ContractDisableController from '../controllers/ContractDisableController';
import ContractsController from '../controllers/ContractsController';

const contractsRouter = Router();
contractsRouter.use(ensureAuthenticated);

const contractsController = new ContractsController();
const contractDisableController = new ContractDisableController();

contractsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      name: Joi.string(),
    },
  }),
  contractsController.index,
);

contractsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string().required(),
      objective: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  contractsController.create,
);

contractsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string().required(),
      objective: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  contractsController.update,
);

contractsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  contractsController.edit,
);

contractsRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  contractDisableController.update,
);

export default contractsRouter;
