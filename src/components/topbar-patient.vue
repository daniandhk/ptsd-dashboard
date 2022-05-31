<script>
import store from '@/store';

export default {
  components: {  },
  data() {
    return {
      user: store.getters.getLoggedUser ? store.getters.getLoggedUser : null,
    };
  },
  methods: {
    //
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
      </div>

      <div class="d-flex">
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
            >halo, {{ user.profile ? (user.profile.first_name ? user.profile.first_name : user.profile.full_name) : user.email }}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </template>
          <!-- item-->
          <a class="dropdown-item">
            <i class="ri-user-line align-middle mr-1" />
            {{ user.email }}
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