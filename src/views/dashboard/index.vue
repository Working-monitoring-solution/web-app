<template>
  <div class="dashboard-container">
    <el-table
      v-loading="listLoading"
      :data="listUsers"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" min-width="50">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" min-width="170">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Email" min-width="170">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" min-width="50">
        <template slot-scope="scope">
          <el-switch :value="scope.row.active" @change="changeStatus(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Created Date" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.createdDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations" min-width="60">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDetail(scope.row.id)">Detail</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        page-size="20"
        :total="totalUser"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUsers, changeActiveStatus, getUsersInfo } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      listUsers: null,
      listLoading: true,
      currentPage: 0,
      totalPages: 0,
      totalUser: 0
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    getUsersInfo().then(response => {
      this.totalPages = response.data.pagesCount
      this.totalUser = response.data.usersCount
    })
    this.getPage(0)
  },
  methods: {
    getPage(number) {
      this.listLoading = true
      getUsers(number).then(response => {
        this.listUsers = response.data
        this.listLoading = false
      }).catch(error => {
        console.log(error)
      })
    },
    changeStatus(id) {
      changeActiveStatus(id).then(response => {
        this.getPage(this.currentPage)
      })
    },
    handleCurrentChange() {
      this.getPage(this.currentPage - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
