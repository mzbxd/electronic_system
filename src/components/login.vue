<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像" />
      </div>

      <!--登陆表单-->
      <el-form
        class="login_form"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>

        <!--密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
          >
          </el-input>
        </el-form-item>

        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const loginFormRules = {
  // 验证用户名合法
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
  ],
  // 验证密码合法
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
  ]
}
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules
    }
  },
  mounted() {
    this.$message.success('hello')
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败！')
        this.$message.success('登录成功！')
        sessionStorage.setItem('token', res.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  // background-color:#eee;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      width: 100px;
      height: 100px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 60px;
      .btns {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
