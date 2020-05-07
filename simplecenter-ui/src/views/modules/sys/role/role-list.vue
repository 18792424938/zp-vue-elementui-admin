<template>
  <div class="main-config">
    <div class="search-group">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" @click="addOrUpdateView()">新增</el-button>
    </div>
    <!--:default-expand-all="true" 默认展开全部-->
    <el-table
      v-loading="tableloading"
      :data="tableData"
      border>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateView(scope.row)">修改</el-button>
          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
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
      width="50%">
      <el-form v-loading="roleFormloading" :model="roleForm" :rules="roleRules" ref="roleForm" label-width="120px">
        <el-form-item  label="名称:" prop="name">
          <el-input v-model="roleForm.name" :readonly="roleForm.id?true:false" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item  label="菜单:" >
          <el-tree
            :data="menuData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="{children:'children',label:'name'}">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "role-list",
    data() {
      return {
        pager:{
          currentPage:1,
          currentSize:10,
          total:0,
        },
        tableloading:false,
        roleFormloading: false,
        dialogVisible: false,
        tableData: [],
        searchForm:{
          name: ""
        },
        menuData:[],
        roleForm: {
          id: "",
          name: ""
        },
        roleRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
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
          url: `/sys/role/list`,
          method: 'get',
          params:this.$http.adornParams({
            currentPage: this.pager.currentPage,
            currentSize: this.pager.currentSize,
            name: this.searchForm.name
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
      //新增或者修改
      addOrUpdateView(row) {
        this.dialogVisible = true
        this.roleFormloading = true;
        this.roleForm.id = "";

        this.menuData = [];
        this.$nextTick(() => {
          this.$refs["roleForm"].resetFields();
          this.$refs.tree.setCheckedKeys([]);
        })

        if (row) {//修改
          this.$http({
            url: `/sys/role/infoMenu/${row.id}`,
            method: 'get'
          }).then(({data}) => {
            if (data.code == 0 && data.data) {

              this.$set(this,'roleForm',data.data.role)
              this.menuData = data.data.systemEntitieList
              this.$nextTick(()=>{
                const allSelect = data.data.systemIds.concat(data.data.menuIds)
                const allSelecteaf = []
                allSelect.forEach(item=>{
                  const node = this.$refs.tree.getNode(item)
                  if(node.isLeaf){
                    allSelecteaf.push(item);
                  }
                })
                debugger
                this.$refs.tree.setCheckedKeys(allSelecteaf);


              })
            }
          }).finally((res) => {
            this.roleFormloading = false;
          })
        } else {
          this.$http({
            url: `/sys/role/menu`,
            method: 'get'
          }).then(({data}) => {
            if (data.code == 0 && data.data) {
              this.menuData = data.data
            }
          }).finally((res) => {
            this.roleFormloading = false;
          })
        }

      },
      //菜单保存
      addOrUpdateHandle() {
        this.$refs["roleForm"].validate((valid) => {
          if (valid) {

            const checkedNodes = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
            this.roleForm.systemIds = [];
            this.roleForm.menuIds = [];
            checkedNodes.forEach(item=>{
              const node = this.$refs.tree.getNode(item)
              if(node.level==1){
                this.roleForm.systemIds.push(item)
              }else{
                this.roleForm.menuIds.push(item)
              }
            })


            this.roleFormloading = true;
            this.$http({
              url: `/sys/role/${this.roleForm.id?'update':'save'}`,
              method: 'post',
              data: this.$http.adornData(this.roleForm)
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
              this.roleFormloading = false;
            })
          }
        })

      },
      //刪除
      deleteHandle(row) {
        this.$confirm(`删除包括该角色所有级联关系,确认删除${row.name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/sys/role/delete`,
            method: 'post',
            data: this.$http.adornData([row.id],false)
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

</style>
