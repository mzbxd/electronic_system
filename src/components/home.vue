<template>
    <el-container>
      <el-header class="header">
        <div>
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logOut">退出</el-button>
      </el-header>

      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 折叠 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EEF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          >

            <!-- 一级菜单 -->
            <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.id"
                :index="`/${subItem.path}`"
                @click="saveNavState(`/${sumItem.path}`)"
              >
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>

    </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    logOut() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有导航栏菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 折叠菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    > div{
      display: flex;
      align-items:center;
      span{
        margin-left:15px
      }
    }
    img {
      width:40px;
      height:40px
    }

  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right:0
    }
  }
}
.toggle-button {
  background-color:#4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing:0.2em;
  cursor: pointer;
}
</style>
