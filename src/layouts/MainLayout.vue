<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Gear Grinder App
        </q-toolbar-title>
        <q-toolbar-title>
          {{ selected_faction.subfaction }} {{ getCurrentFilter.ua }}
          {{ getCurrentFilter.name }}
        </q-toolbar-title>

        <q-btn
          flat
          dense
          right
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerRight = !drawerRight"
        />

        <q-banner
          inline-actions
          class="text-white bg-red"
          v-show="!!show_error"
        >
          {{ show_error }}
          <template v-slot:action>
            <q-btn flat color="white" label="OK" @click="hideError" />
          </template>
        </q-banner>
        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
      
      <q-tabs align="left">
        <q-route-tab to="/chassis" label="Chassis" />
        <q-route-tab to="/thumbs" label="Thumbs" />
        <q-route-tab to="/" label="Idenx" />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :content-class="isDark ? 'bg-grey-9' : 'bg-gray-3'"
    >
      <!-- <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="leftDrawerOpen = !leftDrawerOpen"
      /> -->
      <q-list>
        <!-- <q-btn-dropdown
          class="glossy q-ma-md"
          color="primary"
          :label="getSelectedRuleset"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="selectRuleset(ruleset)"
              v-for="(ruleset, i) in rulesets"
              :key="i"
            >
              <q-item-section>
                <q-item-label>
                  {{ ruleset }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown> -->

        <q-expansion-item flat>
          <template v-slot:header>
            <FactionIcon :faction="getFaction" class="q-pl-none" />
          </template>
          <q-list bordered>
            <q-expansion-item
              flat
              v-for="faction in factions"
              :key="faction.code"
              group="faction.code"
              icon="explore"
              accordion
              dense
              :header-inset-level="0.2"
              :content-inset-level="0.5"
              header-class="text-black text-weight-bold"
            >
              <template v-slot:header>
                <FactionIcon :faction="faction" class="q-pl-none" />
              </template>

              <SubFactionIcon
                v-for="(sub, i) in faction.subfactions"
                :key="i"
                :faction="faction"
                :subFaction="sub"
              />
            </q-expansion-item>

            <q-separator />
          </q-list>
        </q-expansion-item>

        <!-- Filters -->
        <q-expansion-item :header-inset-level="0" :content-inset-level="0.2">
          <template v-slot:header>
            <q-item>
              <q-item-section avatar>
                <q-icon name="filter" />
              </q-item-section>
              <q-item-section>
                Filters
              </q-item-section>
            </q-item>
          </template>
          <q-list bordered>
            <!-- <q-item>
              <q-item-section> -->
            <div class="search-wrapper">
              <q-input
                v-model="nameFilter"
                filled
                type="search"
                label="Model Name"
                clearable
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <q-select
              class="q-ma-md"
              dense
              clearable
              rounded
              outlined
              v-model="selectedUA"
              :options="uas"
              label="Unit Availability"
            />
            <!-- </q-item-section>
            </q-item> -->
          </q-list>
        </q-expansion-item>

        <!-- Settings -->
        <q-expansion-item :header-inset-level="0" :content-inset-level="0.2">
          <template v-slot:header>
            <q-item>
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>
                Settings
              </q-item-section>
            </q-item>
          </template>
          <q-list bordered>
            <!-- <q-item>
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="isDark" label="Dark mode" />
              </q-item-section>
            </q-item> -->

            <q-item>
              <q-item-section avatar>
                Ruleset
              </q-item-section>
              <q-item-section>
                <q-btn-dropdown
                  class="glossy q-ma-md"
                  color="primary"
                  :label="getSelectedRuleset"
                >
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="selectRuleset(ruleset)"
                      v-for="(ruleset, i) in rulesets"
                      :key="i"
                    >
                      <q-item-section>
                        <q-item-label>
                          {{ ruleset }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-checkbox v-model="isDark" label="Dark mode" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-item-label header class="text-grey-8">
          Gear Grinder is made by fans and is not an official DP9 service.
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="drawerRight"
      show-if-above
      bordered
      :content-class="isDark ? 'bg-grey-9' : 'bg-gray-3'"
    >
      <MiniRoster />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";
import FactionIcon from "components/FactionIcon";
import SubFactionIcon from "components/SubFactionIcon";
// import Vehicle from "components/Vehicle";
import MiniRoster from "components/MiniRoster";
import { QSpinnerGears } from "quasar";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "MainLayout",
  components: {
    EssentialLink,
    FactionIcon,
    SubFactionIcon,
    // Vehicle,
    MiniRoster
  },
  methods: {
    hideError() {
      this.$store.commit("logs/clearError");
    },

    loadFactions() {
      console.log("sending request");
      this.$store.dispatch("gamesystem/loadFactions");
    },
    selectRuleset(rs) {
      this.$store.dispatch("gamesystem/selectRuleset", rs);
    },
    getGroupUAs(group) {
      return this.uas;
    },
    ...mapActions("gamesystem", ["loadVehicles"])
  },
  computed: {
    show_error() {
      console.log("show_error = " + this.$store.state.error);
      return this.$store.state.error;
    },
    selectedUA: {
      get: function() {
        const ua = this.$store.state.gamesystem.filter.ua;
        if (ua) return ua;
        else return "All UAs";
      },
      set: function(value) {
        if (value == "All UAs") value = "";
        // this.$store.state.gamesystem.filter.ua = value;
        this.$store.commit("gamesystem/modifyFilter", { ua: value });
      }
    },
    isDark: {
      get: function() {
        return this.$q.dark.isActive;
      },
      set: function(value) {
        this.$q.dark.toggle();
      }
    },
    nameFilter: {
      get: function() {
        return this.filter.name;
      },
      set: function(value) {
        console.log(value);
        this.$store.commit("gamesystem/modifyFilter", { name: value });
      }
    },

    ...mapGetters("gamesystem", [
      "getCurrentFilter",
      "getSelectedRuleset",
      "getFilteredVehicles",
      "getFaction"
    ]),
    ...mapState("gamesystem", [
      "rulesets",
      "factions",
      "filter",
      "loading",
      "roster",
      "selected_faction"
    ])
  },
  watch: {
    loading(newval, oldval) {
      if (newval) {
        this.$q.loading.show({
          message: "Loading gamesystem data",
          spinnerColor: "orange",
          spinner: QSpinnerGears
        });
      } else {
        this.$q.loading.hide();
      }
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      drawerRight: false,
      search: "",
      uas: [
        "All UAs",
        "GP",
        "SK",
        "FS",
        "RC",
        "SF",
        "PT",
        "VL",
        "EG",
        "Attached Upgrade"
      ],

      essentialLinks: [
        {
          title: "DP9 Company Website",
          caption: "dp9.com",
          img: "/statics/icons/dp9.jpg",
          link: "https://www.dp9.com"
        },
        {
          title: "DP9 Forum",
          caption: "dp9forum.com",
          icon: "record_voice_over",
          link: "https://dp9forum.com"
        },
        {
          title: "DP9 Online Store",
          caption: "store.dp9.com",
          icon: "shopping_cart",
          link: "https://store.dp9.com/index.php?route=product/category&path=69"
        },
        {
          title: "Shiny Games (EU store)",
          caption: "shinygames.uk",
          icon: "shopping_cart",
          link: "https://shinygames.uk"
        },
        {
          title: "Unofficial Heavy Gear Discord Server",
          caption: "https://discord.gg/6ShNVen",
          icon: "chat",
          link: "https://discord.gg/6ShNVen"
        },
        {
          title: "Gear Grinder main page",
          caption: "The traditional Gear Grinder",
          img: "/statics/icons/favicon.ico",
          link: "http://hgbtools.infohell.net"
        }
      ]
    };
  }
};
</script>
