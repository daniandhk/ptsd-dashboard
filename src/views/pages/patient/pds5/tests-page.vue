<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import { required } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import tests from "./data-test";
import texts from "./data-text";

export default {
  components: {
    //
  },
  data() {
    return {
        patient_id: 1,
        pageNumber: 1,
        testData: tests,
        textData: texts,
        data_trauma: {
          data1: [],
          data2: "",
        },
        data_trauma_lain: {
          data1: "",
          data2: "",
        },
        isTraumaLainSelected: false,
        isTraumaLainSelected2: false,
        form_style: {
          backgroundColor: "#F0F4F6",
        },
        form_style2: {
          backgroundColor: "#F0F4F6",
        },
        data_diagnosa: {
          data1: [],
          data2: [],
          data3: [],
        },
        data_symptom: [],
        data_input: [
          {
            type: "trauma",
            answers: [],
          },
          {
            type: "diagnosa",
            answers: [],
          },
          {
            type: "symptom",
            answers: [],
          },
        ],

        answers_diagnosa: [
          {
            value: "0",
            text: "Tidak sama sekali",
          },
          {
            value: "1",
            text: "Sekali seminggu atau kurang / sedikit",
          },
          {
            value: "2",
            text: "2 hingga 3 kali seminggu / agak banyak",
          },
          {
            value: "3",
            text: "4 hingga 5 kali seminggu / sangat banyak",
          },
          {
            value: "4",
            text: "6 kali atau lebih dalam seminggu / parah",
          },
        ],

        answers_symptom: [
          {
            value: "a",
            text: "Kurang dari 6 bulan",
          },
          {
            value: "b",
            text: "Lebih dari 6 bulan",
          },
        ],

        submitted_trauma1: false,
        submitted_trauma2: false,
        submitted_diagnosa1: false,
        submitted_diagnosa2: false,
        submitted_final: false,

        data_example: "1",
        trauma_selected: "",
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
  validations: {
    data_trauma: {
      data1: { required },
      data2: { required }
    },
    data_trauma_lain: {
      data1: { required },
      data2: { required }
    },
    data_diagnosa: {
      data1: {
        $each: {
          index: { required },
          answer: { required },
        }
      },
      data2: {
        $each: {
          index: { required },
          answer: { required },
        }
      },
      data3: {
        $each: {
          index: { required },
          answer: { required },
        }
      },
    },
    data_symptom: {
      $each: {
        index: { required },
        answer: { required },
      }
    },
  },
  methods: {
    ...notificationMethods,

    onCancelButtonClick(){
      Swal.fire({
          title: "Anda yakin?",
          text: "Tes ini akan dibatalkan.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#005C9A",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, batalkan!"
      }).then(result => {
          if (result.value) {
              this.$router.push({name: 'home'});
              Swal.fire("Berhasil dibatalkan!", "Anda telah kembali ke menu utama.", "success");
          }
      });
    },

    onNextButtonClick(page, isNext){
      if(isNext){
        if(this.pageNumber == 1){
          this.submitted_trauma1 = true;
          this.$v.data_trauma.data1.$touch();
          this.$v.data_trauma_lain.data1.$touch();

          if (this.$v.data_trauma.data1.$invalid || (this.$v.data_trauma_lain.data1.$invalid && this.isTraumaLainSelected)) {
            if (this.$v.data_trauma.data1.$invalid){
              window.scrollTo(0,document.body.scrollHeight);
            }
            return;
          }
          else{
            if(this.data_trauma.data1.includes("none")){
              this.onCancelButtonClick()
              return
            }
            else{
              this.data_input[0].answers = []

              this.data_trauma.data1.forEach((element, index, array) => {
                  if(this.testData.trauma.answers.includes(element)){
                    this.createAnswerData("trauma", 1, element)
                  }
              });
              
              if(this.data_trauma.data1.includes("lain")){
                this.createAnswerData("trauma", 1, this.data_trauma_lain.data1)
              }
            }
          }
        }
        if(this.pageNumber == 2){
          this.submitted_trauma2 = true;
          this.$v.data_trauma.data2.$touch();
          this.$v.data_trauma_lain.data2.$touch();

          if (this.$v.data_trauma.data2.$invalid || (this.$v.data_trauma_lain.data2.$invalid && this.isTraumaLainSelected2)) {
            if (this.$v.data_trauma.data2.$invalid){
              window.scrollTo(0,document.body.scrollHeight);
            }
            return;
          }
          else{
            let data = this.data_input[0].answers.find(e => e.index === 2)
            if (data) {
              this.data_input[0].answers.splice(this.data_input[0].answers.indexOf(data), 1);
            }

            if(this.data_trauma.data2 == "lain"){
              this.createAnswerData("trauma", 2, this.data_trauma_lain.data2)
            }
            else{
              this.createAnswerData("trauma", 2, this.data_trauma.data2)
            }
          }
          let data = this.data_input[0].answers.find(e => e.index === 2)
          this.trauma_selected = data.resp

          this.testData.diagnosa.questions[0].forEach((element, index, array) => {
              let data = {
                index: index+1,
                answer: ""
              }
              let find = this.data_diagnosa.data1.find(e => e.index === data.index)
              if (!find) {
                this.data_diagnosa.data1.push(data)
              }
          });
        }
        if(this.pageNumber == 3){
          this.submitted_diagnosa1 = true;
          this.$v.data_diagnosa.data1.$touch();

          if (this.$v.data_diagnosa.data1.$invalid) {
            window.scrollTo(0,document.body.scrollHeight);
            return;
          }
          else{
            this.data_diagnosa.data1.forEach((element, index, array) => {
                this.createAnswerData("diagnosa", element.index, element.answer)
            });
          }

          this.testData.diagnosa.questions[1].forEach((element, index, array) => {
              let data = {
                index: index+11,
                answer: ""
              }
              let find = this.data_diagnosa.data2.find(e => e.index === data.index)
              if (!find) {
                this.data_diagnosa.data2.push(data)
              }
          });
        }
        if(this.pageNumber == 4){
          this.submitted_diagnosa2 = true;
          this.$v.data_diagnosa.data2.$touch();

          if (this.$v.data_diagnosa.data2.$invalid) {
            window.scrollTo(0,document.body.scrollHeight);
            return;
          }
          else{
            this.data_diagnosa.data2.forEach((element, index, array) => {
                this.createAnswerData("diagnosa", element.index, element.answer)
            });
          }

          this.testData.diagnosa.questions[2].forEach((element, index, array) => {
              let data = {
                index: index+21,
                answer: ""
              }
              let find = this.data_diagnosa.data3.find(e => e.index === data.index)
              if (!find) {
                this.data_diagnosa.data3.push(data)
              }
          });

          this.testData.symptom.questions.forEach((element, index, array) => {
              let data = {
                index: index+1,
                answer: ""
              }
              let find = this.data_symptom.find(e => e.index === data.index)
              if (!find) {
                this.data_symptom.push(data)
              }
          });
        }
      }
      window.scrollTo(0,0)
      this.pageNumber = page
    },

    onFinishButtonClick(){
      this.submitted_final = true;
      this.$v.data_diagnosa.data3.$touch();
      this.$v.data_symptom.$touch();

      if (this.$v.data_diagnosa.data3.$invalid || this.$v.data_symptom.$invalid) {
        window.scrollTo(0,document.body.scrollHeight);
        return;
      }
      else{
        this.data_diagnosa.data3.forEach((element, index, array) => {
            this.createAnswerData("diagnosa", element.index, element.answer)
        });

        this.data_symptom.forEach((element, index, array) => {
            this.createAnswerData("symptom", element.index, element.answer)
        });
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
      let data = {
        patient_id: this.patient_id,
        data_input: this.data_input,
      }
      return (
          api.inputTest(data)
            .then(response => {
                Swal.fire("Tes telah berakhir!", "Jawaban Anda berhasil disimpan.", "success");
                this.$router.replace({name: 'pds5-finished'});
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

    onSelectedTrauma(e){
      if(this.data_trauma.data1.length > 1 && this.data_trauma.data1[0] == "none"){
        this.data_trauma.data1.splice(0, 1);
      }
      if(this.data_trauma.data1.includes("none")){
        this.data_trauma.data1 = ["none"]
      }
      if(this.data_trauma.data1.includes("lain")){
        this.isTraumaLainSelected = true
        this.form_style.backgroundColor = ""
      }
      else{
        this.isTraumaLainSelected = false
        this.form_style.backgroundColor = "#F0F4F6"
        this.data_trauma_lain.data1 = ""
      }
    },

    onSelectedTrauma2(e){
      if(this.data_trauma.data2 == "lain"){
        this.isTraumaLainSelected2 = true
        this.form_style2.backgroundColor = ""
      }
      else{
        this.isTraumaLainSelected2 = false
        this.form_style2.backgroundColor = "#F0F4F6"
        this.data_trauma_lain.data2 = ""
      }
    },

    createAnswerData(type, index, text){
      let data = {
        index: index,
        resp: text
      }
      switch(type) {
        case "trauma":{
          this.data_input[0].answers.push(data)
          break
        }
        case "diagnosa":{
          let find = this.data_input[1].answers.find(e => e.index === index)
          if (find) {
            this.data_input[1].answers.splice(this.data_input[1].answers.indexOf(find), 1);
          }
          this.data_input[1].answers.push(data)
          break
        }
        case "symptom":{
          let find = this.data_input[2].answers.find(e => e.index === index)
          if (find) {
            this.data_input[2].answers.splice(this.data_input[2].answers.indexOf(find), 1);
          }
          this.data_input[2].answers.push(data)
          break
        }
        default:
          break
      }
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

                <div
                  class="p-2 mt-4"
                >
                  <div
                    v-if="pageNumber==1"
                    style="max-width:660px;"
                  >
                    <div>
                      <h4
                        class="font-size-18"
                        style="font-weight: bold; text-decoration: underline;"
                      >
                        {{ testData.trauma.title }}
                      </h4>
                      <p>
                        1/2
                      </p>
                    </div>

                    <div
                      class="text-left"
                      style="color:black;"
                    >
                      <p>
                        {{ testData.trauma.questions[0] }}<br><b>(Pilih salah satu atau lebih)</b>
                      </p>
                      <div
                        v-for="(answer, index) in testData.trauma.answers"
                        :key="index"
                        class="mt-4"
                      >
                        <input
                          v-model="data_trauma.data1"
                          type="checkbox"
                          name="answer_text"
                          :value="answer"
                          style="vertical-align: middle; float: left; margin-top:5px;"
                          @change="onSelectedTrauma"
                        >
                        <div style="margin-left: 25px;">
                          {{ answer }}
                        </div>
                      </div>
                      <div class="mt-4">
                        <input
                          v-model="data_trauma.data1"
                          type="checkbox"
                          name="answer_text"
                          value="lain"
                          style="vertical-align: middle; float: left; margin-top:5px;"
                          @change="onSelectedTrauma"
                        >
                        <div style="margin-left: 25px;">
                          Trauma lainnya (Harap dijelaskan dengan ringkas):
                        </div>
                        <div
                          class="mb-4 mt-2"
                          style="display: flex;"
                        >
                          <input
                            id="a"
                            type="checkbox"
                            name="a"
                            value="a"
                            style="vertical-align: middle; float: left; margin-top:5px; visibility: hidden;"
                          >
                          <div style="width:100%; margin-left: 12px;">
                            <textarea 
                              v-model="data_trauma_lain.data1"
                              rows="4"
                              type="text"
                              class="form-control"
                              :disabled="!isTraumaLainSelected"
                              :style="form_style"
                              :class="{ 'is-invalid': submitted_trauma1 && isTraumaLainSelected && $v.data_trauma_lain.data1.$error }"
                            />
                            <div 
                              v-if="submitted_trauma1 && isTraumaLainSelected && !$v.data_trauma_lain.data1.required" 
                              class="invalid-feedback"
                            >
                              Penjelasan trauma harus diisi!
                            </div>
                          </div>
                        </div>
                      </div>
                      <input
                        v-model="data_trauma.data1"
                        type="checkbox"
                        name="answer_text"
                        value="none"
                        style="vertical-align: middle; float: left; margin-top:5px;"
                        @change="onSelectedTrauma"
                      >
                      <div style="margin-left: 25px;">
                        Tidak ada
                      </div>
                      <div>
                        <input
                          id="a"
                          type="checkbox"
                          name="a"
                          value="a"
                          style="vertical-align: middle; float: left; margin-top:5px; visibility: hidden;"
                        >
                        <div style="margin-left: 25px;">
                          *** jika <b>TIDAK ADA</b>, tes ini tidak akan dilanjutkan ***
                        </div>
                      </div>
                    </div>

                    <div
                      class="mt-4 text-center form-group"
                      :class="{ 'is-invalid': submitted_trauma1 && $v.data_trauma.data1.$error }"
                    >
                      <button
                        class="btn btn-danger w-md waves-effect waves-light m-1"
                        style="width:180px"
                        @click="onCancelButtonClick()"
                      >
                        Batalkan
                      </button>
                      <button
                        class="btn btn-primary w-md waves-effect waves-light m-1"
                        style="background-color:#005C9A; width:260px"
                        @click="onNextButtonClick(2, true)"
                      >
                        Berikutnya
                      </button>
                    </div>
                    <div 
                      v-if="submitted_trauma1 && !$v.data_trauma.data1.required" 
                      class="invalid-feedback"
                      style="font-size:18px"
                    >
                      Harap pilih minimal satu pilihan!
                    </div>
                  </div>
                  <div
                    v-if="pageNumber==2"
                    style="max-width:660px;"
                  >
                    <div>
                      <h4
                        class="font-size-18"
                        style="font-weight: bold; text-decoration: underline;"
                      >
                        {{ testData.trauma.title }}
                      </h4>
                      <p>
                        2/2
                      </p>
                    </div>

                    <div
                      class="text-left"
                      style="color:black;"
                    >
                      <p>
                        {{ testData.trauma.questions[1] }}<br><b>(Pilih salah satu)</b>
                      </p>
                      <div
                        v-for="(answer, index) in testData.trauma.answers"
                        :key="index"
                        class="mt-4"
                      >
                        <input
                          v-model="data_trauma.data2"
                          type="radio"
                          name="answer_text"
                          :value="answer"
                          style="vertical-align: middle; float: left; margin-top:5px;"
                          @change="onSelectedTrauma2"
                        >
                        <div style="margin-left: 25px;">
                          {{ answer }}
                        </div>
                      </div>
                      <div class="mt-4">
                        <input
                          v-model="data_trauma.data2"
                          type="radio"
                          name="answer_text"
                          value="lain"
                          style="vertical-align: middle; float: left; margin-top: 5px;"
                          @change="onSelectedTrauma2"
                        >
                        <div style="margin-left: 25px;">
                          Trauma lainnya (Harap dijelaskan dengan ringkas):
                        </div>
                        <div
                          class="mb-4 mt-2"
                          style="display: flex;"
                        >
                          <input
                            id="a"
                            type="checkbox"
                            name="a"
                            value="a"
                            style="vertical-align: middle; float: left; margin-top: 5px; visibility: hidden;"
                          >
                          <div style="width:100%; margin-left: 12px;">
                            <textarea 
                              v-model="data_trauma_lain.data2"
                              rows="4"
                              type="text"
                              class="form-control"
                              :disabled="!isTraumaLainSelected2"
                              :style="form_style2"
                              :class="{ 'is-invalid': submitted_trauma2 && isTraumaLainSelected2 && $v.data_trauma_lain.data2.$error }"
                            />
                            <div 
                              v-if="submitted_trauma2 && isTraumaLainSelected2 && !$v.data_trauma_lain.data2.required" 
                              class="invalid-feedback"
                            >
                              Penjelasan trauma harus diisi!
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="mt-4 text-center form-group"
                      :class="{ 'is-invalid': submitted_trauma2 && $v.data_trauma.data2.$error }"
                    >
                      <button
                        class="btn btn-secondary w-md waves-effect waves-light m-1"
                        style="width:180px"
                        @click="onNextButtonClick(1, false)"
                      >
                        Sebelumnya
                      </button>
                      <button
                        class="btn btn-primary w-md waves-effect waves-light m-1"
                        style="background-color:#005C9A; width:260px"
                        @click="onNextButtonClick(3, true)"
                      >
                        Berikutnya
                      </button>
                    </div>
                    <div 
                      v-if="submitted_trauma2 && !$v.data_trauma.data2.required" 
                      class="invalid-feedback"
                      style="font-size:18px"
                    >
                      Harap pilih satu pilihan!
                    </div>
                  </div>
                  <div
                    v-if="pageNumber==3"
                    style="max-width:820px;"
                  >
                    <div class="mb-4">
                      <h4
                        class="font-size-18"
                        style="font-weight: bold; text-decoration: underline;"
                      >
                        {{ testData.diagnosa.title[0] }}
                      </h4>
                      <p>
                        1/2
                      </p>
                    </div>

                    <div
                      class="text-left"
                      style="color:black;"
                    >
                      <div
                        class="card h-100 mb-2"
                        style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
                      >
                        <div
                          class="card-body"
                          style="min-width:260px; justify-content: center; max-width:880px; margin: auto;"
                        >
                          <p>
                            {{ textData.diagnosa[0] }}
                          </p>
                          <p>{{ textData.diagnosa[1] }}<br><b>{{ trauma_selected }}</b></p>
                          <p>{{ textData.diagnosa[2] }}</p>
                        </div>
                      </div>

                      <div
                        class="card h-100 mb-5"
                        style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
                      >
                        <div
                          class="card-body"
                          style="min-width:260px; justify-content: center; max-width:900px; margin: auto;"
                        >
                          <p>
                            {{ textData.diagnosa[3] }}<br>{{ textData.diagnosa[4] }}
                          </p>

                          <div class="mt-4">
                            <div style="display: flex;">
                              <label
                                style="min-width:26px; float: left;"
                                class="mr-2"
                              >0.</label>
                              <label>{{ textData.diagnosa[5] }}</label>
                            </div>
                            <div
                              class="row mb-4 mt-2"
                              style="display: flex; justify-content: center;"
                            >
                              <div
                                v-for="(answer, index_answer) in answers_diagnosa"
                                :key="index_answer"
                                class="m-2"
                                style="justify-content: center; flex-direction: column;"
                              >
                                <div
                                  class="text-center"
                                  style="display: flex; justify-content: center;"
                                >
                                  <input
                                    v-model="data_example"
                                    type="radio"
                                    :value="answer.value"
                                    disabled="true"
                                    style="vertical-align: middle; float: left; margin-top:5px;"
                                  >
                                  <label style="margin-left: 15px;">{{ answer.value }}</label>
                                </div>
                                <p
                                  class="text-center"
                                  style="max-width:150px"
                                >
                                  {{ answer.text }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="mb-4 text-center">
                        <p style="color:#5E6A75">
                          1-10 kesulitan dalam sebulan terakhir
                        </p>
                      </div>

                      <div
                        v-for="(question, index) in testData.diagnosa.questions[0]"
                        :key="index"
                        class="mt-4"
                        :set="v = $v.data_diagnosa.data1.$each[index]"
                      >
                        <div style="display: flex;">
                          <label
                            style="min-width:26px; float: left;"
                            class="mr-2"
                          >{{ index+1 }}.</label>
                          <label>{{ question }}</label>
                        </div>
                        <div
                          class="row mb-4 mt-2"
                          style="display: flex; justify-content: center;"
                          :class="{ 'is-invalid': submitted_diagnosa1 && v.answer.$error }"
                        >
                          <div
                            v-for="(answer, index_answer) in answers_diagnosa"
                            :key="index_answer"
                            class="m-2"
                            style="justify-content: center; flex-direction: column;"
                          >
                            <div
                              class="text-center"
                              style="display: flex; justify-content: center;"
                            >
                              <input
                                v-model="data_diagnosa.data1[index].answer"
                                type="radio"
                                :value="answer.value"
                                style="vertical-align: middle; float: left; margin-top:5px;"
                              >
                              <label style="margin-left: 15px;">{{ answer.value }}</label>
                            </div>
                            <p
                              class="text-center"
                              style="max-width:150px"
                            >
                              {{ answer.text }}
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="submitted_diagnosa1 && !v.answer.$error.required"
                          class="invalid-feedback"
                        >
                          Jawaban harus dipilih!
                        </div>
                        <hr>
                      </div>
                    </div>

                    <div
                      class="mt-4 text-center form-group"
                      :class="{ 'is-invalid': submitted_diagnosa1 && $v.data_diagnosa.data1.$invalid }"
                    >
                      <button
                        class="btn btn-secondary w-md waves-effect waves-light m-1"
                        style="width:180px"
                        @click="onNextButtonClick(2, false)"
                      >
                        Sebelumnya
                      </button>
                      <button
                        class="btn btn-primary w-md waves-effect waves-light m-1"
                        style="background-color:#005C9A; width:260px"
                        @click="onNextButtonClick(4, true)"
                      >
                        Berikutnya
                      </button>
                    </div>
                    <div 
                      v-if="submitted_diagnosa1 && $v.data_diagnosa.data1.$invalid" 
                      class="invalid-feedback"
                      style="font-size:18px"
                    >
                      Harap menjawab semua pertanyaan!
                    </div>
                  </div>
                  <div
                    v-if="pageNumber==4"
                    style="max-width:820px;"
                  >
                    <div class="mb-4">
                      <h4
                        class="font-size-18"
                        style="font-weight: bold; text-decoration: underline;"
                      >
                        {{ testData.diagnosa.title[0] }}
                      </h4>
                      <p>
                        2/2
                      </p>
                    </div>

                    <div
                      class="text-left"
                      style="color:black;"
                    >
                      <div class="mb-4 text-center">
                        <p style="color:#5E6A75">
                          11-20 kesulitan dalam sebulan terakhir
                        </p>
                      </div>

                      <div
                        v-for="(question, index) in testData.diagnosa.questions[1]"
                        :key="index"
                        class="mt-4"
                        :set="v = $v.data_diagnosa.data2.$each[index]"
                      >
                        <div style="display: flex;">
                          <label
                            style="min-width:26px; float: left;"
                            class="mr-2"
                          >{{ index+11 }}.</label>
                          <label>{{ question }}</label>
                        </div>
                        <div
                          class="row mb-4 mt-2"
                          style="display: flex; justify-content: center;"
                          :class="{ 'is-invalid': submitted_diagnosa2 && v.answer.$error }"
                        >
                          <div
                            v-for="(answer, index_answer) in answers_diagnosa"
                            :key="index_answer"
                            class="m-2"
                            style="justify-content: center; flex-direction: column;"
                          >
                            <div
                              class="text-center"
                              style="display: flex; justify-content: center;"
                            >
                              <input
                                v-model="data_diagnosa.data2[index].answer"
                                type="radio"
                                :value="answer.value"
                                style="vertical-align: middle; float: left; margin-top:5px;"
                              >
                              <label style="margin-left: 15px;">{{ answer.value }}</label>
                            </div>
                            <p
                              class="text-center"
                              style="max-width:150px"
                            >
                              {{ answer.text }}
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="submitted_diagnosa2 && !v.answer.$error.required"
                          class="invalid-feedback"
                        >
                          Jawaban harus dipilih!
                        </div>
                        <hr>
                      </div>
                    </div>

                    <div
                      class="mt-4 text-center form-group"
                      :class="{ 'is-invalid': submitted_diagnosa2 && $v.data_diagnosa.data2.$invalid }"
                    >
                      <button
                        class="btn btn-secondary w-md waves-effect waves-light m-1"
                        style="width:180px"
                        @click="onNextButtonClick(3, false)"
                      >
                        Sebelumnya
                      </button>
                      <button
                        class="btn btn-primary w-md waves-effect waves-light m-1"
                        style="background-color:#005C9A; width:260px"
                        @click="onNextButtonClick(5, true)"
                      >
                        Berikutnya
                      </button>
                    </div>
                    <div 
                      v-if="submitted_diagnosa2 && $v.data_diagnosa.data2.$invalid" 
                      class="invalid-feedback"
                      style="font-size:18px"
                    >
                      Harap menjawab semua pertanyaan!
                    </div>
                  </div>
                  <div
                    v-if="pageNumber==5"
                    style="max-width:820px;"
                  >
                    <div class="mb-4">
                      <h4
                        class="font-size-18"
                        style="font-weight: bold; text-decoration: underline;"
                      >
                        {{ testData.diagnosa.title[1] }}
                      </h4>
                    </div>

                    <div
                      class="text-left mb-5"
                      style="color:black;"
                    >
                      <div
                        v-for="(question, index) in testData.diagnosa.questions[2]"
                        :key="index"
                        class="mt-4"
                        :set="v = $v.data_diagnosa.data3.$each[index]"
                      >
                        <div style="display: flex;">
                          <label
                            style="min-width:26px; float: left;"
                            class="mr-2"
                          >{{ index+21 }}.</label>
                          <label>{{ question }}</label>
                        </div>
                        <div
                          class="row mb-4 mt-2"
                          style="display: flex; justify-content: center;"
                          :class="{ 'is-invalid': submitted_final && v.answer.$error }"
                        >
                          <div
                            v-for="(answer, index_answer) in answers_diagnosa"
                            :key="index_answer"
                            class="m-2"
                            style="justify-content: center; flex-direction: column;"
                          >
                            <div
                              class="text-center"
                              style="display: flex; justify-content: center;"
                            >
                              <input
                                v-model="data_diagnosa.data3[index].answer"
                                type="radio"
                                :value="answer.value"
                                style="vertical-align: middle; float: left; margin-top:5px;"
                              >
                              <label style="margin-left: 15px;">{{ answer.value }}</label>
                            </div>
                            <p
                              class="text-center"
                              style="max-width:150px"
                            >
                              {{ answer.text }}
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="submitted_final && !v.answer.$error.required"
                          class="invalid-feedback"
                        >
                          Jawaban harus dipilih!
                        </div>
                        <hr>
                      </div>
                    </div>

                    <div class="mb-4 mt-5">
                      <h4
                        class="font-size-18"
                        style="font-weight: bold; text-decoration: underline;"
                      >
                        {{ testData.symptom.title }}
                      </h4>
                    </div>

                    <div
                      class="text-left"
                      style="color:black;"
                    >
                      <div
                        v-for="(question, index) in testData.symptom.questions"
                        :key="index"
                        class="mt-4"
                        :set="v = $v.data_symptom.$each[index]"
                      >
                        <div style="display: flex;">
                          <label
                            style="min-width:26px; float: left;"
                            class="mr-2"
                          >{{ index+23 }}.</label>
                          <label>{{ question }}</label>
                        </div>
                        <div
                          class="row mb-4 mt-2"
                          style="display: flex; justify-content: center;"
                          :class="{ 'is-invalid': submitted_final && v.answer.$error }"
                        >
                          <div
                            v-for="(answer, index_answer) in answers_symptom"
                            :key="index_answer"
                            class="m-2"
                            style="justify-content: center; flex-direction: column;"
                          >
                            <div
                              class="text-center"
                              style="display: flex; justify-content: center;"
                            >
                              <input
                                v-model="data_symptom[index].answer"
                                type="radio"
                                :value="answer.value"
                                style="vertical-align: middle; float: left; margin-top:5px;"
                              >
                              <label style="margin-left: 15px;">{{ answer.value }}</label>
                            </div>
                            <p
                              class="text-center"
                              style="max-width:150px"
                            >
                              {{ answer.text }}
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="submitted_final && !v.answer.$error.required"
                          class="invalid-feedback"
                        >
                          Jawaban harus dipilih!
                        </div>
                        <hr>
                      </div>
                    </div>

                    <div
                      class="mt-4 text-center form-group"
                      :class="{ 'is-invalid': submitted_final && ($v.data_diagnosa.data3.$invalid || $v.data_symptom.$invalid) }"
                    >
                      <button
                        class="btn btn-secondary w-md waves-effect waves-light m-1"
                        style="width:180px"
                        @click="onNextButtonClick(4, false)"
                      >
                        Sebelumnya
                      </button>
                      <button
                        class="btn btn-success w-md waves-effect waves-light m-1"
                        style="width:260px"
                        @click="onFinishButtonClick()"
                      >
                        Selesai
                      </button>
                    </div>
                    <div 
                      v-if="submitted_final && ($v.data_diagnosa.data3.$invalid || $v.data_symptom.$invalid)" 
                      class="invalid-feedback"
                      style="font-size:18px"
                    >
                      Harap menjawab semua pertanyaan!
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