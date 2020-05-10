<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryAppInfo.search">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getSearchInput"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddAppDialog">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="resAppInfo.applist" border stripe style="width: 100%">
        <el-table-column type="index" fixed></el-table-column>
        <el-table-column prop="app" label="应用"></el-table-column>
        <el-table-column prop="module" label="模块"></el-table-column>
        <el-table-column prop="scheme" label="环境"> </el-table-column>
        <el-table-column prop="main_class" label="主类"> </el-table-column>
        <el-table-column prop="main_args" label="主参"> </el-table-column>
        <el-table-column prop="jvm_args" label="JVM参数"> </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | moment("YYYY-MM-DD HH:mm:ss") }}
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
        :current-page="queryAppInfo.pagenum"
        :page-sizes="[5, 10, 20, 50, 100, 200, 300]"
        :page-size="queryAppInfo.pagesize"
        :layout="resAppInfo.layout"
        :total="resAppInfo.total"
      >
      </el-pagination>

      <!-- 添加app -->
      <el-dialog title="添加应用" :visible.sync="dialogVisible" width="60%">
        <el-form ref="ruleForm" label-width="100px">
          <el-form-item label="项目" prop="project">
            <el-row>
              <el-col :span="16">
                <el-select
                  v-model="addAppForm.project"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :loading="loading"
                  :remote-method="remoteQueryProjectMethod"
                  @change="getProjectModules"
                >
                  <el-option
                    v-for="item in projectlist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="模块">
            <el-row>
              <el-col>
                <el-radio-group v-model="addAppForm.module" @change="moduleRadioChange">
                  <el-radio :label="item" :key="item" v-for="item in projectModules">{{item}}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>

          </el-form-item>

          <el-form-item label="环境">
            <el-row>
              <el-col>
                <el-radio-group v-model="addAppForm.scheme" @change="schemeRadioChange">
                  <el-radio label="production" key="production">生产</el-radio>
                  <el-radio label="stating" key="stating">预发</el-radio>
                  <el-radio label="develop" key="develop">测试</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="主类">
            <el-row>
              <el-col>
                <el-input
                  size="large"
                  placeholder="运行主类"
                  clearable
                  v-model="addAppForm.main_class"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="主参">
            <el-row>
              <el-col>
                <el-input
                  size="large"
                  placeholder="主类参数"
                  clearable
                  v-model="addAppForm.main_args"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="JVM参数">
            <el-row>
              <el-col>
                <el-input
                  size="large"
                  placeholder="jvm参数"
                  clearable
                  v-model="addAppForm.jvm_args"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
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
      queryAppInfo: {
        search: '',
        // 也代表了当前页，可以在分页功能中使用
        pagenum: 1,
        // 也代表当前每页显示多少条数据，可以在分页功能中使用
        pagesize: 8
      },
      dialogVisible: false,
      projectlist: [],
      loading: false,
      resAppInfo: {
        applist: [],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      projectModules: [],
      addAppForm: {
        project: '',
        module: '',
        scheme: '',
        main_class: '',
        main_args: '',
        jvm_args: ''
      }
    }
  },
  methods: {
    showAddAppDialog () {
      this.dialogVisible = true
    },
    // 实时请求后台接口
    remoteQueryProjectMethod (query) {
      if (query === '') {
        this.projectlist = []
      } else {
        setTimeout(() => {
          this.loading = false
          this.projectlist = this.getProjectList(query)
        }, 200)
      }
    },
    // 获取应用列表
    async getProjectList (query) {
      const { data: res } = await this.$http.get('/projects/list.go', {
        params: {'search': query}
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.projectlist = res.data.result
    },
    // 根据关键词搜索应用列表
    getSearchInput () {
      this.getAppList()
    },
    // 获取应用列表
    async getAppList () {
      const { data: res } = await this.$http.get('/apps/list.go', {
        params: this.queryAppInfo
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.resAppInfo.applist = res.data.result
      this.resAppInfo.total = res.data.count
    },
    onSubmit () {},
    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      this.queryAppInfo.pagesize = newSize
      this.getAppList()
    },
    // 监听pagenum改变事件
    handleCurrentChange (newPage) {
      this.queryAppInfo.pagenum = newPage
      this.getAppList()
    },
    // 获取指定项目对应模块
    async getProjectModules (pid) {
      if (pid === undefined) {
        return this.$message.error('未成功获取项目ID')
      }
      var url = '/projects/' + pid + '/pre/build.go'
      const { data: res } = await this.$http.get(url)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.projectModules = res.data.mods
    },
    // 动态获取module
    moduleRadioChange (item) {
      this.addAppForm.module = item
    },
    // 动态获取scheme
    schemeRadioChange (item) {
      this.addAppForm.scheme = item
    }
  },
  created () {
    this.getAppList()
  }
}
</script>

<style lang="less" scoped></style>
