<template>
  <el-container class="maxcontainer">
    <el-header class="elheader">
      <el-button icon="el-icon-menu" class="menuicon" circle @click="menuicon"></el-button>
      <span>品优购后台管理系统</span>
      <el-button @click="loginout" class="exit" type="danger" round>退出</el-button>
    </el-header>
    <el-container class="elcontainer">
      <el-aside :width="collapse?'65px':'180px'"  class="elside">
        <el-menu
          router
          :collapse="collapse"
          :collapse-transition="false"
          :unique-opened="true"
          default-active="2"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="(item,i) in list" :key="item.id" :index="item.id.toString()">
            <template slot="title">
              <i :class="['iconfont',iconArr[i]]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group >
              <el-menu-item class="iconfont el-icon-menu" v-for="itemchild in item.children" :key="itemchild.id" :index="itemchild.path">{{itemchild.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      list: [],
      collapse: false,
      iconArr: ['icon-user-fill', 'icon-cog', 'icon-shoppingcart', 'icon-file', 'icon-chart-area']
    }
  },
  methods: {
    menuicon () {
      this.collapse = !this.collapse
    },
    async jiazai () {
      const {data: {data}} = await this.$http.get('menus')
      this.list = data
    },
    // 退出功能
    loginout () {
      this.$confirm('真的要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.removeItem('token')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '用户已退出!'
        })
      })
    }
  },
  async mounted () {
    this.jiazai()
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
.menuicon {
  margin-right: 10px
}
.el-menu {
  border: 0;
}
</style>
