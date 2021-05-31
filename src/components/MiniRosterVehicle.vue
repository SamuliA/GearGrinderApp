<template>
  <!-- <q-card class="gg-vehicle col-auto q-gutter-xs"> -->
  <q-card
    flat
    square
    :bordered="false"
    class="gg-vehicle col-auto q-pa-xs q-ma-xs"
  >
    <q-banner class="bg-primary text-white" v-show="!!msg">
      {{ msg }}
    </q-banner>
    <q-item>
      <q-btn-dropdown
        class="flat"
        outline
        size="xs"
        color="purple"
        :label="vehicle.roles"
      >
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <!-- <div class="text-h6 q-mb-md">Roles</div> -->
            <q-toggle v-model="cgl" label="Combat Group Leader" />
            <q-toggle v-model="sic" label="Second in Command" />
            <q-toggle v-model="fc" label="Force Commander" />
            <q-toggle v-model="xo" label="Executive Officer" />
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <img :src="getMiniPicSrc()" style="max-height:50px" />

            <div class="text-subtitle1 q-mt-md q-mb-xs">{{ vehicle.name }}</div>
            <div class="text-subtitle1 q-mt-md q-mb-xs">
              {{ vehicle.tv }} TV
            </div>

            <q-btn color="primary" label="Close" push size="sm" v-close-popup />
          </div>
        </div>
        <q-separator horizontal inset class="q-mx-lg" />
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <!-- <div class="text-h6 q-mb-md">Options</div> -->
            <q-toggle v-for="(opt, i) in available_options" :key="i" v-model="taken_options" :val="opt.code" :label="opt.name" />
            <!-- <q-toggle v-model="taken_options" val="opt2" label="opt 2" />
            <q-toggle v-model="taken_options" val="opt3" label="opt 3" />
            <q-toggle v-model="taken_options" val="opt4" label="opt 4" />
            <q-toggle v-model="taken_options" val="opt5" label="opt 5" /> -->
            
          </div>
        </div>
      </q-btn-dropdown>

      <q-item-section>
        <q-item-label>{{ vehicle.name }} {{ vehicle.tv }} TV</q-item-label>
      </q-item-section>
      <!-- <q-item-section avatar>
        <q-chip clickable glossy flat @click="addToRoster(vehicle)">
          <q-avatar outline glossy color="amber-5">{{ vehicle.tv }}</q-avatar>
          TV
        </q-chip>
      </q-item-section> -->

      <q-item-section avatar>
        <q-fab
          color="amber"
          text-color="black"
          icon="keyboard_arrow_left"
          direction="left"
          padding="xs"
        >
          <q-fab-action
            color="red-9"
            padding="xs"
            round
            glossy
            icon="delete"
            @click="removeFromRoster(vehicle)"
            ><q-tooltip>Remove</q-tooltip></q-fab-action
          >
          <q-fab-action
            color="green-9"
            padding="xs"
            round
            glossy
            @click="moveDown(vehicle)"
            icon="keyboard_arrow_down"
            ><q-tooltip>Move down</q-tooltip></q-fab-action
          >
        </q-fab>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
import ggurls from "boot/ggurls";
export default {
  name: "MiniRosterVehicle",
  components: {},
  data() {
    return {
      slide: 0,
      msg: "",
      image_expanded: false,
      expand_traits: false,
      cgl: false,
      sic: false,
      fc: false,
      xo: false,
      taken_options: [],
      available_options: [
        {name:"Opt 1", code:"opt1"},
        {name:"Opt 2", code:"opt2"},
        {name:"Opt 3", code:"opt3"}
      ]
    };
  },
  props: {
    picPreference: String, //empty, "line-art", "photo", "render"
    vehicle: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeFromRoster: function(vehicle) {
      const self = this;
      this.$store.dispatch("gamesystem/removeFromRoster", vehicle).then(() => {
        self.msg = vehicle.name + " was removed from roster";
        setTimeout(() => {
          self.msg = "";
        }, 2000);
      });
    },
    moveDown: function(vehicle) {
      //Move vehicle down
      this.$store.commit("gamesystem/moveDown", {
        vehicle: vehicle
      });
    },
    assignToGroup: function(vehicle) {
      this.$store.commit("gamesystem/assignToGroup", {
        group: this.$store.state.gamesystem.roster.groups[0],
        vehicle: vehicle
      });
    },
    modelPics: function() {
      return this.vehicle.modelPics.map(p => ({
        url: ggurls.modelpics + p.url,
        rel: p.rel,
        index: p.index
      }));
    },
    getFactionPicSrc: function() {
      return ggurls.factionpics + this.vehicle.factionPic;
    },
    getMiniPicSrc: function() {
      if (this.vehicle.modelPics.length > 0) {
        return this.modelPics()[this.slide].url;
      } else {
        return "";
      }
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
        EG: "Engineering",
        "Attached Upgrade": "Upgrade for another model"
      };
      const ua_tt = ua_data[ua.split("(")[0]];
      if (ua.includes("+")) return ua_tt + " unlimited";
      else if (ua == "Attached Upgrade") return ua_tt;
      else return ua_tt + " max 2";
    }
  },
  computed: {
    isCmd: function() {
      return this.vehicle.ua.toLowerCase().includes("cmd");
    },
    getUAs: function() {
      //Get uas as an array and without any CMD texts
      const uas = this.vehicle.ua.split(",").map(av => {
        if (av.toLowerCase().includes("(cmd")) {
          return av.split("(")[0].trim();
        } else {
          return av.trim();
        }
      });
      return uas.filter(v => !!v);
    }
  }
};
</script>
<style lang="sass" scoped>
.gg-vehicle
  width: 280px
</style>
