import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ContractorDisableController from '../controllers/ContractorDisableController';
import ContractorsController from '../controllers/ContractorsController';

const contractorsRouter = Router();
contractorsRouter.use(ensureAuthenticated);

const contractorsController = new ContractorsController();
const contractorDisableController = new ContractorDisableController();

contractorsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      name: Joi.string(),
    },
  }),
  contractorsController.index,
);

contractorsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      contract_number: Joi.string().required(),
      name: Joi.string().required(),
      contract_id: Joi.string().required(),
      prefix: Joi.string().required(),
      enabled: Joi.boolean(),
      ugr_ids: Joi.array().required(),
    },
  }),
  contractorsController.create,
);

contractorsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  contractorsController.edit,
);

contractorsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      contract_number: Joi.string().required(),
      name: Joi.string().required(),
      contract_id: Joi.string().required(),
      prefix: Joi.string().required(),
      enabled: Joi.boolean(),
      ugr_ids: Joi.array().required(),
    },
  }),
  contractorsController.update,
);

contractorsRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  contractorDisableController.update,
);

export default contractorsRouter;
