import Vue from 'vue'
import App from './App.vue'
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import 'leaflet/dist/leaflet.css';

import BusIcon from './BusIcon.vue';
Vue.component('bus-icon', BusIcon);


new Vue({
  el: '#app',
  render: h => h(App)
})

Sentry.init({
  dsn: 'https://d26eb17a90ee4de8a19e666ebb7a39a1@o422150.ingest.sentry.io/5345475',
  beforeSend(event, hint) {
    // Check if it is an exception, and if so, show the report dialog
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },
  integrations: [new VueIntegration({Vue, attachProps: true})],
});
