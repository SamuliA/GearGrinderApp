<template>
  <div>
    <div v-if="roster.vehicles.length > 0">
      Total TV <q-chip> {{ getRosterTV }} </q-chip>
      <!-- <q-btn label="Edit roster"></q-btn> -->
    </div>
    <div v-if="roster.vehicles.length == 0">
      <span class="q-ma-xl">The roster is empty</span>
    </div>

    <div v-for="(group, i) in getRosterGroups" :key="i">
      {{group.name}}
      <MiniRosterGroup :group_id="group._group_id" />
    </div>
    <!-- <div class="q-pa-sm">
      Unassigned
      <MiniRosterVehicle
        v-for="(v, n) in getUnassignedRosterVehicles"
        :key="n"
        :vehicle="v"
      />
    </div> -->
  </div>
</template>
<script>
// import MiniRosterVehicle from "components/MiniRosterVehicle";
import MiniRosterGroup from "components/MiniRosterGroup";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "MainLayout",
  components: {
    // MiniRosterVehicle,
    MiniRosterGroup
  },
  methods: {
    getGroupUAs(group) {
      return this.uas;
    }
  },
  computed: {
    ...mapState("gamesystem", ["roster"]),
    ...mapGetters("gamesystem", [
      "getRosterTV",
      "getRosterGroups",
      "getUnassignedRosterVehicles"
    ])
  },
  data: function() {
    return {
      uas: ["GP", "SK", "FS", "RC", "SF", "PT", "VL"]
    };
  }
};
</script>
