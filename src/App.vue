<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  preFetch({ store }) {
    console.log("Start prefetch");
    return (
      store
        .dispatch("gamesystem/loadRulesets")
        // .then(store.dispatch("gamesystem/loadAllVehicles"))
        .then(store.dispatch("gamesystem/loadFactions"))
        .then(console.log("end prefetch"))
    );
  }
};
</script>
