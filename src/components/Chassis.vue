<template>
  <q-card flat square :bordered="false" class="gg-chassis col-auto q-gutter-xs">
    <!-- <q-banner class="bg-primary text-white" v-show="!!msg">
      {{ msg }}
    </q-banner> -->
    <q-item>
      <q-item-section avatar>
        <q-btn
          :icon="expand_vehicles ? 'expand_less' : 'expand_more'"
          size="sm"
          round
          dense
          @click="expand_vehicles = !expand_vehicles"
        />
      </q-item-section>
      <q-item-section avatar v-show="!expand_vehicles">
        <div>
          <img style="max-height:60px" :src="getMiniPicSrc()" />

          <!-- <q-tooltip>Expand {{ vehicle.modelPics.length }} images</q-tooltip> -->
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
        <q-item-label caption>UA: {{ chassis.getUAs() }} </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section v-if="!expand_vehicles">
      <vehicle-statline :cols="getCols(chassis.getSameStatline().keys)" :vehicles="[chassis.getSameStatline().statline]" />
    </q-card-section>
    <!-- <strong class="q-pa-sm" v-if="!expand_vehicles">Vehicles</strong> -->
    <q-card-section v-if="!expand_vehicles">
      <vehicle-statline :cols="getCols(chassis.getUniqueStatlines().keys)" :vehicles="chassis.getUniqueStatlines().statlines" />
    </q-card-section>
    <!-- <q-card-section v-if="!expand_vehicles">
      <vehicle-statline :cols="cols" :vehicles="chassis.getCommonStatlines()" />
    </q-card-section> -->
    <div v-if="expand_vehicles">
      <Vehicle
        class="q-ma-sm"
        v-for="(vehicle, i) in chassis.vehicles"
        :key="i"
        :vehicle="vehicle"
      />
    </div>
  </q-card>
</template>

<script>
import VehicleStatline from "components/VehicleStatline";
import Vehicle from "components/Vehicle";
import ggurls from "boot/ggurls";
export default {
  name: "Chassis",
  components: {
    VehicleStatline,
    Vehicle
  },
  methods: {
    getCols: function(keys) {
      var retval = [];
      this.cols.forEach(function(col) {
        if( keys.includes( col.name ) ) retval.push( col );
      })
      return retval;
    }, 
    artStyle: function() {
      return this.$store.state.settings.imagePreference;
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
      cols: [
        { name: "name", label: "Name" },
        { name: "chassis", label: "Chassis" },
        { name: "tv", label: "TV" },
        { name: "mr", label: "MR" },
        { name: "ar", label: "AR" },
        { name: "hs", label: "HS" },
        { name: "a", label: "A" },
        { name: "gu", label: "GU" },
        { name: "pi", label: "PI" },
        { name: "ew", label: "EW" },
        { name: "rosterWeapons", label: "Weapons" },
        { name: "traits", label: "Traits" },
        { name: "type", label: "Type" },
        { name: "height", label: "Height" },
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
  width: 600px
</style>
