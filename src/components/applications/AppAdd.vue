<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/apps/list' }"
        >应用列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>应用添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="项目" prop="name">
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            ></el-autocomplete>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      state: '',
      projectlist: []
    }
  },
  methods: {
    async   getProjectList () {
      const {data: res} = await this.$http.get('/projects/list.go')
      if (res.code !== 200) return this.$message.error(res.msg)

      res.data.result.forEach(element => {
        console.log(element.name)
      })
    }
  },
  created () {
    this.getProjectList()
  }
}
</script>

<style lang="less" scoped></style>
