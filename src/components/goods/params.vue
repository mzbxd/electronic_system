<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!-- 商品分类选择区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="seletedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数标签页 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" @click="addDialogVisible = true" :disabled="idBtnDisabled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <e-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}
                </e-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加标签按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="arrt_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditDialog(scope.row.arrt_id)" icon="el-icon-edit"></el-button>
                <el-button type="danger" size="mini" @click="showDeleteDialog(scope.row.arrt_id)" icon="el-icon-delete"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性标签页 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" type="primary" @click="addDialogVisible = true" :disabled="idBtnDisabled">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <el-table-column type="expand">
              <template slot-scope="scope">
                <e-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}
                </e-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加标签按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="arrt_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditDialog(scope.row.arrt_id)" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" @click="showDeleteDialog(scope.row.arrt_id)" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialigClose">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText"  prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数 -->
    <el-dialog
      :title="`修改${titleText}`"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialigClose">
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText"  prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cataList: [],
      // 级联选择框配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器绑定数据
      seletedCateKeys: [],
      // 激活标签页名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 控制添加框
      addDialogVisible: false,
      // 添加表单数据
      addForm: {
        attr_name: ''
      },
      // 添加验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改表单数据
      editForm: {
        attr_name: ''
      },
      // 控制修改框
      editDialogVisible: false
    }
  },
  created() {
    this.getCataList()
    console.log(this.seletedCateKeys.length)
  },
  computed: {
    idBtnDisabled() {
      return this.seletedCateKeys !== 3
    },
    // 当前选中的三级id
    cateId() {
      if (this.seletedCateKeys.length === 3) {
        return this.seletedCateKeys[2]
      }
      return null
    },
    // 判断添加类型
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    // 获取商品分类数据
    async getCataList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('商品分类获取失败')
      this.cataList = res.data
    },
    // 级联选择器变化回调
    handleChange() {
      this.getParamsData()
    },
    // tab标签页点击事件
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      // 判定是否选中三级分类
      if (this.seletedCateKeys.length !== 3) {
        this.seletedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      // 获取参数
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals
          ? item.attr_vals.split(' ') : []
        // 添加变量
        // 控制添加tag
        item.inputVisible = false
        // 输入的内容
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加框关闭清空数据
    addDialigClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加属性
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('属性添加失败')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 弹出修改框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) this.$message.error('获取属性失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改框关闭清空数据
    editDialigClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 200) return this.$message.error('参数修改失败')
        this.$message.success('参数修改成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 弹出删除框
    async showDeleteDialog(id) {
      const confirmResult = await this.$confirm('确定删除参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$axios.delete(
        `categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('参数删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 标签输入框变化
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      // 输入合法后续处理
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false

      this.saveAttrValues(row)
    },
    // 切换标签状态
    showInput(row) {
      row.inputVisible = true
      // 获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrValues(row)
    },
    // 更新attr_vals
    async saveAttrValues(row) {
      const { data: res } = await this.$axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
    }
  }
}
</script>

<style lang="scss">
.cat_opt{
  margin:15px 0;
}
.input-new-tag{
  width:120px;
}
</style>
