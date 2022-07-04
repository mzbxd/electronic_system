<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogFormVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogFormVisible"
      @close="DialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        :model="addForm"
        :rules="addRoleRules"
        ref="addRoleRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editdialogVisible"
      @close="editDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        :model="editForm"
        :rules="editRoleRules"
        ref="editRoleRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkRoleName = (rule, value, callback) => {
      if (this.roleList.find(item => item.roleName === value)) return callback(new Error('该角色已存在'))
      return callback()
    }
    return {
      // 角色列表数据
      roleList: [],
      // 添加表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改表单
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加框状态
      dialogFormVisible: false,
      // 修改框状态
      editdialogVisible: false,
      // 权限分配框状态
      setRightDialogVisible: false,
      // 树形权限
      rightsList: [],
      // 树规则
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      treeRole: {},
      // 默认选中节点
      defKeys: [],
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 16, message: '用户名长度在3-16个字符之间', trigger: 'blur' },
          { validator: checkRoleName, trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editRoleRules: {
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.$message.success('获取角色列表成功')
    },

    // 添加角色
    addRoles() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        // 请求
        // const { data: res } = await this.$axios.post('roles', this.addRole)
        // if (res.meta.status !== 201) return this.$message.error('添加失败')
        // this.$message.success('添加成功')
        this.dialogFormVisible = false
      })
    },
    // 关闭添加框重置数据
    DialogClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 弹出修改框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editRole = res.data
      this.editRoleVisible = true
    },
    // 关闭修改框重置数据
    editDialogClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    async editRole() {
      const { data: res } = await this.$axios.put(`roles/${this.editRole.id}`, {
        roleDesc: this.editRole.roleDesc
      })
      if (res.meta.data !== 200) return this.$message.error('修改失败')
      this.editRoleVisible = false
      this.getRoleList()
      this.$message.success('修改成功')
    },
    async removeRole(id) {
      const confirmResult = this.$confirm('确定删除角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // const { data: res } = await this.$axios.delete(`user/${id}`)
      // if (res.meta.data !== 200) return this.$message.error('删除失败')
      // this.$message.success('删除成功')
      this.getRoleList()
    },
    // 根据id删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.confirm('确定删除权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.data !== 200) return this.$message.error('权限删除失败')
      this.$message.success('删除成功')
      role.children = res.data
    },
    // 展示权限分配框
    async showSetRightDialog(role) {
      this.treeRole = role
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.data !== 200) return this.$message.error('权限获取失败')
      this.rightsList = res.data

      // 获取三级节点id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取角色下所有三级权限id保存到defKeys中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭对话框重置数据
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.treeRole.id}/rights`, {
        rids: idStr
      })
      if (res.meta.data !== 200) return this.$message.error('权限分配失败')
      this.$message.success('权限分配成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.el-form{
  padding:0 100px;
  box-sizing:border-box;
}
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top:1px solid #eee;
}
.bdbottom{
  border-bottom:1px solid #eee;
}
.vcenter{
  display:flex;
  align-items: center;
}
</style>
