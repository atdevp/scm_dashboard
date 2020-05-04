<template>
<div>
  <!-- 面包屑导航栏 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>应用列表</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/apps/add' }">应用添加</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="rewriteNewPage(add_app_link)">添加项目</el-button>
        </el-col>
      </el-row>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      'add_app_link': 'apps/add'
    }
  },
  methods: {
    rewriteNewPage (link) {
      window.location = link
    }
  },
  created () {

  }
}
</script>

<style lang="less" scoped></style>
