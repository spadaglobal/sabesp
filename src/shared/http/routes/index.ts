import accountsRouter from '@modules/accounts/infra/http/routes/accounts.routes';
import contractsRouter from '@modules/contracts/infra/http/routes/contracts.routes';
import lvPosRouter from '@modules/lvPos/infra/http/routes/lvPos.routes';
import lvsRouter from '@modules/lvs/infra/http/routes/lvs.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import reasonsRouter from '@modules/reasons/infra/http/routes/reasons.routes';
import requirementsRouter from '@modules/requirements/infra/http/routes/requirements.routes';
import reviewsRouter from '@modules/reviews/infra/http/routes/reviews.routes';
import taskTypesRouter from '@modules/tasks/infra/http/routes/task-types.routes';
import tasksRouter from '@modules/tasks/infra/http/routes/tasks.routes';
import teamsRouter from '@modules/teams/infra/http/routes/teams.routes';
import contractorsRouter from '@modules/ugrs/infra/http/routes/contractors.routes';
import groupsRouter from '@modules/ugrs/infra/http/routes/groups.routes';
import ugrsRouter from '@modules/ugrs/infra/http/routes/ugrs.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/users', usersRouter);

routes.use('/accounts', accountsRouter);

routes.use('/requirements', requirementsRouter);

routes.use('/reviews', reviewsRouter);

routes.use('/reasons', reasonsRouter);

routes.use('/contracts', contractsRouter);

routes.use('/contractors', contractorsRouter);

routes.use('/teams', teamsRouter);

routes.use('/orders', ordersRouter);

routes.use('/lvs', lvsRouter);

routes.use('/lv-pos', lvPosRouter);

routes.use('/ugrs', ugrsRouter);

routes.use('/groups', groupsRouter);

routes.use('/tasks', tasksRouter);

routes.use('/task-types', taskTypesRouter);

routes.use('/sessions', sessionsRouter);

routes.use('/password', passwordRouter);

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello Stack' });
});

export default routes;
