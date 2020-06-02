<template>
  <div class="main-config">
    <div class="search-group">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="searchForm.ip" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="服务名称">
          <el-input v-model="searchForm.system" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="方法名称">
          <el-input v-model="searchForm.method" placeholder="请输入" clearable></el-input>
        </el-form-item>



        <el-form-item label="请求时间">
          <el-date-picker
            v-model="searchForm.times"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--:default-expand-all="true" 默认展开全部-->
    <el-table
      v-loading="tableloading"
      :data="tableData"
      border>
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="method"
        label="请求方式">
      </el-table-column>

      <el-table-column
        width="100px"
        prop="time"
        label="耗时(ms)">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作地址">
      </el-table-column>
      <el-table-column
        min-width="100px"
        prop="system"
        label="系统名称">
      </el-table-column>
      <!--<el-table-column
        :show-overflow-tooltip="true"
        prop="method"
        label="返回数据">
      </el-table-column>-->
      <!--<el-table-column
        :show-overflow-tooltip="true"
        prop="method"
        label="请求方法">
      </el-table-column>-->
     <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="params"
        label="参数">
      </el-table-column>-->
      <el-table-column
        min-width="100px"
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        width="150px"
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="80px"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="infoView(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
    -->
    <div class="pager-footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "log-list",
    data() {
      return {
        pager:{
          dialogLogVisible:false,
          currentPage:1,
          currentSize:10,
          total:0,
        },
        tableloading:false,
        tableData: [],
        searchForm:{
          username: "",
          method: "",
          system: "",
          ip: "",
          times:[]
        },
      }
    },
    activated() {
      this.getDataList();
    },
    methods: {
      getDataList() {
        const {username,method,system,ip,times} = this.searchForm

        const submit = {
          currentPage: this.pager.currentPage,
          currentSize: this.pager.currentSize,
          startDate:times&&times.length>0?times[0]:"",
          endDate:times&&times.length>0?times[1]:"",
        };

        Object.assign(submit,{username,method,system,ip})
        console.log("submit",submit);

        this.tableloading = true;
        this.$http({
          url: `/log/log/list`,
          method: 'get',
          params:this.$http.adornParams(submit)
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            if(!data.data.records.length&&this.pager.currentPage>1){
              this.handleCurrentChange(this.pager.currentPage-1);
            }else{
              this.pager.total = data.data.total
              this.tableData = data.data.records;
            }
          }
        }).finally((res) => {
          this.tableloading = false
        })
      },
      //新增或者修改
      infoView(row) {
        this.$http({
          url: `/log/log/info/${row.id}`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {

          }
        }).finally((res) => {

        })
      },

      // 每页数
      handleSizeChange (val) {
        this.pager.currentSize = val
        this.pager.currentPage = 1
        this.getDataList()
      },
      // 当前页
      handleCurrentChange (val) {
        this.pager.currentPage = val
        this.getDataList()
      },
    }
  }
</script>

<style scoped>

</style>
