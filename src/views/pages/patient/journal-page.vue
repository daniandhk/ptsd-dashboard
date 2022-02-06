<script>
import store from '@/store';
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import moment from 'moment';
import Swal from "sweetalert2";
import Topbar from "@/components/topbar-patient";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    Topbar,
  },
  validations: {
      data_journal: {
          user_id: { required },
          text: { required }
      },
  },
  data() {
    return {
      user: store.getters.getLoggedUser ? store.getters.getLoggedUser : null,

      today: moment().format('YYYY-MM-DD'),
      date: moment().format('YYYY-MM-DD'),
      dashboard: {
          journal: null,
          note_question: [],
      },

      isJournalNull: false,
      isToday: true,
      data_journal: {
          user_id: "",
          text: ""
      },
      submitted_journal: false,

      journal_form: {
        backgroundColor: "#F0F4F6",
      },

      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "question_text",
      sortDesc: false,
      dataNotes: [],
      fields: [
        { key: "question_text", sortable: true, label: "Catatan Psikolog" },
        { key: "answer", sortable: false, label: "Jawaban Anda" },
        { key: "action", label: "Aksi", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
      ],

    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  beforeMount: async function(){
    document.body.setAttribute("data-topbar", "dark");
  },
  mounted: async function(){
    await this.getDashboard(this.today);
  },
  methods: {
    ...notificationMethods,

    getRequestParams(date) {
      let params = {};

      if (date) {
        params["date"] = date;
      }

      return params;
    },

    async getDashboard(date){
        loading();
        //emptying
        this.dashboard = {
            journal: null,
            note_question: [],
        }
        this.dataNotes = []
        this.data_journal = {
            user_id: "",
            text: ""
        },

        this.date = date
        const params = this.getRequestParams(
            date,
        );
        return (
          api.getJournalDashboard(this.user.id, params)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
                if(response.data.data.data){
                    this.dashboard = response.data.data.data;
                    this.setDashboard();
                }
                loading();
            })
            .catch(error => {
              console.log(error);
              loading();
            })
        );
    },

    setDashboard(){
        if(moment(this.today).isSame(this.date)){
            this.isToday = true;
            this.journal_form.backgroundColor = "";
        }
        else{
            this.isToday = false;
            this.journal_form.backgroundColor = "#F0F4F6";
        }
        if(this.dashboard){
            if(this.dashboard.journal){
                this.isJournalNull = false;
                this.data_journal = this.dashboard.journal
            }
            else{
                this.isJournalNull = true;
            }

            if(this.dashboard.note_question){
                this.dataNotes = this.dashboard.note_question
            }
        }
    },

    onSubmitAnswerButtonClick(data){
        if(data.answer == null){
            return
        }
        else{
            let input = {
                note_question_id: data.id,
                answer_text: data.answer
            }
            loading();
            return (
            api.inputNoteAnswer(input)
                // eslint-disable-next-line no-unused-vars
                .then(response => {
                loading();
                window.location.reload();
                })
                .catch(error => {
                loading();
                console.log(error)
                })
            );
        }
    },

    onUpdateJournalButtonClick(){
      loading();
      this.submitted_journal = true;
      // stop here if form is invalid
      this.$v.data_journal.$touch();

      if (this.$v.data_journal.$invalid) {
        loading();
        return;
      } else {
        let id = this.data_journal.id;
        let data = {
            user_id: this.user.id,
            text: this.data_journal.text
        }
        return (
          api.updateJournal(data, id)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              loading();
              window.location.reload();
            })
            .catch(error => {
              loading();
              console.log(error)
            })
        );
      }
    },

    onSubmitJournalButtonClick(){
      loading();
      this.data_journal.user_id = this.user.id;
      this.submitted_journal = true;
      // stop here if form is invalid
      this.$v.data_journal.$touch();

      if (this.$v.data_journal.$invalid) {
        loading();
        return;
      } else {
        return (
          api.inputJournal(this.data_journal)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              loading();
              window.location.reload();
            })
            .catch(error => {
              loading();
              console.log(error)
            })
        );
      }
    },

    isNoteAnswered(data){
        if(data.note_answer.length > 0){
            return true
        }
        else{
            return false
        }
        
    },

    onTodayButtonClick(){
        this.getDashboard(this.today);
    },

    onPrevButtonClick(){
        this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
        this.getDashboard(this.date);
    },

    onNextButtonClick(){
        this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
        this.getDashboard(this.date);
    },

    formattedDate(date){
        return moment(date).locale('id').format('LL');
    }
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
  <div>
    <Topbar />
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
      <div
        class="m-5"
        style="display: flex; align-items: center; justify-content: center; height: 100%;"
      >
        <div class="col-sm-8">
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
                  <div class="row">
                    <div class="col-sm-4 mt-2 mb-2">
                      <a href="/">
                        <i
                          class="mdi mdi-home-variant"
                          style="font-size:25px; color:grey;"
                        />
                      </a>
                    </div>
                    <div class="col-sm-4 mt-2 mb-2">
                      <div style="display: flex; align-items: center; justify-content: center;">
                        <a
                          href="#"
                          @click="onPrevButtonClick()"
                        >
                          <i
                            class="mdi mdi-skip-previous"
                            style="font-size:25px; color:#005C9A;"
                          />
                        </a>
                        <button 
                          v-if="!isToday"
                          type="button"
                          class="btn btn-light btn-md mr-2 ml-2"
                          disabled
                        >
                          {{ formattedDate(date) }}
                        </button>
                        <button 
                          v-if="isToday"
                          type="button"
                          class="btn btn-primary btn-md mr-2 ml-2"
                          style="background-color:#005C9A;"
                        >
                          {{ formattedDate(date) }}
                        </button>
                        <a
                          href="#"
                          @click="onNextButtonClick()"
                        >
                          <i
                            class="mdi mdi-skip-next"
                            style="font-size:25px; color:#005C9A;"
                          />
                        </a>
                      </div>
                    </div>
                    <div class="col-sm-4 mt-2 mb-2">
                      <button 
                        v-if="!isToday"
                        type="button"
                        class="btn btn-primary m-1 btn-sm"
                        style="background-color:#005C9A;"
                        @click="onTodayButtonClick()"
                      >
                        Ke Hari Ini
                      </button>
                      <button 
                        v-if="isToday"
                        type="button"
                        class="btn btn-outline-dark m-1 btn-sm"
                      >
                        Hari Ini
                      </button>
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
                    <div
                      class="row mt-3"
                      style="display: flex; justify-content: center;"
                    >
                      <div style="width:100%;">
                        <div class="mb-2 mt-2">
                          Jurnal
                        </div>
                        <div class="mr-5 ml-5">
                          <textarea 
                            v-model="data_journal.text"
                            rows="4"
                            type="text"
                            class="form-control"
                            :disabled="!isToday"
                            :style="journal_form"
                            :class="{ 'is-invalid': submitted_journal && $v.data_journal.$error }"
                          />
                          <div 
                            v-if="submitted_journal && !$v.data_journal.required" 
                            class="invalid-feedback"
                          >
                            Jurnal harus diisi!
                          </div>
                          <button 
                            v-if="isToday && isJournalNull"
                            type="button"
                            class="btn btn-success mt-2 btn-sm"
                            style=" width:100%;"
                            @click="onSubmitJournalButtonClick()"
                          >
                            Simpan
                          </button>
                          <button 
                            v-if="isToday && !isJournalNull"
                            type="button"
                            class="btn btn-warning mt-2 btn-sm"
                            style=" width:100%;"
                            @click="onUpdateJournalButtonClick()"
                          >
                            Update
                          </button>
                          <button 
                            v-if="!isToday && isJournalNull"
                            type="button"
                            class="btn btn-outline-dark mt-2 btn-sm"
                            style=" width:100%;"
                            disabled
                          >
                            Jurnal dan jawaban catatan di isi per hari!
                          </button>
                          <button 
                            v-if="!isToday && !isJournalNull"
                            type="button"
                            class="btn btn-secondary mt-2 btn-sm"
                            style=" width:100%;"
                            disabled
                          >
                            Tersimpan
                          </button>
                        </div>
                      </div>
                      <div
                        class="mt-5"
                        style="width:100%;"
                      >
                        <div style="width:100%;">
                          <div class="table-responsive">
                            <b-table
                              class="table-centered"
                              :items="dataNotes"
                              :fields="fields"
                              responsive="sm"
                              :per-page="perPage"
                              :current-page="currentPage"
                              :sort-by="sortBy"
                              :sort-desc="sortDesc"
                              :filter="filter"
                              :head-variant="'dark'"
                              :filter-included-fields="filterOn"
                            >
                              <template v-slot:cell(answer)="data">
                                <input
                                  v-model="data.item.answer"
                                  type="text"
                                  class="form-control"
                                  style="min-width: 150px;"
                                  :disabled="isNoteAnswered(data.item) || !isToday" 
                                >
                              </template>
                              <template v-slot:cell(action)="data">
                                <b-button
                                  v-if="!isNoteAnswered(data.item) && isToday" 
                                  type="submit"
                                  variant="success"
                                  size="sm"
                                  style="min-width: 100px;"
                                  @click="onSubmitAnswerButtonClick(data.item)" 
                                >
                                  Simpan
                                </b-button>
                                <b-button
                                  v-if="isNoteAnswered(data.item) && isToday" 
                                  type="submit"
                                  variant="secondary"
                                  size="sm"
                                  style="min-width: 100px;"
                                  disabled
                                >
                                  Tersimpan
                                </b-button>
                                <b-button
                                  v-if="!isToday" 
                                  type="submit"
                                  variant="secondary"
                                  size="sm"
                                  style="min-width: 100px;"
                                  disabled
                                >
                                  -
                                </b-button>
                              </template>
                            </b-table>
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
</template>