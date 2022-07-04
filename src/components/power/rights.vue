<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card-box">
      <!-- 卡片视图 -->
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === 0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === 1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: [
        {
          authName: 'admin',
          path: 'http',
          level: 0
        }, {
          authName: 'admin',
          path: 'http',
          level: 1
        }, {
          authName: 'admin',
          path: 'http',
          level: 3
        }
      ]
    }
  },
  created() {
    // 获取权限列表
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.card-box{
  display: flex;
  justify-content: center;
  .el-card{
    width: 85%;
  }
}

</style>
