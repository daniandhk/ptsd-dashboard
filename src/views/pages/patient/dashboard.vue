<script>
import store from '@/store';
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import PageHeader from "@/components/page-header";
import Topbar from "@/components/topbar-patient";

export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description" }],
  },
  components: {
    PageHeader,
    Topbar
  },
  data() {
    return {
      //
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  beforeMount: function(){
    document.body.setAttribute("data-topbar", "dark");
  },
  methods: {
    ...notificationMethods,

    //
  },
};
</script>

<template>
  <div>
    <Topbar />
    <PageHeader
      :title="title"
      :items="items"
    />
    <div>
      //
    </div>
  </div>
</template>