<template>
  <div class="login-container">
    <el-form ref="formRef" :model="form" :rules="rules" class="login-page">
      <div class="login-logo">
       <img src="../assets/login.png" style="width:85%;margin-top: 25px">
      </div>
      <el-form-item prop="username">
        <el-input v-model="form.username" style="width:100%;height: 40px;margin-top: 10px"  placeholder="用户名" clearable>
          <template #prefix>
            <el-icon class="el-input__icon"><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" style="width:100%;height: 40px;margin-top: 10px" placeholder="密码" clearable show-password>
          <template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%;height: 40px;margin-top: 10px" @click="login">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/userStore.js';
import { loginAPI } from '@/api/auth.js';

const form = ref({
  username: '',
  password: '',
});

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
});

const router = useRouter();
const formRef = ref(null);

const login = async () => {
    const res = await loginAPI(form.value);
    if (res.data.code === 200) {
      ElMessage.success("登录成功");
      localStorage.setItem('token', res.data.data.token)
      await useUserStore().getUserInfo();
      router.push("/");
    } else {
      ElMessage.error("登录失败，请检查");
    }
};

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-image: url("../assets/bg.jpg");
  overflow: hidden;
}
.login-page {
  border-radius: 5px;
  margin: 180px auto;
  width: 400px;
  height: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
}
.login-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

}
</style>
