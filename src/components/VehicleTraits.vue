<template>
  <div :class="expanded ? 'q-mx-sm' : 'q-mx-md'">
    <q-dialog v-model="dialog.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">{{ dialog.ti.text }}</div>
          <div class="text-subtitle">{{ dialog.ti.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <strong> {{ dialog.ti.short_info }} </strong>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span class="text-caption">{{ dialog.ti.info }}</span>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-btn
      :icon="expand_traits ? 'expand_less' : 'expand_more'"
      size="sm"
      round
      dense
      @click="expand_traits = !expand_traits"
    /> -->
    <!-- <strong class="q-pa-sm" v-if="expanded">Traits</strong> -->
    <q-btn
      icon="expand_more"
      size="sm"
      round
      dense
      @click="expand()"
      v-if="expanded == false"
    />
    <q-chip
      square
      clickable
      dense
      outline
      color="indigo-6"
      v-show="!expanded"
      v-for="ti in trait_info"
      :key="ti.text"
      @click="showdialog(ti)"
    >
      <span>{{ ti.text }}</span>
      <q-tooltip v-if="!dialog.show">
        {{ ti.short_info }}
      </q-tooltip>
    </q-chip>

    <!-- Expanded  -->
    <q-btn
      icon="expand_less"
      size="sm"
      class="q-ma-xs"
      round
      dense
      @click="expand()"
      v-if="expanded == true"
    />
    <span class="text-subtitle2" v-if="expanded">Traits</span>
    <div v-if="expanded">
      <div class="q-pa-xs" v-for="(ti, i) in trait_info" :key="i">
        <q-icon
          round
          clickable
          size="xs"
          color="indigo-3"
          @click="showdialog(ti)"
          name="info"
          left
        />
        <strong class="q-pr-xs">{{ ti.text }}</strong
        >{{ ti.short_info }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VehicleTraits",
  props: {
    trait_info: {
      type: Array,
      default: function() {
        return [];
      }
    }
    // expanded: {
    //   type: Boolean,
    //   default: false
    // }
  },
  methods: {
    showdialog(ti) {
      console.log(ti);
      this.dialog.ti = ti;
      this.dialog.show = true;
    },
    expand() {
      this.expanded = !this.expanded;
      //If expanded is a prop, cannot modify it directly. Then make event like this:
      // this.$emit("update-number", myNumber);
    }
  },
  data() {
    return {
      dialog: { show: false, ti: { text: "", info: "", short_info: "" } },
      expanded: false
    };
  }
};
</script>
