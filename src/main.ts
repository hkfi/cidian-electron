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
  faBookOpen,
  faLanguage,
  faPlus,
  faMinus,
  faCheck,
  faAngleDoubleDown,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faUserSecret,
  faSearch,
  faHome,
  faBookmark,
  faBookOpen,
  faLanguage,
  faPlus,
  faMinus,
  faCheck,
  faAngleDoubleDown,
  faChevronLeft,
  faChevronRight
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
