import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import { make } from "vuex-pathify";

pathify.options.mapping = "simple";

const getDefaultState = () => ({
  PositionDesc : [0],
  PositionName : "",
  PositionDepart : "",
  PositionPriority : "",
  PositionJD : "",
  PositionJQ : "",
  Applyform : false,
  Applydesc : false,
  Apply100w : true,
  language: 'th',
  selectID: [],
  searchVal: "",
  firstnameADs: '',
  surnameADs: '',
  mobileADs: '',
  groupPeoplePlus: {},
  educationalName: '',
  academyName: '',
  myAssetID: [],
  notGetADs: false,
  empIDPeoplePlus: '',
  consentStatus: '',
  policyDialog: false,
  usernameForUpdate: '',
  passwordForUpdate: '',
  tokenForUpdate: ''
});
const loginInfo = () => ({
  drawer: false,
  toggle: false,
  titleNavigation: 'I.P. ONE CAREER',
  selectedIndexStr: 1,
  infoLogin: {
    isLogin: false,
    authentication: false,
    ADname: '',
    ADfirstName: '',
    ADlastName: '',
    ADemail: '',
    ADempId: '',
    ADgroup:[],
    ADsamAccount: '',
    ADmobile: '',
    ADtelephone: ''
  },
  selectAssetID: '',
  selectEmploymentID: '',
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
