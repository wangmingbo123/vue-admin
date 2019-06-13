<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div id="wang">
    <p v-on:click="hh('jia')">fachu</p>
    <!--
    父组件监听
    -->
    <h1>{{mei}}</h1>

  </div>
</template>


<script>
  // 定义组件
  //  Vue.component('wang-component', {
  //
  //    /*
  //     * 必须是函数
  //     * */
  ////      data:function () {
  ////
  ////        return 0
  ////      }
  //    // es6
  //    data(){
  //      return {
  //        // 复合数据
  //
  //      }
  //    }
  //
  //  })


  // 定义组件
  var ComponetWang = {
    name: 'wang',

    /*
     *  props 父组件向子组件传递参数
     * */
    props: [
      'name'

    ],

    /*
     *  data 和自己的template进行双向绑定
     * */
    data: function () {
      // 组件返回的数据
      console.log('data is invoke')
      return {
        msg: 'hhhhh',
        mei: 'meili'
      }
    },
    methods: {
      add() {
        console.log('add is invoke ')

      },
      hh(para){
        console.log('hh is invoke ' + para)
        console.log('hh is invoke ')
        this.$emit('fu', 'paraOne')
      },
      jie(one){
        console.log('jie is invoke ' + one)
      }
    },
    mounted () {
      console.log('mounted is invoke')
    }
  }

  // 注册组件
  //  Vue.component('ComponetWang', ComponetWang)

  // 监听事件
  //    ComponetWang.$on('test', function (msg) {
  //      console.log('test is invoke msg ' + msg)
  //    })

  //  ComponetWang.methods.hh('asda')


  console.log('$$$$$$$$ ' + ComponetWang.$data)

  // 导出组件
  export  default  ComponetWang


</script>
