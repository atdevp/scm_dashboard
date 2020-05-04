<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="resUserInfo.userlist" border stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        ></el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
        <el-table-column label="激活">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_active"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="管理员">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_staff"></el-switch>
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

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryUserInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryUserInfo.pagesize"
      :layout="resUserInfo.layout"
      :total="resUserInfo.total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //   定义获取用户列表的参数对象
      queryUserInfo: {
        search: '',
        // 也代表了当前页，可以在分页功能中使用
        pagenum: 1,
        // 也代表当前每页显示多少条数据，可以在分页功能中使用
        pagesize: 1
      },
      resUserInfo: {
        userlist: [],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // get请求参数
      const { data: res } = await this.$http.get('/users/list.go', {
        params: this.queryUserInfo
      })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.resUserInfo.userlist = res.data.result
      this.resUserInfo.total = res.data.count
    },

    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      this.queryUserInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听pagenum改变事件
    handleCurrentChange (newPage) {
      this.queryUserInfo.pagenum = newPage
      this.getUserList()
    }

  }
}
</script>

<style lang="less" scoped></style>
