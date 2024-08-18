<template>
  <el-row :gutter="24" style="margin-bottom: 8px">
    <el-col :span="6">
      <el-card style="background-color: #F22727">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="position: relative; width: 50px; height: 50px;">
              <img src="../assets/BugOutlined.svg" alt="Logo" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%;">
            </div>
            <div style="font-size: 20px;font-weight: bolder;color: white;margin-top: 2px">未修复</div>
          </div>
          <div style="font-size: 50px; text-align: center; color: white">
           {{unfix}}
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card style="background-color: #67C23A">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="position: relative; width: 50px; height: 50px;">
              <img src="../assets/SafetyCertificateOutlined.svg" alt="Logo" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%;">
            </div>
            <div style="font-size: 20px;font-weight: bolder;color: white;margin-top: 2px">已修复</div>
          </div>
          <div style="font-size: 50px; text-align: center; color: white">
            {{fix}}
          </div>
        </div>
      </el-card>    </el-col>
    <el-col :span="6">
      <el-card style="background-color: #909399">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="position: relative; width: 50px; height: 50px;">
              <img src="../assets/AlertOutlined.svg" alt="Logo" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%;">
            </div>
            <div style="font-size: 20px;font-weight: bolder;color: white;margin-top: 2px">误报</div>
          </div>
          <div style="font-size: 50px; text-align: center; color: white">
            {{mis}}
          </div>
        </div>
      </el-card>    </el-col>
    <el-col :span="6">
      <el-card style="background-color: #0091EA">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="position: relative; width: 50px; height: 50px;">
              <img src="../assets/RocketOutlined.svg" alt="Logo" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%;">
            </div>
            <div style="font-size: 20px;font-weight: bolder;color: white;margin-top: 2px">接受风险</div>
          </div>
          <div style="font-size: 50px; text-align: center; color: white">
            {{accept}}
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="24" style="margin-bottom: 8px">
    <el-col :span="8">
      <el-card>
        <v-chart class="chart" :option="vulOption" autoresize />
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card>
        <v-chart class="chart" :option="topOptions" autoresize />
    </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart,BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide } from 'vue';
import {getTopVulAPI, getVulDataAPI} from "@/api/dashboard.js";

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

const fix=ref('');
const unfix=ref('');
const mis=ref('');
const accept=ref('');

const crittcalCount=ref('');
const highCount=ref('');
const mediumCount=ref('');
const lowCount=ref('')

const vulNames=ref([]);
const vulCounts = ref([]);


const vulOption = ref({
  title: {
    text: '漏洞统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    bottom: '0',
    data: ['严重', '高危', '中危', '低危'],
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['50%', '45%'],
      data: [
        {name: '严重', value: crittcalCount},
        {name: '高危', value: highCount},
        {name: '中危', value: mediumCount},
        {name: '低危', value: lowCount},
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        show: true,
        formatter: '{b}: {c}',
      },
      itemStyle: {
        color: function(params) {
          // const colorList = ['#E65100', '#FF6F00', '#FFCA28', '#8BC34A'];
          const colorList = ['#AD1457', '#f02727', '#FFC107', '#66c03a'];
          return colorList[params.dataIndex];
        },
      },
    },
  ],
});

const topOptions =ref({
  title: {
    text: '漏洞Top10',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}',
  },
  grid: {
    left: '10%',
    right: '10%',
    top: '10%',
    bottom: '25%',
  },
  xAxis: {
    type: 'category',
    data: vulNames.value,
    axisLabel: {
      interval: 0,
      rotate: 20,
    },
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar',
      data: vulCounts.value,
      itemStyle: {
        color: '#0090e8',
      },
    },
  ],
});
const start = async () => {
  const vulRes = await getVulDataAPI();
  fix.value = vulRes.data.data.fix;
  unfix.value = vulRes.data.data.unfix;
  mis.value = vulRes.data.data.mis;
  accept.value = vulRes.data.data.accept;

  crittcalCount.value = vulRes.data.data.critical;
  highCount.value = vulRes.data.data.high;
  mediumCount.value = vulRes.data.data.medium;
  lowCount.value = vulRes.data.data.low;

  const topRes = await getTopVulAPI();
  topRes.data.data.forEach(item => {
    vulNames.value.push(item.name);
    vulCounts.value.push(item.count);
  });
  const sortedTop = vulCounts.value
      .map((count, index) => ({ count, vulNames: vulNames.value[index] }))
      .sort((a, b) => b.count - a.count);
  vulCounts.value = sortedTop.map(item => item.count);
  vulNames.value = sortedTop.map(item => item.vulNames);
};
start();
</script>

<style scoped>
.chart {
  height: 50vh;
}
</style>
