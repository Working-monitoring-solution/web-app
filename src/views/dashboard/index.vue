<template>
  <div class="dashboard-container">
    <el-form ref="formSearch" :inline="true" :model="formSearch" :rules="rules" class="form-search">
      <el-form-item label="Search by" prop="name">
        <el-input
          v-model="formSearch.name"
          type="text"
          placeholder="name"
          @keyup.enter.native="search"
        />
      </el-form-item>
      <el-form-item label="or" prop="email">
        <el-input
          v-model="formSearch.email"
          type="text"
          placeholder="email"
          @keyup.enter.native="searchUser"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">Search</el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column align="center" label="Name" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Email" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" min-width="60">
        <template slot-scope="scope">
          <el-switch :value="scope.row.active" @change="changeStatus(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role admin" min-width="70">
        <template slot-scope="scope">
          <el-switch :value="scope.row.roleAdmin" @change="changeRoleAdmin(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Created Date" min-width="90">
        <template slot-scope="scope">
          {{ scope.row.createdDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations" min-width="70">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDetail(scope.row.id)">Detail</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        :total="totalUser"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { searchUsers, changeActiveStatus, changeRoleAdmin } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    const validateName = (rule, value, callback) => {
      setTimeout(() => {
        if (/\d/.test(value)) {
          return callback(new Error('Name is invalid'))
        }
        callback()
      }, 1000)
    }
    const validateEmail = (rule, value, callback) => { callback() }
    return {
      formSearch: {
        name: '',
        email: '',
        position: '',
        department: ''
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      listUsers: null,
      listLoading: true,
      pageSize: 20,
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
    searchUsers(0, '', '', '', '').then(response => {
      this.totalPages = response.data.totalPages
      this.totalUser = response.data.totalElements
      this.listUsers = response.data.content
      this.listLoading = false
    })
  },
  methods: {
    search() {
      this.$refs.formSearch.validate(valid => {
        this.currentPage = 0
        this.getPageSearch(0)
      })
    },
    getPageSearch(page) {
      this.listLoading = true
      searchUsers(page,
        this.formSearch.name,
        this.formSearch.email,
        this.formSearch.position,
        this.formSearch.department)
        .then(response => {
          this.totalPages = response.data.totalPages
          this.totalUser = response.data.totalElements
          this.listUsers = response.data.content
          this.listLoading = false
        })
    },
    changeStatus(id) {
      changeActiveStatus(id).then(response => {
        this.getPageSearch(this.currentPage - 1)
      })
    },
    changeRoleAdmin(id) {
      changeRoleAdmin(id).then(response => {
        this.getPageSearch(this.currentPage - 1)
      })
    },
    handleCurrentChange() {
      this.getPageSearch(this.currentPage - 1)
    },
    handleDetail(id) {
      this.$router.push({ name: 'Detail', params: { id: id }})
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
