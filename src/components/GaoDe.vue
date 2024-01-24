<template>
    <div id="container"></div>
</template>
<script lang="ts" setup name="GaoDe">
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import emitter from '@/utils/emitter';
import axios from "axios";
import Gaode from '@/components/static/config';
let map: any;
map = null;
// 挂载地图
onMounted(() => {
    AMapLoader.load({
        key: Gaode.GaodeKey, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
        .then((AMap) => {
            map = new AMap.Map("container", {
                // 设置地图容器id
                viewMode: "3D", // 是否为3D地图模式
                zoom: 12, // 初始化地图级别
                center: [125.325365, 43.897367], // 初始化地图中心点位置
            });
            // 提供展示道路事件并绑定emitter
            emitter.on("showRoad", async function () {
                let roadData = await axios.get("/api/getRoad/");
                // console.log(roadData.data);
                let pathSet: any[] = [];
                // 把道路渲染到地图上
                for (let item of roadData.data) {
                    // console.log(item);
                    // let unit = AMap.LngLat(+item.road_unit_head.split(",")[0], +item.road_unit_head.split(",")[1])
                    let head = item.road_unit_head.split(",");
                    let tail = item.road_unit_tail.split(",");
                    let path_head = new AMap.LngLat(Number(head[0]), Number(head[1]));
                    let path_tail = new AMap.LngLat(Number(tail[0]), Number(tail[1]));
                    let path = [path_head, path_tail];
                    pathSet.push(path);

                };
                // console.log(pathSet);
                let polyline = new AMap.Polyline({
                    path: pathSet,
                    borderWeight: 2,
                    strokeColor: "red",
                    lineJoin: 'round'
                });
                map.add(polyline);
            }); //展示路线事件结束
            let tOR = function (ev: any) {
                emitter.emit('touchToGetOR', ev);
            };
            let tDE = function (ev: any) {
                emitter.emit('touchToGetDE', ev);
            };
            emitter.on("touchGetOCoord", function () {
                map.on('click', tOR);
            });//绑定起点选择事件
            emitter.on("touchGetOCoordCancel", function () {
                map.off('click', tOR);
            });//解绑起点选择事件
            emitter.on("touchGetDCoord", function () {
                map.on('click', tDE);
            });//绑定终点选择事件
            emitter.on("touchGetDCoordCancel", function () {
                map.off('click', tDE);
            });//解绑终点选择事件
        })
        .catch((e) => {
            console.log(e);
        });
});








// 卸载时销毁
onUnmounted(() => {
    map?.destroy();
});
</script>

<style scoped>
#container {
    position: absolute;
    left: 400px;
    padding: 0px;
    margin: 0px;
    min-width: calc(100% - 400px);
    height: 100%;
}
</style>