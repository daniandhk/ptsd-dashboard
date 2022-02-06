<script>
import { notificationMethods } from "@/state/helpers";

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

    onStartButtonClick(){
      this.$router.replace({
          name: 'home'
      });
    },
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
              class="mr-5 ml-5 mt-2 mb-2"
              style="flex-direction: column;"
            >
              <div>
                <div class="text-center">
                  <div class="row justify-content-center">
                    <img
                      src="@/assets/logo-mini.png"
                      height="80"
                      alt="logo"
                    >
                    <div class="ml-3 mt-3 text-left">
                      <h4
                        class="font-size-24"
                        style="margin-bottom:0!important; text-weight: bold;"
                      >
                        Tes Penilaian Diri PTSD
                      </h4>
                      <p
                        class="font-size-20 mt-0"
                        style="font-weight: normal;"
                      >
                        PDS-5
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-2 mt-4">
                  <div>
                    <div
                      class="card h-100"
                      style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
                    >
                      <div
                        class="card-body"
                        style="min-width:260px; max-width:600px"
                      >
                        <div style="color:black;">
                          <p class="mb-4">
                            <b style="font-size:20px">Tes telah berakhir!</b><br>Jawaban Anda berhasil disimpan.
                          </p>
                          <p>
                            <b style="font-size:20px">Tahap selanjutnya adalah verifikasi jawaban dengan psikolog melalui Video Call.</b><br>Jadwal dan tautan / link Video Call akan segera diinformasikan melalui email.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      class="mt-4 text-center form-group"
                    >
                      <button
                        class="btn btn-primary w-md waves-effect waves-light m-1"
                        style="background-color:#005C9A; min-width:100%;"
                        @click="onStartButtonClick()"
                      >
                        Selesai
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>