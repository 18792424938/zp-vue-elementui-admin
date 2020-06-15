<template>
  <div>
    <el-form v-loading="centerFormloading" :model="centerForm" :rules="centerFormRules" ref="centerForm"
             label-width="120px">
      <el-form-item label="头像:" prop="logo">
        <fileupload @refresh="fileuploadRefresh" :ids="centerForm.logos" :showFileList="false"
                    className="avatar-uploader"></fileupload>
      </el-form-item>
      <el-form-item label="测试:" prop="logo">
        <fileupload @refresh="ceshiRefresh" :ids="centerForm.ceshi" accept=".doc,.docx,.xlsx,.xls"></fileupload>
        <div>
          <div v-for="item in fileListNow">
            {{item.name}}
            <el-button type="text" @click="preview(item)">预览</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateSelf">确 定</el-button>
    </div>

    <!--预览-->
    <el-dialog
      title="预览"
      :visible.sync="dialogPreviewVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="90%">
      <div >
        <pdfView v-if="dialogPreviewVisible" :url="previewPdfUrl" ></pdfView>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Fileupload from '@/components/fileupload/fileupload'
import pdfView from '@/components/pdf-view'

export default {
    name: 'updateinfo',
    data () {
      return {
        previewPdfUrl: '',
        dialogPreviewVisible: false,
        fileListNow: [],
        centerFormloading: false,
        centerForm: {
          logo: '',
          logos: [],
          ceshi: []
        },
        centerFormRules: {
          logo: [
            {required: true, message: '必填', trigger: 'change'}
          ]
        }
      }
    },
    components: {Fileupload, pdfView},
    methods: {
      ceshiRefresh (data) {
        this.centerForm.ceshi = data
        this.$http({
          url: `/fileupload/file/fileList`,
          method: 'post',
          data: this.$http.adornData(data, false)
        }).then(({data}) => {
          if (data.code == 0) {
            this.fileListNow = data.data
          }
        })
      },
      // 修改个人信息
      updateSelf () {
        this.centerForm.logo = this.centerForm.logos.length > 0 ? this.centerForm.logos[0] : ''
        this.$refs['centerForm'].validate((valid) => {
          if (valid) {
            var stringify = JSON.parse(JSON.stringify(this.centerForm))
            stringify.logos = null
            this.centerFormloading = true
            this.$http({
              url: `/sys/user/updateSelf`,
              method: 'post',
              data: this.$http.adornData(stringify)
            }).then(({data}) => {
              if (data.code == 0) {
                this.$message({
                  message: '修改成功!',
                  type: 'success'
                })
              } else {
                this.$message.error(data.msg)
              }
            }).finally((res) => {
              this.centerFormloading = false
            })
          }
        })
      },
      fileuploadRefresh (data) {
        this.centerForm.logos = data
      },
      // 预览
      preview (item) {
        this.$http({
          url: `/fileupload/file/findById`,
          method: 'get',
          params: this.$http.adornParams({id: item.id})
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            if (data.data.encode == 30) {
              this.dialogPreviewVisible = true
              this.previewPdfUrl = data.data.previewUrl
            } else if (data.data == 20) { // 转码中,请稍后再试
              this.$message.error('转码中,请稍后再试')
              this.dialogPreviewVisible = false
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
