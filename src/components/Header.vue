<template>
  <div class="header-content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    <div style="flex: 1; width: 0; display: flex; align-items: center; justify-content: flex-end " >
      <el-text>欢迎回来！</el-text>
      <el-dropdown>
            <span class="el-dropdown-link">
              {{ user.username }}
              <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
            </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage} from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/userStore.js';

const user = ref({});

const router = useRouter();
const userStore = useUserStore();
user.value = userStore.userInfo;

const exit = () => {
  userStore.clearUserInfo();
  router.push('/login');
  ElMessage.success('退出系统成功');
};

</script>
<style>
.header-content {
  display: flex;
  align-items: center;
  width: 100%;
}
</style>