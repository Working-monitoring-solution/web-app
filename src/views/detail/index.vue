<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header">User information</span>
      </div>
      <el-row align="middle">
        <el-col :span="8" :offset="3">
          <el-form
            ref="form"
            class="form-container"
            label-width="90px"
            disabled
          >
            <el-form-item label="Name:">
              <el-col>
                <div v-if="isEditting">
                  <el-input v-model="form.name" />
                </div>
                <div v-else>
                  {{ form.name }}
                </div>
              </el-col>
            </el-form-item>
            <el-form-item label="Email:">
              <el-col>
                <div v-if="isEditting">
                  <el-input v-model="form.email" />
                </div>
                <div v-else>
                  {{ form.email }}
                </div>
              </el-col>
            </el-form-item>
          </el-form>
          <el-form ref="form" class="form-container" label-width="90px">
            <el-form-item label="Status:">
              <div v-if="isEditting">
                <el-select v-model="formEdit.active">
                  <el-option label="Active" :value="true" />
                  <el-option label="Inactive" :value="false" />
                </el-select>
              </div>
              <div v-else>
                <el-tag :type="form.active | activeFilter">
                  {{ activeMapping[form.active] }}
                </el-tag>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form ref="form" class="form-container" label-width="120px">
            <el-form-item label="Manger:">
              <div v-if="isEditting">
                <el-select
                  v-model="formEdit.manager.id"
                  placeholder="Please select employee's manager"
                  clearable
                >
                  <el-option
                    v-for="item in listManager"
                    :key="item.id"
                    :label="item.email"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.email }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.name }}
                    </span>
                  </el-option>
                </el-select>
              </div>
              <div v-else>
                {{ form.manager === null ? null : form.manager.name }}
              </div>
            </el-form-item>
            <el-form-item label="Department:">
              <div v-if="isEditting">
                <el-select
                  v-model="formEdit.department.id"
                  placeholder="Please select employee's department"
                  clearable
                  @change="getListPosition"
                >
                  <el-option
                    v-for="item in listDepartment"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <div v-else>
                {{ form.department === null ? null : form.department.name }}
              </div>
            </el-form-item>
            <el-form-item label="Position:">
              <div v-if="isEditting">
                <el-select
                  v-model="formEdit.position.id"
                  placeholder="Please select employee's position"
                  clearable
                >
                  <el-option
                    v-for="item in listPosition"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <div v-else>
                {{ form.position === null ? null : form.position.name }}
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div v-if="isEditting">
        <el-row class="button">
          <el-button type="primary" @click="submit">Submit</el-button>
          <el-button type="danger" @click="cancleEdit">Cancle</el-button>
        </el-row>
      </div>
      <div v-else>
        <el-row class="button">
          <el-button type="primary" @click="enableEdit">Edit</el-button>
        </el-row>
      </div>
    </el-card>
    <div class="data-table">
      <el-form
        :inline="true"
        class="form-search"
      >
        <el-date-picker
          v-model="searchDate"
          type="month"
          placeholder="Pick a month"
        />
        <el-form-item>
          <el-button type="primary" @click="search">Search</el-button>
        </el-form-item>
      </el-form>
      <div v-if="displayChart">
        <el-card class="box-card">
          <el-table
            :data="reportMonth"
            border
            fit
          >
            <el-table-column align="center" label="Working days">
              <template slot-scope="scope">
                {{ scope.row.workingDate }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Unauthorized absences" min-width="100px">
              <template slot-scope="scope">
                {{ scope.row.unauthorizedAbsence }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Day offs">
              <template slot-scope="scope">
                {{ scope.row.dayOff }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Stay late">
              <template slot-scope="scope">
                {{ scope.row.workLate }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Leave soon">
              <template slot-scope="scope">
                {{ scope.row.homeSoon }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Offsite times">
              <template slot-scope="scope">
                {{ scope.row.offSiteTime }}
              </template>
            </el-table-column>
          </el-table>
          <div class="button" style="margin-top: 10px;">
            <el-button type="primary" @click="dowloadExcel">Dowload detail data</el-button>
          </div>
        </el-card>
        <el-card class="box-card">
          <bar-chart :chart-data="reportYear" :options="barOptions" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllWorkingDateInMonth, getUserReport, getUserById, changeUserInfor } from '@/api/detail'
import { getManagers, getDepartment, getPosition } from '@/api/user'
import BarChart from '@/components/Chart/BarChart'

export default {
  name: 'Detail',
  components: {
    BarChart
  },
  filters: {
    activeFilter(active) {
      const activeMap = {
        true: 'success',
        false: 'danger'
      }
      return activeMap[active]
    }
  },
  data() {
    return {
      isEditting: false,
      listManager: [],
      listPosition: [],
      listDepartment: [],
      user: '',
      activeMapping: {
        true: 'active',
        false: 'inactive'
      },
      form: {
        name: '',
        email: '',
        manager: '',
        active: false,
        position: '',
        department: ''
      },
      formEdit: {
        name: '',
        email: '',
        manager: '',
        active: false,
        position: '',
        department: ''
      },
      searchDate: '',
      listLoading: false,
      data: [],
      displayChart: false,
      reportYear: '',
      reportMonth: '',
      barOptions: '',
      searchMonth: '',
      searchYear: ''
    }
  },
  created() {
    getUserById(this.$route.params.id).then((response) => {
      this.form = response.data
      if (this.form.manager === null) {
        this.form.manager = {
          id: null,
          name: null
        }
      }
      if (this.form.department === null) {
        this.form.department = {
          id: null,
          name: null
        }
      }
      if (this.form.position === null) {
        this.form.position = {
          id: null,
          name: null
        }
      }
      this.formEdit = this.form
    })
    getManagers().then(response => {
      this.listManager = response.data
    })
    getDepartment().then(response => {
      this.listDepartment = response.data
    })
    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Working data in year',
        fontSize: 14
      }
    }
  },
  methods: {
    enableEdit() {
      this.isEditting = true
    },
    cancleEdit() {
      this.isEditting = false
    },
    submit() {
      changeUserInfor(this.$route.params.id, this.formEdit.manager.id, this.formEdit.active, this.formEdit.department.id, this.formEdit.position.id)
        .then(response => {
          this.form = response.data
          this.formEdit = this.form
          this.isEditting = false
        })
    },
    getListPosition() {
      getPosition(this.formEdit.department.id).then(response => {
        this.listPosition = response.data
      })
    },
    search() {
      this.searchMonth = this.searchDate.getMonth() + 1
      this.searchYear = this.searchDate.getFullYear()
      getUserReport(this.$route.params.id, this.searchMonth, this.searchYear)
        .then((response) => {
          this.reportYear = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Working dates',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: response.data.reportYear.map((obj) => obj.workingDate)
              },
              {
                label: 'Day offs',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: response.data.reportYear.map((obj) => obj.dayOff)
              },
              {
                label: 'Unauthorized absences',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: response.data.reportYear.map((obj) => obj.unauthorizedAbsence)
              }
            ]
          }
          this.reportMonth = [response.data.reportMonth]
          this.displayChart = true
        })
    },
    dowloadExcel() {
      const url = getAllWorkingDateInMonth(this.$route.params.id, this.searchMonth, this.searchYear)
      window.open(url)
    }
  }
}
</script>

<style>
.box-card {
  margin: 10px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  background-color: #f9fafc;
}
.button {
  text-align: center;
}
.form-search {
  text-align: center;
}
.el-select {
  width: 100%;
}
.header {
  font-weight: bold;
}
.data-table {
  margin: 20px 10px;
}
.form-container {
  white-space: nowrap;
  overflow: hidden;
}
</style>
