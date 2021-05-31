<template>
  <q-card class="gg-vehicle col-auto q-gutter-xs">
    <!-- <q-card flat square :bordered="false" class="gg-vehicle col-auto q-gutter-xs"> -->
    <q-banner class="bg-primary text-white" v-show="!!msg">
      {{ msg }}
    </q-banner>

    <q-item>
      <q-item-section avatar v-show="image_expanded">
        <q-avatar rounded size="35px">
          <img :src="getFactionPicSrc()" @click="image_expanded = !image_expanded" />
          <q-tooltip>{{ vehicle.faction }}</q-tooltip>
        </q-avatar>
      </q-item-section>
      <q-item-section avatar v-show="!image_expanded">
        <div>
          <img
            style="max-height:60px"
            :src="getMiniPicSrc()"
            @click="image_expanded = !image_expanded"
          />

          <q-tooltip>Expand {{ vehicle.modelPics.length }} images</q-tooltip>
        </div>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ vehicle.name }} </q-item-label>
        <q-item-label caption>{{ vehicle.chassis }}</q-item-label>
        <q-item-label caption>
          <q-badge class="q-ma-xs" outline color="purple" dense v-if="isCmd">
            🟊CMD🟊
            <q-tooltip>This is a command model</q-tooltip>
          </q-badge>
          <q-badge
            class="q-ma-xs"
            outline
            color="dark grey"
            dense
            v-for="ua in getUAs"
            :key="ua"
          >
            {{ ua }}
            <q-tooltip>{{ getUATooltip(ua) }}</q-tooltip>
          </q-badge></q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <div class="text-weight-light">
          {{ vehicle.gamesystem }}
        </div>

        <q-chip clickable glossy flat @click="addToRoster(vehicle)">
          <q-avatar outline glossy color="amber-5">{{ vehicle.tv }}</q-avatar>
          TV
        </q-chip>
        <q-tooltip>Add to roster</q-tooltip>
      </q-item-section>
      <!-- <q-item-section avatar>
        <q-btn outline color="black" glossy size="md">
          <div class="row items-center no-wrap">
            {{ vehicle.tv }}TV
            <q-tooltip>TV</q-tooltip>
          </div>
        </q-btn>
      </q-item-section> -->
      <!-- <q-item-section avatar>
        <q-avatar rounded size="35px">
          <img :src="getFactionPicSrc()" />
          <q-tooltip>{{ vehicle.faction }}</q-tooltip>
        </q-avatar>
      </q-item-section> -->
      <!-- <q-item-section avatar>
        <q-btn
          round
          color="primary"
          size="md"
          icon="playlist_add"
          @click="addToRoster(vehicle)"
        >
          <q-tooltip>Add To Roster</q-tooltip>
        </q-btn>
      </q-item-section> -->
    </q-item>

    <q-carousel
      v-if="image_expanded"
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      swipeable
      :arrows="modelPics().length > 1"
      :navigation="modelPics().length > 1"
      control-type="flat"
      control-color="grey"
      class="rounded-borders"
    >
      <q-carousel-slide
        v-for="p in modelPics()"
        :key="p.index"
        :name="p.index"
        class="column no-wrap flex-center"
      >
        <q-chip
          v-if="badgeColors[p.rel].caption != null"
          class="q-ma-sm"
          outline
          dense
          :color="badgeColors[p.rel].color"
        >
          {{ badgeColors[p.rel].caption }}
          <q-tooltip> {{ badgeColors[p.rel].tooltip }} </q-tooltip>
        </q-chip>
        <q-img
          contain
          style="max:width: 300px; height: 300px"
          v-bind:src="p.url"
          @click="image_expanded = !image_expanded"
        >
          <q-tooltip>Collapse image</q-tooltip>
        </q-img>
      </q-carousel-slide>
    </q-carousel>

    <q-card-section>
      <vehicle-statline :vehicles="[vehicle]" />
    </q-card-section>
    <!-- Traits -->
    <q-card-section class="q-ma-none q-pa-none">
      <VehicleTraits
        :expanded="expand_traits"
        :trait_info="vehicle.trait_info"
      />
    </q-card-section>

    <q-card-section class="q-ma-none q-pa-none q-pb-sm">
      <VehicleWeapons
        :expanded="expand_traits"
        :weapons="vehicle.Weapons"
        :title="vehicle.weapons"
      />
    </q-card-section>
    <!-- <q-card-section class="q-pa-sm"> -->
    <!-- <q-card-section> -->
    <!-- <q-card-actions align="right">
      <q-btn
        :icon="expand_traits ? 'expand_less' : 'expand_more'"
        :label="expand_traits ? 'less' : 'more'"
        dense
        flat
        @click="expand_traits = !expand_traits"
      />
      <q-space />
      <q-btn
        icon="add"
        color="green"
        glossy
        round
        right
        class="q-ma-md"
        @click="addToRoster(vehicle)"
      >
        <div class="row items-center no-wrap">
          <q-tooltip>Add To roster, cost {{ vehicle.tv }} TV </q-tooltip>
        </div>
      </q-btn>
    </q-card-actions> -->
    <!-- </q-card-section> -->
  </q-card>
</template>

<script>
import VehicleStatline from "components/VehicleStatline";
import VehicleWeapons from "components/VehicleWeapons";
import VehicleTraits from "components/VehicleTraits";
import ggurls from "boot/ggurls";
export default {
  name: "Vehicle",
  components: {
    VehicleStatline,
    VehicleWeapons,
    VehicleTraits
  },
  methods: {
    addToRoster: function(vehicle) {
      const self = this;
      this.$store.dispatch("gamesystem/addToRoster", vehicle).then(() => {
        self.msg = vehicle.name + " was added to roster";
        setTimeout(() => {
          self.msg = "";
        }, 1500);
      });
    },
    modelPics: function() {
      // console.log(this.vehicle.modelPics.length);
      return this.vehicle.modelPics.map(p => ({
        url: ggurls.modelpics + p.url,
        // url: "http://localhost:3010" + p.url,
        // url: "http://hgbtools.infohell.net" + p.url,
        rel: p.rel,
        index: p.index
      }));
    },
    getFactionPicSrc: function() {
      return (
        // "http://hgbtools.infohell.net/faction-images/" + this.vehicle.factionPic
        ggurls.factionpics + this.vehicle.factionPic
      );
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
  },
  data() {
    return {
      slide: 0,
      msg: "",
      image_expanded: false,
      expand_traits: false,
      badgeColors: {
        accurate: { color: "green", caption: null },
        base: {
          color: "purple",
          caption: "base model",
          tooltip: "Image represents a model this variant is based on."
        },
        chassis: {
          color: "orange",
          caption: "chassis",
          tooltip:
            "Image does not accurately represent the weapons and equipment of this model, but has the same chassis."
        },
        generic: {
          color: "grey",
          caption: "image not found",
          tooltip: "No suitable image exists in the system, sorry"
        }
      }
    };
  },
  props: {
    picPreference: String, //empty, "line-art", "photo", "render"
    vehicle: {
      type: Object,
      required: true
    }
  }
};
</script>
<style lang="sass" scoped>
.gg-vehicle
  width: 100%
  // min-width: 370px
  // max-width: 370px
  // min-width: 360px
  max-width: 700px
</style>
