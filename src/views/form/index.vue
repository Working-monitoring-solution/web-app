<template>
  <div class="app-container">
    <el-form ref="form" class="form-container" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="Name" prop="name">
        <el-col>
          <el-input v-model="form.name" placeholder="Please enter user's name" />
        </el-col>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-col>
          <el-input
            v-model="form.email"
            type="email"
            placeholder="Please enter user's email"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-col>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Please enter user's password"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="Confirm password" prop="confirmPassword">
        <el-col>
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Please enter user's password again"
          />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">Submit</el-button>
        <el-button @click="resetForm('form')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createUser } from '@/api/user'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Name can not be empty'))
      }
      callback()
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Email can not be empty'))
      }
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      setTimeout(() => {
        if (!regex.test(value.toLowerCase())) {
          return callback(new Error('Email is invalid'))
        }
        callback()
      }, 1000)
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Password can not be empty'))
      }
      callback()
    }
    const validateConfirmPassword = (rule, value, callback) => {
      setTimeout(() => {
        if (value !== this.form.password) {
          return callback(new Error('Password doesn\'t match'))
        }
        callback()
      }, 1000)
    }
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        const user = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password
        }
        createUser(user).then(response => {
          this.$message({
            message: 'Create user success!',
            type: 'success'
          })
          this.$refs[formName].resetFields()
        }).catch(error => {
          console.log(error)
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
.form-container {
  width: 60%;
  display: inline-block;
}
.app-container {
  text-align: center;
}
</style>

