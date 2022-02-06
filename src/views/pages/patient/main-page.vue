<script>
import store from '@/store';
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import moment from 'moment';
import Swal from "sweetalert2";

export default {
  components: {
    //
  },
  data() {
    return {
      user: store.getters.getLoggedUser ? store.getters.getLoggedUser : null,
      dashboard: {
          test: {
              created_at: ""
          },
          journal: null,
          psychologists: [],
          consult: null,
      },

      isTestSubmitted: false,
      isTestNull: true,
      isScheduleNull: true,
      isTestFinished: false,
      isLoading: false,
      isScheduleToday: false,

      haveRelation: false,

      haveConsult: false,
      isConsultToday: false,
      isLinkNull: true,

      dataProfile: null,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  beforeMount: async function(){
    this.isLoading = true;
    await this.getDashboard();
    this.isLoading = false;
  },
  methods: {
    ...notificationMethods,

    async getDashboard(){
        return (
          api.getDashboard(this.user.id)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
                if(response.data.data.data){
                    this.dashboard = response.data.data.data;
                    this.setDashboard();
                }
            })
            .catch(error => {
              loading();
              console.log(error);
            })
        );
    },

    setDashboard(){
        if(this.dashboard){
            if(this.dashboard.test == null){
                this.isTestSubmitted = false;
                this.isTestNull = true;
            }
            else{
                this.isTestNull = false;
                if(this.dashboard.test.is_finished){
                    this.isTestFinished = true;
                }
                else{
                    this.isTestFinished = false;
                }
                if(this.dashboard.test.videocall_date && this.dashboard.test.videocall_link){
                    this.isScheduleNull = false;
                }
                else{
                    this.isScheduleNull = true;
                }

                let next_date = this.dashboard.test.next_date
                if(moment().format('L') < moment(next_date).format('L')){
                    this.isTestSubmitted = true;
                }
                else{
                    this.isTestSubmitted = false;
                }

                if(this.dashboard.test.videocall_date){
                  moment(this.formatDate(moment(), 'tanggal'))
                    .isSameOrAfter(this.formatDate(this.dashboard.test.videocall_date, 'tanggal')) 
                    ? this.isScheduleToday = true : this.isScheduleToday = false
                }
                else{
                  this.isScheduleToday = false;
                }
            }

            if(this.dashboard.have_relation){
              this.haveRelation = true;
            }
            else{
              this.haveRelation = false;
            }

            if(this.dashboard.consult){
              this.haveConsult = true;
              let today = this.formatDate(moment(), 'tanggal')
              let hari = this.formatDate(this.dashboard.consult.next_date, 'tanggal')
              if(moment(today).isSameOrAfter(hari)){
                this.isConsultToday = true;
              }
              else{
                this.isConsultToday = false;
              }

              if(this.dashboard.consult.consult_info.videocall_link){
                this.isLinkNull = false;
              }
              else{
                this.isLinkNull = true;
              }
            }
            else{
              this.haveConsult = false;
            }
        }
    },

    onPDS5AnswerButtonClick(){
        let id = this.dashboard.test.id
        this.$router.push({
          name: 'pds5-answer', 
          params: { test_id: id }
      });
    },

    onPDS5TestButtonClick(){
      this.$router.push({
          name: 'pds5-landing'
      });
    },

    onProfileButtonClick(data){
      this.dataProfile = data
      this.$bvModal.show('modal-profile');
    },

    onGoToLinkButtonClick(link){
      if(link == 'chat'){
        window.open("http://help-ptsd-chat.herokuapp.com/");
      }
      else{
        window.open(link);
      }
    },

    onPilihButtonClick(data){
      Swal.fire({
          title: "Ingin berkonsultasi dengan " + data.first_name + " " + data.last_name + " " + data.degree + "?",
          text: "Anda dapat mengakhiri chat di menu chat.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#005C9A",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, lanjutkan!"
      }).then(result => {
          if (result.value) {
              let relation = {
                psychologist_id: data.id,
                psychologist_user_id: data.user_id,
                patient_id: this.user.id,
                patient_user_id: this.user.user_id,
                status_test: 'none',
                status_chat: true
              }
              api.createRelation(relation)
              // eslint-disable-next-line no-unused-vars
              .then(response => {
                  window.open("http://help-ptsd-chat.herokuapp.com/");
              })
              .catch(error => {
                console.log(error);
              })
          }
      });
    },

    isOnline(data){
      if(data.chat_schedule.length != 0){
        let today = this.formatDate(moment(), 'hari')
        data.chat_schedule.forEach((element, index, array) => {
            let hari = this.formatDate(element.day, 'hari')
            if(moment(today).isSame(hari)){
              return true;
            }
        });
        return false;
      }
      else{
        return false;
      }
    },

    getDate(data){
      if(data.chat_schedule.length != 0){
        let today = this.formatDate(moment(), 'hari')
        data.chat_schedule.forEach((element, index, array) => {
            let hari = this.formatDate(element.day, 'hari')
            if(moment(today).isBefore(hari)){
              return element;
            }
        });
        return null;
      }
      else{
        return null;
      }
    },

    onJournalButtonClick(){
      this.$router.push({
          name: 'journal'
      });
    },

    formatDate(date, format){
      if(format == 'tanggal'){
        return moment(date).locale('id').format('DD MMMM YYYY')
      }
      if(format == 'lengkap'){
        return moment(date).locale('id').format('LLLL')
      }
      if(format == 'hari'){
        return moment(date).locale('id').format('dddd')
      }
        
    }

    //
  },
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
  <div class="pt-5">
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

    <div class="m-5">
      <div class="row">
        <!-- 1 -->
        <div class="col-sm-4 pt-1 pb-1">
          <div
            class="card"
            style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
          >
            <div class="card-body mt-2 ml-2 mr-2">
              <div class="text-center form-group mb-0">
                <div>
                  <i
                    style="font-size:50px; color:#005C9A;"
                    class="mdi mdi-file-document-edit-outline"
                  />
                  <h5
                    class="text-center font-size-15 text-uppercase"
                    style="color:#005C9A;"
                  >
                    Tes Penilaian Diri PTSD
                  </h5>
                  <hr
                    style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 4px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                  >
                  <div
                    v-if="!isLoading"
                    style="color:black;"
                  >
                    <p
                      class="text-center mt-0"
                      style="font-weight:bold;"
                    >
                      Tes PDS-5
                    </p>
                    <div>
                      Tes terakhir dilakukan
                      <div v-if="isTestNull">
                        -
                      </div>
                      <div v-if="!isTestNull">
                        <div
                          class="card h-100 mt-2"
                          style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
                        >
                          <div
                            class="card-body"
                            style="padding:12px!important"
                          >
                            <div
                              class="row"
                              style="display: flex; align-items: center; justify-content: center;"
                            >
                              <div style="width: 50%; font-weight:bold;">
                                {{ formatDate(dashboard.test.created_at, 'tanggal') }}
                              </div>
                              <button 
                                type="button"
                                class="btn btn-secondary m-1 btn-sm"
                                @click="onPDS5AnswerButtonClick()"
                              >
                                Lihat Jawaban
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr
                      style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 2px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                    >
                    <div>
                      <div v-if="isTestSubmitted && !isTestFinished">
                        <div class="mt-4 mb-2">
                          Verifikasi jawaban via Video Call
                        </div>
                        <div v-if="isScheduleNull">
                          <div style="font-weight:bold;">
                            Harap tunggu informasi Jadwal dan tautan / link Video Call untuk verifikasi jawaban tes dengan psikolog.
                          </div>
                        </div>
                        <div v-if="!isScheduleNull">
                          <div
                            class="row mt-3"
                            style="display: flex; justify-content: center;"
                          >
                            <div style="width:50%;">
                              <div class="mb-2">
                                Jadwal
                              </div>
                              <div style="font-weight:bold;">
                                {{ formatDate(dashboard.test.videocall_date, 'lengkap') }}
                              </div>
                            </div>
                            <div style="width:50%;">
                              <div>
                                Tautan / Link
                              </div>
                              <div>
                                <button 
                                  type="button"
                                  class="btn btn-primary m-1 btn-sm mr-2"
                                  style="background-color:#005C9A; min-width:80%;"
                                  :disabled="!isScheduleToday"
                                  @click.stop.prevent="onGoToLinkButtonClick(dashboard.test.videocall_link)"
                                >
                                  Video Call
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="mt-5">
                            Profil psikolog
                          </div>
                          <div
                            class="card h-100 mt-2"
                            style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); cursor: pointer;"
                            @click="onProfileButtonClick(dashboard.psychologists[0])"
                          >
                            <div
                              class="card-body"
                              style="padding:12px!important"
                            >
                              <div
                                class="row"
                                style="display: flex; align-items: center; justify-content: center;"
                              >
                                <img
                                  class="rounded-circle header-profile-user ml-2"
                                  src="@/assets/images/users/default_profile.jpg"
                                  alt="Header Avatar"
                                >
                                <div class="column text-left mr-5 ml-3">
                                  <div style="font-weight:bold;">
                                    {{ dashboard.psychologists[0].first_name + " " + dashboard.psychologists[0].last_name + " " + dashboard.psychologists[0].degree }}
                                  </div>
                                  <div class="font-size-12">
                                    {{ dashboard.psychologists[0].str_number ? dashboard.psychologists[0].str_number : "No. STR" }}
                                  </div>
                                </div>
                                <button 
                                  type="button"
                                  class="btn btn-light m-1 btn-sm mr-2"
                                  style="background-color:#2A82BD; min-width:20%; color:white;"
                                  @click.stop.prevent="onGoToLinkButtonClick('chat')"
                                >
                                  Chat
                                </button>
                              </div>
                            </div>
                          </div>
                          <hr
                            style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 2px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                          >
                          <div
                            class="font-size-12"
                            style="color:grey;"
                          >
                            Ubah jadwal? Silahkan kirim pesan ke psikolog!
                          </div>
                        </div>
                      </div>
                      <div v-if="!isTestSubmitted && (!isTestFinished || isTestFinished)">
                        Tes berikutnya
                        <button 
                          type="button"
                          class="btn btn-success m-1"
                          style="width:100%;"
                          @click="onPDS5TestButtonClick()"
                        >
                          Mulai Tes
                        </button>
                      </div>
                      <div v-if="isTestSubmitted && isTestFinished">
                        Tes berikutnya
                        <div
                          class="mt-2"
                          style="text-weight:bold;"
                        >
                          {{ formatDate(dashboard.test.next_date, 'tanggal') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2 -->
        <div class="col-sm-4 pt-1 pb-1">
          <div
            class="card"
            style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
          >
            <div class="card-body mt-2 ml-2 mr-2">
              <div class="text-center form-group mb-0">
                <div>
                  <i
                    style="font-size:50px; color:#005C9A;"
                    class=" mdi mdi-stethoscope"
                  />
                  <h5
                    class="text-center font-size-15 text-uppercase"
                    style="color:#005C9A;"
                  >
                    Konsultasi dengan Psikolog
                  </h5>
                  <hr
                    style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 4px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                  >
                  <div
                    v-if="!isLoading"
                    style="color:black;"
                  >
                    <div v-if="haveRelation">
                      <div v-if="haveConsult">
                        <div v-if="isConsultToday">
                          <div
                            class="row mt-3"
                            style="display: flex; justify-content: center;"
                          >
                            <div style="width:50%;">
                              <div class="mb-2">
                                Konsultasi ke-{{ dashboard.consult.consult_index }}
                              </div>
                              <div style="font-weight:bold;">
                                {{ formatDate(dashboard.consult.consult_info.videocall_date, 'lengkap') }}
                              </div>
                            </div>
                            <div style="width:50%;">
                              <div>
                                Tautan / Link
                              </div>
                              <div>
                                <button 
                                  type="button"
                                  class="btn btn-primary m-1 btn-sm mr-2"
                                  style="background-color:#005C9A; min-width:80%;"
                                  :disabled="!isConsultToday || isLinkNull"
                                  @click.stop.prevent="onGoToLinkButtonClick(dashboard.consult.consult_info.videocall_link)"
                                >
                                  Video Call
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="!isConsultToday">
                          <div
                            class="row mt-3"
                            style="display: flex; justify-content: center;"
                          >
                            <div style="width:50%;">
                              <div class="mb-2">
                                Konsultasi terakhir
                              </div>
                              <div>
                                {{ formatDate(dashboard.consult.last_date, 'tanggal') }}
                              </div>
                            </div>
                            <div style="width:50%;">
                              <div class="mb-2">
                                Konsultasi ke-{{ dashboard.consult.consult_index }}
                              </div>
                              <div style="font-weight:bold;">
                                {{ formatDate(dashboard.consult.next_date, 'lengkap') }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          v-if="haveConsult"
                          class="text-center mt-5"
                        >
                          Profil psikolog
                        </div>
                        <div
                          v-if="!haveConsult"
                          class="text-center mt-0"
                        >
                          Profil psikolog
                        </div>
                        <div
                          class="card h-100 mt-2"
                          style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); cursor: pointer;"
                          @click="onProfileButtonClick(dashboard.psychologists[0])"
                        >
                          <div
                            class="card-body"
                            style="padding:12px!important"
                          >
                            <div
                              class="row"
                              style="display: flex; align-items: center; justify-content: center;"
                            >
                              <img
                                class="rounded-circle header-profile-user ml-2"
                                src="@/assets/images/users/default_profile.jpg"
                                alt="Header Avatar"
                              >
                              <div class="column text-left mr-5 ml-3">
                                <div style="font-weight:bold;">
                                  {{ dashboard.psychologists[0].first_name + " " + dashboard.psychologists[0].last_name + " " + dashboard.psychologists[0].degree }}
                                </div>
                                <div class="font-size-12">
                                  {{ dashboard.psychologists[0].str_number ? dashboard.psychologists[0].str_number : "No. STR" }}
                                </div>
                              </div>
                              <button 
                                type="button"
                                class="btn btn-light m-1 btn-sm mr-2"
                                style="background-color:#2A82BD; min-width:20%; color:white;"
                                @click.stop.prevent="onGoToLinkButtonClick('chat')"
                              >
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                        <hr
                          style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 2px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                        >
                        <div
                          v-if="haveConsult"
                          class="font-size-12"
                          style="color:grey;"
                        >
                          Ubah jadwal? Silahkan kirim pesan ke psikolog!
                        </div>
                        <div
                          v-if="!haveConsult"
                          class="font-size-12"
                          style="color:grey;"
                        >
                          Butuh Video Call? Silahkan kirim pesan ke psikolog!
                        </div>
                      </div>
                    </div>
                    <div v-if="!haveRelation">
                      <div>
                        <div
                          class="text-center mt-0"
                          style="font-weight:bold;"
                        >
                          Pilih psikolog
                        </div>
                        <div
                          v-for="(psychologist, index) in dashboard.psychologists"
                          :key="index"
                        >
                          <div
                            class="card h-100 mt-2"
                            style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); cursor: pointer;"
                            @click="onProfileButtonClick(psychologist)"
                          >
                            <div
                              class="card-body"
                              style="padding:12px!important"
                            >
                              <div
                                class="row"
                                style="display: flex; align-items: center; justify-content: center;"
                              >
                                <img
                                  class="rounded-circle header-profile-user ml-2"
                                  src="@/assets/images/users/default_profile.jpg"
                                  alt="Header Avatar"
                                >
                                <div class="column text-left mr-5 ml-3">
                                  <div style="font-weight:bold;">
                                    {{ psychologist.first_name + " " + psychologist.last_name + " " + psychologist.degree }}
                                  </div>
                                  <div class="font-size-12">
                                    {{ psychologist.str_number ? psychologist.str_number : "No. STR" }}
                                  </div>
                                </div>
                                <div v-if="isOnline(psychologist)">
                                  <button 
                                    type="button"
                                    class="btn btn-primary m-1 btn-sm mr-2"
                                    style="min-width:20%;"
                                    @click.stop.prevent="onPilihButtonClick(psychologist)"
                                  >
                                    Pilih
                                  </button>
                                </div>
                                <div v-if="!isOnline(psychologist)">
                                  <button 
                                    type="button"
                                    class="btn btn-secondary m-1 btn-sm mr-2"
                                    style="min-width:20%;"
                                    :disabled="true"
                                  >
                                    Offline
                                  </button>
                                </div>
                              </div>
                              <div v-if="!isOnline(psychologist)">
                                <hr
                                  style="margin-left: -12px; 
                                            margin-right: -12px; 
                                            height: 2px; 
                                            background-color: #eee; 
                                            border: 0 none; 
                                            color: #eee;"
                                >
                                <div class="font-size-12">
                                  Online berikutnya: {{ getDate(psychologist) ? getDate(psychologist).day + ", " + getDate(psychologist).time_start + "-" + getDate(psychologist).time_end : "Senin, 08:00-09:00" }}
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
            </div>
          </div>
        </div>

        <!-- 3 -->
        <div class="col-sm-4 pt-1 pb-1">
          <div
            class="card"
            style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
          >
            <div class="card-body mt-2 ml-2 mr-2">
              <div class="text-center form-group mb-0">
                <div>
                  <i
                    style="font-size:50px; color:#005C9A;"
                    class="mdi mdi-calendar-heart"
                  />
                  <h5
                    class="text-center font-size-15 text-uppercase"
                    style="color:#005C9A;"
                  >
                    Jurnal dan Catatan Psikolog
                  </h5>
                  <hr
                    style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 4px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                  >
                  <div
                    v-if="!isLoading"
                    style="color:black;"
                  >
                    <div
                      class="row mt-3"
                      style="display: flex; justify-content: center;"
                    >
                      <div style="width:50%;">
                        <div class="mb-2">
                          Jurnal hari ini
                        </div>
                        <div style="font-style:italic; color:grey;">
                          " {{ dashboard.journal ? dashboard.journal.text.substring(0,80) + " ..." : "-" }} "
                        </div>
                      </div>
                      <div style="width:50%;">
                        <div class="mb-2">
                          Catatan psikolog
                        </div>
                        <div style="font-weight:bold; font-size:35px;">
                          {{ dashboard.consult ? dashboard.consult.note_question.length : "-" }}
                        </div>
                        <div
                          class="mt-2"
                          style="color:grey;"
                        >
                          kegiatan per hari
                        </div>
                      </div>
                    </div>
                    <hr
                      style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 2px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                    >
                    <button 
                      type="button"
                      class="btn btn-primary p-1 btn-sm"
                      style="background-color:#005C9A; min-width:100%;"
                      @click="onJournalButtonClick()"
                    >
                      Jurnal dan Catatan Psikolog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div name="modalProfile">
      <b-modal 
        id="modal-profile" 
        size="md" 
        title="Profil Psikolog" 
        hide-footer 
        title-class="font-18"
      >
        <template v-slot:title>
          <a class="font-weight-bold active">Profil Psikolog</a>
        </template>
        <template>
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <img
              class="rounded-circle"
              src="@/assets/images/users/default_profile.jpg"
              alt="Header Avatar"
              width="120"
              height="120"
            >
            <div>
              <div class="row mt-5">
                <div class="column">
                  <p>Nama</p>
                  <p>Pengalaman</p>
                  <p>Tempat Praktik</p>
                  <p>Nomor STR</p>
                </div>
                <div class="column mr-2 ml-2">
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                </div>
                <div
                  class="column"
                  style="color:black;"
                >
                  <p>{{ dataProfile ? dataProfile.first_name + " " + dataProfile.last_name + " " + dataProfile.degree : "nama" }}</p>
                  <p>{{ dataProfile ? dataProfile.years_experience + " " + "Tahun" : "tahun" }}</p>
                  <p>{{ dataProfile ? dataProfile.workplace + " " : "tempat" }}</p>
                  <p>{{ dataProfile ? dataProfile.str_number + " " : "str" }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </b-modal>
    </div>
  </div>
</template>