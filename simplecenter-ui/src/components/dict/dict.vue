<template>
	<span>
    {{dictName}}
	</span>
</template>
<script>

  export default {
    name: 'dict',
    data () {
      return {
        dictName: ''
      }
    },
    props: ['dictType', 'dictValue'],
    created () {
      this.initData()
    },
    methods: {
      initData () {

        const dicts = this.$cookie.get('dict' + this.dictType)
        if (dicts) {
          this.washData(JSON.parse(dicts));
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
            this.washData(data.data);
            this.$cookie.set('dict' + this.dictType,JSON.stringify(data.data))
          }
        })
      },
      /**
       * 清洗数据
       */
      washData(dataList){

        if(Array.isArray(this.dictValue)){
          this.dictValue.forEach(item=>{
            item=item+"";
          })
        }

        dataList.forEach(item=>{
          item.value = item.value+""
          if(typeof this.dictValue == 'string'){
            if(item.value == this.dictValue){
              this.dictName = item.dictName
            }
          }else if(Array.isArray(this.dictValue)){
            if(this.dictValue.includes(item.value)){
              this.dictName+=(item.dictName+",")
            }
          }
        })

        if(this.dictName.endsWith(",")){
          this.dictName = this.dictName.substring(0,this.dictName.length-1)
        }

      }
    }
  }
</script>
