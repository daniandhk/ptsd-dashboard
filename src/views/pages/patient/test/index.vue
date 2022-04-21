<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import TestPDS5 from "../../patient/pds5/tests-page";

export default {
  components: {
    TestPDS5
  },
  data() {
    return {
        test_type: this.$route.params.test_type,
        test: "",
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
  mounted() {
      this.checkAuth();
  },
  methods: {
    ...notificationMethods,

    getRequestParams(test_type) {
      let params = {};

      if (test_type) {
        params["test_type"] = test_type;
      }

      return params;
    },

    checkAuth(){
        loading();
        const params = this.getRequestParams(
            this.test_type,
        );
        return api.getTestTypes(params)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
                if(response.data.data.length > 0){
                    this.test = response.data.data[0]
                }
                else{
                    this.$router.replace({
                        name: 'error-404'
                    });
                }
                loading();
            })
            .catch(error => {
                loading();
                this.$router.replace({
                    name: 'error-404'
                });
            })
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
      class="row"
      style="min-height: 100vh; display: flex; flex-direction: column; background-color: #005C9A;"
    >
      <div
        class="card h-100 m-5"
        style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); border-radius: 30px; display: flex; justify-content: center; align-items: center;"
      >
        <div class="card-body">
          //
        </div>
      </div>
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
                        {{ test.name }}
                      </p>
                    </div>
                  </div>
                </div>
                <TestPDS5 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>