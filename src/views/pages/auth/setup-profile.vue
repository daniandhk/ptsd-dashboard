<script>
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Multiselect from "vue-multiselect";
import regions from './regions.json';
import DatePicker from "vue2-datepicker";
import store from '@/store';

export default {
  components: {
    Multiselect,
    DatePicker,
  },
  data() {
    return {
      user: store.getters.getLoggedUser ? store.getters.getLoggedUser : null,
      regions: regions,
      cities: [],
      data_province: "",

      isProvinceSelected: false,
      submitted: false,
      registerError: null,
      isRegisterError: false,
      profileData: {
          province: "",
          city: "",
          datebirth: "",
          first_name: "",
          last_name: "",
          phone: "",
      },

      croppa: null,
      //
    };
  },
  validations: {
    profileData: {
      province: { required },
      city: { required },
      datebirth: { required },
      first_name: { required },
      last_name: { required },
      phone: { required },
    }
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

    async tryToRegister(){
      loading();
      this.submitted = true;
      this.profileData.province = this.data_province.provinsi;
      // stop here if form is invalid
      this.$v.profileData.$touch();

      if (this.$v.profileData.$invalid) {
        loading();
        return;
      } else {
        this.registerError = null;
        this.profileData.user_id = this.user.id;
        const dataInput = await this.toFormData(this.profileData);
        return (
          api.inputProfilePatient(dataInput)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              loading();
              window.location.reload();
            })
            .catch(error => {
              loading();
              this.registerError = error.response ? error.response.data.message : error;
              this.isRegisterError = true;
            })
        );
      }
    },

    async toFormData(data){
      let formData = new FormData;
      if(this.croppa.hasImage()){
        const blob = await this.croppa.promisedBlob();
        formData.append('avatar', blob);
        formData.append('image_name', this.croppa.getChosenFile().name);
      }
      formData.append('user_id', data.user_id);
      formData.append('province', data.province);
      formData.append('city', data.city);
      formData.append('datebirth', data.datebirth);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('phone', data.phone);
      return formData;
    },

    selectProvince(value){
        this.profileData.city = ""
        this.cities = value.kota
        this.isProvinceSelected = true
    },

    removeProvince(){
        this.profileData.city = ""
        this.cities = []
        this.isProvinceSelected = false
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
  <div>
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
    <div style="min-height: 100%; display: flex;">
      <div
        class="card h-100 m-5"
        style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); border-radius: 18px; display: flex; justify-content: center; align-items: center;"
      >
        <div
          class="card-body"
          style="max-width:548px"
        >
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
                        style="margin-bottom:0!important; text-weight: bold; color:#005C9A;"
                      >
                        Selamat Datang!
                      </h4>
                      <p
                        class="font-size-20 mt-0"
                        style="font-weight: normal;"
                      >
                        Pertama, atur profil Anda.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-2 mt-3">
                  <b-alert
                    v-model="isRegisterError"
                    class="mt-3"
                    variant="danger"
                    dismissible
                  >
                    {{ registerError }}
                  </b-alert>

                  <b-alert
                    v-if="notification.message"
                    variant="danger"
                    class="mt-3"
                    show
                    dismissible
                  >
                    {{ notification.message }}
                  </b-alert>

                  <form
                    class="form-horizontal"
                    style="min-width:260px;"
                    @submit.prevent="tryToRegister"
                  >
                    <div
                      class="col-md-12"
                      style="padding:0!important; margin:0!important"
                    >
                      <div
                        class="form-group text-center col-md-12"
                        style="padding:0!important; padding-left:2px!important; padding-right:2px!important;"
                      >
                        <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
                          <label for="image">Foto Profil</label>
                          <div style="justify-content: center;">
                            <croppa v-model="croppa" />
                          </div>
                          <div
                            v-if="croppa && croppa.hasImage()"
                            class="row col-lg-8"
                            style="justify-content: center;"
                          >
                            <div class="m-1">
                              <b-button
                                variant="outline-secondary"
                                size="sm"
                                style="width:90px"
                                @click="croppa.moveUpwards(10)"
                              >
                                move up
                              </b-button>
                            </div>
                            <div class="m-1">
                              <b-button
                                variant="outline-secondary"
                                size="sm"
                                style="width:90px"
                                @click="croppa.moveDownwards(10)"
                              >
                                move down
                              </b-button>
                            </div>
                            <div class="m-1">
                              <b-button
                                variant="outline-secondary"
                                size="sm"
                                style="width:90px"
                                @click="croppa.moveLeftwards(10)"
                              >
                                move left
                              </b-button>
                            </div>
                            <div class="m-1">
                              <b-button
                                variant="outline-secondary"
                                size="sm"
                                style="width:90px"
                                @click="croppa.moveRightwards(10)"
                              >
                                move right
                              </b-button>
                            </div>
                            <div class="m-1">
                              <b-button
                                variant="outline-secondary"
                                size="sm"
                                style="width:90px"
                                @click="croppa.zoomIn()"
                              >
                                zoom in
                              </b-button>
                            </div>
                            <div class="m-1">
                              <b-button
                                variant="outline-secondary"
                                size="sm"
                                style="width:90px"
                                @click="croppa.zoomOut()"
                              >
                                zoom out
                              </b-button>
                            </div>
                          </div>
                        </div>
                        <hr
                          class="mb-4 mt-4"
                          style="margin-left: -76px;margin-right: -76px;"
                        >
                      </div>
                    </div>
                    <div
                      class="row col-md-12"
                      style="padding:0!important; margin:0!important"
                    >
                      <div
                        class="form-group text-left col-md-6"
                        style="padding:0!important; padding-left:2px!important; padding-right:2px!important;"
                      >
                        <label for="first_name">Nama Depan</label>
                        <input
                          id="first_name"
                          v-model="profileData.first_name"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': submitted && $v.profileData.first_name.$error }"
                        >
                        <div 
                          v-if="submitted && !$v.profileData.first_name.required" 
                          class="invalid-feedback"
                        >
                          Nama Depan harus diisi!
                        </div>
                      </div>

                      <div
                        class="form-group text-left col-md-6"
                        style="padding:0!important; padding-left:2px!important; padding-right:2px!important;"
                      >
                        <label for="last_name">Nama Belakang</label>
                        <input
                          id="last_name"
                          v-model="profileData.last_name"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': submitted && $v.profileData.last_name.$error }"
                        >
                        <div 
                          v-if="submitted && !$v.profileData.last_name.required" 
                          class="invalid-feedback"
                        >
                          Nama Belakang harus diisi!
                        </div>
                      </div>
                    </div>

                    <div
                      class="form-group text-left datepicker-div"
                      style="padding:0!important; padding-left:2px!important; padding-right:2px!important;"
                    >
                      <label for="phone">Tanggal Lahir</label>
                      <date-picker
                        v-model="profileData.datebirth"
                        :first-day-of-week="1" 
                        lang="en"
                        value-type="format"
                        :class="{ 'is-invalid': submitted && $v.profileData.datebirth.$error }"
                      />
                      <div
                        v-if="submitted && !$v.profileData.datebirth.required"
                        class="invalid-feedback"
                      >
                        Tanggal Lahir harus diisi!
                      </div>
                    </div>

                    <div
                      class="form-group mb-3 text-left"
                      style="padding:0!important; padding-left:2px!important; padding-right:2px!important;"
                    >
                      <label for="phone">No. Telepon</label>
                      <input
                        id="phone"
                        v-model="profileData.phone"
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.profileData.phone.$error }"
                      >
                      <div 
                        v-if="submitted && !$v.profileData.phone.required" 
                        class="invalid-feedback"
                      >
                        No. Telepon harus diisi!
                      </div>
                    </div>

                    <div
                      class="row col-md-12"
                      style="padding:0!important; margin:0!important"
                    >
                      <div
                        class="form-group text-left col-md-6"
                        style="padding:0!important; padding-left:2px!important; padding-right:2px!important;"
                      >
                        <label for="instansi">Provinsi</label>
                        <multiselect
                          v-model="data_province"
                          :options="regions"
                          label="provinsi"
                          track-by="provinsi"
                          :show-labels="false"
                          :class="{ 'is-invalid': submitted && $v.profileData.province.$error }"
                          @select="selectProvince"
                          @remove="removeProvince"
                        />
                        <div
                          v-if="submitted && !$v.profileData.province.required"
                          class="invalid-feedback"
                        >
                          Provinsi harus dipilih!
                        </div>
                      </div>

                      <div
                        class="form-group text-left col-md-6"
                        style="padding:0!important; padding-left:2px!important; padding-right:2px!important;"
                      >
                        <label for="instansi">Kota</label>
                        <multiselect
                          v-model="profileData.city"
                          :disabled="!isProvinceSelected"
                          :options="cities"
                          :show-labels="false"
                          :class="{ 'is-invalid': submitted && $v.profileData.city.$error }"
                        />
                        <div
                          v-if="submitted && !$v.profileData.city.required"
                          class="invalid-feedback"
                        >
                          Kota harus dipilih!
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 text-center">
                      <button
                        class="btn btn-primary w-md waves-effect waves-light"
                        style="width:100%; background-color:#005C9A;"
                        type="submit"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .datepicker-div >>> input {
    height:38.64px;
  }
</style>