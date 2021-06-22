import Vue from 'vue';
import Vuex from 'vuex';

import projects from './projects';

Vue.use(Vuex);

const modules = {
  projects,
};

export default new Vuex.Store({
  modules,
});
