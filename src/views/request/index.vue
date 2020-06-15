<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header">PENDING REQUEST</span>
      </div>
      <el-table
        v-loading="listLoadingPending"
        :data="listPending"
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
        <el-table-column align="center" label="Date" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="User" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.user === null ? null : scope.row.user.email }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Manager" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.manager === null ? null : scope.row.manager.email }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Reason" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.reason }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Handle" min-width="100">
          <template slot-scope="scope">
            <el-row>
              <el-button type="success" icon="el-icon-check" circle @click="approve(scope.row.id)" />
              <el-button type="danger" icon="el-icon-close" circle @click="deny(scope.row.id)" />
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page.sync="pendingPage"
          :total="totalPending"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          @current-change="handlePendingChange"
        />
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header">HISTORY</span>
      </div>
      <el-table
        v-loading="listLoadingHistory"
        :data="listHistory"
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
        <el-table-column align="center" label="Date" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="User ID" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.user === null ? null : scope.row.user.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Manager ID" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.manager === null ? null : scope.row.manager.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Reason" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.reason }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Status" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page.sync="historyPage"
          :total="totalHistory"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          @current-change="handleHistoryChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getHandledRequest, getPendingRequest, approveRequest, denyRequest } from '@/api/request'

export default {
  name: 'Request',
  filters: {
    statusFilter(status) {
      const statusMap = {
        APPROVED: 'success',
        DENIED: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listPending: [],
      pendingPage: 1,
      totalPending: 0,
      listHistory: [],
      historyPage: 1,
      totalHistory: 0,
      listLoadingPending: false,
      listLoadingHistory: false,
      pageSize: 20
    }
  },
  created() {
    this.listLoadingPending = true
    this.listLoadingHistory = true
    getPendingRequest(this.pendingPage - 1).then(response => {
      this.listPending = response.data.content
      this.totalPending = response.data.totalElements
      this.listLoadingPending = false
    })
    getHandledRequest(this.historyPage - 1).then(response => {
      this.listHistory = response.data.content
      this.totalHistory = response.data.totalElements
      this.listLoadingHistory = false
    })
  },
  methods: {
    approve(requestId) {
      approveRequest(requestId).then(response => {
        this.listLoadingPending = true
        this.listLoadingHistory = true
        getPendingRequest(this.pendingPage - 1).then(response => {
          this.listPending = response.data.content
          this.totalPending = response.data.totalElements
          this.listLoadingPending = false
        })
        getHandledRequest(this.historyPage - 1).then(response => {
          this.listHistory = response.data.content
          this.totalHistory = response.data.totalElements
          this.listLoadingHistory = false
        })
      })
    },
    deny(requestId) {
      denyRequest(requestId).then(response => {
        this.listLoadingPending = true
        this.listLoadingHistory = true
        getPendingRequest(this.pendingPage - 1).then(response => {
          this.listPending = response.data.content
          this.totalPending = response.data.totalElements
          this.listLoadingPending = false
        })
        getHandledRequest(this.historyPage - 1).then(response => {
          this.listHistory = response.data.content
          this.totalHistory = response.data.totalElements
          this.listLoadingHistory = false
        })
      })
    },
    handlePendingChange() {
      this.listLoadingPending = true
      getPendingRequest(this.pendingPage - 1).then(response => {
        this.listPending = response.data.content
        this.totalPending = response.data.totalElements
        this.listLoadingPending = false
      })
    },
    handleHistoryChange() {
      this.listLoadingHistory = true
      getHandledRequest(this.historyPage - 1).then(response => {
        this.listHistory = response.data.content
        this.totalHistory = response.data.totalElements
        this.listLoadingHistory = false
      })
    }
  }
}
</script>

<style>
.box-card {
  margin: 10px;
}
.header {
  font-weight: bold;
}
</style>
