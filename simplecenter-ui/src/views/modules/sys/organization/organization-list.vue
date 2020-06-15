<template>
  <div class="main-config">
    <div class="search-group">

    </div>
    <div class="button-group">
      <el-button type="primary" @click="addOrUpdateView()">新增</el-button>
    </div>
    <!--:default-expand-all="true" 默认展开全部-->
    <el-table
      v-loading="tableloading"
      :data="tableData"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="describe"
        label="描述"
        width="300">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <span v-if="scope.row.parentId">
            <el-button type="text" @click="addOrUpdateView(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
          </span>

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
      <el-form v-loading="organizationFormloading" :model="organizationForm" :rules="organizationRules" ref="organizationForm" label-width="120px">
        <el-form-item  label="名称:" prop="name">
          <el-input v-model="organizationForm.name"  placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="上级菜单:" prop="parentId">
          <el-popover
            v-if="!organizationForm.id"
            placement="bottom"
            width="300"
            ref="parentPopover"
            v-model="popoverVisible"
            trigger="click">
            <div style="max-height: 450px;overflow: auto;padding: 10px 5px">
              <el-tree
                :data="tableData"
                :props="{children:'children',label:'name'}"
                :expand-on-click-node="false"
                :default-expand-all="true"
                @node-click="orgSelectHandle">
              </el-tree>
            </div>
          </el-popover>
          <el-input placeholder="点击选择上级组织机构" readonly v-model="organizationForm.parentName"  v-popover:parentPopover></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="describe">
          <el-input v-model="organizationForm.describe" placeholder="请输入" clearable></el-input>
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
    name: 'organization-list',
    data () {
      return {
        popoverVisible: false,
        tableloading: false,
        organizationFormloading: false,
        dialogVisible: false,
        tableData: [],
        organizationForm: {
          id: '',
          name: '',
          describe: '',
          parentId: '',
          parentName: ''
        },
        organizationRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          parentId: [
            {required: true, message: '请选择父级菜单', trigger: 'change'}
          ]
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
          url: `/sys/organization/list`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.tableData = data.data
          }
        }).finally((res) => {
          this.tableloading = false
        })
      },
      // 新增或者修改
      addOrUpdateView (row) {
        this.dialogVisible = true
        this.organizationForm.id = ''
        this.organizationForm.parentName = ''
        this.$nextTick(() => {
          this.$refs['organizationForm'].resetFields()
        })
        if (row) { // 修改
          this.organizationFormloading = true
          this.$http({
            url: `/sys/organization/info/${row.id}`,
            method: 'get'
          }).then(({data}) => {
            if (data.code == 0 && data.data) {
              this.$set(this, 'organizationForm', data.data)
              debugger
            }
          }).finally((res) => {
            this.organizationFormloading = false
          })
        } else {
          this.organizationFormloading = false
        }
      },
      // 菜单保存
      addOrUpdateHandle () {
        this.$refs['organizationForm'].validate((valid) => {
          if (valid) {
            this.organizationFormloading = true
            this.$http({
              url: `/sys/organization/${this.organizationForm.id ? 'update' : 'save'}`,
              method: 'post',
              data: this.$http.adornData(this.organizationForm)
            }).then(({data}) => {
              if (data.code == 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getDataList()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            }).finally((res) => {
              this.organizationFormloading = false
            })
          }
        })
      },
      // 删除
      deleteHandle (row) {
        this.$confirm(`确认删除${row.name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/sys/organization/delete/${row.id}`,
            method: 'get'
          }).then(({data}) => {
            if (data.code == 0) {
              this.$message({
                message: '删除成功',
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
      // 点击树形菜单
      orgSelectHandle (data, node, component) {
        this.organizationForm.parentId = data.id
        this.organizationForm.parentName = data.name
        this.popoverVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
