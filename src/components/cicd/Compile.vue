<template>
  <div>
    <el-card>
      <el-form ref="compileFormRef" :rules="ruleCompileForm" :model="compileForm">
        <el-form-item label="项目" prop="project">
          <el-row>
            <el-col :span="4">
              <el-select
                v-model="compileForm.project"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteQueryProjectMethod"
                @change="getProjectModules"
                size="small"
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

        <el-form-item label="模块" prop="module">
          <el-row>
            <el-col :span="20">
              <el-radio-group
                v-model="compileForm.module"
                @change="moduleRadioChange"
              >
                <el-radio
                  :label="item"
                  :key="item"
                  v-for="item in projectModules"
                  >{{ item }}</el-radio
                >
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="分支" prop="branch">
          <el-row>
            <el-col :span="4">
              <el-input placeholder="选择或输入分支"  clearable v-model="compileForm.branch" size="small">
              <el-select slot="prepend" v-model="compileForm.branch" placeholder="请选择" @change="selectBranch">
                <el-option label="master" value="master"></el-option>
                <el-option label="develop" value="develop"></el-option>
              </el-select>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="环境" prop="scheme">
          <el-row>
            <el-col :span="8">
              <el-radio-group v-model="compileForm.scheme" @change="schemeRadioChange">
                <el-radio label="production" key="production">生产</el-radio>
                <el-radio label="stating" key="stating">预发</el-radio>
                <el-radio label="develop" key="develop">测试</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="版本" prop="version">
          <el-row>
            <el-col :span="4">
              <el-input
                size="small"
                placeholder="请输入版本号"
                clearable
                v-model="compileForm.version"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="更新依赖">
          <el-row>
            <el-col :span="2">
              <el-switch
                v-model="compileForm.dependence"
                active-color="#13ce66"
                inactive-color="#1E1E1E"
                @change="isUpdateDependence"
              >
              </el-switch>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="compile" size="mini">编译</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectlist: [],
      projectModules: [],
      compileForm: {
        project: '',
        branch: '',
        module: '',
        scheme: '',
        version: '',
        dependence: true
      },
      ruleCompileForm: {
        project: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        branch: [
          { required: true, message: '请选择分支', trigger: 'blur' }
        ],
        // module: [
        //   { required: true, message: '请选择模块', trigger: 'change' }
        // ],
        scheme: [
          { required: true, message: '请选择scheme', trigger: 'change' }
        ],
        version: [
          { required: true, message: '请输入分支', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取项目列表
    async getProjectList (query) {
      const { data: res } = await this.$http.get('/projects/list.go', {
        params: { search: query }
      })
      if (res.code !== 200) return this.$message.error(res.msg)

      this.projectlist = res.data.result
    },
    // 实时请求后台接口
    remoteQueryProjectMethod (query) {
      if (query === '') {
        this.projectlist = []
      } else {
        setTimeout(() => {
          this.projectlist = this.getProjectList(query)
        }, 200)
      }
    },
    // 选择分支
    selectBranch (item) {
      this.compileForm.branch = item
    },
    // 获取指定项目对应模块和版本
    async getProjectModules (pid) {
      if (pid === undefined) {
        return this.$message.error('未成功获取项目ID')
      }
      var url = '/projects/' + pid + '/pre/build.go'
      const { data: res } = await this.$http.get(url)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.projectModules = res.data.mods
      this.compileForm.version = res.data.new_tag
    },
    // 动态获取module
    moduleRadioChange (item) {
      this.compileForm.module = item
    },
    // 动态获取scheme
    schemeRadioChange (item) {
      this.compileForm.scheme = item
    },
    // 是否更新依赖
    isUpdateDependence (item) {
      this.compileForm.dependence = item
    },
    async getCompileCommand (pid) {
      var url = '/projects/' + pid + '/post/getCompileCommand.go'
      const { data: res } = await this.$http.post(url, this.compileForm)
      if (res.code !== 200) return this.$message.error(res.msg)
      console.log(res.data.command)
    },
    // 编译按钮
    compile () {
      this.$refs.compileFormRef.validate(async valid => {
        if (!valid) return
        setTimeout(() => {
          console.log(this.compileForm)
          this.getCompileCommand(this.compileForm.project)
          // loading.close()
        }, 2000)
      })
    }
  },
  created () {}
}
</script>

<style lang="less" scoped></style>
