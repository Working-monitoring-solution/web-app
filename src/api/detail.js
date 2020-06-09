import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getAllWorkingDateInMonth(userId, month, year) {
  const baseURL = process.env.VUE_APP_BASE_API
  const token = getToken()
  return `${baseURL}/working-date/get-working-date?userId=${userId}&month=${month}&year=${year}&token=${token}`
}

export function getUserReport(userId, month, year) {
  return request({
    url: '/report/get-report',
    method: 'post',
    params: { userId, month, year }
  })
}

export function getUserById(id) {
  return request({
    url: '/admin/get-user-by-id',
    method: 'post',
    params: { id }
  })
}

export function changeUserInfor(userId, managerId, status, department, position) {
  return request({
    url: '/admin/change-user-info',
    method: 'post',
    params: { userId, managerId, status, department, position }
  })
}
