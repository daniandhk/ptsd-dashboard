<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';

export default {
  components: {
    //
  },
  data() {
    return {
        isResendSuccess: false,
        isConfirmFailed: false,
        isResendDisabled: false,
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

    onLogoutButtonClick(){
      this.$router.push({name: 'logout'});
    },

    onConfirmButtonClick(){
      loading();
      api.validateUser()
            // eslint-disable-next-line no-unused-vars
        .then(response => {
          if(response.data){
            if(response.data.email_verified_at != null){
              this.isConfirmFailed = false;
              window.location.reload();
            }
            else{
              this.isConfirmFailed = true;
            }
          }
          loading();
        })
        .catch(error => {
          loading();
          console.log(error)
        })
    },

    onResendButtonClick(){
      loading();
      api.resend()
            // eslint-disable-next-line no-unused-vars
        .then(response => {
          loading();
          this.isResendSuccess = true;
          this.isResendDisabled = true;
        })
        .catch(error => {
          loading();
          console.log(error)
        })
    }
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
    class="mt-5"
    style="display: flex; align-items: center; justify-content: center; height: 100%; overflow: hidden; overflow-x: hidden;"
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
      style="min-height: 100%; display: flex;"
    >
      <div
        class="card h-100 m-5"
        style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); border-radius: 30px; display: flex; justify-content: center; align-items: center;"
      >
        <div class="card-body">
          <div class="text-center form-group mb-0">
            <div
              class="mr-5 ml-5 mt-2 mb-3"
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
                Terima kasih telah mendaftarkan akun! Silahkan cek email Anda untuk verifikasi.
              </p>

              <b-alert
                v-model="isResendSuccess"
                class="mt-3"
                variant="success"
              >
                Verifikasi telah dikirim kembali ke email Anda!
              </b-alert>

              <b-alert
                v-if="isConfirmFailed"
                variant="danger"
                class="mt-3"
                show
                dismissible
              >
                Email belum diverifikasi! Harap cek kembali email Anda.
              </b-alert>

              <div class="mt-2">
                <button 
                  type="button"
                  class="btn btn-secondary m-1" 
                  style="min-width: 250px;"
                  :disabled="isResendDisabled"
                  @click="onResendButtonClick()"
                >
                  Kirim Ulang Email
                </button>
                <button 
                  type="button"
                  class="btn btn-primary m-1" 
                  style="min-width: 250px; background-color:#005C9A;"
                  @click="onConfirmButtonClick()"
                >
                  Konfirmasi
                </button>
              </div>
              <!-- <div class="mt-3 text-center">
                <p>Atau</p>
              </div>
              <button 
                type="button"
                class="btn btn-danger m-1" 
                style="min-width: 250px;"
                @click="onLogoutButtonClick()"
              >
                Log Out
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>