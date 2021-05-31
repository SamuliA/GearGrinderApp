<template>
  <q-item class="q-ml-none">
    <!-- :class="selected ? 'bg-primary' : ''" -->
    <!-- <q-item clickable @click="selectFaction" :active="selected"> -->
    <q-item-section avatar class="q-pl-none">
      <img :src="getPicSrc()" style="max-height: 35px" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ faction.code }}</q-item-label>
      <q-item-label v-if="!this.faction.code" caption>
        {{ getCaption() }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import ggurls from "boot/ggurls";
export default {
  name: "FactionIcon",
  methods: {
    getPicSrc() {
      // return "http://hgbtools.infohell.net/faction-images/" + this.faction.img;
      // return "http://localhost:3010/faction-images/" + this.faction.img;
      return this.faction.img
        ? ggurls.factionpics + this.faction.img
        : ggurls.factionpics + "Terra-Nova.png";
    },
    getCaption() {
      return this.faction.code && this.faction.subfactions
        ? this.faction.subfactions.length + " subfactions"
        : "Choose Faction";
    }
  },
  computed: {
    selected: function() {
      return (
        this.$store.state.gamesystem.filter.faction &&
        this.$store.state.gamesystem.filter.faction == this.faction.code
      );
    }
  },
  props: {
    faction: {
      type: Object,
      required: false,
      default: function() {
        return {
          name: "",
          code: "GearGrinder",
          img: "GearGrinder.png"
        };
      }
    }
  }
};
</script>
