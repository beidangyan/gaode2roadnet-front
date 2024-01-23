<template>
    <div id="box">
        <div id="lngbox">
            <div class="coordunit">起始点经度：<br>
                <input type="text" :value="oLng">
            </div>
            <div class="coordunit">起始点纬度：<br>
                <input type="text" :value="oLat">
            </div>
            <div class="coordunit">终止点经度：<br>
                <input type="text" :value="dLng">
            </div>
            <div class="coordunit">终止点纬度：<br>
                <input type="text" :value="dLat">
            </div>
        </div>
        <div id="buttonbox">
            <button @click="getRoad">获取OD路径</button>
            <button @click="emitter.emit('showRoad')">展示数据库路径</button>
            <button @click="startButton" :class="{ active: startButtonState }">点击选择起点</button>
            <button @click="endButton" :class="{ active: endButtonState }">点击选择终点</button>
        </div>
        <!-- <button @click="">获取OD路径</button>
        <button @click="">展示数据库路径</button> -->
    </div>
</template>

<script lang="ts" setup name= "console">
import { ref } from "vue";
import emitter from "@/utils/emitter";
import axios from "axios";

let oLng = ref("125.325365");
let oLat = ref("43.897367");
let dLng = ref("125.324237");
let dLat = ref("43.951226");

let startButtonState = ref(false);
let endButtonState = ref(false);

// axios发送获取路径请求
async function getRoad() {
    let OR = oLng.value + ',' + oLat.value;
    let DE = dLng.value + ',' + dLat.value;
    let result = await axios({
        method: 'get',
        url: '/api/saveRoad/',
        params: {
            OR: OR,
            DE: DE
        }
    });
    emitter.emit("showRoad");
    if (endButtonState.value) {
        endButtonState.value = false;
    };
    if (startButtonState.value) {
        startButtonState.value = false;
    };
};
// 选择起点事件
function startButton() {
    if (startButtonState.value) {
        emitter.emit('touchGetOCoordCancel');
        startButtonState.value = false;
    } else {
        emitter.emit('touchGetOCoord');
        startButtonState.value = true;
        if (endButtonState.value) {
            endButtonState.value = false;
            emitter.emit('touchGetDCoordCancel')
        };
    }
}
// 选择终点事件
function endButton() {
    if (endButtonState.value) {
        emitter.emit('touchGetDCoordCancel');
        endButtonState.value = false;
    } else {
        emitter.emit('touchGetDCoord');
        endButtonState.value = true;
        if (startButtonState.value) {
            startButtonState.value = false;
            emitter.emit('touchGetOCoordCancel')
        };
    }
}

// 注册点击选择经纬度响应式事件--->
emitter.on('touchToGetOR', function (e: any) {
    oLng.value = e?.lnglat.getLng();
    oLat.value = e?.lnglat.getLat();
});
emitter.on('touchToGetDE', function (e: any) {
    dLng.value = e?.lnglat.getLng();
    dLat.value = e?.lnglat.getLat();
});
// <---经纬度响应式事件结束

</script>

<style scoped>
/* 经纬度box样式 */
#box {
    background-color: #F3F4F6;
    margin: 0;
    padding: 0;
    width: 395px;
    height: 100%;
    float: left;

}

#lngbox {
    background-color: #F3F3F5;
    border: 2px solid #ccc;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0px;
    box-shadow: 2px 2px 5px gray;
}

.coordunit {
    margin: 5px auto;
    font-size: 15pt;
}

.coordunit input {
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 25px;
}

/* 按钮box样式 */
#buttonbox {
    background-color: #F3F3F5;
    border: 2px solid #ccc;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0px;
    box-shadow: 2px 2px 5px gray;
}

#buttonbox button {
    margin: 10px auto;
    height: 36px;
    width: 150px;
    font-size: medium;
    background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    background-size: 400%;
    border: 2px solid #ccc;
    border-radius: 18px;
}

button.active {
    animation: animate 8s linear infinite;
}

@keyframes animate {
    0% {
        background-position: 0%;
    }

    100% {
        background-position: 400%;
    }
}

#buttonbox button:hover {
    box-shadow: 2px 2px 5px #B3CEFE;
}
</style>