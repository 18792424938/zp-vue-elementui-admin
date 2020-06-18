<template>
  <div class="main-config">
    <div class="search-group">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.key" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="tableloading"
      :data="tableData"
      border>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="username"
        label="账号">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="realname"
        label="姓名">
      </el-table-column>
      <!--<el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>



  </div>
</template>

<script>
  export default {
    name: 'online-list',
    data () {
      return {
        tableloading: false,
        tableData: [],
        searchForm: {
          key: ''
        }
      }
    },
    activated () {
      this.getDataList()
  },
    methods: {
      getDataList () {
        this.tableloading = true
        this.$http({
          url: `/sys/conmon/onlineuser`,
          method: 'get',
          params: this.$http.adornParams({
            key: this.searchForm.key
          })
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.tableData = data.data
          }
        }).finally((res) => {
          this.tableloading = false
        })
      },
      // 删除
      deleteHandle (row) {
        this.$confirm(`确定要删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/sys/conmon/delonlineuser`,
            method: 'get',
            params: this.$http.adornParams({
              key: row.key
            })
          }).then(({data}) => {
            if (data.code == 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          }).finally((res) => {
            this.tableloading = false
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
