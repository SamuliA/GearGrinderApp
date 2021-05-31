// const url_get_vehicles = "http://hgbtools.infohell.net/v2/vehicles/";
const url_get_vehicles = "http://localhost:3010/v2/vehicles/";
const url_get_factions = "http://localhost:3010/v2/factions/";
const url_get_rulesets = "http://localhost:3010/v2/versions/";
// import axios from "axios";
import { gscache } from "boot/gscache";
import ggurls from "boot/ggurls";
// const axios = this._vm.$axios;

export async function loadRulesets({ commit, dispatch, state }) {
  console.log("loadRulesets");
  return this._vm.$axios
    .get(ggurls.get_rulesets, {
      params: {}
    })
    .then(val => {
      console.log(val);
      commit("updateRulesets", val.data);
      return dispatch("loadFactions");
    })
    .catch(err => {
      console.log(err);
      commit("gamesystem/errorHappened", "Cannot connect to Gear Grinder API", {
        root: true
      });
    })
    .finally(() => {
      //   this.$q.loading.hide();
      console.log("Request finished ");
    });
}

export async function selectRuleset({ commit, dispatch, state }, ruleset_name) {
  //Set ruleset as active.
  commit("setSelectedRuleset", ruleset_name);
  //Check if ruleset already loaded
  if (gscache.shouldUpdate(ruleset_name)) {
    dispatch("loadAllVehicles");
  }
}

export async function loadFactions({ commit, state }, search) {
  console.log("loadFactions");
  return (
    this._vm.$axios
      // return axios
      .get(ggurls.get_factions + state.selected_ruleset, {
        params: {}
      })
      .then(val => {
        console.log(val);
        commit("updateFactions", val.data);
      })
      .catch(err => {
        console.log(err);
        commit(
          "gamesystem/errorHappened",
          "Cannot connect to Gear Grinder API",
          {
            root: true
          }
        );
      })
      .finally(() => {
        console.log("Request finished ");
      })
  );
}

export async function selectFaction({ commit, dispatch, state }, payload) {
  //Check if ruleset already loaded
  if (gscache.shouldUpdate(state.selected_ruleset)) {
    dispatch("loadAllVehicles").then(() => {
      commit("selectFaction", payload);
    });
  } else {
    commit("selectFaction", payload);
  }
}

export async function loadAllVehicles({ commit, state }) {
  console.log("loadAllVehicles");
  commit("setLoading", "Loading");
  return this._vm.$axios
    .get(ggurls.get_vehicles + state.selected_ruleset, {
      params: { filter: "" }
    })
    .then(val => {
      console.log(val);
      commit("setLoadedVehiclesCount", val.length);
      commit("setFilter", state.filter);
      // gscache[state.selected_ruleset].vehicles = val.data;

      gscache.insertGamesystemVehicles(state.selected_ruleset, val.data);
    })
    .catch(err => {
      console.log(err);
      commit("gamesystem/errorHappened", "Cannot connect to Gear Grinder API", {
        root: true
      });
    })
    .finally(() => {
      console.log("Request finished ");
      commit("setLoading", "");
    });
}

export function addToRoster({ commit, state }, orig_vehicle) {
  var vehicle = _.clone(orig_vehicle);
  vehicle._roster_id = state.roster._next_free_id;
  vehicle._group_id = 0;
  commit("incRosterId");
  commit("addToRoster", vehicle);
}

export function removeFromRoster({ commit }, vehicle) {
  commit("removeFromRoster", vehicle);
}
