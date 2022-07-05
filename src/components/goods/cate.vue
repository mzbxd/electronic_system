<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="dataList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="tree-table"
      >
        <!-- 商品是否在售 -->
        <template slot="isOnsale" slot-scope="scope">
          <i class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen">
          </i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>

        <!-- 商品分级 -->
        <template slot="order" slot-scope="scope">
          <e-tag size="mini" v-if="scope.row.cat_level === 0">一级</e-tag>
          <e-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</e-tag>
          <e-tag type="warning" size="mini" v-else>三级</e-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="showRemoveBox(scope.row.cat_id)" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <!-- 编辑分类表单 -->
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类
      cataList: [],
      // 查询参数
      queryInfo: {
        type: 3,
        pageNum: 1,
        pageSize: 5
      },
      // 总数据条数
      total: 0,
      // tree-table列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          // 定义当前列为模板列
          type: 'template',
          // 模板名称
          template: 'isOnsale'
        }, {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加框
      addCateDialogVisible: false,
      // 添加分类数据
      addCateForm: {
        cat_name: '',
        // 父级分类id 0为自身一级
        cat_pid: 0,
        // 0,1,2 分类
        cat_level: 0
      },
      // 编辑分类信息
      editCateForm: {
        cat_name: '',
        cat_id: ''
      },
      // 添加分类规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据列表
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: 'true',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选择内容
      selectedKeys: []
    }
  },
  created() {
    this.getCataList()
  },
  methods: {
    // 获取商品分类数据
    async getCataList() {
      const { data: res } = await this.$axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('商品分类获取失败')
      this.cataList = res.data.result
      this.total = res.data.total
    },
    // 监听pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getCataList()
    },
    // 监听pageNum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getCataList()
    },
    // 弹出添加框
    showAddCateDialog() {
      this.addCateDialogVisible = true
    },
    // 获取分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories',
        { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('父级数据获取失败')
      this.parentCateList = res.data
    },
    // 级联选择器发生变化
    parentCateChange() {
      // selectedKeys.length > 0 选中父级
      // 否则未选中任何分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 赋值等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类id
        this.addCateForm.cat_pid = 0
        // 当前分类等级
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('categories', this.addCateForm)
        if (res.meta.status !== 200) return this.$message.error('分类添加失败')
        this.$message.success('分类添加成功')
        this.getCataList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加框关闭
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 弹出编辑框
    async showEditDialog(id) {
      const { data: res } = this.$axios.get(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取分类信息失败')
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 编辑分类
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put(`categories/${this.editCateForm.cat_id}`, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('修改分类失败')
        this.editCateDialogClosed = false
        this.getCataList()
        this.$message.success('修改分类成功')
      })
    },
    // 监听编辑框关闭
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 删除
    async showRemoveBox(id) {
      const confirmResult = await this.$confirm('确认删除分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$axios.delete(`categories/${id}`)
      if (res.meta.data !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCataList()
    }
  }
}
</script>

<style scoped lang="scss">
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
