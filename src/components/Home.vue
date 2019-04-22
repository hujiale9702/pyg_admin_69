<template>
  <el-container class="maxcontainer">
    <el-header class="elheader">
      <el-button icon="el-icon-search" circle></el-button>
      <span>品优购后台管理系统</span>
      <el-button class="exit" type="danger" round>退出</el-button>
    </el-header>
    <el-container class="elcontainer">
      <el-aside width="200px" class="elside">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for='item in list' :key="item.id" index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group >
              <el-menu-item v-for="itemchild in item.children" :key="itemchild.id" index="1">{{itemchild.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main class="elmain">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      list: [{
        id: '',
        authName: '',
        children: [{id: '', authName: ''}]
      }]
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  async mounted () {
    const {data: {data}} = await this.$http.get('menus')
    console.log(data)
    this.list = data
  }
}
</script>

<style>
.maxcontainer {
    height: 100%;
}
.elheader {
    color: #fff;
    background-color: #373D41;
    line-height: 60px;
}
.elheader .exit {
    margin: 15px;
    float: right;
}
.elcontainer {
    height: 100%;
}
.elcontainer .elside {
    background-color: #545C64;
}
</style>
