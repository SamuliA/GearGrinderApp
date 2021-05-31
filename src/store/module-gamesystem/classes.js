// the chassis class, for holding a group of vehicles that have something in common.
// name = string
// vehicles = array of Vehicle (from the GG API)
import _ from "lodash";
class Chassis {
  constructor(name, vehicles) {
    this.name = name;
    this.vehicles = vehicles;
  }
  getCommonStatlines(keys) {
    //This looks at the stats of vehicles and returns the minimum amount of different statlines
    // keys is a list of stat names to include in the result(s)
    //  returns an Array of objects.
    if (!keys) keys = ["tv", "mr", "ar", "hs", "a", "gu", "pi", "ew", "type"];
    // var retval = [];
    const retval = _(this.vehicles)
      .map(v => _.pick(v, ["name", ...keys])) //Take just the keys
      // .sort( v => _.matches(v)) //
      //   .countBy(v => _.matches(v))
      // .uniqBy(v => {
      //   return _.values(_.pick(v, keys)).join();
      // })
      .value();
    // console.log(retval);
    return retval;
  }
  getSameStatline() {
    //List of keys that belong to the visible statline
    const keys = ["chassis", "tv", "mr", "ar", "hs", "a", "gu", "pi", "ew", "rosterWeapons", "traits", "type", "height"];
    //Keys in case there is only one vehicle in the chassis
    const default_keys = ["chassis", "mr", "ar", "hs", "a", "gu", "pi", "ew", "type", "height"];
    if( this.vehicles.length == 1 )
    {
      return {keys: default_keys, statline: _.pick( this.vehicles[0], default_keys )}
    }

    //Take one key at a time, and compare all values. If all are teh same, add it to result
    var result = {}
    _.each(keys, k => {
      const values = _.map(this.vehicles, v => {
        return v[k];
      });
      if( _.uniq(values).length == 1 ) {
        //all are same, add to result:
        result[k] = values[0];
      }
    } )
    // return result;
    return {keys: _.keys(result), statline: result}
  }
  getUniqueStatlines() {
    const keys = ["name", "tv", "mr", "ar", "hs", "a", "gu", "pi", "ew", "rosterWeapons", "traits", "type", "height"];
    //keys in case there is only one vehicle in the chassis
    const default_keys = ["name", "tv", "rosterWeapons", "traits"];
    
    if( this.vehicles.length == 1 )
    {
      return {keys: default_keys, statlines: [_.pick( this.vehicles[0], default_keys )] };
    }
    
    //Take one key at a time and compare all values. If they are not all same, add all values to results
    var results =  []; 
    
    _.each(keys, k => {
      const values = _.map(this.vehicles, v => {
        return v[k];
      });
      if( _.uniq(values).length != 1 ) {
        //all are NOT the same, add to result:
        // var i = 0;
        for( var i = 0; i < this.vehicles.length; i++ ) {
          if( !results[i] ) results [i] = {};
          results[i][k] = this.vehicles[i][k];
        }
      }
    } )
    // return results;
    return {keys: _.keys(results[0]), statlines: results}

  }
  getTVRange() {
    let min = 100;
    let max = 0;
    this.vehicles.forEach(v => {
      if (v.tv < min) min = v.tv;
      if (v.tv > max) max = v.tv;
    });
    if (min === max) {
      return "" + min + " TV";
    } else {
      return "" + min + " to " + max + " TV ";
    }
  }
  getUAs() {
    let uas = [];
    this.vehicles.forEach(v => {
      uas = _.concat(uas, v.ua.split(","));
    });

    const retval = _.chain(uas)
      .map(ua => {
        return ua.trim();
      })
      .uniq()
      .sortBy()
      .value()
      .join(", ");
    return retval;
  }
}
export { Chassis };

//Combatgroup
//{ _group_id: 1, ua: "", slots: { cgl: 0 }, vehicles: [] }
class Group {
  constructor(id, name) {
    this.name = name;
    this.vehicle_ids = []; //list of vehicle ids
    this._group_id = id;
  }
  addVehicle(vehicle) {
    if (!vehicle.roles) {
      vehicle.roles = vehicles.length ? ["pu"] : ["pu", "cgl"];
    }
    vehicle._group_id = this._group_id;
    vehicle.hasRole = function(role) {
      return this.roles.indexOf(role) !== -1;
    };
    vehicle.addRole = function(role) {
      if (this.roles.indexOf(role) === -1) this.roles.push(role);
    };
    vehicle.removeRole = function(role) {
      _.remove(this.roles, role);
    };
  }

  //Roles of models in a group: vehicles have a a "roles" array with possible values: cgl, fc, xo, 2ic, vet, duelist, pu, su1, su2 etc.
  // Validation logic will make sure there are not too many or too few roles for any model in a group/roster context.
}

export { Group };
