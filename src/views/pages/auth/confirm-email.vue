<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';

export default {
  components: {
    //
  },
  data() {
    return {
        //
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  methods: {
    ...notificationMethods,

    //
  }
};
function loading() {
  var x = document.getElementById("loading");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
</script>

<template>
  <div
    style="background-color: #005C9A; display: flex; align-items: center; justify-content: center; height: 100%; overflow: hidden; overflow-x: hidden;"
  >
    <div
      id="loading"
      style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
      <b-spinner
        style="width: 3rem; height: 3rem;"
        class="m-2"
        variant="warning"
        role="status"
      />
    </div>
    <div
      style="min-height: 100vh; display: flex; background-color: #005C9A;"
    >
      <div
        class="card h-100 m-5"
        style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); border-radius: 30px; display: flex; justify-content: center; align-items: center;"
      >
        <div class="card-body">
          <div class="text-center form-group mb-0">
            <div
              class="mr-5 ml-5 mt-2 mb-2 pr-5 pl-5"
              style="flex-direction: column;"
            >
              <p
                style="color:#005C9A; font-size:24px; text-align:center; font-weight: bold; margin-bottom:0!important"
              >
                Harap verifikasi email Anda!
              </p>
              <p
                style="font-size:16px; text-align:center; margin-top:0!important"
              >
                Terima kasih telah mendaftarkan akun! Harap cek email Anda untuk verifikasi.
              </p>
              <div class="mt-2">
                <button 
                  type="button"
                  class="btn btn-secondary m-1" 
                  style="min-width: 200px;" 
                >
                  Kirim Ulang Email
                </button>
                <button 
                  type="button"
                  class="btn btn-primary m-1" 
                  style="min-width: 200px; background-color:#005C9A;" 
                >
                  Konfirmasi
                </button>
              </div>
              <div class="mt-3 text-center">
                <p>Atau</p>
              </div>
              <button 
                type="button"
                class="btn btn-danger m-1" 
                style="min-width: 150px;" 
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>