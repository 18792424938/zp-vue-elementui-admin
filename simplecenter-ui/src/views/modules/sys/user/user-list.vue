<template>
  <div class="main-config">
    <div class="search-group">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.realname" placeholder="请输入" clearable></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateView()">新增</el-button>
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
        prop="realname"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="organizationName"
        label="组织机构">
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
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="isAuth('sys:user:update')" @click="addOrUpdateView(scope.row)">修改</el-button>
          <el-button type="text" v-if="isAuth('sys:user:forbidden')" @click="deleteHandle(scope.row)">{{scope.row.status==10?'禁用':'启用'}}</el-button>
          <el-button type="text" v-if="isAuth('sys:user:resetPassword')" @click="resetPasswordHandle(scope.row)">重置密码</el-button>
          <el-button type="text" v-if="isAuth('sys:user:info')" @click="infoView(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table><!--
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
      <el-form v-loading="userFormloading" :model="userForm" :rules="userRules" ref="userForm" label-width="120px">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="userForm.username" :readonly="userForm.id?true:false" placeholder="请输入"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="realname">
          <el-input v-model="userForm.realname" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="!userForm.id" label="默认密码:" prop="password">
          <el-input v-model="userForm.password" readonly placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="roleIds">
          <el-checkbox-group v-model="userForm.roleIds">
            <el-checkbox :label="item.id" v-for="item in roleList" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="组织机构:" prop="organizationId">
          <el-popover
            placement="bottom"
            width="300"
            ref="parentPopover"
            v-model="popoverVisible"
            trigger="click">
            <div style="max-height: 450px;overflow: auto;padding: 10px 5px">
              <el-tree
                :data="organizationTree"
                :props="{children:'children',label:'name'}"
                :expand-on-click-node="false"
                :default-expand-all="true"
                @node-click="orgSelectHandle">
              </el-tree>
            </div>
          </el-popover>
          <el-input placeholder="点击选择组织机构" readonly v-model="userForm.organizationName"  v-popover:parentPopover></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <dictModule :form="userForm" field="status" type="radio" dictType="user_status"></dictModule>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateHandle">确 定</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog
      title="详情"
      :visible.sync="dialogInfoVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="50%">
      <el-form v-loading="userFormInfoloading" :model="userFormInfo" label-width="120px">
        <el-form-item label="用户名:" prop="username">
         {{userFormInfo.username}}
        </el-form-item>
        <el-form-item label="姓名:" prop="realname">
         {{userFormInfo.realname}}
        </el-form-item>
        <el-form-item label="角色:" prop="roleIds">
          <el-checkbox-group v-model="userFormInfo.roleIds">
            <el-checkbox :label="item.id" v-for="item in roleList" :disabled="true" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="组织机构:" prop="organizationId">
          {{userFormInfo.organizationName}}
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-tag type="success" v-if="userFormInfo.status==10">启用</el-tag>
          <el-tag type="danger" v-if="userFormInfo.status==20">禁用</el-tag>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'user-list',
    data () {
      return {
        dialogInfoVisible: false,
        organizationTree: [],
        popoverVisible: false,
        roleList: [],
        pager: {
          currentPage: 1,
          currentSize: 10,
          total: 0
        },
        tableloading: false,
        userFormloading: false,
        dialogVisible: false,
        tableData: [],
        searchForm: {
          username: '',
          realname: ''
        },
        userForm: {
          id: '',
          username: '',
          realname: '',
          organizationId: '',
          organizationName: '',
          password: '',
          status: 10,
          roleIds: []
        },
        userFormInfoloading: false,
        userFormInfo: {
          id: '',
          username: '',
          realname: '',
          organizationId: '',
          organizationName: '',
          status: '',
          roleIds: []
        },
        userRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          realname: [
            {required: true, message: '请输入姓名', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'change'}
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
          url: `/sys/user/list`,
          method: 'get',
          params: this.$http.adornParams({
            currentPage: this.pager.currentPage,
            currentSize: this.pager.currentSize,
            username: this.searchForm.username,
            realname: this.searchForm.realname
          })
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            if (!data.data.records.length && this.pager.currentPage > 1) {
              this.handleCurrentChange(this.pager.currentPage - 1)
            } else {
              this.pager.total = data.data.total
              this.tableData = data.data.records
            }
          }
        }).finally((res) => {
          this.tableloading = false
        })
      },
      getRoleList () {
        this.$http({
          url: `/sys/role/listRoleAll`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.roleList = data.data
          }
        }).finally((res) => {

        })
      },
      // 新增或者修改
      addOrUpdateView (row) {
        // 查询组织机构
        this.getOrgTree()

        this.getRoleList()

        this.dialogVisible = true
        this.userForm.id = ''
        this.userForm.organizationName = ''
        this.$nextTick(() => {
          this.$refs['userForm'].resetFields()
        })
        if (row) { // 修改
          this.userFormloading = true
          this.$http({
            url: `/sys/user/info/${row.id}`,
            method: 'get'
          }).then(({data}) => {
            if (data.code == 0 && data.data) {
              this.$set(this, 'userForm', data.data)
            }
          }).finally((res) => {
            this.userFormloading = false
          })
        } else {
          this.userForm.password = '11111111'
          this.userFormloading = false
        }
      },
      // 详情
      infoView (row) {
        this.dialogInfoVisible = true
        this.getRoleList()
        this.userFormInfoloading = true
        this.userFormInfo.id = ''
        this.$http({
          url: `/sys/user/info/${row.id}`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.$set(this, 'userFormInfo', data.data)
          }
        }).finally((res) => {
          this.userFormInfoloading = false
        })
      },
      // 菜单保存
      addOrUpdateHandle () {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            console.log('this.userForm', this.userForm)

            this.userFormloading = true
            this.$http({
              url: `/sys/user/${this.userForm.id ? 'update' : 'save'}`,
              method: 'post',
              data: this.$http.adornData(this.userForm)
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
              this.userFormloading = false
            })
          }
        })
      },
      // 启用/禁用
      deleteHandle (row) {
        const jinyong = () => {
          this.tableloading = true
          this.$http({
            url: `/sys/user/forbidden/${row.id}`,
            method: 'get'
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
        }

        if (row.status == 10) {
          this.$confirm(`确定要禁用[${row.username}]吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            jinyong()
          })
        } else {
          jinyong()
        }
      },
      // 重置密码
      resetPasswordHandle (row) {
        this.$confirm(`确定重置[${row.username}]的密码吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableloading = true
          this.$http({
            url: `/sys/user/resetPassword`,
            method: 'post',
            data: this.$http.adornData({id: row.id, password: '11111111'})
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

      // 点击树形菜单
      orgSelectHandle (data, node, component) {
        this.userForm.organizationId = data.id
        this.userForm.organizationName = data.name
        this.popoverVisible = false
      },
      getOrgTree () {
        this.$http({
          url: `/sys/organization/tree`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.organizationTree = data.data
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
