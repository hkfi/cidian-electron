import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserSecret,
  faSearch,
  faHome,
  faBookmark,
  faLanguage,
  faPlus,
  faMinus,
  faCheck,
  faAngleDoubleDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faUserSecret,
  faSearch,
  faHome,
  faBookmark,
  faLanguage,
  faPlus,
  faMinus,
  faCheck,
  faAngleDoubleDown
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
