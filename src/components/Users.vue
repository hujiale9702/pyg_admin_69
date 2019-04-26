<template>
  <div class="content">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '>' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="params.query">
            <el-button @click="search()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" @click="showDialogForm()" plain>添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="updateState(scope.row.id,scope.row.mg_state)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ccc"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button @click="editUsers(scope.row.id)" icon="el-icon-edit" round></el-button>
              <el-button @click="roleUsers(scope.row)" icon="el-icon-share"></el-button>
              <el-button @click="delUsers(scope.row.id)" icon="el-icon-delete" round></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :page-size="params.pagesize"
        :current-page="params.pagenum"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog width="400px" title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form label-width="100px" autocomplete="off">
        <el-form-item label="当前用户：">
          {{roleUserName}}
        </el-form-item>
        <el-form-item label="当前用户：">
          {{roleUserRoleName}}
        </el-form-item>
        <el-form-item label="分配角色：">
          <el-select v-model="roleValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 定义  手机号校验函数
    const checkMobile = (rule, value, callback) => {
      if (
        !/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
          value
        )
      ) { return callback(new Error('手机号不对')) }
      callback()
    }
    return {
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      editDialogFormVisible: false,
      roleDialogFormVisible: false,
      roleUserName: '',
      roleUserRoleName: '',
      options: [],
      roleUserId: '',
      roleValue: '',
      params: {
        pagenum: 1,
        pagesize: 5
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 18, message: '密码6-18个字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 手机号必须自定义校验规则  通过自己的函数来校验 （rule,value,callback）
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 手机号必须自定义校验规则  通过自己的函数来校验 （rule,value,callback）
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 修改状态
    async updateState (oldid, newstate) {
      const {data: { meta } } = await this.$http.put(`users/${oldid}/state/${newstate}`)
      if (meta.status !== 200) return this.$message.error('修改状态失败')
      this.$message.success('修改状态成功')
      this.getUsers()
    },
    // 显示角色分配隐藏页
    async roleUsers (row) {
      const {data: { data }} = await this.$http.get('roles')
      console.log(row)
      this.options = data
      this.roleUserId = row.id
      this.roleUserName = row.username
      this.roleUserRoleName = row.role_name
      this.roleDialogFormVisible = true
    },
    // 角色分配
    async changeRole () {
      const {data: { meta }} = await this.$http.put(`users/${this.roleUserId}/role`, {
        rid: this.roleValue
      })
      if (meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.roleDialogFormVisible = false
      this.getUsers()
    },
    // 显示添加隐藏页
    showDialogForm () {
      // 显示隐藏页
      this.dialogFormVisible = true
      // 重置表单
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    // 显示编辑隐藏页
    async editUsers (id) {
      this.editDialogFormVisible = true
      // 根据id获取数据
      const { data: { data, meta }} = await this.$http.get(`users/${id}`)
      if (meta.status !== 200) return this.$message.error('获取用户数据失败')
      // 把数据展示表单内
      this.editForm = data
    },
    // 编辑用户
    editSubmit () {
      // 验证表单
      this.$refs.editForm.validate(async valid => {
        // 验证通过
        if (valid) {
          const {
            data: { meta }
          } = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (meta.status !== 200) return this.$message.error('编辑失败')
          this.$message.success('编辑成功')
          // 成功刷新页面
          this.editDialogFormVisible = false
          // 更新列表
          this.getUsers()
        }
      })
    },
    // 搜索功能
    search () {
      this.params.pagenum = 1
      this.getUsers()
    },
    // 删除用户
    delUsers (id) {
      this.$confirm('真的要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {
          data: { meta }
        } = await this.$http.delete(`users/${id}`)
        if (meta.status !== 200) return this.$message.error('删除失败!')
        this.$message.success('删除成功!')
        // 删除成功后刷新页面
        this.getUsers()
      })
    },
    // 获取用户
    async getUsers () {
      const {
        data: { data }
      } = await this.$http.get('/users', { params: this.params })
      this.tableData = data.users
      this.total = data.total
    },
    // 页码改变时
    changePage (newPage) {
      this.params.pagenum = newPage
      this.getUsers()
    },
    // 添加用户
    addSubmit () {
      // 验证表单
      this.$refs.addForm.validate(async valid => {
        // 验证通过
        if (valid) {
          const {
            data: { meta }
          } = await this.$http.post('users', this.addForm)
          if (meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          // 成功刷新页面
          this.dialogFormVisible = false
          // 更新列表
          this.getUsers()
        }
      })
    }
  },
  mounted () {
    this.getUsers()
  }
}
</script>

<style>
</style>
