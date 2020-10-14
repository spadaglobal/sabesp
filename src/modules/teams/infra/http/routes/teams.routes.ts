import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import TeamDisableController from '../controllers/TeamDisableController';
import TeamsController from '../controllers/TeamsController';

const teamsRouter = Router();
teamsRouter.use(ensureAuthenticated);

const teamsController = new TeamsController();
const teamDisableController = new TeamDisableController();

teamsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      ugr_id: Joi.string(),
    },
  }),
  teamsController.index,
);

teamsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      contractor_id: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  teamsController.create,
);

teamsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      contractor_id: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  teamsController.update,
);

teamsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  teamsController.edit,
);

teamsRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  teamDisableController.update,
);

export default teamsRouter;
