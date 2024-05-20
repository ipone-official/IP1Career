import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import { make } from "vuex-pathify";

pathify.options.mapping = "simple";

const getDefaultState = () => ({
  userMember: [],
  disabledFormReport: false,
  subHeaders: [],
  disabledAddPhone: false,
  PositionDesc : [0]
});
const loginInfo = () => ({
  drawer: true,
  toggle: true,
  titleNavigation: 'I.P. ONE CAREER',
  selectedIndexStr: 1,
  infoLogin: {
    isLogin: false,
    authentication: false,
    username: 'DHL',
  },
})
const state = Object.assign(getDefaultState(), loginInfo());

const mutations = make.mutations(state);
const resetMutation = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

Object.assign(mutations, resetMutation);

const actions = make.actions(state);
const getters = make.getters(state);

Vue.use(Vuex);

// create store
export default new Vuex.Store({
  modules: {},
  plugins: [pathify.plugin],
  state,
  mutations,
  actions,
  getters,
});
