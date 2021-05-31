import _ from "lodash";
import { gscache } from "boot/gscache";
//vehicles
export function updateVehicles(state, data) {
  state.vehicles = data;
}
export function setLoadedVehiclesCount(state, count) {
  console.log("setLoadedVehiclesCount");
  state.loaded_vehicles_count = count;
}

//Ruleset
export function updateRulesets(state, rulesets) {
  state.rulesets = rulesets;
  if (rulesets.length > 0) state.selected_ruleset = rulesets[0];
}

export function setSelectedRuleset(state, ruleset_name) {
  state.selected_ruleset = ruleset_name;
  gscache.gs = ruleset_name;
}

//Factions
export function updateFactions(state, data) {
  state.factions = data;
}
export function selectFaction(state, payload) {
  // state.filter.faction = faction_code;

  state.selected_faction = payload;

  state.roster.faction = payload.faction;
  state.roster.subfaction = payload.subfaction;
}

//Filter
export function setFilter(state, filter) {
  state.filter = filter;
}
// export function setNameFilter(state, namefilter) {
//   state.filter.name = namefilter;
// }
export function modifyFilter(state, modfilter) {
  _.assign(state.filter, modfilter);
}

//Roster
export function incRosterId(state) {
  ++state.roster._next_free_id;
}

export function addToRoster(state, vehicle) {
  // vehicle._roster_id = ++state.roster._next_free_id;
  state.roster.vehicles.push(vehicle);
  //Automatically assign the vehicle to a free group, if any
  const lastgrp = _.last(state.roster.groups);
  // if (lastgrp) vehicle._group_id = lastgrp._group_id;
  _addToGroup(lastgrp, vehicle);
}
export function removeFromRoster(state, vehicle) {
  _removeFromGroup(state, vehicle);
  state.roster.vehicles = _.reject(state.roster.vehicles, {
    _roster_id: vehicle._roster_id
  });
}
//Assign the vehicle to a combat group
export function assignToGroup(state, payload) {
  const vehicle = payload.vehicle;
  const group = payload.group;
  console.log("assignToGroup" + group + vehicle);
  if (!vehicle) return;
  if (!group) return;

  //Remove vehicle from old group
  _removeFromGroup(state, vehicle);
  _addToGroup(group, vehicle);

  //Force update
  state.roster.groups = _.clone(state.roster.groups);
}

//helper function to find group by id
function _findGroup(state, id) {
  return _.find(state.roster.groups, g => g._group_id == id);
}

//Helper function to add a vehicle to a group
function _addToGroup(group, vehicle) {
  vehicle._group_id = group._group_id;
  group.vehicle_ids.push(vehicle._roster_id);
}

//Helper function to remove vehicle from group
function _removeFromGroup(state, vehicle) {
  const group = _findGroup(state, vehicle._group_id);
  if (group) {
    _.remove(group.vehicle_ids, vehicle._roster_id);
    vehicle._group_id = 0;
  }
}
const swapArrayLocs = (arr, index1, index2) => {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};

//Move vehicle down
export function moveDown(state, payload) {
  const vehicle = payload.vehicle;
  const group = _findGroup(state, vehicle._group_id);

  const index = _.findIndex(group.vehicle_ids, id => id === vehicle._roster_id);
  if (index != -1 && index < group.vehicle_ids.length - 1) {
    swapArrayLocs(group.vehicle_ids, index, index + 1);
    console.log(group);
  }
  state.roster.groups = _.clone(state.roster.groups);
}

export function addGroup(state) {
  var new_group_id = ++state.roster._next_free_id;
  state.roster.groups = state.roster.groups.push(
    new Group(new_group_id, "CG" + new_group_id, [])
  );
}

//Payload = {_group_id: id, ua:new_ua}
export function setGroupUA(state, payload) {
  console.log(payload);

  var group = _.find(
    state.roster.groups,
    g => g._group_id == payload._group_id
  );
  group.ua = payload.ua;
}

//Misc
export function errorHappened(state, error) {
  state.error = error;
}
export function setLoading(state, msg) {
  state.loading = msg;
}
