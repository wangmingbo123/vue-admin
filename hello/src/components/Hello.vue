<template>
  <div id="hello">
    <p>{{jia}}</p>
    <p>{{one}}</p>
  </div>
</template>
<script>


  export default{
    name: 'hello',
    props: {
      one: [String]
    },
    data(){
      return {
        /*
         * 定义数据
         * */
        user: [],
        jia: ''

      }
    },
    methods: {
      wang(){
        return 'wang'
      }
    },
    mounted(){
      this.jia='maya'
      console.log('this is '+this)
      console.log('mounted is invoke')
    },



  }
</script>
