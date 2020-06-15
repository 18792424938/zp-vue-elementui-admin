<template>
  <div>

    <el-upload
      :headers="headers()"
      :class="className"
      :action="this.$http.defaults.baseURL+'/fileupload/file/upload'"
      :show-file-list="showFileList"
      :multiple="multiple"
      :file-list="fileList"
      :data="params"
      :accept="accept"
      :list-type="listType"
      :limit="limit"
      :on-progress="handleProgress"
      :on-change	="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove">
      <div v-if="className=='avatar-uploader'" >
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div v-else class="upload-default">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传{{accept}}文件，且不超过10MB</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
  /**
   * 说明
   * className == avatar-uploader 用于头像 只会有一个
   */
  export default {
    name: 'fileupload',
    data () {
      return {
        avatarUrl: '',
        fileList: [], // [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        fileListNow: []// [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'},encode:"",previewUrl: 'https://xxx.cdn.com/xxx.jpg'},]//后台请求的
      }
    },
    props: {
      className: {
        type: String,
        default: ''
      },
      showFileList: {
        type: Boolean,
        default: true
      }, // 是否显示已上传文件列表
      multiple: {
        type: Boolean,
        default: false
      }, // 是否支持多选文件
      ids: {// 数据的id集合
        type: Array,
        default: () => {
          return []
        }
      },
      params: {
        type: Object,
        default: () => {
          return {}
        }
      }, // 上传时附带的额外参数
      accept: {
        type: String,
        default: ''
      }, // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）.doc,.docx,.xlsx,.xls
      listType: {
        type: String,
        default: 'text'
      }, // 文件列表的类型	string	text/picture/picture-card	text
      limit: {
        type: Number,
        default: 10
      }, // 最大允许上传个数	number
      onRemove: {
        type: Function,
        default: (file, fileList) => {

        }
      }, // 文件列表移除文件时的钩子	function(file, fileList)
      onSuccess: {
        type: Function,
        default: (response, file, fileList) => {

        }
      },
      Function, // 文件上传成功时的钩子	function(response, file, fileList)	—
      onError: {
        type: Function,
        default: (err, file, fileList) => {

        }
      }, // 文件上传失败时的钩子	function(err, file, fileList)
      onProgress: {
        type: Function,
        default: (event, file, fileList) => {

        }
      }, // 文件上传时的钩子	function(event, file, fileList)
      onChange: {
        type: Function,
        default: (file, fileList) => {

        }
      }// 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	function(file, fileList)

    },
    watch: {
      ids: {
        handler: function (val, oldVal) {
          if (JSON.stringify(val) != JSON.stringify(oldVal)) {
            debugger
            this.refreshFileList()
          }
        },
        deep: true
      }
    },
    mounted () {
      this.initFileList()
  },
    methods: {
      headers () {
        return {token: this.$cookie.get('token') || sessionStorage.getItem('token')}
      },
      refreshFileList () {
        if (this.ids.length) {
          this.$http({
            url: `/fileupload/file/fileList`,
            method: 'post',
            data: this.$http.adornData(this.ids, false)
          }).then(({data}) => {
            if (data.code == 0) {
              this.fileListNow = data.data
            }
          })
        } else {
          this.fileList = []
          this.fileListNow = []
        }
      },
      initFileList () {
        if (this.ids.length) {
          this.$http({
            url: `/fileupload/file/fileList`,
            method: 'post',
            data: this.$http.adornData(this.ids, false)
          }).then(({data}) => {
            if (data.code == 0) {
              this.fileList = data.data
              this.fileListNow = data.data
              if (this.className == 'avatar-uploader') { // 头像专用
                if (data.data.length > 0) {
                  this.avatarUrl = data.data[0].url
                }
              }
            }
          })
        } else {
          this.fileList = []
          this.fileListNow = []
        }
      },
      handleSuccess (response, file, fileList) {
        if (response.code == 0 && response.data) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          var returnData = JSON.parse(JSON.stringify(this.ids))
          if (this.className == 'avatar-uploader') { // 头像专用
            returnData = [response.data.id]
            this.avatarUrl = response.data.url
          } else {
            returnData.push(response.data.id)
          }
          this.$emit('refresh', returnData)
          this.onSuccess(response, file, fileList)
          file.id = response.data.id
        } else {
          for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].uid == file.uid) {
              fileList.splice(i, 1)
              break
            }
          }
          // 删除
          this.$message.error(response.msg)
        }
      },
      handleProgress (event, file, fileList) {

      },
      handleChange (file, fileList) {

      },
      handleError (err, file, fileList) {
        this.$message.error('网络异常,请稍后再试')
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].uid == file.uid) {
            fileList.splice(i, 1)
            break
          }
        }
      },
      handleRemove (file, fileList) {
        const returnData = JSON.parse(JSON.stringify(this.ids))
        if (returnData.indexOf(file.id) > -1) {
          returnData.splice(returnData.indexOf(file.id), 1)
          this.$emit('refresh', returnData)
          this.onRemove(file, fileList)
        }
      }

    }
  }
</script>

<style  lang="scss">
  .upload-default{
    text-align: left;
  }
  /*头像*/
  .avatar-uploader{
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

</style>
