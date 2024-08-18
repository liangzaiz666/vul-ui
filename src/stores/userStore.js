import {userInfoAPI} from "@/api/user.js";
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user',()=>{
    const userInfo = ref({});

    const getUserInfo = async ()=>{
        const token = localStorage.getItem("token");
        const res = await userInfoAPI(token);
        userInfo.value = res.data.data;

    };

    const  clearUserInfo = () => {
        localStorage.removeItem('token');
        userInfo.value = {};
    };

    return{
        userInfo, getUserInfo, clearUserInfo,
    };
},{
    persist: true,
})