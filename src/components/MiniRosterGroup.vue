<template>
  <div>
    {{ group.name }}
    <div>PU</div>
    <!-- <q-select
      class="q-ma-md"
      dense
      clearable
      rounded
      outlined
      v-model="ua"
      :options="uas"
      :options-dense="true"
      label="Unit Availability"
    /> -->
    <q-item-label>{{ ua }}</q-item-label>
    <q-btn-dropdown color="primary" label="Select UA">
      <q-list>
        <q-item
          clickable
          v-close-popup
          v-for="uac in getGroupUAs(group)"
          @click="onSelectUA(uac)"
          :key="uac"
        >
          <q-item-section>
            <q-item-label>{{ uac }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    
    <span>{{group.name}}</span>
    <span v-for="(v, n) in group.vehicles" :key="n" :vehicle="v" >{{v.name}}</span>
    <MiniRosterVehicle v-for="(v, n) in group.vehicles" :key="n" :vehicle="v" />
  </div>
</template>
<script>
import MiniRosterVehicle from "components/MiniRosterVehicle";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "MainLayout",
  components: {
    MiniRosterVehicle
  },
  props: {
    // group: { type: Object, required: true }
    group_id: { type: Number, required: true }
  },
  methods: {
    getGroupUAs(group) {
      return this.uas;
    },
    onSelectUA(ua) {
      this.ua = ua;
    }
  },
  computed: {
    ua: {
      set(value) {
        console.log("setter");
        this.$store.commit("gamesystem/setGroupUA", {
          _group_id: this._group_id,
          ua: value
        });
      },
      get() {
        return this.getRosterGroup(this._group_id).ua;
        // return this.group.ua;
      }
    },
    group: {
      get() {
        const grp = this.getRosterGroup(this._group_id);
        console.log("getRosterGroup");
        console.log(grp);
        return grp;
      }
    },
    ...mapGetters("gamesystem", ["getRosterGroup"])
  },
  data: function() {
    return {
      uas: ["GP", "SK", "FS", "RC", "SF", "PT", "VL", "EG"]
    };
  }
};
</script>
