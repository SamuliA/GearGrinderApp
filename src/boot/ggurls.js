var ggurls;
if (process.env.PROD) {
  ggurls = {
    modelpics: "http://hgbtools.infohell.net",
    weaponpics: "http://hgbtools.infohell.net/",
    factionpics: "http://hgbtools.infohell.net/faction-images/",
    get_vehicles: "http://hgbtools.infohell.net/v2/vehicles/",
    get_factions: "http://hgbtools.infohell.net/v2/factions/",
    get_rulesets: "http://hgbtools.infohell.net/v2/versions/"
  };
} else {
  ggurls = {
    modelpics: "http://localhost:3010",
    weaponpics: "http://localhost:3010/",
    factionpics: "http://localhost:3010/faction-images/",
    get_vehicles: "http://localhost:3010/v2/vehicles/",
    get_factions: "http://localhost:3010/v2/factions/",
    get_rulesets: "http://localhost:3010/v2/versions/"
  };
}
export default ggurls;
