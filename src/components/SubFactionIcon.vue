<template>
  <q-item clickable @click="selectFaction">
    <q-item-section avatar>
      <img :src="getPicSrc()" style="max-height: 35px" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ subFaction.code }}</q-item-label>
      <q-item-label caption>
        {{ getCaption() }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import ggurls from "boot/ggurls";
export default {
  name: "SubFactionIcon",
  methods: {
    getPicSrc() {
      return (
        // "http://hgbtools.infohell.net/faction-images/" + this.subFaction.img
        // "http://localhost:3010/faction-images/" + this.subFaction.img
        ggurls.factionpics + this.subFaction.img
      );
    },
    getCaption() {
      // return this.faction.code;
      return this.subFaction.name;
    },
    selectFaction() {
      console.log("select");
      console.log(this.subFaction);
      this.$store
        .dispatch("gamesystem/selectFaction", {
          faction: this.faction.code,
          subfaction: this.subFaction.code
        })
        .then(() => {
          this.$emit("selectionsuccess");
        });
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
      required: true
    },
    subFaction: {
      type: Object,
      default: function() {
        return { code: "", img: "" };
      }
    }
  }
};
</script>
