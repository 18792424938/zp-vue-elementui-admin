<template>
  <div class="main-config">
    <div v-for="item in dataList" >
      <el-row>
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>服务器信息</span>
            </div>
            <div  >
              <el-row class="text-row"  >
                <el-col :span="6">服务器名称</el-col>
                <el-col :span="6">{{item.serverComputerName}}</el-col>
                <el-col :span="6">操作系统</el-col>
                <el-col :span="6">{{item.serverOsName}}</el-col>
              </el-row>
              <el-row class="text-row" >
                <el-col :span="6">服务器IP</el-col>
                <el-col :span="6">{{item.serverComputerIp}}</el-col>
                <el-col :span="6">系统架构</el-col>
                <el-col :span="6">{{item.serverOsArch}}</el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>CPU</span>
            </div>
            <div  >
              <el-row class="text-row" >
                <el-col :span="12">核心数</el-col>
                <el-col :span="12">{{item.cpuNum}}</el-col>
              </el-row>
              <el-row class="text-row" >
                <el-col :span="12">系统使用率</el-col>
                <el-col :span="12">{{item.cpuSys}}%</el-col>
              </el-row>
              <el-row class="text-row" >
                <el-col :span="12">用户使用率</el-col>
                <el-col :span="12">{{item.cpuUsed}}%</el-col>
              </el-row>
              <el-row class="text-row" >
                <el-col :span="12">当前空闲率</el-col>
                <el-col :span="12">{{item.cpuFree}}%</el-col>
              </el-row>


            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>内存</span>
            </div>
            <div  >
              <el-row class="text-row" >
                <el-col :span="12">总内存</el-col>
                <el-col :span="12">{{item.memTotal}}G</el-col>
              </el-row>
              <el-row class="text-row" >
                <el-col :span="12">已用内存</el-col>
                <el-col :span="12">{{item.memUsed}}G</el-col>
              </el-row>
              <el-row class="text-row" >
                <el-col :span="12">剩余内存</el-col>
                <el-col :span="12">{{item.memFree}}G</el-col>
              </el-row>
              <el-row class="text-row" >
                <el-col :span="12">使用率</el-col>
                <el-col :span="12">{{item.memUsePro}}%</el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>磁盘状态</span>
            </div>
            <div  >
              <el-table
                v-if="item.sysFileList"
                :data="item.sysFileList"
                style="width: 100%">
                <el-table-column
                  prop="dirName"
                  label="磁盘路径">
                </el-table-column>
                <el-table-column
                  prop="sysTypeName"
                  label="磁盘类型">
                </el-table-column>
                <el-table-column
                  prop="typeName"
                  label="文件类型">
                </el-table-column>
                <el-table-column
                  prop="total"
                  label="总大小">
                </el-table-column>
                <el-table-column
                  prop="free"
                  label="可用大小">
                </el-table-column>
                <el-table-column
                  prop="used"
                  label="已用大小">
                </el-table-column>
                <el-table-column
                  prop="usage"
                  label="已用百分比">
                  <template slot-scope="scope">
                    {{scope.row.usage}}%
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>



    </div>
  </div>
</template>

<script>
  export default {
    name: 'server-index',
    data () {
      return {
        dataList: []
      }
    },
    activated () {
      this.getDataList()
  },
    methods: {
      getDataList () {
        this.$http({
          url: `/gateway/server/list`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.dataList = data.data
          }
        }).finally((res) => {

        })
      }

    }
  }
</script>

<style scoped>
  .box-card{
    margin: 10px;
  }
  .text-row{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #606266;
  }
</style>
