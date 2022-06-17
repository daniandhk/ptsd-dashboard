<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import { required } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import store from '@/store';
import moment from 'moment';

export default {
  components: {
    //
  },
  data() {
    return {
      user: store.getters.getLoggedUser,
      backendUrl: process.env.VUE_APP_BACKEND_URL,

      test_type: this.$route.params.test_type,
      test_id: this.$route.params.test_id,
      patient_id: this.$route.params.patient_id,

      currentPage: 1,
      data_input:{
        patient_id: null,
        test_type_id: null,
        pages: []
      },

      test: "",
      test_review: {
        index: 0,
        score: 0,
        next_date: "",
        videocall_date: "",
        videocall_link: "",
        created_at: "",
        is_finished: true,
      },

      questionData: [],
      pageData: {
        title: "",
        description: ""
      },
      isReview: false,
      isLoading: true,
      isSubmitted: false,

      submitted: false,
      isThisPageInvalid: false,

      patient: {
        first_name: "",
        last_name: "",
        datebirth: "",
        image: "",
        city: "",
        province: "",

      }
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    currentPageIndex() {
      return this.currentPage-1;
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
    // if(!this.isSubmitted){
    //   window.addEventListener("beforeunload", this.preventNav);
    //   this.$once("hook:beforeDestroy", () => {
    //     window.removeEventListener("beforeunload", this.preventNav);
    //   })
    // }
  },
  validations: {
    data_input: {
      pages: {
        $each: {
          questions: {
            $each: {
              answers: { required },
            }
          },
        }
      }
    },
  },
  mounted: async function() {
    await this.loadData();
  },
  methods: {
    ...notificationMethods,

    preventNav(event) {
      if (this.isSubmitted){
        return
      }
      event.preventDefault()
      event.returnValue = ""
    },

    async loadData(){
      await this.checkAuth();
      await this.setData();
      if(this.isReview){
        await this.getAnswers();
        await this.convertAnswers();
        this.patient = this.test_review.patient;
      }
    },

    getAge(string){
      return (moment().diff(moment(string, 'YYYY-MM-DD'), 'years')).toString() + ' Tahun'
    },

    dateFormatted(string){
      return moment(string).locale('id').format('DD MMMM YYYY')
    },

    getRequestParams(test_type) {
      let params = {};

      if (test_type) {
        params["test_type"] = test_type;
      }

      return params;
    },

    async checkAuth(){
      loading();
      this.isLoading = true
      if(this.test_id && this.patient_id){
        this.isReview = true
      }
      const params = this.getRequestParams(
        this.test_type,
      );
      return api.getTestTypeQuestions(params)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          if(response.data.data){
            this.test = response.data.data
          }
          else{
            this.$router.replace({
              name: 'error-404'
            });
          }
          loading();
          this.isLoading = false;
        })
        .catch(error => {
          loading();
          this.isLoading = false;

          this.$router.replace({
            name: 'error-404'
          });
        })
    },

    async setData(){
      this.data_input.patient_id = this.user.profile.id
      this.data_input.test_type_id = this.test.id
      this.questionData = this.test.test_pages[0].test_questions
      this.pageData = this.test.test_pages[0]

      this.test.test_pages.forEach((page, index1, array1) => {
        let data1 = {
          page_id: page.id,
          page_number: page.number,
          questions: [],
        }
        this.data_input.pages.push(data1);

        page.test_questions.forEach((question, index2, array2) => {
          let data2 = {
            answer_type: question.answer_type,
            answers: [],
          }
          this.data_input.pages[index1].questions.push(data2);
        });
      });
    },

    getAnswers(){
      if(this.user.role == 'patient'){
        if(this.patient_id != this.user.profile.id){
          this.$router.replace({
            name: 'error-404'
          });
        }
      }
      return api.showTest(this.test_id)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          if(response.data.data){
            if(response.data.data.patient_id != this.patient_id){
              this.$router.replace({
                name: 'error-404'
              });
            }
            this.test_review = response.data.data
            this.test.test_pages.forEach((page, index1, array1) => {
              page.test_questions.forEach((question, index2, array2) => {
                this.test_review.answers.forEach((answer, index3, array3) => {
                  if(answer.test_question_id == question.id){
                    this.data_input.pages[index1].questions[index2].answers.push(answer)
                  }
                  let idx_test_answer = question.test_answers.findIndex(element => element.id == answer.test_answer_id);
                  if(idx_test_answer != -1){
                    let test_answer = question.test_answers[idx_test_answer]
                    if(question.answer_type == 'essay' || test_answer.is_essay){
                      question.test_answers[idx_test_answer].text = answer.text
                    }
                  }
                });
              });
            });
          }
          else{
            this.$router.replace({
              name: 'error-404'
            });
          }
        })
        .catch(error => {
          this.$router.replace({
            name: 'error-404'
          });
        })
    },

    async convertAnswers(){
      this.data_input.pages.forEach((page, index1, arr1) => {
        page.questions.forEach((question, index2, arr2) => {
          question.answers.forEach((answer, index3, arr3) => {
            if(question.answer_type != 'essay'){
              this.data_input.pages[index1].questions[index2].answers[index3] = answer.test_answer_id;
            }
          });
        });
      });
    },

    onCancelButtonClick(){
      if (!window.confirm("Keluar dan batalkan tes?")) {
        return;
      }
      this.isSubmitted = true;
      this.$router.push({name: 'home'});
      Swal.fire("Berhasil dibatalkan!", "Anda dialihkan ke menu utama.", "success");
    },

    onBackButtonClick(){
      window.scrollTo(0,0)
      this.currentPage -= 1
      this.questionData = this.test.test_pages[this.currentPageIndex].test_questions
      this.pageData = this.test.test_pages[this.currentPageIndex]

      this.submitted = false
      this.isThisPageInvalid = false
    },

    onExitButtonClick(){
      this.isSubmitted = true;
      this.$router.push({name: 'home'});
    },

    onNextButtonClick(){
      this.submitted = false
      this.submitted = true

      if(!this.isReview){
        for (let i = 0; i < this.data_input.pages[this.currentPageIndex].questions.length; i++) {
          if(this.isAnswerEmpty(this.data_input.pages[this.currentPageIndex].questions[i].answers, i)){
            break
          }
        }
        this.$v.data_input.pages.$each[this.currentPageIndex].$touch();

        if (this.isThisPageInvalid || this.$v.data_input.pages.$each[this.currentPageIndex].$invalid) {
          // window.scrollTo(0,document.body.scrollHeight);
          return;
        }
      }
      
      window.scrollTo(0,0)
      this.currentPage += 1
      this.questionData = this.test.test_pages[this.currentPageIndex].test_questions
      this.pageData = this.test.test_pages[this.currentPageIndex]

      this.submitted = false
      this.isThisPageInvalid = false
    },

    onFinishButtonClick(){
      this.submitted = false
      this.submitted = true
      this.$v.data_input.pages.$each[this.currentPageIndex].$touch();

      if (this.isThisPageInvalid || this.$v.data_input.pages.$each[this.currentPageIndex].$invalid) {
        // window.scrollTo(0,document.body.scrollHeight);
        return;
      }
      
      Swal.fire({
        title: "Akhiri tes?",
        text: "Harap periksa kembali jawaban Anda.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#005C9A",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Ya, akhiri tes!"
      }).then(result => {
        if (result.value) {
          this.inputTest();
        }
      });
    },

    inputTest(){
      return (
        api.inputTest(this.data_input)
          .then(response => {
            this.isSubmitted = true;
            Swal.fire("Tes telah berakhir!", "Jawaban Anda berhasil disimpan.", "success");
            this.$router.replace({
              name: 'test-finished', 
              params: { test_type: this.test_type }
            });
          })
          .catch(error => {
            //pop up
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Terjadi kesalahan!',
              footer: error.response.data.message
            })
          })
      );
    },

    isEmptyAnswerChecked(array, data){
      let found = array.find(element => element.id == data.id);
      if(found){
        return true
      }
      return false
    },

    isAnswerEmpty(array, index){
      let id = 'card-' + index.toString()
      if(array.length == 0){
        this.isThisPageInvalid = true
        document.getElementById(id).scrollIntoView();
        return true
      }

      let isEmpty = false
      
      for (let i = 0; i < array.length; i++) {
        if(array[i].text == null || array[i].text == ""){
          isEmpty = true
          document.getElementById(id).scrollIntoView();
          break
        }
      }
      
      this.isThisPageInvalid = isEmpty
      return isEmpty
    },

    onEssayChanged(index, answer){
      if(answer.text == null || answer.text == ""){
        if(this.data_input.pages[this.currentPageIndex].questions[index].answers.length > 0){
          this.data_input.pages[this.currentPageIndex].questions[index].answers.splice(0, 1);
        }
      }
      else{
        if(this.data_input.pages[this.currentPageIndex].questions[index].answers.length == 0){
          this.data_input.pages[this.currentPageIndex].questions[index].answers.push(answer)
        }
      }
    },

    onIsEssayChanged(array, data){
      let idx = array.findIndex(element => element.id == data.id);
      if(idx != -1){
        array[idx].text = data.text
      }
    },

    //
  },
  // beforeRouteLeave(to, from, next) {
  //   if(!this.isSubmitted){
  //     if (!window.confirm("Keluar dan batalkan tes?")) {
  //       return;
  //     }
  //   }
  //   next();
  // },
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
      id="main-page"
      class="row"
      style="max-width:820px; min-height: 100vh; display: flex; flex-direction: column; background-color: #005C9A;"
    >
      <div v-if="!isLoading">
        <div
          class="card h-100 mt-4 mb-3 ml-5 mr-5"
          style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); border-radius: 18px; display: flex; justify-content: center; align-items: center;"
        >
          <div class="card-body">
            <div class="mb-0">
              <div
                class="mr-5 ml-5 mt-2 mb-2"
                style="flex-direction: column;"
              >
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
                        {{ isReview ? 'Review Tes Penilaian Diri PTSD' : 'Tes Penilaian Diri PTSD' }}
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
                <div
                  v-if="isReview"
                  class="mt-4"
                >
                  <div>
                    <div
                      class="card h-100"
                      style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
                    >
                      <div
                        class="card-body"
                        style="min-width:260px; max-width:600px"
                      >
                        <div class="row justify-content-center mr-1 ml-1">
                          <div class="col-sm-3 text-center">
                            <img
                              :src="backendUrl + '/' + (patient.image ? patient.image : 'avatars/default_profile.jpg')"
                              alt
                              class="avatar-md mt-2 rounded-circle"
                            >
                          </div>
                          <div class="mt-2 text-left col-sm-9">
                            <p class="mb-0">
                              <b class="font-size-18">{{ patient.first_name + ' ' + patient.last_name }}</b>
                            </p>
                            <p class="mb-0 font-size-14">
                              {{ getAge(patient.datebirth) }}
                            </p>
                            <p class="font-size-14">
                              {{ patient.city + ', ' + patient.province }}
                            </p>
                            <hr>
                            <div class="row ml-1">
                              <div class="column mt-0 mb-0">
                                <p class="mt-0 mb-0">
                                  <b>Tes ke-{{ test_review.index.toString() }}</b>
                                </p>
                                <p class="mt-0 mb-0">
                                  <b>Tanggal tes</b>
                                </p>
                                <p class="mt-0 mb-0">
                                  <b>Total skor</b>
                                </p>
                              </div>
                              <div class="column mr-2 ml-2">
                                <p
                                  class="mt-0 mb-0"
                                  style="visibility: hidden;"
                                >
                                  //
                                </p>
                                <p class="mt-0 mb-0">
                                  :
                                </p>
                                <p class="mt-0 mb-0">
                                  :
                                </p>
                              </div>
                              <div class="column mt-0 mb-0">
                                <p
                                  class="mt-0 mb-0"
                                  style="visibility: hidden;"
                                >
                                  //
                                </p>
                                <p class="mt-0 mb-0">
                                  {{ dateFormatted(test_review.created_at) }}
                                </p>
                                <p class="mt-0 mb-0">
                                  {{ test_review.score.toString() }} dari {{ test.total_score.toString() }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="!test_review.is_finished">
                      <div
                        class="card h-100"
                        style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
                      >
                        <div
                          class="card-body"
                          style="min-width:260px; max-width:600px"
                        >
                          <div class="text-center">
                            <label>Verifikasi Jawaban via Video Call</label>
                          </div>
                          <div class="row ml-1">
                            <div class="column mt-0 mb-0">
                              <p class="mt-0 mb-0">
                                <b>Jadwal</b>
                              </p>
                              <p class="mt-0 mb-0">
                                <b>Link/URL</b>
                              </p>
                            </div>
                            <div class="column mr-2 ml-2">
                              <p class="mt-0 mb-0">
                                :
                              </p>
                              <p class="mt-0 mb-0">
                                :
                              </p>
                            </div>
                            <div class="column mt-0 mb-0">
                              <p class="mt-0 mb-0">
                                {{ test_review.videocall_date ? dateFormatted(test_review.videocall_date) : '-' }}
                              </p>
                              <p class="mt-0 mb-0">
                                {{ test_review.videocall_link ? test_review.videocall_link : '-' }}
                              </p>
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
        <div
          v-if="pageData.title || pageData.description"
          class="card h-100 mt-2 mb-3 ml-5 mr-5"
          style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); border-radius: 6px; display: flex; justify-content: center; align-items: center;"
        >
          <div class="card-body">
            <div class="p-2">
              <div>
                <h4
                  v-if="pageData.title"
                  class="font-size-20"
                  style="font-weight: bold; text-decoration: underline;"
                >
                  {{ pageData.title }}
                </h4>
                <p
                  v-if="pageData.description"
                  class="mb-0"
                >
                  {{ pageData.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(question, index) in questionData"
          :key="index"
          class="mt-2 mb-3 ml-5 mr-5"
          :set="v_question = $v.data_input.pages.$each[currentPageIndex].questions.$each[index]"
        >
          <div
            :id="'card-' + index"
            class="card h-100 mb-3"
            style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); border-radius: 6px; display: flex; justify-content: center; align-items: left;"
            :class="{ 'card-invalid': submitted && isAnswerEmpty(data_input.pages[currentPageIndex].questions[index].answers, index) }"
          >
            <div class="card-body">
              <div :class="{ 'is-invalid': submitted && v_question.answers.$error }">
                <label class="font-size-16 mb-0">{{ question.text }}</label>
              </div>
              <label
                v-if="question.answer_type == 'mc_multi'"
                class="mb-0"
              >(Pilih salah satu atau lebih)</label>
              <div
                v-if="submitted && !v_question.answers.$error.required"
                class="invalid-feedback font-size-14 mt-0"
              >
                {{ question.answer_type == 'essay' ? 'Jawaban harus diisi!' : 'Jawaban harus dipilih!' }}
              </div>
              <div
                v-for="(answer, index_answer) in question.test_answers"
                :key="index_answer"
                class="mt-4"
              >
                <div v-if="question.answer_type == 'mc_multi'">
                  <input
                    v-model="data_input.pages[currentPageIndex].questions[index].answers"
                    type="checkbox"
                    :name="'checkbox-' + index + '-' + index_answer"
                    :value="isReview ? answer.id : answer"
                    style="vertical-align: middle; float: left; margin-top:5px;"
                    :disabled="isReview"
                  >
                  <div
                    v-if="answer.description || answer.text"
                    class="text-left"
                    style="margin-left: 25px;"
                  >
                    {{ answer.is_essay ? answer.description : answer.text }}
                  </div>
                  <div
                    v-if="answer.is_essay"
                    class="mb-4 mt-2"
                    style="display: flex;"
                  >
                    <input
                      id="a"
                      type="radio"
                      name="a"
                      value="a"
                      style="vertical-align: middle; float: left; margin-top:5px; visibility: hidden;"
                    >
                    <div style="width:100%; margin-left: 12px;">
                      <textarea 
                        v-model="answer.text"
                        :name="'textarea-' + index + '-' + index_answer"
                        rows="4"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && !answer.text && isEmptyAnswerChecked(data_input.pages[currentPageIndex].questions[index].answers, answer) }"
                        :disabled="isReview"
                        @input="onIsEssayChanged(data_input.pages[currentPageIndex].questions[index].answers, answer)"
                      />
                      <div 
                        v-if="submitted && !answer.text && isEmptyAnswerChecked(data_input.pages[currentPageIndex].questions[index].answers, answer)" 
                        class="invalid-feedback"
                      >
                        Harus diisi!
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="question.answer_type == 'mc_one'">
                  <input
                    v-model="data_input.pages[currentPageIndex].questions[index].answers[0]"
                    type="radio"
                    :name="'radio-' + index + '-' + index_answer"
                    :value="isReview ? answer.id : answer"
                    style="vertical-align: middle; float: left; margin-top:5px;"
                    :disabled="isReview"
                  >
                  <div
                    v-if="answer.description || answer.text"
                    style="margin-left: 25px;"
                  >
                    {{ answer.is_essay ? answer.description : answer.text }}
                  </div>
                  <div
                    v-if="answer.is_essay"
                    class="mb-4 mt-2"
                    style="display: flex;"
                  >
                    <input
                      id="a"
                      type="radio"
                      name="a"
                      value="a"
                      style="vertical-align: middle; float: left; margin-top:5px; visibility: hidden;"
                    >
                    <div style="width:100%; margin-left: 12px;">
                      <textarea 
                        v-model="answer.text"
                        :name="'textarea-' + index + '-' + index_answer"
                        rows="4"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && !answer.text && isEmptyAnswerChecked(data_input.pages[currentPageIndex].questions[index].answers, answer) }"
                        :disabled="isReview"
                        @input="onIsEssayChanged(data_input.pages[currentPageIndex].questions[index].answers, answer)"
                      />
                      <div 
                        v-if="submitted && !answer.text && isEmptyAnswerChecked(data_input.pages[currentPageIndex].questions[index].answers, answer)" 
                        class="invalid-feedback"
                      >
                        Harus diisi!
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="question.answer_type == 'score'">
                  <input
                    v-model="data_input.pages[currentPageIndex].questions[index].answers[0]"
                    type="radio"
                    :name="'radio-' + index + '-' + index_answer"
                    :value="isReview ? answer.id : answer"
                    style="vertical-align: middle; float: left; margin-top:5px;"
                    :disabled="isReview"
                  >
                  <div
                    v-if="answer.description || answer.text"
                    style="margin-left: 25px;"
                  >
                    <b class="mr-2">[ {{ answer.weight }} ]</b> {{ answer.is_essay ? answer.description : answer.text }}
                  </div>
                </div>
                <div
                  v-if="question.answer_type == 'essay'"
                  style="margin-top: -12px!important;"
                >
                  <textarea 
                    v-model="answer.text"
                    :name="'textarea-' + index + '-' + index_answer"
                    rows="4"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !answer.text && isEmptyAnswerChecked(data_input.pages[currentPageIndex].questions[index].answers, answer) }"
                    :disabled="isReview"
                    @input="onEssayChanged(index, answer)"
                  />
                  <div 
                    v-if="submitted && !answer.text && isEmptyAnswerChecked(data_input.pages[currentPageIndex].questions[index].answers, answer)" 
                    class="invalid-feedback"
                  >
                    Harus diisi!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="row mt-2 ml-4 mr-4 mb-3 text-center"
          style="padding-left:12px ; padding-right:10.5px ;"
        >
          <div class="col-md-3 pt-1 pb-1">
            <b-button
              v-if="currentPage > 1"
              variant="secondary"
              style="width:100%; box-shadow: 0 8px 15px rgb(0 0 0 / 0.2);"
              @click="onBackButtonClick()" 
            >
              Sebelumnya
            </b-button>
            <b-button
              v-if="currentPage == 1 && !isReview"
              variant="danger"
              style="width:100%; box-shadow: 0 8px 15px rgb(0 0 0 / 0.2);"
              @click="onCancelButtonClick()" 
            >
              Batalkan
            </b-button>
            <b-button
              v-if="currentPage == 1 && isReview"
              variant="secondary"
              style="width:100%; box-shadow: 0 8px 15px rgb(0 0 0 / 0.2);"
              @click="onExitButtonClick()" 
            >
              Keluar
            </b-button>
          </div>
          <div
            class="col-md-4 pt-1 pb-1"
            style="display: flex; align-items: center; justify-content: center;"
          >
            <label
              class="mt-2"
              style="color: white;"
            >Halaman {{ currentPage }} dari {{ test.total_page }}</label>
          </div>
          <div class="col-md-5 pt-1 pb-1">
            <b-button
              v-if="currentPage < test.total_page"
              variant="light"
              style="width:100%; box-shadow: 0 8px 15px rgb(0 0 0 / 0.2);"
              @click="onNextButtonClick()" 
            >
              Berikutnya
            </b-button>
            <b-button
              v-if="currentPage == test.total_page"
              variant="success"
              style="width:100%; box-shadow: 0 8px 15px rgb(0 0 0 / 0.2);"
              :disabled="isReview"
              @click="onFinishButtonClick()"
            >
              Selesai
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card-invalid {
    border: 4px solid #ff3d60 !important;
  }

  @media only screen and (min-width: 820px) { 
  #main-page { 
    width: 820px; 
  } 
}
</style>