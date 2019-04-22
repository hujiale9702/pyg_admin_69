<template>
  <div class="login_container">
    <div class="box">
      <img src="../assets/images/logo.png" alt>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username" prefix-icon="iconfont icon-account"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" prefix-icon="iconfont icon-eye-slash"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">登录</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submit () {
      // 通过async和await处理异步请求
      this.$refs.form.validate(async istrue => {
        if (istrue) {
          // 表单验证成功, 发送登录请求
          const {data: {data, meta}} = await this.$http.post('/login', this.form)
          console.log(data)
          // 判断登录状态, 失败时弹出提示框
          if (meta.status !== 200) return this.$message.error(meta.msg)
          // 成功时跳转到后台首页
          sessionStorage.setItem('token', data.token)
          // 成功跳转
          this.$router.push('/home')
        }
      })
    }
  }

}
</script>

<style scoped>
.login_container {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ccc, #3dd6f1);
}
.login_container .box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 500px;
  height: 300px;
  padding: 20px 40px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #fff;
  border-radius: 5px;
  background: linear-gradient(45deg, #3dd6f1, #ccc);
}
.login_container .box img {
  width: 200px;
  display: block;
  margin: 15px auto;
}
.login_container .box form {
  padding: 40px;
}
</style>
