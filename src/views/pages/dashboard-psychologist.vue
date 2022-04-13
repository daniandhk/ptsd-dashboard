<script>
import Layout from "../layouts/main";
import PageHeader from "@/components/page-header";
import Topbar from "@/components/topbar-patient";
import ConfirmEmail from "@/views/pages/auth/confirm-email";
import SetupProfile from "@/views/pages/auth/setup-psychologist";

import store from '@/store';
import { notificationMethods } from "@/state/helpers";

export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
    Topbar,
    ConfirmEmail,
    SetupProfile
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "Psikolog"
        },
        {
          text: "Dashboard",
          active: true
        }
      ],

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
  }
};
</script>

<template>
  <div>
    <div v-if="viewEmail || viewProfile">
      <Topbar />
      <div style="overflow-x: hidden;">
        <ConfirmEmail v-if="viewEmail" />
        <SetupProfile v-if="viewProfile" />
      </div>
    </div>
    <div v-if="!viewEmail && !viewProfile">
      <Layout>
        <PageHeader
          :title="title"
          :items="items"
        />
        <div>
          //
        </div>
      </Layout>
    </div>
  </div>
</template>