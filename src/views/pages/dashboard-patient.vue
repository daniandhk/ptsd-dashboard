<script>
import store from '@/store';
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Topbar from "@/components/topbar-patient";
import ConfirmEmail from "@/views/pages/auth/confirm-email";
import SetupProfile from "@/views/pages/auth/setup-profile";
import SetupGuardian from "@/views/pages/auth/setup-guardian";
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
    SetupGuardian,
    MainPage,
  },
  data() {
    return {
      user: store.getters.getLoggedUser ? store.getters.getLoggedUser : null,
      viewEmail: false,
      viewProfile: false,
      viewGuardian: false,
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
          this.viewGuardian = false
        }
        else if(this.user.profile == null){
          this.viewEmail = false
          this.viewProfile = true
          this.viewGuardian = false
        }
        else if(this.user.profile.guardian == null){
          this.viewEmail = false
          this.viewProfile = false
          this.viewGuardian = true
        }
        else{
          this.viewEmail = false
          this.viewProfile = false
          this.viewGuardian = false
        }
      }
    },
  },
};
</script>

<template>
  <div style="min-height:100vh">
    <Topbar />
    <div style="overflow-x: hidden;">
      <ConfirmEmail v-if="viewEmail" />
      <SetupProfile v-if="viewProfile" />
      <SetupGuardian v-if="viewGuardian" />
      <MainPage v-if="!viewEmail && !viewProfile && !viewGuardian" />
    </div>
  </div>
</template>