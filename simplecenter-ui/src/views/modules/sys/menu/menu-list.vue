<template>
  <div class="main-config">

    <div class="button-group">
      <el-select v-model="systemId" @change="systemChange" placeholder="请选择" >
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
          <dict dictType="menu_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="icon"
        width="60"
        label="图标" >
        <template slot-scope="scope">
          <i :class="'iconfont icon'+scope.row.icon"></i>
        </template>
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
            ref="parentPopover"
            @show="popoverShow"
            v-model="popoverVisible"
            trigger="click">
            <div style="max-height: 450px;overflow: auto;padding: 10px 5px">
              <el-tree
                v-loading="treeLoading"
                :data="menuTree"
                :props="{children:'children',label:'name'}"
                :expand-on-click-node="false"
                :default-expand-all="true"
                @node-click="menuSelectHandle">
              </el-tree>
            </div>
          </el-popover>
          <el-input placeholder="点击选择上级菜单" readonly v-model="menuForm.parentName"  v-popover:parentPopover clearable></el-input>
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
          <el-switch
            v-model="menuForm.enabled"
            :active-value="10"
            :inactive-value="20"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="权限码:" prop="perms">
          <el-input v-model="menuForm.perms" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-popover
            placement="bottom"
            width="308"
            ref="iconPopover"
            @show="popoverIconShow"
            v-model="popoverIconVisible"
            trigger="click">
            <div style="min-300px: 450px;max-height: 450px;overflow: auto;padding: 10px 5px">
              <div class="menudiv" v-for="item in icons" @click="chooseIcon(item)">
                <i class="iconfont menuicon"  :class="'icon'+ item"></i>
              </div>
            </div>
          </el-popover>
          <el-input :prefix-icon="'iconfont icon'+menuForm.icon" placeholder="点击选择图标" readonly v-model="menuForm.icon"  v-popover:iconPopover clearable></el-input>
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
  import iconfont from '@/assets/icon/iconfont/iconfont.json';
  export default {
    name: "menu-list",
    data() {
      return {
        treeLoading:false,
        popoverIconVisible:false,
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

        },
        icons:[],
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
        this.tableData= [];
        this.getTree();
      },
      //显示上级菜单选择
      popoverShow(){
        if(this.systemId){
          this.treeLoading = true;
          this.$http({
            url: `/sys/menu/menuTree`,
            method: 'get',
            params: this.$http.adornParams({systemId:this.systemId})
          }).then(({data}) => {
            if (data.code == 0 && data.data) {
              this.menuTree = data.data
            }
          }).finally((res) => {
            this.treeLoading = false;
          })
        }
      },
      //显示对应的icon
      popoverIconShow(){
        this.icons = [];
        iconfont.glyphs.forEach(item=>{
          this.icons.push(item.font_class);
        })
      },
      chooseIcon(item){
        this.menuForm.icon = item;
        this.popoverIconVisible = false;
      },
      //点击树形菜单
      menuSelectHandle(data,node,component){
        this.menuForm.parentId = data.id
        this.menuForm.parentName = data.name
        this.popoverVisible = false;
      },
      //新增或者修改
      addOrUpdateView(row) {

        if(!this.systemId){
          this.$message.error("请选择系统")
          return
        }
        this.menuForm.id = ""
        this.menuForm.parentId = ""
        this.menuForm.parentName = ''
        this.menuForm.routeName = ''
        this.menuForm.routePath = ''
        this.menuForm.componentUrl = ''

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
            url: `/sys/menu/delete/${row.id}`,
            method: 'get'
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
  .menudiv{
    float: left;
    margin: 5px;
    cursor: pointer;
  }
  .menudiv:hover{
    border: #2DA0B9;
  }
  .menuicon{
    width:30px;
    height:30px;
    display: block;
    color: black;
  }
</style>
