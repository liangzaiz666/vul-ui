<template>
  <!-- 用户查询 -->
  <el-card style="height: 75px">
    <el-form inline>
      <el-form-item label="用户名：">
        <el-input v-model="username" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load" icon="Search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="" icon="RefreshRight" @click="clearSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px;">
    <el-button type="primary" @click="add" v-if="isAdmin" size="small" icon="Plus">新增</el-button>
    <!-- 用户信息 -->
    <el-table :data="users" @selection-change="handleSelectionChange">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-text>{{ getStatusText(row.role) }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="edit(row)" v-if="isAdmin" icon="Edit"/>
          <el-popconfirm title="确认删除?" @confirm="deleted(row.id)" v-if="isAdmin">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"/>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页加载用户信息 -->
      <el-pagination class="pagination-bar"
        v-model:currentPage="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalUsers"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="padding-top: 10px"
      ></el-pagination>
  </el-card>
  <!-- 添加/编辑用户栏 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户名：">
        <el-input v-model="form.username" autocomplete="off" :disabled="isViewMode"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="form.password" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="角色：">
        <el-select v-model="form.role" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedRole"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElPagination,
  ElPopconfirm,
  ElTableColumn
} from 'element-plus';
import {addUserAPI, deleteUserAPI, getUsersAPI,  updateUserAPI} from '@/api/user.js';
import { useUserStore } from '@/stores/userStore.js';
// 用户信息
const userStore = useUserStore();
const user = ref({});
user.value = userStore.userInfo;
// 获取管理员用户角色
const isAdmin = computed(() => user.value.role === '1');
const username = ref('');
const dialogVisible = ref(false);
const totalUsers = ref(10);
const currentPage = ref(1);
const pageSize = ref(10);
const users = ref([]);
const selectedUserIds = ref([]);
const isViewMode= ref();
const isPwd= ref();
const form = reactive({
  id: '',
  username: '',
  password: '',
  newPassword: '',
  role: ''
});
const selectedRole = [
  {
    value: '1',
    label: '管理员',
  },
  {
    value: '2',
    label: '普通用户',
  }
]
const getStatusText = (role) =>{
  if (role === '1') {
    return '管理员';
  } else if (role === '2') {
    return '普通用户';
  }
};
const handleSelectionChange = (val) => {
  selectedUserIds.value = val.map((v) => v.id);
};

let dialogTitle;
const add = () => {
  isViewMode.value = false;
  dialogVisible.value = true;
  isPwd.value =true;
  dialogTitle= '创建用户';
  Object.keys(form).forEach(key => {
    form[key] = '';
  });
};
const edit = (row) => {
  isPwd.value =false;
  isViewMode.value = true;
  dialogTitle= '编辑用户';
  dialogVisible.value = true;
  form.id = row.id;
  form.username = row.username;
  form.newPassword = row.newPassword;
  form.role = row.role;
};

const load = async () => {
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    username: username.value,
  };
  const res = await getUsersAPI(params);
  users.value = res.data.data.records;
  totalUsers.value = res.data.data.total;
};

const clearSearch = () => {
  username.value = '';
  load();
};

const deleted = async (id) => {
  const res = await deleteUserAPI(id);
  if (res.data.code === 200) {
    ElMessage.success('删除成功');
  } else {
    ElMessage.error('删除失败');
  }
  await load();

};
const save = async () => {
  if (form.id) {
    try {
      const res = await updateUserAPI(form);
      if (res.data.code === 200) {
        ElMessage.success('更新成功');
        await load();
      } else {
        ElMessage.error(res.data.message);
      }
    } catch (error) {
      ElMessage.error(error.response.data.message);
    }
    dialogVisible.value = false;
  } else {
    try {
      const res = await addUserAPI(form);
      if (res.data.code === 200) {
        ElMessage.success('添加成功');
        await load();
      } else {
        ElMessage.error(res.data.message);
      }
    } catch (error) {
      ElMessage.error(error.response.data.message);
    }
    await load();
    dialogVisible.value = false;
  }
};

// 处理分页大小改变事件
const handleSizeChange = (val) => {
  pageSize.value = val;
  load();
};

// 处理当前页改变事件
const handleCurrentChange = (val) => {
  currentPage.value = val;
  load();
};

onMounted(() => {
  load();
});
</script>

<style scoped>
.search-bar .el-form-item {
  margin-right: 10px;
}
.dialog-footer {
  text-align: right;
}
</style>

