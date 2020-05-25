<template>

<span>
  <span v-if="type=='select'">
    <el-select v-model="dictValue" :placeholder="placeholder" @change="changeSelect" clearable :disabled="disabled">
      <el-option
        v-for="item in dictList"
        :key="item.value"
        :label="item.dictName"
        :value="item.value">
      </el-option>
    </el-select>
  </span>
  <span v-else-if="type=='radio'">
     <el-radio-group v-model="dictValue" @change="changeSelect">
      <el-radio v-for="item in dictList" :key="item.value" :label="item.value">{{item.dictName}}</el-radio>
    </el-radio-group>
  </span>
  <span v-else-if="type=='checkbox'">
     <el-checkbox-group v-model="dictValue" @change="changeSelect">
      <el-checkbox v-for="item in dictList" :key="item.value" :label="item.value">{{item.dictName}}</el-checkbox>
    </el-checkbox-group>
  </span>
</span>
</template>
<script>
  export default {
    name: 'dictModule',
    data() {
      return {
        dictList: []
      }
    },
    props: {
      form:null,
      type: {
        type: String,
        default: "select"
      },
      dictType: {
        type: String,
        default: ""
      },
      field: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: "请选择"
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      dictValue: {
        get: function () { return this.form[this.field]+"" } ,
        set: function (val) { this.changeSelect(val) }
      }
    },
    created() {
      this.initData()
    },
    methods: {
      initData() {
        const dicts = this.$cookie.get('dict' + this.dictType)

        if (dicts) {
          this.dictList = JSON.parse(dicts);
          return;
        }
        this.$http({
          url: `/sys/dict/types`,
          method: 'get',
          params: this.$http.adornParams({
            'type': this.dictType
          })
        }).then(({data}) => {
          if (data.code === 0&&data.data.length) {
            this.dictList = data.data
            this.$cookie.set('dict' + this.dictType,JSON.stringify(data.data))
          }
        })
      },
      // 选择回调
      changeSelect(value) {
        this.form[this.field] = value;
        this.$emit('change', value)
      },
    },
  }

</script>
<style>

</style>
