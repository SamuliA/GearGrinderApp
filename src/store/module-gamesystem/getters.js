// import {filter, mapValues, pick, keys} from 'lodash'
import _ from "lodash";
import { gscache } from "boot/gscache";
import { Chassis } from "./classes";
import { someGetter } from "../module-example/getters";

//Ruleset getter
export function getSelectedRuleset(state) {
  return state.selected_ruleset;
}

// Faction object getter, will combine main faction and selected subfaction data into one object.
export function getFaction(state) {
  console.log("getFaction()");
  console.log(state.selected_faction);
  if (!state.selected_faction.faction || !state.selected_faction.subfaction)
    return {};
  const fact = _.find(
    state.factions,
    f => f.code == state.selected_faction.faction
  );
  const sub = _.find(
    fact.subfactions,
    sub => sub.code == state.selected_faction.subfaction
  );
  var retval = _.clone(sub);
  retval.faction_code = fact.code;

  //Add rules  from main faction, if they exist
  retval.rules = _.compact(_.concat(fact.rules, sub.rules));

  //Use vehicle query from main unless sub has it's own (sub overrides main)
  if (!retval.vehicles_query) retval.vehicles_query = fact.vehicles_query;

  return retval;
}

//Filter vehicles so that all values of defined properties of the filter must be found in the vehicles properties of the same name.
//For example: filter: {name:"hun", faction:"North"}, matches vehicles: {name: "Hunter", faction: "NORTH"}
export function getFilteredVehicles(state) {
  //All properties of filter that have been defined, must be found in the vehicle.
  const filtered = getFilteredVehiclesUnpaged(state);

  const paged = _.slice(filtered, state.paging.start, state.paging.end);
  // console.log(paged);
  return paged;
}

export function getFilteredVehiclesUnpaged(state) {
  console.log("getFilteredVehiclesUnpaged");
  console.log(state.filter);

  // const vehicles = gscache[state.selected_ruleset].vehicles;
  // const vehicles = gscache.getAll();
  const query = getFaction(state).vehicles_query; //Array of query parameters
  const vehicles = gscache.get(query);
  //convert filter to lowercase
  if (vehicles.lenght == 0) return [];

  //drop falsy values from filter
  const filter = _.omitBy(state.filter, val => !val);

  //Nothing to filter? return all
  var filtered = [];
  if (_.keys(filter).length == 0) {
    filtered = vehicles;
  } else {
    filtered = _.filter(vehicles, vehicle => {
      //Take only the keys defined in filter from vehicle.
      const veh = _.pick(vehicle, _.keys(filter));

      //Every key existing in filter must be found in veh
      return _.every(_.keys(filter), key => {
        return veh[key].toLowerCase().includes(filter[key].toLowerCase());
      });
    });
  }
  return filtered;
}

export function getCurrentFilter(state) {
  return state.filter;
}

//List of chassis after applying current filter
//Helper function to generate list of all chassis found in vehicle data
//Returns an array of Chassis objects.
// const Chassis = {name: "", vehicles: [] }
export function getFilteredChassisList(state) {
  var chassis_obj = {};
  const vehlist = getFilteredVehiclesUnpaged(state);
  vehlist.forEach(v => {
    if (!chassis_obj[v.chassis]) {
      chassis_obj[v.chassis] = [];
    }
    chassis_obj[v.chassis].push(v);
  });

  const chassis_list = _.map(
    chassis_obj,
    (vehicles, chassis_name) => new Chassis(chassis_name, vehicles)
  );

  return chassis_list;
}

export function getRosterTV(state) {
  return _.reduce(state.roster.vehicles, (sum, v) => sum + v.tv, 0);
}

export function getRosterGroups(state) {
  console.log("getRosterGroups");
  var retval = _.map(state.roster.groups, g => {
    var gr = _.clone(g);
    var id = g._group_id;
    console.log(" ID = " + id);
    // gr.vehicles = _.filter(state.roster.vehicles, { _group_id: id });
    gr.vehicles = getGroupVehicles(state)(gr);
    console.log(gr);
    return gr;
  });
  return retval;
}

//Get a group by id. Returns a function that takes id parameter
export function getRosterGroup(state) {
  return function(id) {
    return _.find(state.roster.groups, grp => grp._group_id == id);
  };
}

export function getGroupVehicles(state) {
  return function(gr) {
    return _.map(gr.vehicle_ids, id => {
      return _.find(state.roster.vehicles, v => {
        return v._roster_id == id;
      });
    });
  };
}

export function getUnassignedRosterVehicles(state) {
  return _.filter(state.roster.vehicles, v => {
    return !v._group_id;
  });
}
