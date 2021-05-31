<template>
  <div :class="expanded ? 'q-ma-xs' : 'q-ml-md'">
    <q-dialog v-model="dialog.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">{{ wpn.ref }}</div>
          <div class="text-subtitle2">{{ wpn.prefix }} {{ wpn.name }}</div>
          <img :src="getImage(wpn)" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <strong>Range:</strong>
          <!-- {{ wpn.range }}" -->
          <q-chip color="">
            <span class="text-weight-bolder"> {{ wpn.range }}"</span></q-chip
          >
          <strong>Damage:</strong>
          <q-chip :color="getColor(wpn)">
            <span class="text-weight-bolder"> {{ wpn.pen }} </span></q-chip
          >
        </q-card-section>

        <q-card-section class="q-pt-none">
          <strong>Category:</strong> {{ wpn.category }}
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          v-for="(trait, i) in wpn.Traits"
          :key="i"
        >
          <strong>{{ trait.title }} {{ trait.value }} </strong>

          {{ trait.short_description }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <span v-if="!expanded">
      <q-btn
        icon="expand_more"
        size="sm"
        round
        dense
        @click="expanded = true"
        v-if="expanded == false"
      />
      <q-chip
        square
        dense
        clickable
        outline
        v-for="(w, i) in weapons"
        :color="getColor(w)"
        :key="i"
        @click="showdialog(w)"
      >
        <span>{{ w.ref }}</span>
        <q-tooltip v-if="!dialog.show">
          Click for rules
        </q-tooltip>
      </q-chip>
    </span>

    <!-- Expanded -->
    <q-btn
      icon="expand_less"
      class="q-ma-sm"
      size="sm"
      round
      dense
      @click="expanded = false"
      v-if="expanded == true"
    />
    <span class="text-subtitle2" v-if="expanded">Weapons</span>
    <q-markup-table dense flat square v-if="expanded">
      <thead>
        <tr>
          <th v-for="col in cols" :key="col.label">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(weapon, i) in weapons"
          :key="i"
          class="text-center"
          @click="showdialog(weapon)"
        >
          <!-- <td class="text-left no-padding">
            <q-icon
              :color="getColor(weapon)"
              name="info"
              size="xs"
              @click="showdialog(weapon)"
            ></q-icon>
          </td> -->
          <td v-for="col in cols" :key="col.label">
            {{ getColData(weapon, col)
            }}<span v-if="col.name == 'range'">"</span>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import ggurls from "boot/ggurls";
export default {
  name: "VehicleWeapons",
  props: {
    weapons: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: "weapons"
    }
    // expanded: {
    //   type: Boolean,
    //   default: false
    // }
  },
  methods: {
    showdialog(weapon) {
      console.log(weapon);
      this.wpn = weapon;
      this.dialog.show = true;
    },
    getColData(weapon, col) {
      var retval = "";
      if (weapon.count > 1 && col.name == "code") retval = weapon.count + " x ";
      retval += weapon[col.name];
      return retval;
    },
    getImage(weapon) {
      return ggurls.weaponpics + weapon.imageFileName;
      // return "http://localhost:3010/" + weapon.imageFileName;
      // return "/" + weapon.imageFileName;
    },
    getColor(weapon) {
      // return "deep-orange-" + (weapon.pen - 2);
      return "deep-orange-" + weapon.pen;
    }
  },
  data() {
    return {
      wpn: { prefix: "", name: "", range: "", pen: 5, Traits: [] },
      dialog: { show: false },
      expanded: false,

      cols: [
        { name: "code", label: "Code" },
        { name: "range", label: "Range" },
        { name: "pen", label: "Dmg" },
        { name: "traits", label: "Traits" },
        { name: "category", label: "Category" }
      ]
    };
  }
};
</script>
