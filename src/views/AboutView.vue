<template>
  <div class="about">
    <h1>This is an about page</h1>
    <ul style="display:flex;list-style: none;">
      <li v-for="(item,index) in list" :key="index" style="width: 200px;height: 400px;background-color: gray;margin-right: 20px;">
        <img :src="item.img" alt="" style="width: 200px;height: 200px;">
        <div>1212</div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default({
    data() {
      return {
        name: '张三',
        list: [
          {id:1,img: require('../assets/indexListImg1.png')},
          {id:2,img: require('../assets/indexListImg2.png')},
          {id:3,img: require('../assets/indexListImg3.png')},
          {id:4,img: require('../assets/indexListImg4.png')},
        ]
      }
    },
    mounted() {
      console.log("AboutView1")
      console.log("AboutView2")
      console.log("AboutView3")
      console.log("AboutView4")
    },
    methods: {

    }
  })
</script>