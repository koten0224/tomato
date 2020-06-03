import Vue from 'vue/dist/vue.esm';
import Vuex from 'vuex';
import Rails from '@rails/ujs';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    doingTasks: [], 
    doneTasks: []
  },

  mutations: {
    SET_TASKS(state, resp){
      state.doingTasks = resp.doingTasks;
      state.doneTasks = resp.doneTasks;
    }, 

    REMOVE_TASK(state, taskId) {
      const foundTask = state.tasks.findIndex(task => task.id == taskId);
      if (foundTask >= 0) {
        state.tasks.splice(foundTask, 1);
      }
    }
  }, 

  actions: {
    removeTask({ commit }, taskId) {
      Rails.ajax({
        url: `/api/v1/tasks/${taskId}`, 
        type: 'DELETE', 
        dataType: 'JSON', 
        success: resp => {
          commit('REMOVE_TASK', resp.taskId);
        }, 
        error: err => {
          console.log(err);
        }
      })
    },

    loadTasks({ commit }, projectId) {
      Rails.ajax({
        url: `/api/v1/projects/${projectId}/tasks`, 
        type: 'GET', 
        dataType: 'json',
        success: resp => {
          commit('SET_TASKS', resp)
        }, 
        error: err => {
          console.log(err);
        } 
      });
    }
  }
})

export default store;