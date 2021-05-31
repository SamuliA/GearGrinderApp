<template>
  <!-- <q-page class="flex flex-start"> -->
  <q-page padding class="justify-center items-center page">
    <q-list>
      <q-item>
        <q-item-section avatar>
          <img :src="getPicSrc()" style="max-height:50px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">{{ getFaction.name }} </q-item-label>
          <q-item-label caption>{{ getFaction.description }} </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-for="(rule, ri) in getFaction.rules" :key="ri">
        <q-item-section>
          <q-item-label>{{ rule.name }} </q-item-label>
          <q-item-label caption>{{ rule.description }} </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div bordered class="q-pa-md row items-start q-gutter-md">
      <Chassis2
        v-for="(chassis, i) in getFilteredChassisList"
        :key="i"
        v-bind:chassis="chassis"
        v-bind:picPreference="picPreference"
      />
      <!-- <Vehicle
        v-for="(vehicle, i) in getFilteredVehicles"
        :key="i"
        v-bind:vehicle="vehicle"
        v-bind:picPreference="picPreference"
      /> -->
      <h3 class="q-pa-md text-grey" v-if="getFilteredVehicles.length === 0">
        <!-- <img :src="getPicSrc()" style="max-height:500px" /> -->
        Gear Grinder App
      </h3>
    </div>
  </q-page>
</template>

<script>
import Vehicle from "components/Vehicle";
// import Chassis from "components/Chassis";
import Chassis2 from "components/Chassis2";
// import { QSpinnerGears } from "quasar";
import { mapState, mapGetters } from "vuex";
import ggurls from "boot/ggurls";
export default {
  name: "PageIndex",

  components: {
    // Vehicle,
    Chassis2
  },
  methods: {
    getPicSrc() {
      if (this.getFaction.img) {
        return ggurls.factionpics + this.getFaction.img;
      } else {
        return ggurls.factionpics + "GearGrinder.png";
      }
    }
  },
  computed: {
    ...mapGetters("gamesystem", [
      "getFilteredVehicles",
      "getFilteredChassisList",
      "getFaction"
    ])
  },
  data() {
    return {
      noAPI: false,
      picPreference: "photo"
    };
  }
};
</script>
<style lang="stylus" scoped>
.search {
  max-width: 1024px;
  margin: 0 auto;
  width: 50%;
}
.search-wrapper {
  display: flex;
  justify-content: flex-begin;
}
</style>
