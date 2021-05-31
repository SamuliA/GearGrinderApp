export default {
  namespaced: true,
  getters: {},
  mutations: {
    setImagePreference(state, value) {
      state.imagePreference = value;
    }
  },
  actions: {},
  state: {
    imagePreference: "art"
  }
};
