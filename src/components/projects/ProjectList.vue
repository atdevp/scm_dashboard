<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryProjectInfo.search" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getSearchInput"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddProjectDialog">添加</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="resProjectInfo.projectlist"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" fixed></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="url" label="地址" width="400"></el-table-column>
        <el-table-column prop="p_type" label="类型"> </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_date | moment("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryProjectInfo.pagenum"
        :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
        :page-size="queryProjectInfo.pagesize"
        :layout="resProjectInfo.layout"
        :total="resProjectInfo.total"
      >
      </el-pagination>

      <!-- 添加project -->
      <el-dialog title="添加项目" :visible.sync="dialogVisible" width="60%">
        <el-form :rules="ruleAddProjectForm" label-width="100px" :model="addProjectForm" ref="addProjectFormRef">

          <el-form-item label="仓库地址" prop="url">
            <el-row>
              <el-col :span="16">
                <el-input
                  size="large"
                  placeholder="请输入仓库地址"
                  clearable
                  v-model="addProjectForm.url"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="项目功能" prop="func">
            <el-row>
              <el-col :span="16">
                <el-input
                  size="large"
                  placeholder="请输入项目功能"
                  clearable
                  v-model="addProjectForm.func"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="运行方式" prop="type">
            <el-row>
              <el-col :span="16">
                <el-select v-model="addProjectForm.type" size="medium">
                  <el-option  key="jar" label="jar" value="jar"></el-option>
                  <el-option  key="war" label="war" value="war"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item style="margin-top: 50px">
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryProjectInfo: {
        search: '',
        // 也代表了当前页，可以在分页功能中使用
        pagenum: 1,
        // 也代表当前每页显示多少条数据，可以在分页功能中使用
        pagesize: 8
      },
      resProjectInfo: {
        projectlist: [],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      addProjectForm: {
        url: '',
        func: '',
        type: ''

      },
      ruleAddProjectForm: {
        url: [
          { required: true, message: '请输入项目地址', trigger: 'blur' }
        ],
        func: [
          { required: true, message: '请输入项目功能', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择对应应用运行方式', trigger: 'blur' }
        ]
      },

      dialogVisible: false
    }
  },
  created () {
    this.getProjectList()
    this.keyupSubmit()
  },
  methods: {
    keyupSubmit () {
      document.onkeydown = e => {
        let _key = window.event.keyCode
        if (_key === 13) {
          this.getSearchInput()
        }
      }
    },
    getSearchInput () {
      this.getProjectList()
    },
    async getProjectList () {
      const { data: res } = await this.$http.get('/projects/list.go', {
        params: this.queryProjectInfo
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.resProjectInfo.projectlist = res.data.result
      this.resProjectInfo.total = res.data.count
    },
    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      this.queryProjectInfo.pagesize = newSize
      this.getProjectList()
    },
    // 监听pagenum改变事件
    handleCurrentChange (newPage) {
      this.queryProjectInfo.pagenum = newPage
      this.getProjectList()
    },
    showAddProjectDialog () {
      this.dialogVisible = true
    },
    async addProject (loading) {
      const { data: res } = await this.$http.post('/projects/create.go', this.addProjectForm)
      loading.close()
      if (res.code !== 201) {
        return this.$message.error(res.msg)
      }
      this.$message({
        message: '创建成功',
        type: 'success'
      })
      this.dialogVisible = false
      this.getProjectList()
    },
    onSubmit () {
      this.$refs.addProjectFormRef.validate(async valid => {
        if (!valid) return
        const loading = this.$loading({
          lock: true,
          text: 'Cloning',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          this.addProject(loading)
          // loading.close()
        }, 2000)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
