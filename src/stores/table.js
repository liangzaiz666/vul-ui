import {defineStore} from "pinia";

const useTableHeightStore = defineStore(
    'table-height',
    {
        state: () => ({
            height: 500,//默认高度
        }),
        getters:{},
        actions:{
            setHeight(height) {
                this.height=height//高度赋值
            },
            setTableHeight() {
                //计算高度：窗口高度-表格距离顶部距离-固定高度（底部页码高度）
                this.height= window.innerHeight -document.getElementById("elTableId").getBoundingClientRect().top - 52;
                //问题：在浏览器窗口缩放90%时，table表的滚动条会消失（max-height丢失），解决：操作dom添加
                document.querySelector('#elTableId .el-scrollbar__wrap').style.maxHeight = this.height - 40 + "px"
                window.onresize = () => {
                    debounce(tableHeightFun, 200); //防抖
                };
                let that=this
                function tableHeightFun() {
                    //页面没有table的id时，不执行
                    if(document.getElementById('elTableId')==null)return
                    //问题：在路由切换后，窗口高度变高，table表的max-height不能变大。解决：先赋值变小，再变大。
                    that.height = window.innerHeight - document.getElementById('elTableId').getBoundingClientRect().top - 52 - 1;
                    document.querySelector('#elTableId .el-scrollbar__wrap').style.maxHeight = (that.height - 40 - 1) + "px"
                    setTimeout(() => {
                        that.height=  window.innerHeight -document.getElementById("elTableId").getBoundingClientRect().top -52;
                        document.querySelector('#elTableId .el-scrollbar__wrap').style.maxHeight = (that.height - 40) + "px"
                    }, 200);
                }
                var timeout = null; //定义一个定时器
                function debounce(fn, wait) {
                    if (timeout !== null) clearTimeout(timeout); //清除这个定时器
                    timeout = setTimeout(fn, wait);
                }
            }
        }
    })
export default useTableHeightStore