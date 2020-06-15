import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function validateToken() {
  return request({
    url: '/admin/validate-token',
    method: 'get'
  })
}

export function searchUsers(page, name, email, position, department) {
  return request({
    url: '/admin/search-users',
    method: 'get',
    params: { page, name, email, position, department }
  })
}

export function changeActiveStatus(id) {
  return request({
    url: '/admin/change-active-status',
    method: 'put',
    params: { id }
  })
}

export function changeRoleAdmin(id) {
  return request({
    url: '/admin/change-role-admin-status',
    method: 'put',
    params: { id }
  })
}

export function getManagers() {
  return request({
    url: '/admin/get-all-manager',
    method: 'get'
  })
}

export function createUser(user) {
  return request({
    url: '/admin/create-user',
    method: 'post',
    data: user
  })
}

export function getDepartment() {
  return request({
    url: '/admin/get-department',
    method: 'get'
  })
}

export function getPosition(departmentId) {
  return request({
    url: '/admin/get-position',
    method: 'get',
    params: { departmentId }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

