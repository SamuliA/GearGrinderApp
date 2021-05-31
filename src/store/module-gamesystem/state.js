import { Group } from "./classes";
export default function() {
  return {
    rulesets: ["V3.0Beta", "Alpha2019", "BrigandV2"],
    selected_ruleset: "V3.0Beta",
    factions: [], //{ name: "North" }, { name: "South" }],
    selected_faction: { faction: "", subfaction: "" },
    filter: { name: "", faction: "", ua: "", chassis: "" },
    paging: { start: 0, end: 20 },
    search: "",
    loaded_vehicles_count: 0,
    // vehicles: [], //Visible vehicles only.
    roster: {
      name: "",
      faction: "",
      subfaction: "",
      groups: [new Group(1, "CG1", [])],
      vehicles: [],
      _next_free_id: 2
    },
    weapons: {},
    traits: {},
    weapontraits: {},
    options: [],
    loading: ""
  };
}
