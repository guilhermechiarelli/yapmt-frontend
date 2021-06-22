import api from '../services/api';

export default {
  namespaced: true,

  state: {
    projects: [],
  },

  mutations: {
    SET_PROJECTS: (state, payload) => {
      state.projects = payload;
    },
  },

  actions: {
    async getProjects({ commit }) {
      const response = await api.get('/projects');
      commit('SET_PROJECTS', response.data);
    },
  },

  getters: {},
};
