<template>
  <div style="height: 50px; display: flex; align-items: center; justify-content: center" >
    <img src="../assets/Aside_logo.png" style="height: 50px;margin-top: 8px">
  </div>
  <el-menu
      :default-active="path"
      router background-color="#001529" text-color="rgba(255, 255, 255, 0.65)" active-text-color="#fff" style="border: 0">
    <el-menu-item index="/dashboard">
      <el-icon><svg t="1723275772288" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29933" width="200" height="200"><path d="M800 896c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H224c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h576z m64-832c53.02 0 96 42.98 96 96v576c0 53.02-42.98 96-96 96H160c-53.02 0-96-42.98-96-96V160c0-53.02 42.98-96 96-96h704z m0.53 64H160c-17.496 0-31.713 14.042-32 31.47V736c0 17.496 14.042 31.713 31.47 32H864c17.496 0 31.713-14.042 32-31.47V160c0-17.496-14.042-31.713-31.47-32z m-54.965 252.753l0.315 0.426c10.29 14.15 7.296 33.906-6.633 44.386l-0.426 0.315L644.158 541.27c-20.98 15.258-49.093 16.343-71.185 2.748l-161.395-99.32a16 16 0 0 0-18.209 0.997L275.646 537.26c-13.81 10.742-33.654 8.386-44.577-5.198l-0.328-0.415c-10.742-13.81-8.386-33.654 5.198-44.577l0.415-0.328 126.483-98.376c21.07-16.388 50.1-17.978 72.834-3.988l161.716 99.517a16 16 0 0 0 17.796-0.687L765.18 374.12c14.15-10.29 33.906-7.296 44.386 6.633z" p-id="29934"></path></svg></el-icon>
      <template #title>漏洞态势</template>
    </el-menu-item>
    <el-menu-item index="/vul">
      <el-icon><svg t="1723275522299" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15981" width="200" height="200"><path d="M731.418 321.434H287.36a38.374 38.374 0 0 1-32.077-59.52c58.368-88.679 153.344-141.62 254.106-141.62 100.736 0 195.737 52.941 254.131 141.62a38.4 38.4 0 0 1-32.102 59.52z m-357.274-76.8h270.464c-39.168-30.49-86.4-47.54-135.22-47.54-48.844 0-96.076 17.05-135.244 47.54z m135.22 699.187c-190.746 0-345.908-161.075-345.908-359.04 0-84.378 28.826-166.4 81.152-230.963a38.4 38.4 0 0 1 29.85-14.234H744.32c11.571 0 22.554 5.222 29.824 14.234 52.326 64.563 81.152 146.61 81.152 230.963-0.026 197.965-155.187 359.04-345.933 359.04zM293.477 416.384a291.584 291.584 0 0 0-53.222 168.397c0 155.622 120.73 282.24 269.107 282.24S778.47 740.403 778.47 584.78c0-60.775-18.79-119.885-53.222-168.397h-431.77z" p-id="15982"></path><path d="M265.984 422.502a38.11 38.11 0 0 1-16.538-3.763L113.51 353.664a38.4 38.4 0 1 1 33.127-69.274l135.936 65.076a38.4 38.4 0 0 1-16.589 73.036z m-142.618 462.72a38.4 38.4 0 0 1-16.588-73.062l135.936-65.05a38.426 38.426 0 0 1 33.126 69.3l-135.936 65.05a38.03 38.03 0 0 1-16.538 3.762z m78.49-283.904H44.826a38.4 38.4 0 1 1 0-76.8h157.03a38.4 38.4 0 1 1 0 76.8z m556.16-178.816a38.374 38.374 0 0 1-16.614-73.036l135.936-65.076a38.323 38.323 0 0 1 51.2 18.074 38.374 38.374 0 0 1-18.048 51.2l-135.936 65.075a38.11 38.11 0 0 1-16.538 3.763z m142.618 462.72a38.446 38.446 0 0 1-16.538-3.737l-135.936-65.05a38.451 38.451 0 0 1 33.152-69.299l135.936 65.05a38.451 38.451 0 0 1 18.074 51.225 38.477 38.477 0 0 1-34.688 21.811z m78.515-283.904h-157.03a38.4 38.4 0 0 1 0-76.8h157.03a38.4 38.4 0 0 1 0 76.8zM509.363 807.373a25.6 25.6 0 0 1-25.6-25.6V496.486a25.6 25.6 0 0 1 51.2 0v285.287a25.6 25.6 0 0 1-25.6 25.6z" p-id="15983"></path></svg></el-icon>
      <template #title>漏洞管理</template>
    </el-menu-item>
    <el-menu-item index="/assets">
      <el-icon><svg t="1723275607789" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26994" width="200" height="200"><path d="M481.1 535.9L116.8 357.8c-15-10.5-16.4-56.1 0-62.8l364.3-178.1c20.6-10.2 39.9-12.5 62.8 0L906.4 295c14.9 12 19.9 47.7 0 62.8L543.9 535.9c-20.6 8.6-44.9 9.8-62.8 0z" p-id="26995"></path><path d="M912.4 489.9c-12.7-26.2-44.2-37.1-70.4-24.4L511.4 626.2 180.7 465.5c-26.2-12.7-57.7-1.8-70.4 24.4-12.7 26.2-1.8 57.7 24.4 70.4l349.2 169.6c8.9 4.3 18.4 5.9 27.6 5.1 9.2 0.8 18.7-0.8 27.6-5.1l349.2-169.6c25.9-12.7 36.9-44.3 24.1-70.4z" p-id="26996"></path><path d="M912.4 670.9c-12.7-26.2-44.2-37.1-70.4-24.4L511.4 807.2 180.7 646.5c-26.2-12.7-57.7-1.8-70.4 24.4-12.7 26.2-1.8 57.7 24.4 70.4l349.2 169.6c8.9 4.3 18.4 5.9 27.6 5.1 9.2 0.8 18.7-0.8 27.6-5.1l349.2-169.6c25.9-12.7 36.9-44.3 24.1-70.4z" p-id="26997"></path></svg></el-icon>
      <template #title>资产管理</template>
    </el-menu-item>
    <el-sub-menu index="1" popper-class="">
      <template #title>
        <el-icon><svg t="1723275883438" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37965" width="200" height="200"><path d="M546.53 951.177c-21.448 11.764-47.612 11.764-69.06 0L131.113 760.728C109.407 748.809 96 726.621 96 702.448V321.552c0-24.172 13.407-46.361 35.113-58.28L477.47 72.823c21.448-11.764 47.612-11.764 69.06 0l346.357 190.448C914.593 275.191 928 297.379 928 321.552v380.897c0 24.172-13.407 46.361-35.113 58.28L546.53 951.177zM166 317c-6 3-6 10-6 10v370c0 7 6 10 6 10l340 187s3 2 6 2 6-2 6-2 334.316-183.895 338-186c7-4 8-12 8-12V331c0-11-6-14-6-14L516 129s-2-1-4-1-4 1-4 1-338.775 186.388-342 188z" p-id="37966"></path><path d="M512 416c52.935 0 96 43.065 96 96s-43.065 96-96 96-96-43.065-96-96 43.065-96 96-96m0-64c-88.366 0-160 71.634-160 160s71.634 160 160 160 160-71.634 160-160-71.634-160-160-160z" p-id="37967"></path></svg></el-icon>
        <span>系统管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/system/user">
          <el-icon><svg t="1723275935761" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="38959" width="200" height="200"><path d="M427.4 526.6c-3.8 0-7.4-0.8-11-2.2-86.2-36.4-141.8-120.4-141.8-213.8 0-128 104.2-232 232-232s232 104.2 232 232c0 90.6-53.2 173.4-135.6 211.2-14.4 6.6-31.2 0.2-37.8-14-6.6-14.4-0.2-31.2 14.2-37.8 62.2-28.4 102.4-91 102.4-159.4 0-96.6-78.6-175-175-175s-175 78.6-175 175c0 70.6 42 133.8 107 161.2 14.4 6.2 21.2 22.8 15.2 37.4C449 520.2 438.4 526.6 427.4 526.6M657.8 938.6 657.8 938.6l-492.6-0.4c-31 0-59.2-15.4-75.6-41.2-15.8-24.8-17.6-55.4-5.2-82 43.2-92.2 156.4-247.6 429.2-251.8C794 558.2 896 724.6 932 823.6c9.4 26 5.6 54-10.4 77-16.6 23.8-44.2 38-73.8 38l-71.2 0c-15.8 0-28.6-12.8-28.6-28.6s12.8-28.6 28.6-28.6l71.2 0c11 0 21-5.2 27-13.6 3-4.4 7.6-13.4 3.6-25-37.4-103.6-132-226.6-363.8-222.8C284.8 623.8 182 741.4 136 839.2c-4.2 9-3.6 19 1.8 27.2 5.8 9.2 16.2 14.6 27.6 14.6l492.4 0.4c15.8 0 28.4 12.8 28.4 28.6C686.4 926 673.6 938.6 657.8 938.6" p-id="38960"></path></svg></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
<!--        <el-menu-item index="">...</el-menu-item>-->
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';

const user = ref({});
const route = useRoute();
const path = ref(route.path);
const userStore = useUserStore();
user.value = userStore.userInfo;
</script>

<style>
.el-menu-inline .el-menu-item{
  background-color: #000c17 !important;
}
.el-menu-item:hover{
  color: #fff !important;
}
.el-sub-menu__title:hover{
  color: #fff !important;
}
.el-menu-item.is-active{
  background-color: #40a9ff !important;
  border-radius: 5px;
  margin: 3px;
}
.el-menu-item{
  height: 50px !important;
  margin: 3px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-header{
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  display: flex;
  align-items: center;
}
svg:hover {
  color: #067acc !important;
}
</style>