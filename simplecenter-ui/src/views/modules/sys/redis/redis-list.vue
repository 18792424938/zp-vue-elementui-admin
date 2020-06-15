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
        prop="key"
        label="键">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="data"
        label="数据">
      </el-table-column>
      <el-table-column
        prop="expire"
        label="剩余时间(秒)">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
          <el-button type="text" @click="view(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="600px">
      <el-form  :model="userForm"  ref="userForm" label-width="120px">
        <el-form-item label="键:" prop="username">
          {{userForm.key}}
        </el-form-item>
        <el-form-item label="剩余时间(秒):" prop="username">
          {{userForm.expire}}
        </el-form-item>
        <el-form-item label="数据:" prop="realname">
          {{userForm.data}}
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'redis-list',
    data () {
      return {
        dialogVisible: false,
        tableloading: false,
        tableData: [],
        searchForm: {
          key: ''
        },
        userForm: {
          key: '',
          data: '',
          expire: ''
        }
      }
    },
    activated () {
      debugger
      this.getDataList()
  },
    methods: {
      getDataList () {
        this.tableloading = true
        this.$http({
          url: `/sys/conmon/redislist`,
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
      // 启用/禁用
      deleteHandle (row) {
        this.$confirm(`确定要删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/sys/conmon/delredis`,
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
      },
      // 查看详情
      view (row) {
        this.dialogVisible = true
        this.userForm.key = row.key
        this.userForm.data = row.data
        this.userForm.expire = row.expire
      }

    }
  }
</script>

<style scoped>

</style>
