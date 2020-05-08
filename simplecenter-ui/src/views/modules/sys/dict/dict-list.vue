<template>
  <div class="main-config">
    <div class="search-group">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="类型">
          <el-input v-model="searchForm.type" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchForm.description" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="字段名">
          <el-input v-model="searchForm.dictName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="字段值">
          <el-input v-model="searchForm.value" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" @click="addView()">新增</el-button>
      <el-button type="danger" @click="deleteHandle()">批量删除</el-button>
    </div>
    <!--:default-expand-all="true" 默认展开全部-->
    <el-table
      v-loading="tableloading"
      :data="tableData"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="dictName"
        label="字段名">
      </el-table-column>
      <el-table-column
        prop="value"
        label="字段值">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==10">启用</el-tag>
          <el-tag type="danger" v-if="scope.row.status==20">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="updateView(scope.row)">修改</el-button>
          <el-button type="text" @click="cloneView(scope.row)">克隆</el-button>
          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


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
      width="1250px">
      <el-form v-loading="dictFormloading" class="demo-form-inline" :inline="true"
               :model="dictForm"  ref="dictForm" >
        <div v-for="(domain, index) in dictForm.dictFormDynamic" :key="index">
          <el-form-item  label-width="82px" label="字段名称:"
                         :rules="{
                            required: true, message: '字段名称必填', trigger: 'blur'
                          }"
                         :prop="'dictFormDynamic.' + index + '.dictName'">
            <el-input v-model="domain.dictName"  placeholder="请输入" clearable></el-input>
          </el-form-item>
         <el-form-item  label-width="70px" label="字段值:" :rules="{
                            required: true, message: '字段值必填', trigger: 'blur'
                          }"
                         :prop="'dictFormDynamic.' + index + '.value'">
            <el-input v-model="domain.value" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label-width="55px" label="类型:"  :rules="{
                            required: true, message: '类型必填', trigger: 'blur'
                          }"
                        :prop="'dictFormDynamic.' + index + '.type'">
            <el-input v-model="domain.type" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label-width="55px" label="描述:"  :rules="{
                            required: true, message: '描述必填', trigger: 'blur'
                          }"
                        :prop="'dictFormDynamic.' + index + '.description'">
            <el-input v-model="domain.description" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label-width="55px" label="排序:" :rules="{
                            required: true, message: '排序必填', trigger: 'blur'
                          }"
                        :prop="'dictFormDynamic.' + index + '.orderNum'">
            <el-input-number style="width:100px" v-model="domain.orderNum" controls-position="right" :min="1"
                             :max="10000"></el-input-number>
          </el-form-item>
          <el-form-item label-width="55px" label="状态:" :rules="{
                            required: true, message: '状态必填', trigger: 'change'
                          }"
                        :prop="'dictFormDynamic.' + index + '.status'">
            <el-switch
              v-model="domain.status"
              :active-value="10"
              :inactive-value="20"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label-width="0px">
            <el-button type="text" @click="delRocord(index)">删除</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRocord">添 加</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHandle">确 定</el-button>
      </div>
    </el-dialog>

    <!--菜单新增或者修改-->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisibleUpdate"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="50%">
      <el-form v-loading="dictFormUpdateloading"
               :model="dictFormUpdate" :rules="dictRules" ref="dictFormUpdate" label-width="100px">
        <el-form-item  label="字段名称:" prop="dictName">
          <el-input v-model="dictFormUpdate.dictName"  placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item  label="字段值:" prop="value">
          <el-input v-model="dictFormUpdate.value" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-input v-model="dictFormUpdate.type" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="dictFormUpdate.description" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="description">
          <el-input-number style="width:100px" v-model="dictFormUpdate.orderNum" controls-position="right" :min="1"
                           :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-switch
            v-model="dictFormUpdate.status"
            :active-value="10"
            :inactive-value="20"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "dict-list",
    data() {
      return {
        pager:{
          currentPage:1,
          currentSize:10,
          total:0,
        },
        multipleSelection:[],
        tableloading:false,
        dictFormloading: false,
        dictFormUpdateloading: false,
        dialogVisibleUpdate: false,
        dialogVisible: false,
        tableData: [],
        searchForm:{
          dictName: "",
          type:"",
          description:"",
          value:"",
        },
        dictForm:{
          dictFormDynamic:[{
            id: "",
            dictName: "",
            value: "",
            type: "",
            description:"",
            orderNum:"",
            status:10
          }]
        },
        dictFormUpdate: {
          id: "",
          dictName: "",
          value: "",
          type: "",
          description:"",
          orderNum:"",
          status: 10,
        },
        dictRules: {
          dictName: [
            {required: true, message: '字段名必填', trigger: 'blur'},
          ],
          value: [
            {required: true, message: '字段值必填', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '字段类型', trigger: 'blur'},
          ],
          description: [
            {required: true, message: '字段描述', trigger: 'blur'},
          ],
          orderNum: [
            {required: true, message: '排序', trigger: 'blur'},
          ],
          status: [
            {required: true, message: '状态', trigger: 'change'},
          ],



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
          url: `/sys/dict/list`,
          method: 'get',
          params:this.$http.adornParams({
            currentPage: this.pager.currentPage,
            currentSize: this.pager.currentSize,
            dictName: this.searchForm.dictName,
            type:this.searchForm.type,
            description:this.searchForm.description,
            value:this.searchForm.value
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
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      addView(){
        this.dictForm.dictFormDynamic = [{
          id: "",
          dictName: "",
          value: "",
          type: "",
          description:"",
          orderNum:"",
          status:10
        }];
        this.dialogVisible = true;
      },
      addRocord(){
        this.dictForm.dictFormDynamic.push({
          id: "",
          dictName: "",
          value: "",
          type: "",
          description:"",
          orderNum:"",
          status:10
        })
      },
      delRocord(index){
        if(this.dictForm.dictFormDynamic.length){
          this.$message.error("最少保留一条")
          return
        }
        if (this.dictForm.dictFormDynamic[index]) {
          this.dictForm.dictFormDynamic.splice(index, 1)
        }
      },
      //修改
      updateView(row) {
        this.dialogVisibleUpdate = true
        this.dictFormUpdateloading = true;
        this.$nextTick(() => {
          this.$refs["dictFormUpdate"].resetFields();
        })
        this.$http({
          url: `/sys/dict/info/${row.id}`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.$set(this,'dictFormUpdate',data.data)
          }
        }).finally((res) => {
          this.dictFormUpdateloading = false;
        })
      },
      cloneView(row){
        this.$nextTick(() => {
          this.$refs["dictFormUpdate"].resetFields();
        })
        this.dialogVisibleUpdate = true;
        this.dictFormUpdateloading = true;
        this.$http({
          url: `/sys/dict/info/${row.id}`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.$set(this,'dictFormUpdate',data.data)
            this.$set(this.dictFormUpdate,'id',"")
          }
        }).finally((res) => {
          this.dictFormUpdateloading = false;
        })
      },
      addHandle(){
        this.$refs["dictForm"].validate((valid) => {
          if (valid) {
            this.dictFormloading = true;
            this.$http({
              url: `/sys/dict/saveAll`,
              method: 'post',
              data: this.$http.adornData(this.dictForm.dictFormDynamic,false)
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
              this.dictFormloading = false;
            })
          }
        })
      },
      //菜单保存
      updateHandle() {
        this.$refs["dictFormUpdate"].validate((valid) => {
          if (valid) {
            this.dictFormUpdateloading = true;
            this.$http({
              url: `/sys/dict/${this.dictFormUpdate.id?'update':'save'}`,
              method: 'post',
              data: this.$http.adornData(this.dictFormUpdate)
            }).then(({data}) => {
              if (data.code == 0 ) {
                this.$message({
                  message:  '操作成功',
                  type: 'success'
                });
                this.getDataList();
                this.dialogVisibleUpdate = false;
              }else{
                this.$message.error(data.msg)
              }
            }).finally((res) => {
              this.dictFormUpdateloading = false;
            })
          }
        })

      },
      //启用/禁用
      deleteHandle(row) {

        const ids = row ? [row.id] : this.multipleSelection.map(item => {
          return item.id
        })

        if(!ids.length){
          this.$message.error("请选择要删除的对象")
          return
        }

        this.$confirm(`确认删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/sys/dict/delete`,
            method: 'post',
            data: this.$http.adornData(ids,false)
          }).then(({data}) => {
            if (data.code == 0 ) {
              this.$message({
                message:  '删除成功',
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
  .demo-form-inline .el-input{
    width: 140px;
  }
</style>
