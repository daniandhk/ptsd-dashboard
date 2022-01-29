<script>
import simplebar from "simplebar-vue";
import i18n from "../i18n";
import store from '@/store';

export default {
  components: {  },
  data() {
    return {
      current_language: "en",
      // getRole: store.getters.getRoleUser,
      // user: store.getters.getLoggedUser
      user: {
        first_name: "First",
        last_name: "Last"
      }
    };
  },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    // setLanguage(locale) {
    //   i18n.locale = locale;
    //   this.current_language = i18n.locale;
    // },
  }
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <a
            href="/"
            class="logo logo-dark"
          >
            <span class="logo-sm">
              <img
                src="@/assets/logo-mini.png"
                alt
                height="40"
              >
            </span>
            <span class="logo-lg">
              <img
                src="@/assets/logo-full.png"
                alt
                height="40"
              >
            </span>
          </a>

          <a
            href="/"
            class="logo logo-light"
          >
            <span class="logo-sm">
              <img
                src="@/assets/logo-mini.png"
                alt
                height="40"
              >
            </span>
            <span class="logo-lg">
              <img
                src="@/assets/logo-full.png"
                alt
                height="40"
              >
            </span>
          </a>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-24 header-item waves-effect"
          @click="toggleMenu"
        >
          <i class="ri-menu-2-line align-middle" />
        </button>
      </div>

      <div class="d-flex">
        <!-- <div class="dropdown d-none d-lg-inline-block ml-1">
          <button
            type="button"
            class="btn header-item noti-icon waves-effect"
            @click="initFullScreen"
          >
            <i class="ri-fullscreen-line"></i>
          </button>
        </div> -->

        <b-dropdown
          right
          variant="black"
          toggle-class="header-item"
          class="d-inline-block user-dropdown"
        >
          <template v-slot:button-content>
            <img
              class="rounded-circle header-profile-user"
              src="@/assets/images/users/default_profile.jpg"
              alt="Header Avatar"
            >
            <span
              class="d-none d-xl-inline-block ml-2 mr-2"
              style="font-size:16px"
            >halo, {{ user.first_name }}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </template>
          <!-- item-->
          <a class="dropdown-item">
            <i class="ri-user-line align-middle mr-1" />
            {{ user.first_name + " " + user.last_name }}
          </a>
          <a
            class="dropdown-item d-block"
            href="/settings/change-password"
          >
            <i class="ri-settings-2-line align-middle mr-1" />
            Pengaturan
          </a>
          <div class="dropdown-divider" />
          <a
            class="dropdown-item text-danger"
            href="/logout"
          >
            <i class="ri-shut-down-line align-middle mr-1 text-danger" />
            Logout
          </a>
        </b-dropdown>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.notify-item {
  .active {
    color: #16181b;
    background-color: #f8f9fa;
  }
}
</style>