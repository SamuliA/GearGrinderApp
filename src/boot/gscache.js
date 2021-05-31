const taffy = require("taffydb").taffy;
import _ from "lodash";
const gscache = {
  db: taffy([]),
  gs: "",
  //Main level: name of gamesystem
  gamesystems: {
    "V3.0Beta": {
      loadedDate: 0
    }
  },
  insertGamesystemVehicles: function(gamesystem_name, vehicles) {
    console.log("insertGamesystemVehicles" + gamesystem_name);
    this.gs = gamesystem_name;
    //Remove old versions
    this.db({ gamesystem: this.gs }).remove();

    //Insert new vehicles and add the gamesystem property to them
    this.db.insert(
      _.map(vehicles, v => {
        v.gamesystem = gamesystem_name;
        return v;
      })
    );
    this.gamesystems[gamesystem_name] = { loadedDate: Date.now() };
  },
  getAll() {
    console.log("getAll");
    // console.log(this.db);
    if (this.db) {
      return this.db({ gamesystem: this.gs }).get();
    } else {
      return [];
    }
  },
  //Get using a query, which is an array of query parameters.
  get(query) {
    console.log("get");
    if (!query) return this.getAll();
    if (this.db) {
      return this.db({ gamesystem: this.gs }, ...query).get();
    } else {
      return [];
    }
  },
  //Helper function to check if data should update.
  shouldUpdate: function(gs_name) {
    //Update if data is older than a day
    if (!this.gamesystems[gs_name]) return true;
    if (!this.gamesystems[gs_name].loadedDate) return true;
    return Date.now() - this.gamesystems[gs_name].loadedDate > 24 * 60 * 60000;
  }
};

export { gscache };
