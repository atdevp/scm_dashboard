<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目列表</el-breadcrumb-item>
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
          <el-button type="primary">添加项目</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <template>
      <el-table
        :data="resProjectInfo.projectlist"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" fixed></el-table-column>
        <el-table-column prop="name" label="名称" ></el-table-column>
        <el-table-column prop="url" label="地址" width="400"></el-table-column>
        <el-table-column prop="p_type" label="类型">
        </el-table-column>
        <el-table-column label="创建时间">
            <template slot-scope="scope">
                {{ scope.row.add_date | moment('YYYY-MM-DD HH:mm:ss')}}
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
      </template>

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
        pagesize: 10
      },
      resProjectInfo: {
        projectlist: [],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  created () {
    this.getProjectList()
  },
  methods: {
    async getProjectList () {
      const { data: res } = await this.$http.get('/projects/list.go', {
        params: this.queryProjectInfo
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      console.log(res)
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
    }
  }
}
</script>

<style lang="less" scoped></style>
