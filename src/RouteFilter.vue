<template>

  <section>
    <h2>
      Show only buses on route 
    </h2>
    <select v-model="selectedRoute" v-on:input="updateFilter">
      <option v-for="route in routes" :value="route.Key">
        {{ route.Value }}
      </option>
    </select>
  </section>

</template>

<style>
  section {
    position: absolute;
    padding: 20px 10px;
    background: #32a852;
    z-index: 999;
    bottom: 20px;
    color: white;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 3px 3px 0px #2b8a44;
    min-width: 320px;
    padding: 10px;
  }
  h2 {
    margin: 5px;
    font-size: 1.2em;
    font-family: Arial, Helvetica, sans-serif;
  }
  select {
    width: 100%;
    margin: 0 auto;
  }
</style>

<script>
  
export default {
  name: 'RouteFilter',
  data() {
    return {
      selectedRoute: '-',
      routes: [{Key: '-', Value: 'All Routes'}]
    }
  },
  methods: {
    updateFilter(e) {
      this.$emit('selected-route', e.target.value);
    }
  },
  async created() {
    const data = await fetch('https://edinburgh.conorhaining.com/api/routes');
    this.routes = this.routes.concat(await data.json());
  }
};
</script>
