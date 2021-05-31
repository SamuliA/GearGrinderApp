<template>
  <q-expansion-item
    dense
    v-model="expand_vehicles"
    @click="expand"
    ref="chassisparent"
    class="gg-chassis col-auto q-gutter-xs q-ml-xs"
  >
    <template v-slot:header>
      <q-item-section avatar>
        <div>
          <!-- <img style="max-height:40px" :src="getMiniPicSrc()" /> -->
          <img style="max-width:50px" :src="getMiniPicSrc()" />
        </div>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ chassis.name }} </q-item-label>
        <q-item-label caption
          >{{ chassis.vehicles.length }} variants</q-item-label
        >
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ chassis.getTVRange() }} </q-item-label>
        <q-item-label caption>{{ chassis.getUAs() }} </q-item-label>
      </q-item-section>
      <q-space />

    </template>

    <q-banner v-if="expand_vehicles" rounded class="bg-grey-3">
      {{ chassis.description }}
    </q-banner>
    <q-list v-if="expand_vehicles" class="row items-start">
      <Vehicle
        class="q-ma-sm"
        v-for="(vehicle, i) in chassis.vehicles"
        :key="i"
        :vehicle="vehicle"
      />
      <q-btn
        icon="expand_less"
        class="q-ma-none"
        style="min-width: 100%"
        :label="'Close ' + chassis.name"
        @click="unexpand()"
      />
    </q-list>
  </q-expansion-item>
</template>

<script>
// import VehicleStatline from "components/VehicleStatline";
import { scroll } from "quasar";
const { getScrollTarget, getScrollPosition, setScrollPosition } = scroll;
import Vehicle from "components/Vehicle";
import ggurls from "boot/ggurls";
export default {
  name: "Chassis2",
  components: {
    // VehicleStatline,
    Vehicle
  },
  methods: {
    artStyle: function() {
      return this.$store.state.settings.imagePreference;
    },
    expand: function() {
      // this.expand_vehicles = !this.expand_vehicles;
      // console.log(this.$refs.chassisparent.$el);
      if (this.expand_vehicles) {
        this.scroltgt = getScrollTarget(this.$refs.chassisparent.$el);
        this.scrolpos = getScrollPosition(this.scroltgt);
      }
    },
    unexpand: function() {
      setScrollPosition(this.scroltgt, this.scrolpos);
      this.expand_vehicles = false;
    },
    getUATooltip: function(ua) {
      const ua_data = {
        GP: "General Purpose",
        SK: "Strike",
        FS: "Fire Support",
        RC: "Recon",
        SF: "Special Forces",
        PT: "Paratrooper",
        VL: "VTOL",
        "Attached Upgrade": "Upgrade for another model"
      };
      const ua_tt = ua_data[ua.split("(")[0]];
      if (ua.includes("+")) return ua_tt + " unlimited";
      else if (ua == "Attached Upgrade") return ua_tt;
      else return ua_tt + " max 2";
    },
    modelPics: function() {
      // console.log(this.vehicle.modelPics.length);
      return this.chassis.vehicles[0].modelPics.map(p => ({
        url: ggurls.modelpics + p.url,
        // url: "http://localhost:3010" + p.url,
        // url: "http://hgbtools.infohell.net" + p.url,
        rel: p.rel,
        index: p.index
      }));
    },
    getMiniPicSrc: function() {
      if (this.chassis.vehicles[0].modelPics.length > 0) {
        return this.modelPics()[0].url;
      } else {
        return "";
      }
    }
  },

  data() {
    return {
      msg: "",
      expand_vehicles: false,
      image_expanded: false,
      scrolpos: 0,
      scroltgt: null,
      cols: [
        { name: "name", label: "Name" },
        { name: "tv", label: "TV" },
        { name: "mr", label: "MR" },
        { name: "ar", label: "AR" },
        { name: "hs", label: "HS" },
        { name: "a", label: "A" },
        { name: "gu", label: "GU" },
        { name: "pi", label: "PI" },
        { name: "ew", label: "EW" },
        { name: "type", label: "Type" }
      ]
    };
  },
  props: {
    picPreference: String, //empty, "line-art", "photo", "render"
    chassis: {
      type: Object,
      required: true
    }
  }
};
</script>
<style lang="sass" scoped>
.gg-chassis
  // min-width: 360px
  width: 100%
  // max-width: 820px
  // min-width: 500px
  // max-width: 500px
</style>
