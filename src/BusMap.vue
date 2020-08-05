<template>
  
  <div id="rootmap"></div>  

</template>

<style>
  #rootmap {
    width: 100%;
    height: 100%;
  }
  .leaflet-div-icon{
    border: 0;
    background: none;
  }
</style>

<script>
  import Vue from 'vue'
  import L from 'leaflet';
  import 'leaflet-realtime';
  import BusIcon from './BusIcon.vue';
  import BusTooltip from './BusTooltip.vue';
  import * as signalR from '@microsoft/signalr';

  export default {
    name: "BusMap",
    components: {
      BusIcon
    },
    data() {
      return {
        _map: null,
        _realtime: null,
        _signalR: null,
        dataUrl: 'https://edinburgh.conorhaining.com/api/locations',
        wsUrl: 'https://edinburgh.conorhaining.com/busHub'
      }
    },
    props: {
      routeFilter: {
        type: String,
        default: null
      }
    },
    watch: { 
      routeFilter: {
        handler: function(newVal, oldVal) {
          this._map.eachLayer((layer) => {
            if (layer.setOpacity && layer._tooltip) {
              if (newVal != '-' && layer.feature && layer.feature.properties.name != newVal) {
                layer.setOpacity(0);
                layer._tooltip.setOpacity(0);
              } else {
                layer.setOpacity(1);
                layer._tooltip.setOpacity(1);
              }
            }
          });
        }
      }
    },
    methods: {
      createMap() {
        const accessToken = 'pk.eyJ1IjoiY29uaGFpbmluZyIsImEiOiJjazhxYWw0ZHUwMWl6M2Rtc3Vsdjdrd2IwIn0.AbAYktumGW-KIdsFLwpjdg';
        const styleId = 'conhaining/ck7p9dybm05up1io58zj7u77f';

        this._map = L.map(this.$el, {
              center: [55.949680, -3.204165],
              zoom: 14,
              fadeAnimation: true,
              zoomAnimation: true 
          });

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: styleId,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: accessToken
        }).addTo(this._map);
        
        this._map.locate({setView: true, maxZoom: 16});
        this._map.on('locationfound', this.onLocationFound);
      },
      setupRealtime() {
        this._realtime = L.realtime({
          url: this.dataUrl,
          crossOrigin: true,
          type: 'json'
        }, {
            start: false,
            interval: 60 * 1000,
            getFeatureId: function(featureData){
                return featureData.properties.vehicleId;
            },
            filter: (point) => {
              if (this.routeFilter) { 
                return point.properties.name == this.routeFilter;
              } 
              return true; 
            },
            pointToLayer: (point, latlng) => this.makeBusPoint(point, latlng),
            onEachFeature: (point, layer) => this.createTooltip(point, layer)
        }).addTo(this._map);
      },
      async initialLoad() {
        const firstLoad = await fetch(this.dataUrl).then((res) => res.json());
        this._realtime.update(firstLoad);  
      },
      makeBusPoint(point, latlng) {
        const busIcon = Vue.extend(BusIcon);
        const iconTemplate = new busIcon({
          propsData: {
            textColour: point.properties.text_colour,
            colour: point.properties.colour,
            heading: point.properties.heading
          }
        });
        iconTemplate.$slots.default = [ point.properties.name ];
        iconTemplate.$mount();
        
        const html = iconTemplate.$el.innerHTML;
        
        const icon =  L.divIcon({
            html: html
        });
        return L.marker(latlng, {icon: icon});
      },
      createTooltip(point, layer) {
        const busTooltip = Vue.extend(BusTooltip);
        const iconTemplate = new busTooltip({
          propsData: {
            name: point.properties.name,            
            lastUpdated: point.properties.last_update,            
            vehicleId: point.properties.vehicleId,            
            destination: point.properties.destination
          }
        });
        iconTemplate.$mount();
        
        const html = iconTemplate.$el.innerHTML;
        
        return layer.bindTooltip(html);
      },
      onLocationFound(e) {
        const radius = 5;

        L.circle(e.latlng, radius).addTo(this._map);
      }
    },
    async mounted () {
      this.createMap();

      this.setupRealtime();
      await this.initialLoad();
      
      this._signalR = new signalR.HubConnectionBuilder().withUrl(this.wsUrl).build();
      await this._signalR.start();
      
      this._signalR.on("ReceiveMessage", (message) => {
          message = JSON.parse(message);
          this._realtime.update(message);
      });
      
      this._realtime.on('update', (e) => {
        Object.keys(e.update).forEach((id) => {
            const point = e.update[id];
            const layer = this._realtime.getLayer(id);
            this.createTooltip(point, layer);
        });
    });
    }
  };
</script>
