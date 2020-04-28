<template>
  <div class="dashboard-container">
    <el-form ref="formSearch" :inline="true" :model="formSearch" :rules="rules" class="form-search">
      <el-form-item label="Search by" prop="name">
        <el-input
          v-model="formSearch.name"
          type="text"
          placeholder="name"
          @keyup.enter.native="searchUser"
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
        <el-button type="primary" @click="searchUser">Search</el-button>
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
import { getUsers, changeActiveStatus, getUsersInfo, searchByName, searchByEmail, searchByNameAndEmail } from '@/api/user'

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
        email: ''
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
    getUsersInfo().then(response => {
      this.totalPages = response.data.pagesCount
      this.totalUser = response.data.usersCount
    })
    this.getPage(0)
  },
  methods: {
    searchUser() {
      this.$refs.formSearch.validate(valid => {
        this.currentPage = 0
        console.log('start search')
        this.getPageSearch(0)
      })
    },
    getPageSearch(pageNumber) {
      if (this.formSearch.name.trim() === '' && this.formSearch.email.trim() !== '') {
        console.log('serach by email')
        this.listLoading = true
        searchByEmail(this.formSearch.email, pageNumber).then(response => {
          this.listUsers = response.data.userList
          this.totalPages = response.data.pagesCount
          this.totalUser = response.data.usersCount
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
      }
      if (this.formSearch.name.trim() !== '' && this.formSearch.email.trim() === '') {
        console.log('serach by name')
        this.listLoading = true
        searchByName(this.formSearch.name, pageNumber).then(response => {
          this.listUsers = response.data.userList
          this.totalPages = response.data.pagesCount
          this.totalUser = response.data.usersCount
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
      }
      if (this.formSearch.name.trim() !== '' && this.formSearch.email.trim() !== '') {
        console.log('serach by email and name')
        this.listLoading = true
        searchByNameAndEmail(this.formSearch.name, this.formSearch.email, pageNumber).then(response => {
          this.listUsers = response.data.userList
          this.totalPages = response.data.pagesCount
          this.totalUser = response.data.usersCount
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
      }
      if (this.formSearch.name.trim() === '' && this.formSearch.email.trim() === '') {
        console.log('no search')
        this.getPage(pageNumber)
      }
    },
    getPage(pageNumber) {
      this.listLoading = true
      getUsers(pageNumber).then(response => {
        this.listUsers = response.data
        this.listLoading = false
      }).catch(error => {
        console.log(error)
      })
    },
    changeStatus(id) {
      changeActiveStatus(id).then(response => {
        this.getPage(this.currentPage - 1)
      })
    },
    handleCurrentChange() {
      if (this.formSearch.name.trim() !== '' || this.formSearch.email.trim() !== '') {
        this.getPageSearch(this.currentPage - 1)
      } else {
        this.getPage(this.currentPage - 1)
      }
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
