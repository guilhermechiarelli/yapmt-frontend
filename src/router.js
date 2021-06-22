import Vue from 'vue';
import Router from 'vue-router';

import Template from './template';
import NewProject from './pages/NewProject';
import Tasks from './pages/Tasks';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Template',
      component: Template,
      children: [
        {
          path: '/tasks/:projectId',
          name: 'Tasks',
          component: Tasks,
        },
        {
          path: '/new-project',
          name: 'NewProject',
          component: NewProject,
        },
      ],
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
