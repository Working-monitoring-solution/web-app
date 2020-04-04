import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function validateToken(token) {
  return request({
    url: '/admin/validate-token',
    method: 'post'
  })
}

export function getUsers(page) {
  return request({
    url: '/admin/get-users',
    method: 'post',
    params: { page }
  })
}

export function changeActiveStatus(id) {
  return request({
    url: '/admin/change-active-status',
    method: 'post',
    params: { id }
  })
}

export function getUsersInfo() {
  return request({
    url: '/admin/get-all-users-info',
    method: 'post'
  })
}

export function createUser(user) {
  return request({
    url: '/admin/create-user',
    method: 'post',
    data: user
  })
}
