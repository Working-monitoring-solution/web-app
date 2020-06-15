import request from '@/utils/request'

export function countPendingRequest() {
  return request({
    url: '/working-date/admin/count-pending-request',
    method: 'get'
  })
}

export function getPendingRequest(page) {
  return request({
    url: '/working-date/admin/get-pending-request',
    method: 'get',
    params: { page }
  })
}

export function getHandledRequest(page) {
  return request({
    url: '/working-date/admin/get-handled-request',
    method: 'get',
    params: { page }
  })
}

export function approveRequest(requestId) {
  return request({
    url: '/working-date/approve-request',
    method: 'put',
    params: { requestId }
  })
}

export function denyRequest(requestId) {
  return request({
    url: '/working-date/deny-request',
    method: 'put',
    params: { requestId }
  })
}
