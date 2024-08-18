<template>
  <!-- 漏洞查询 -->
  <el-card>
    <el-form inline>
      <el-form-item label="漏洞名称：">
        <el-input v-model="name" placeholder="" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="IP地址：">
        <el-input v-model="ip" placeholder="" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="风险等级：">
        <el-select v-model="level" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理优先级：">
        <el-select v-model="priority" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedPriority"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="漏洞状态：">
        <el-select v-model="status" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedStatus"
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
  <!-- 漏洞数据 -->
  <el-card style="margin-top: 10px;">
    <div slot="header" class="clearfix">
      <el-popconfirm title="确认删除?" @confirm="batchDelete" v-if="isAdmin">
        <template #reference>
          <el-button type="danger" size="small" icon="Delete">批量删除</el-button>
        </template>
      </el-popconfirm>
      <el-button type="success" @click="showStatusDialog" size="small" icon="MagicStick">批量处置</el-button>
      <el-button type="primary" @click="add" v-if="isAdmin" size="small" icon="Plus">新增</el-button>
      <div style="float: right;">
        <el-tooltip content="Tip：非常紧急：优先级>=5；紧急：优先级=4，一般：优先级<4" placement="bottom">
          <el-button type="default" v-if="isAdmin" size="small" icon="HelpFilled" @click="coutPriority">优先级计算</el-button>
        </el-tooltip>
        <el-button type="default" v-if="isAdmin" size="small" icon="UploadFilled" @click="upDialogVisible = true">批量导入</el-button>
      </div>
      <el-dialog title="漏洞导入" v-model="upDialogVisible" width="30%">
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
    <!-- 漏洞列表 -->
    <el-table :data="tableData"  @selection-change="handleSelectionChange" :max-height="tableHeightStore.height" id="elTableId">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="name" label="漏洞名称" width="200"></el-table-column>
        <el-table-column prop="level" label="风险等级" width="110" sortable>
          <template #default="{ row }">
            <n-tag v-if="row.level === 'critical'" :color="{ color: '#ac1456', textColor: '#ffffff'}" :bordered="false" style="height:25px; padding: 9px;font-size: 13px; border-radius:4px" >严重</n-tag>
            <n-tag v-else-if="row.level === 'high'" :color="{ color: '#ee2727', textColor: '#ffffff'}" :bordered="false" style="height:25px; padding: 9px;font-size: 13px; border-radius:4px">高危</n-tag>
            <n-tag v-else-if="row.level === 'medium'" :color="{ color: '#fdbf07', textColor: '#ffffff'}" :bordered="false" style="height:25px; padding: 9px;font-size: 13px; border-radius:4px">中危</n-tag>
            <n-tag v-else-if="row.level === 'low'" :color="{ color: '#65be3a', textColor: '#ffffff'}" :bordered="false" style="height:25px; padding: 9px;font-size: 13px; border-radius:4px">低危</n-tag>
          </template>
        </el-table-column>
      <el-table-column prop="ip" label="IP地址" width="140"></el-table-column>
      <el-table-column prop="systemName" label="所属系统" width="140"></el-table-column>
      <el-table-column prop="location" label="漏洞位置" width="140"></el-table-column>
      <el-table-column prop="priority" label="处理优先级" width="120" sortable>
          <template #default="{ row }">
            <el-text v-if="row.priority === '3'">非常紧急</el-text>
            <el-text v-else-if="row.priority === '2'">紧急</el-text>
            <el-text v-else-if="row.priority === '1'">一般</el-text>
            <el-text v-else></el-text>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="漏洞状态" width="110" sortable>
          <template #default="{ row }">
            <el-text v-if="row.status === 'fix'">已修复</el-text>
            <el-text v-else-if="row.status === 'accept'">接受</el-text>
            <el-text v-else-if="row.status === 'mis'">误报</el-text>
            <el-text v-else-if="row.status === 'unfix'">未修复</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发现时间" width="180" ></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" ></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)" icon="View"/>
            <el-button type="primary" size="small" @click="handleEdit(row)" v-if="isAdmin" icon="Edit"/>
            <el-popconfirm title="确认删除?" @confirm="handleDelete(row.id)" v-if="isAdmin">
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
  <!-- 查看、编辑漏洞栏 -->
  <el-drawer
      :title="drawerTitle"
      v-model="drawerVisible"
      direction="rtl"
      size="30%"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="漏洞名称：">
        <el-text v-if="isViewMode">{{ form.name }}</el-text>
        <el-input v-else class="form-input" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="漏洞详情：">
        <el-text v-if="isViewMode">{{ form.detail }}</el-text>
        <el-input v-else class="form-input" v-model="form.detail" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="风险等级：">
        <el-text v-if="isViewMode">{{getLevelText(form.level)}}</el-text>
        <el-select v-else v-model="form.level" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址：">
        <el-text v-if="isViewMode">{{ form.ip }}</el-text>
        <el-input v-else class="form-input" v-model="form.ip"></el-input>
      </el-form-item>
      <el-form-item label="所属系统：">
        <el-text>{{ form.systemName }}</el-text>
      </el-form-item>
      <el-form-item label="漏洞位置：">
        <el-text v-if="isViewMode">{{ form.location }}</el-text>
        <el-input v-else class="form-input" v-model="form.location"></el-input>
      </el-form-item>
      <el-form-item label="修复方案：">
        <el-text v-if="isViewMode">{{ form.solution }}</el-text>
        <el-input v-else class="form-input" v-model="form.solution" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="处理优先级：">
        <el-text v-if="isViewMode">{{ getPriorityText(form.priority)}}</el-text>
        <el-select v-else v-model="form.priority" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedPriority"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="漏洞状态：">
        <el-text v-if="isViewMode">{{getStatusText(form.status)}}</el-text>
        <el-select v-else v-model="form.status" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CVE编号：">
        <el-text v-if="isViewMode">{{ form.cve }}</el-text>
        <el-input v-else class="form-input" v-model="form.cve"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto" v-if="!isViewMode">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 新增漏洞栏 -->
  <el-dialog v-model="vulDialogVisible" title="新增漏洞" width="40%">
    <el-form :model="form" label-width="120px">
      <el-form-item label="漏洞名称：">
        <el-input class="form-input" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="漏洞详情：">
        <el-input class="form-input" v-model="form.detail" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="风险等级：">
        <el-select v-model="form.level" placeholder="" style="width: 120px;">
          <el-option
                v-for="item in selectedLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址：">
        <el-input class="form-input" v-model="form.ip"></el-input>
      </el-form-item>
      <el-form-item label="漏洞位置：">
        <el-input class="form-input" v-model="form.location"></el-input>
      </el-form-item>
      <el-form-item label="修复方案：">
        <el-input class="form-input" v-model="form.solution"></el-input>
      </el-form-item>
      <el-form-item label="处理优先级：">
        <el-select v-model="form.priority" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedPriority"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="漏洞状态：">
        <el-select v-model="form.status" placeholder="" style="width: 120px;">
          <el-option
              v-for="item in selectedStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CVE编号：">
        <el-input class="form-input" v-model="form.cve"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer" v-if="!isViewMode">
        <el-button @click="vulDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">新增</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="statusDialogVisible" title="漏洞处置" width="20%">选择处置动作：
    <el-select v-model="newStatus" style="margin-top: 10px;margin-bottom: 10px">
      <el-option
          v-for="item in selectedStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      >
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="statusDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="batchEditStatus">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  computed, onActivated,
} from 'vue';
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDialog,
  ElPopconfirm,
  ElMessage,
} from 'element-plus';
import { useUserStore } from '@/stores/userStore.js';
import { getVulsAPI, deleteVulAPI, batchDeleteVulsAPI, updateVulAPI, addVulAPI, importFileAPI, coutPriorityAPI, batchEditStatusAPI} from '@/api/vul';
import useTableHeightStore from '@/stores/table';
const tableHeightStore = useTableHeightStore()

// 用户信息
const userStore = useUserStore();
const user = ref({});
user.value = userStore.userInfo;
// 获取管理员用户角色
const isAdmin = computed(() => user.value.role === '1');

// 组件的逻辑部分
const name = ref('');
const ip = ref('');
const level = ref('');
const priority = ref('');
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const createdAt = ref('');
const updatedAt = ref('');
const status = ref('');
const newStatus = ref('');
const timeRange =ref([]);
const isViewMode= ref();
const drawerVisible = ref(false);
const vulDialogVisible = ref(false);
const statusDialogVisible = ref(false);
const upDialogVisible = ref(false);
const form = reactive({
  id: '',
  name: '',
  detail: '',
  level: '',
  ip: '',
  systemName:'',
  location: '',
  solution: '',
  priority: '',
  status: '',
  cve: '',
});
const selectedIds = ref([]);
const selectedLevel = [
  {
    value: 'critical',
    label: '严重',
  },
  {
    value: 'high',
    label: '高危',
  },
  {
    value: 'medium',
    label: '中危',
  },
  {
    value: 'low',
    label: '低危',
  },
]
const selectedPriority= [
  {
    value: '3',
    label: '非常紧急',
  },
  {
    value: '2',
    label: '紧急',
  },
  {
    value: '1',
    label: '一般',
  },
]
const selectedStatus = [
  {
    value: 'fix',
    label: '已修复',
  },
  {
    value: 'unfix',
    label: '未修复',
  },
  {
    value: 'accept',
    label: '接受',
  },
  {
    value: 'mis',
    label: '误报',
  },
]
const getLevelText = (level) =>{
  if (level === 'critical') {
    return '严重';
  } else if (level === 'high') {
    return '高危';
  } else if (level === 'medium') {
    return '中危';
  }else if (level === 'low') {
    return '低危';
  }
};
const getPriorityText = (priority) =>{
  if (priority === '3') {
    return '非常紧急';
  } else if (priority === '2') {
    return '紧急';
  } else if (level === '1') {
    return '一般';
  }
};
const getStatusText = (status) =>{
  if (status === 'fix') {
    return '已修复';
  } else if (status === 'unfix') {
    return '未修复';
  } else if (status === 'medium') {
    return '中危';
  }else if (status === 'accept') {
    return '接受';
  }else if (status === 'mis') {
    return '误报';
  }
};
// 加载数据
const load = async () => {
  // 漏洞查询
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    name: name.value,
    ip: ip.value,
    level: level.value,
    priority: priority.value,
    status: status.value,
    startTime: timeRange.value ? timeRange.value[0] : null,
    endTime: timeRange.value ? timeRange.value[1] : null,
  };
  const res = await getVulsAPI(params);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

// 清空搜索条件
const clear = () => {
  name.value = '';
  ip.value = '';
  level.value = '';
  priority.value = '';
  status.value = '';
  timeRange.value=[];
  load();
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

// 删除选中的漏洞
const handleDelete = async (id) => {
  const res = await deleteVulAPI(id);
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

// 批量删除漏洞
const batchDelete = async () => {
  // 处理批量删除逻辑
  if (!selectedIds.value.length) {
    ElMessage.warning('请选择数据！');
    return;
  }
  try {
    const response = await batchDeleteVulsAPI(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success('删除成功');
      await load();
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('删除失败');
  }
};
// 批量处置漏洞

const showStatusDialog = () => {
  if (!selectedIds.value.length) {
    ElMessage.warning('请选择数据！');
  }else {
    statusDialogVisible.value=true;
    newStatus.value='';
  }
}

const batchEditStatus = async () => {
  if (!newStatus.value.length) {
    ElMessage.warning('请选择处置结果！');
    console.log(newStatus.value);
    return;
  }
  try {
    const response = await batchEditStatusAPI(selectedIds.value, newStatus.value);
    if (response.data.code === 200) {
      ElMessage.success('处置成功');
      await load();
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('处置失败');
  }
  statusDialogVisible.value=false;
};
// 新增漏洞
const add = () => {
  isViewMode.value = false;
  vulDialogVisible.value = true;
  Object.keys(form).forEach(key => {
    form[key] = '';
  });
};

// 提交保存的数据
const save = async () => {
  if (form.id) {
    try {
      const res = await updateVulAPI(form);
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
      const res = await addVulAPI(form);
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
    vulDialogVisible.value = false;
  }
};
let drawerTitle;
// 漏洞详情
const handleDetail = (row) => {
  drawerTitle= '详情';
  drawerVisible.value = true;
  // 设置表单数据
  form.id = row.id;
  form.name = row.name;
  form.detail = row.detail;
  form.ip = row.ip;
  form.systemName = row.systemName;
  form.location = row.location;
  form.solution = row.solution;
  form.level = row.level;
  form.priority = row.priority;
  form.status = row.status;
  form.cve = row.cve;
  isViewMode.value = true;
};
// 漏洞编辑
const handleEdit = (row) => {
  drawerTitle= '编辑';
  drawerVisible.value = true;
  // 设置表单数据
  form.id = row.id;
  form.name = row.name;
  form.detail = row.detail;
  form.ip = row.ip;
  form.location = row.location;
  form.solution = row.solution;
  form.level = row.level;
  form.priority = row.priority;
  form.status = row.status;
  form.cve = row.cve;
  isViewMode.value = false;
};

const uploadFile = async (file) => {
  try {
    const res = await importFileAPI(file.file);
    if (res.data.code === 200) {
      ElMessage.success('导入成功');
      upDialogVisible.value=false;
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
  a.href = '../../../public/static/vul_template.xlsx'
  a.download = 'assets_template.xlsx'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const coutPriority = async() => {
  try {
    const res = await coutPriorityAPI();
    if (res.data.code === 200) {
      ElMessage.success('计算成功，共计算'+res.data.data+"条数据");
      await load();
    } else {
      ElMessage.error(res.data.message);
    }
  }catch (error) {
    ElMessage.error(error.response.data.message);
  }
};
onMounted(() => {
  load(); // 初始化加载数据
  useTableHeightStore().setTableHeight()
});

onActivated(() => {
  useTableHeightStore().setTableHeight()
})

</script>
<style scoped>
.search-bar .el-form-item {
  margin-right: 10px;
}
.form-input {
  width: 80%;
}

.dialog-footer {
  text-align: right;
}
</style>
