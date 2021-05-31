<template>
  <q-markup-table dense flat square wrap-cells>
    <thead>
      <tr>
        <th v-for="col in cols" :key="col.label">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(vehicle, i) in vehicles" :key="i">
        <td v-for="col in cols" :key="col.name" class="text-center">
          {{ vehicle[col.name] }}<span v-if="col.name == 'height'">"</span>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script>
export default {
  name: "VehicleStatline",
  props: {
    vehicles: {
      type: Array,
      required: true
    },
    cols: {
      type: Array,
      default: function() {
        return [
          // { name: "name", label: "Name" },
          { name: "mr", label: "MR" },
          { name: "ar", label: "AR" },
          { name: "hs", label: "H/S" },
          { name: "a", label: "A" },
          { name: "gu", label: "GU" },
          { name: "pi", label: "PI" },
          { name: "ew", label: "EW" },
          { name: "type", label: "Type" }
        ];
      }
    }
  }
};
</script>
