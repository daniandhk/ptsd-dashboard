<script>
import store from '@/store';
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Topbar from "@/components/topbar-patient";
import ConfirmEmail from "@/views/pages/auth/confirm-email";
import SetupProfile from "@/views/pages/auth/setup-profile";
import MainPage from "./patient/main-page"

export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description" }],
  },
  components: {
    Topbar,
    ConfirmEmail,
    SetupProfile,
    MainPage,
  },
  data() {
    return {
      user: store.getters.getLoggedUser ? store.getters.getLoggedUser : null,
      viewEmail: false,
      viewProfile: false,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  beforeMount: function(){
    document.body.setAttribute("data-topbar", "dark");
    this.checkUser();
  },
  methods: {
    ...notificationMethods,

    checkUser(){
      if(this.user){
        if(this.user.email_verified_at == null){
          this.viewEmail = true
          this.viewProfile = false
        }
        else if(this.user.profile == null){
          this.viewEmail = false
          this.viewProfile = true
        }
        else{
          this.viewEmail = false
          this.viewProfile = false
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <Topbar />
    <div style="overflow-x: hidden;">
      <ConfirmEmail v-if="viewEmail" />
      <SetupProfile v-if="viewProfile" />
      <MainPage v-if="!viewEmail && !viewProfile" />
    </div>
  </div>
</template>