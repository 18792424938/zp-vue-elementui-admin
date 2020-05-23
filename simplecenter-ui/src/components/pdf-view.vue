<template>
  <div v-loading="pdfloading" class="pdf-view">
    <div style="margin: 10px 0px">
      <el-button v-if="!iframe" @click="moreHandle">更多操作</el-button>
      <el-button v-if="iframe" @click="back">返回</el-button>
    </div>
    <iframe v-if="iframe" :src="url" type="application/pdf" width="100%" style="height:300mm" ></iframe>
    <div v-else>
      <pdf
        class="pdf"
        v-for="i in pdfPages"
        :key="i"
        :src="pdfUrl"
        :page="i">
      </pdf>
    </div>

  </div>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
    name: "pdf-view",
    data() {
      return {
        pdfloading: false,
        pdfUrl: "",
        pdfPages: 1,
        iframe:false,
        loadingTask:null,
      }
    },
    props: {
      url: {
        type: String,
        default: ""
      },
    },
    components: {pdf},
    mounted() {

      this.initPdf();
    },
    methods: {
      initPdf() {
        this.pdfUrl = "";
        this.pdfPages = 1;
        this.pdfloading = true;
        this.loadingTask = pdf.createLoadingTask(this.url)
        this.loadingTask.then(item => {
          this.pdfUrl = this.loadingTask
          this.pdfPages = item.numPages
        }).catch((err) => {
          this.$message.error('pdf加载失败')
        }).finally(()=>{
          this.pdfloading = false;
        })
      },
      moreHandle(){
        this.iframe = true;
        this.loadingTask.destroy()
        this.loadingTask= null;
      },
      back(){
        this.iframe = false;
        this.initPdf();
      },

    }

  }
</script>

<style scoped>
  .pdf-view{

    width: 220mm;
    margin: 0 auto;
  }
  .pdf{
    border: 1px solid #3B3B3B;
  }
</style>
