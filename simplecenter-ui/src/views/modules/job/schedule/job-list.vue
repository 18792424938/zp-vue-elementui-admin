<template>
  <div class="main-config">
    <div class="search-group">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.beanName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="方法名">
          <el-input v-model="searchForm.methodName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" @click="addOrUpdateView()">新增</el-button>
      <el-button type="primary" @click="viewLog()">查看日志</el-button>
    </div>
    <!--:default-expand-all="true" 默认展开全部-->
    <el-table
      v-loading="tableloading"
      :data="tableData"
      border>
      <el-table-column
        prop="beanName"
        label="bean名称">
      </el-table-column>
      <el-table-column
        prop="methodName"
        label="方法名">
      </el-table-column>
      <el-table-column
        width="120px"
        prop="params"
        label="参数">
      </el-table-column>
      <el-table-column
        width="130px"
        prop="cronExpression"
        label="cron表达式">
      </el-table-column>
      <el-table-column
        prop="status"
        width="70px"
        label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==0">已启用</el-tag>
          <el-tag type="danger" v-if="scope.row.status==1">已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="150px"
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="250px"
        label="操作">
        <template slot-scope="scope">

          <el-button type="text" @click="runHandle(scope.row)">立即执行</el-button>
          <el-button type="text" @click="resumeHandle(scope.row)">恢复</el-button>
          <el-button type="text" @click="pauseHandle(scope.row)">停止</el-button>
          <el-button type="text" @click="addOrUpdateView(scope.row)">修改</el-button>
          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
         <!-- <el-button type="text" @click="addOrUpdateView(scope.row)">修改</el-button>
          <el-button type="text" @click="deleteHandle(scope.row)">{{scope.row.status==10?'禁用':'启用'}}</el-button>
          <el-button type="text" @click="resetPasswordHandle(scope.row)">重置密码</el-button>-->
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


    <!--菜单新增或者修改-->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="60%">
      <el-form v-loading="scheduleFormloading" :model="scheduleForm" :rules="scheduleRules" ref="scheduleForm" label-width="120px">
        <el-form-item  label="bean名称:" prop="beanName">
          <el-input v-model="scheduleForm.beanName"  placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="方法名:" prop="methodName">
          <el-input v-model="scheduleForm.methodName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item  label="cron表达式:" prop="cronExpression">
          <el-input v-model="scheduleForm.cronExpression" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item  label="参数:" prop="params">
          <el-input v-model="scheduleForm.params" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="scheduleForm.remark" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateHandle">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="日志"
      :visible.sync="dialogLogVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="85%">
      <div>
        <el-table
          v-loading="tableLogloading"
          :data="tableLogData"
          border>
          <el-table-column
            prop="beanName"
            label="bean名称">
          </el-table-column>
          <el-table-column
            prop="methodName"
            label="方法名">
          </el-table-column>
          <el-table-column
            prop="params"
            label="参数">
          </el-table-column>
          <el-table-column
            prop="error"
            label="错误信息">
          </el-table-column>
          <el-table-column
            prop="times"
            label="耗时(ms)">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status==0">成功</el-tag>
              <el-tag type="danger" v-if="scope.row.status==1">失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
        </el-table>
        <div class="pager-footer">
          <el-pagination
            @size-change="handleSizeChangeLog"
            @current-change="handleCurrentChangeLog"
            :current-page="pagerLog.currentPage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pagerLog.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagerLog.total">
          </el-pagination>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "job-list",
    data() {
      return {
        dialogLogVisible:false,
        tableLogloading:false,
        tableLogData:[],
        pagerLog:{
          dialogLogVisible:false,
          currentPage:1,
          currentSize:10,
          total:0,
        },
        pager:{
          dialogLogVisible:false,
          currentPage:1,
          currentSize:10,
          total:0,
        },
        tableloading:false,
        scheduleFormloading: false,
        dialogVisible: false,
        tableData: [],
        searchForm:{
          beanName: "",
          methodName: ""
        },
        scheduleForm: {
          id: "",
          beanName: "",
          methodName: "",
          params: "",
          cronExpression: "",
          remark: "",
        },

        scheduleRules: {
          beanName: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
          methodName: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
          cronExpression: [
            {required: true, message: '必填', trigger: 'blur'},
          ]

        }
      }
    },
    activated() {
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.tableloading = true;
        this.$http({
          url: `/job/schedule/list`,
          method: 'get',
          params:this.$http.adornParams({
            currentPage: this.pager.currentPage,
            currentSize: this.pager.currentSize
          })
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
      viewLog(){
        this.dialogLogVisible = true;
        this.tableLogData = [];
        this.getLogDataList();
      },
      getLogDataList() {
        this.tableLogloading = true;
        this.$http({
          url: `/job/scheduleLog/list`,
          method: 'get',
          params:this.$http.adornParams({
            currentPage: this.pagerLog.currentPage,
            currentSize: this.pagerLog.currentSize
          })
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            if(!data.data.records.length&&this.pagerLog.currentPage>1){
              this.handleCurrentChangeLog(this.pagerLog.currentPage-1);
            }else{
              this.pagerLog.total = data.data.total
              this.tableLogData = data.data.records;
            }
          }
        }).finally((res) => {
          this.tableLogloading = false
        })
      },
      //新增或者修改
      addOrUpdateView(row) {
        this.dialogVisible = true;
        this.scheduleForm.id = "";
        this.$nextTick(() => {
          this.$refs["scheduleForm"].resetFields();
        })
        if (row) {//修改
          this.scheduleFormloading = true;
          this.$http({
            url: `/job/schedule/info/${row.id}`,
            method: 'get'
          }).then(({data}) => {
            if (data.code == 0 && data.data) {
              this.$set(this,'scheduleForm',data.data)
            }
          }).finally((res) => {
            this.scheduleFormloading = false;
          })
        }

      },
      //菜单保存
      addOrUpdateHandle() {
        this.$refs["scheduleForm"].validate((valid) => {
          if (valid) {
            this.scheduleFormloading = true;
            this.$http({
              url: `/job/schedule/${this.scheduleForm.id?'update':'save'}`,
              method: 'post',
              data: this.$http.adornData(this.scheduleForm)
            }).then(({data}) => {
              if (data.code == 0 ) {
                this.$message({
                  message:  '操作成功',
                  type: 'success'
                });
                this.getDataList();
                this.dialogVisible = false;
              }else{
                this.$message.error(data.msg)
              }
            }).finally((res) => {
              this.scheduleFormloading = false;
            })
          }
        })

      },
      //启用/禁用
      deleteHandle(row) {
        const ids = [row.id]
        this.$confirm(`确定要删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/job/schedule/delete`,
            method: 'POST',
            data:this.$http.adornData(ids,false)
          }).then(({data}) => {
            if (data.code == 0 ) {
              this.$message({
                message:  '操作成功',
                type: 'success'
              });
              this.getDataList();
            }else{
              this.$message.error(data.msg)
            }
          }).finally((res) => {
            this.tableloading = false
          })
        })
      },
      //立即执行
      runHandle(row) {
        this.tableloading = true
        const ids = [row.id]
        this.$http({
          url: `/job/schedule/run`,
          method: 'POST',
          data:this.$http.adornData(ids,false)
        }).then(({data}) => {
          if (data.code == 0 ) {
            this.$message({
              message:  '操作成功',
              type: 'success'
            });
            this.getDataList();
          }else{
            this.$message.error(data.msg)
          }
        }).finally((res) => {
          this.tableloading = false
        })
      },
      //停止
      pauseHandle(row) {
        this.tableloading = true
        const ids = [row.id]
        this.$http({
          url: `/job/schedule/pause`,
          method: 'POST',
          data:this.$http.adornData(ids,false)
        }).then(({data}) => {
          if (data.code == 0 ) {
            this.$message({
              message:  '操作成功',
              type: 'success'
            });
            this.getDataList();
          }else{
            this.$message.error(data.msg)
          }
        }).finally((res) => {
          this.tableloading = false
        })
      },
      //恢复
      resumeHandle(row) {
        this.tableloading = true
        const ids = [row.id]
        this.$http({
          url: `/job/schedule/resume`,
          method: 'POST',
          data:this.$http.adornData(ids,false)
        }).then(({data}) => {
          if (data.code == 0 ) {
            this.$message({
              message:  '操作成功',
              type: 'success'
            });
            this.getDataList();
          }else{
            this.$message.error(data.msg)
          }
        }).finally((res) => {
          this.tableloading = false
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

      // 每页数
      handleSizeChangeLog (val) {
        this.pagerLog.currentSize = val
        this.pagerLog.currentPage = 1
        this.getLogDataList()
      },
      // 当前页
      handleCurrentChangeLog (val) {
        this.pagerLog.currentPage = val
        this.getLogDataList()
      },


    }
  }
</script>

<style scoped>

</style>
