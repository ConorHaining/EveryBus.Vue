<template>
  <div id="wrapper">
    <header>
      <h1>Every Bus in Edinburgh</h1>
    </header>
    <route-filter v-on:selected-route="filterRoute"></route-filter>
    <bus-map :route-filter="selectedRoute"></bus-map> 
  </div>
</template>

<style>
  #wrapper {
    width: 100%;
    height: 100%;
  }
  header {
    position: absolute;
    padding: 20px 10px;
    background: #32a852;
    z-index: 999;
    color: white;
    left: 50%;
    transform: translate(-50%, 0%);
    box-shadow: 3px 3px 0px #2b8a44;
    min-width: 320px;
    padding: 10px;
    font-size: 1em;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
  }
  header h1{
    margin: 5px 0;
  }
  .leaflet-div-icon{
    border: 0;
    background: none;
  }
</style>

<script>
  import Vue from 'vue'
  import BusMap from './BusMap.vue';
  import RouteFilter from './RouteFilter.vue';

  export default {
    name: "App",
    components: {
      BusMap,
      RouteFilter
    },
    data() {
      return {
        routes: ['-'],
        selectedRoute: null
      }
    },
    methods: {
      filterRoute(e) {
        this.selectedRoute = e;
      }
    }
  };
</script>
