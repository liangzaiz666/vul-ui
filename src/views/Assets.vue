<template>
  <!-- 资产搜索 -->
  <el-card style="max-width: 100%">
    <el-form inline>
      <el-form-item label="资产名称：">
        <el-input v-model="name" placeholder="资产名称" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="IP地址：">
        <el-input v-model="ip" placeholder="IP地址" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属系统：">
        <el-input v-model="systemName" placeholder="所属系统" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="资产价值：">
        <el-select v-model="worth" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedWorth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load" icon="Search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  @click="clear" icon="RefreshRight">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 资产数据 -->
  <el-card style="margin-top: 10px;">
    <div slot="header" class="clearfix">
      <el-popconfirm title="确认删除?" @confirm="deleteBatch" v-if="isAdmin">
        <template #reference>
          <el-button type="danger" size="small" icon="Delete">批量删除</el-button>
        </template>
      </el-popconfirm>
      <el-button type="primary" @click="add" v-if="isAdmin" size="small" icon="Plus">新增</el-button>
      <el-button type="default" size="small" icon="UploadFilled" style="float: right;" @click="upDialogVisible = true" >批量导入</el-button>
      <el-dialog title="资产导入" v-model="upDialogVisible" width="30%">
        <el-upload
            class="upload-demo"
            drag
            :http-request="uploadFile"
            :show-file-list="false"
            >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">拽入文件或 <em>选择文件</em></div>
        </el-upload>
        <el-button type="primary" size="small" @click="downloadTemplate" style="margin-top: 10px">下载模板</el-button>
      </el-dialog>
    </div>
    <!-- 资产数据 -->
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="资产名称" width="200"></el-table-column>
      <el-table-column prop="ip" label="IP地址" width="200"></el-table-column>
      <el-table-column prop="systemName" label="所属系统" width="110" sortable></el-table-column>
      <el-table-column prop="worth" label="资产价值" width="120" sortable>
        <template #default="{ row }">
          <el-text v-if="row.worth === '3'">非常重要</el-text>
          <el-text v-else-if="row.worth === '2'">重要</el-text>
          <el-text v-else-if="row.worth === '1'">一般</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" ></el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="180" ></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="detail(row)" icon="View"/>
          <el-button type="primary" size="small" @click="edit(row)" v-if="isAdmin" icon="Edit"/>
          <el-popconfirm title="确认删除?" @confirm="deleted(row.id)" v-if="isAdmin">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"/>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        v-model:currentPage="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="padding-top: 10px"
    ></el-pagination>
  </el-card>
  <!-- 查看、编辑资产 -->
  <el-drawer
        :title="drawerTitle"
        v-model="drawerVisible"
        direction="rtl"
        size="30%"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="资产名称：">
          <el-text v-if="isViewMode">{{ form.name }}</el-text>
          <el-input v-else class="" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="IP地址：">
          <el-text v-if="isViewMode">{{ form.ip }}</el-text>
          <el-input v-else v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="所属系统：">
          <el-text v-if="isViewMode">{{ form.systemName }}</el-text>
          <el-input v-else v-model="form.systemName"></el-input>
        </el-form-item>
        <el-form-item label="资产价值：">
          <el-text v-if="isViewMode">{{getWorthText(form.worth)}}</el-text>
          <el-select v-else v-model="form.worth" placeholder="" style="width: 120px;">
            <el-option
                v-for="item in selectedWorth"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto" v-if="!isViewMode">
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 新增资产 -->
    <el-dialog v-model="assetDialogVisible" title="新增资产" width="40%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="资产名称：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="IP地址：">
          <el-input v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="所属系统：">
          <el-input v-model="form.systemName"></el-input>
        </el-form-item>
        <el-form-item label="资产价值：">
          <el-select v-model="form.worth" style="width: 120px;">
            <el-option
                v-for="item in selectedWorth"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" v-if="!isViewMode">
          <el-button @click="assetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  computed,
} from 'vue';
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElTag,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDialog,
  ElPopconfirm,
  ElMessage,
} from 'element-plus';
import { useUserStore } from '@/stores/userStore.js';
import { getAssetsAPI, deleteAssetAPI, batchDeleteAssetsAPI, updateAssetAPI, addAssetAPI,importFileAPI } from '@/api/asset';
// 用户信息
const userStore = useUserStore();
const user = ref({});
user.value = userStore.userInfo;
// 获取管理员用户角色
const isAdmin = computed(() => user.value.role === '1');
// 获取读者用户角色
const isReader = computed(() => user.value.role === '2');

// 组件的逻辑部分
const name =ref('');
const ip = ref('');
const systemName = ref('');
const worth = ref('');
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const createdAt = ref('');
const updatedAt = ref('');
const isViewMode= ref();
const drawerVisible = ref(false);
const upDialogVisible = ref(false);
const assetDialogVisible = ref(false);
const form = reactive({
  id: '',
  name: '',
  ip: '',
  systemName: '',
  worth: '',
});
const selectedIds = ref([]);
const selectedWorth = [
  {
    value: '1',
    label: '一般',
  },
  {
    value: '2',
    label: '重要',
  },
  {
    value: '3',
    label: '非常重要',
  },
]

// 加载数据
const load = async () => {
  // 资产列表
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    name: name.value,
    ip: ip.value,
    systemName: systemName.value,
    worth: worth.value,
  };
  const res = await getAssetsAPI(params);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

const getWorthText = (worth) =>{
  if (worth === '3') {
    return '非常重要';
  } else if (worth === '2') {
    return '重要';
  } else if (worth === '1') {
    return '一般';
  }
};

// 清空搜索条件
const clear = () => {
    name.value='';
    ip.value = '';
    systemName.value = '';
    worth.value = '';
    load();
};

// 处理分页大小改变事件
const handleSizeChange = (val) => {
  pageSize.value = val;
  load(); // 重新加载数据
};

// 处理当前页改变事件
const handleCurrentChange = (val) => {
  currentPage.value = val;
  load(); // 重新加载数据
};


// 删除选中的资产
const deleted = async (id) => {
  const res = await deleteAssetAPI(id);
  if (res.data.code === 200) {
    ElMessage.success('删除成功');
  } else {
    ElMessage.error('删除失败');
  }
  await load();
};

// 处理表格行选中事件
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(row => row.id);
};

// 批量删除资产
const deleteBatch = async () => {
  // 处理批量删除逻辑
  if (!selectedIds.value.length) {
    ElMessage.warning('请选择数据！');
    return;
  }
  try {
    const response = await batchDeleteAssetsAPI(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success('删除成功');
      await load();
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('批量删除失败');
  }
};

// 新增资产
const add = () => {
  assetDialogVisible.value = true;
  Object.keys(form).forEach(key => {
    form[key] = '';
  });
};

// 提交保存的数据
const save = async () => {
  if (form.id) {
    try {
      const res = await updateAssetAPI(form);
      if (res.data.code === 200) {
        ElMessage.success('更新成功');
        await load();
      } else {
        ElMessage.error(res.data.message);
      }
    } catch (error) {
      ElMessage.error(error.response.data.message);
    }
    drawerVisible.value = false;
  } else {
    try {
      const res = await addAssetAPI(form);
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
    assetDialogVisible.value = false;
  }
};
let drawerTitle;
// 资产详情
const detail = (row) => {
  drawerTitle= '详情';
  drawerVisible.value = true;
  // 设置表单数据
  form.name = row.name;
  form.id = row.id;
  form.ip = row.ip;
  form.systemName = row.systemName;
  form.worth = row.worth;
  isViewMode.value = true;
};
// 资产编辑
const edit = (row) => {
  drawerTitle= '编辑';
  drawerVisible.value = true;
  form.name = row.name;
  form.id = row.id;
  form.ip = row.ip;
  form.systemName = row.systemName;
  form.worth = row.worth;
  isViewMode.value = false;
};
const uploadFile = async (file) => {
  try {
    const res = await importFileAPI(file.file);
    if (res.data.code === 200) {
      ElMessage.success('导入成功');
      await load();
    } else {
      ElMessage.error(res.data.message);
    }
  }catch (error) {
    ElMessage.error(error.response.data.message);
  }
};

const downloadTemplate = () => {
  let a = document.createElement('a')
  a.href = '../../../public/static/assets_template.xlsx'
  a.download = 'assets_template.xlsx'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

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
