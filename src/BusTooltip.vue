<template>

  <div>
    <div>
      <strong>Service: </strong> {{ name }}
    </div>
    <div>
      <strong>Last Updated: </strong> {{ lastUpdated }}
    </div>
    <div>
      <strong>Vehicle ID: </strong> {{ vehicleId }}
    </div>
    <div>
      <strong>Destination </strong> {{ destination }}
    </div>
  </div>

</template>

<style>

</style>

<script>
  
export default {
  name: 'BusPopover',
  data() {
    return {
      
    }
  },
  props: {
    name: {
      type: String,
      default: 'X'
    },
    lastUpdated: {
      type: String,
      default: 'X'
    },
    vehicleId: {
      type: String,
      default: 'X'
    },
    destination: {
      type: String,
      default: 'X'
    }
  }
};
</script>
