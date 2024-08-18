<template>
    <el-container class="el-container">
<!--      侧边栏-->
      <el-aside :width="asideWitch" style="min-height: 100vh; background-color:#001529 ">
        <Aside />
      </el-aside>
      <el-container class="el-container">
<!--        头部-->
        <el-header>
         <Header/>
        </el-header>
<!--        主体-->
        <el-main>
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Aside from '@/components/Aside.vue'

const asideWitch = ref('200px')
</script>


