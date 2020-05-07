<template>
  <div class="main-config">
    <div class="button-group">
      <el-select v-model="systemId" @change="systemChange" placeholder="请选择" clearable>
        <el-option
          v-for="item in systemList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="addOrUpdateView()">新增</el-button>
    </div>
    <!--:default-expand-all="true" 默认展开全部-->
    <el-table
      v-loading="tableloading"
      :data="tableData"
      row-key="id"
      border
      highlight-current-row
      :tree-props="{'children': 'children',hasChildren:'hasChildren'}">
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="routeName"
        label="路由名称">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="routePath"
        label="路由地址">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="componentUrl"
        label="组件路径">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="perms"
        label="权限码">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="type"
        width="60"
        label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type==10">目录</span>
          <span v-if="scope.row.type==20">菜单</span>
          <span v-if="scope.row.type==30">按钮</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="icon"
        width="60"
        label="图标" >
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="orderNum"
        width="60"
        label="排序">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="enabled"
        width="50"
        label="启用">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled==10">启用</span>
          <span v-if="scope.row.enabled==20">禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateView(scope.row)">修改</el-button>
          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--菜单新增或者修改-->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="50%">
      <el-form v-loading="menuFormloading" :model="menuForm" :rules="menuRules" ref="menuForm" label-width="120px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="上级菜单:" prop="parentId">
          <el-popover
            placement="bottom"
            width="300"
            @show="popoverShow"
            trigger="hover">
            <el-tree
              :data="menuTree"
              :props="{children:'children',label:'name'}"
              :expand-on-click-node="false"
              :default-expand-all="true"
              @node-click="menuSelectHandle">
            </el-tree>
            <el-input placeholder="请选择" readonly v-model="menuForm.parentName" slot="reference"  clearable></el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="类型:" prop="type">
          <el-radio-group v-model="menuForm.type" @change="typeChange"  clearable>
            <el-radio :label="10">目录</el-radio>
            <el-radio :label="20">菜单</el-radio>
            <el-radio :label="30">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menuForm.type!=10" label="路由名称:" prop="routeName">
          <el-input v-model="menuForm.routeName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="menuForm.type!=10" label="路由路径:" prop="routePath">
          <el-input v-model="menuForm.routePath" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="menuForm.type!=10" label="组件路径:" prop="componentUrl">
          <el-input v-model="menuForm.componentUrl" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序号:" prop="orderNum">
          <el-input-number v-model="menuForm.orderNum" controls-position="right" :min="1"
                           :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用:" prop="enabled">
          <el-radio-group v-model="menuForm.enabled">
            <el-radio :label="10">启用</el-radio>
            <el-radio :label="20">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限码:" prop="perms">
          <el-input v-model="menuForm.perms" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请选择" clearable></el-input>
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
    name: "menu-list",
    data() {
      return {
        tableloading:false,
        menuFormloading: false,
        dialogVisible: false,
        tableData: [],
        systemList: [],
        menuTree:[],
        popoverVisible:false,
        systemId:"",
        menuForm: {
          id: "",
          name: "",
          type: 10,
          perms: "",
          routeName: "",
          routePath: "",
          componentUrl: "",
          icon: "",
          orderNum: "",
          enabled: 10,
          systemId: "",
          parentId: "",
          parentName: "",
        },
        menuRules: {
          name: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '请输入菜单名称', trigger: 'change'},
          ],
          enabled: [
            {required: true, message: '请选择启用状态', trigger: 'change'},
          ],
          orderNum: [
            {required: true, message: '请输入排序号', trigger: 'blur'},
          ],

        }
      }
    },
    activated() {
      this.getSystemAll();
    },
    methods: {
      getTree() {
        this.tableloading = true;
        this.$http({
          url: `/sys/menu/tree/${this.systemId}`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.tableData = data.data
          }
        }).finally((res) => {
          this.tableloading = false
        })
      },
      getSystemAll() {
        this.$http({
          url: `/sys/system/listAll`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.systemList = data.data
            if(this.systemList&&this.systemList.length){
              this.systemId = this.systemList[0].id
              this.getTree();
            }

          }
        }).finally((res) => {

        })
      },
      // 选择系统 查询对应的菜单
      systemChange(val) {
        this.getTree();
      },
      //显示上级菜单选择
      popoverShow(){
        if(this.systemId){
          this.$http({
            url: `/sys/menu/menuTree`,
            method: 'get',
            params: this.$http.adornParams({systemId:this.systemId})
          }).then(({data}) => {
            if (data.code == 0 && data.data) {
              this.menuTree = data.data
            }
          }).finally((res) => {

          })
        }
      },
      //点击树形菜单
      menuSelectHandle(data,node,component){
        this.menuForm.parentId = data.id
        this.menuForm.parentName = data.name
      },
      //新增或者修改
      addOrUpdateView(row) {
        if(!this.systemId){
          this.$message.error("请选择系统")
        }
        this.menuForm.parentId = ""
        this.menuForm.parentName = ''

        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs["menuForm"].resetFields();
        })
        if (row) {//修改
          this.menuFormloading = true;
          this.$http({
            url: `/sys/menu/info/${row.id}`,
            method: 'get'
          }).then(({data}) => {
            if (data.code == 0 && data.data) {
              this.$set(this,'menuForm',data.data)
            }
          }).finally((res) => {
            this.menuFormloading = false;
          })
        } else {//新增
          this.menuFormloading = false;
        }


      },
      //菜单保存
      addOrUpdateHandle() {
        this.$refs["menuForm"].validate((valid) => {
          if (valid) {
            this.menuFormloading = true;
            this.menuForm.systemId = this.systemId
            this.$http({
              url: `/sys/menu/${this.menuForm.id?'update':'save'}`,
              method: 'post',
              data: this.$http.adornData(this.menuForm)
            }).then(({data}) => {
              if (data.code == 0 ) {
                this.$message({
                  message:  '操作成功',
                  type: 'success'
                });
                this.getTree();
                this.dialogVisible = false;
              }else{
                this.$message.error(data.msg)
              }
            }).finally((res) => {
              this.menuFormloading = false;
            })
          }
        })

      },
      deleteHandle(row) {
        this.$confirm(`删除包括该菜单所有级联关系,确认删除${row.name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/sys/menu/delete`,
            method: 'post',
            data: this.$http.adornData([row.id],false)
          }).then(({data}) => {
            if (data.code == 0 ) {
              this.$message({
                message:  '删除成功',
                type: 'success'
              });
              this.getTree();
            }else{
              this.$message.error(data.msg)
            }
          }).finally((res) => {
            this.tableloading = false
          })
        })
      },
      typeChange(val) {
        if (val == 10) {
          this.menuForm.routeName = "";
          this.menuForm.routePath = "";
          this.menuForm.componentUrl = "";
          this.menuForm.icon = "";
        }

      }
    }
  }
</script>

<style scoped>

</style>
