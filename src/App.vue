<template>
  <div class="index-box">
    <div class="token-box">
      <a-input placeholder="请输入token" allow-clear v-model="token" />
      <a-input placeholder="请输入name" allow-clear v-model="name" />
      <a-button @click="setLocalToken">确认</a-button>
    </div>
    <div class="button-box">
      <a-space>
        <a-button @click="getLocalData">获取</a-button>
        <a-button>重置</a-button>
        <a-button @click="getLocalToken">获取本地信息</a-button>
      </a-space>
    </div>
    <div class="data-box">
      <div class="content-box">
        <div class="title">总抽数</div>
        <div class="number">{{ total }}</div>
      </div>
      <div class="content-box">
        <div class="title">已垫</div>
        <div class="number">{{ count }}</div>
      </div>
      <div class="content-box"></div>
      <div class="content-box"></div>
      <div class="content-box"></div>
      <div class="content-box"></div>
    </div>
    <div class="stars-list">
      <div class="content-box" v-for="(item, index) in starsList" :key="index + 'stars-list'">
        <div class="title">{{ index + 1 }} 星</div>
        <div class="number">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
const { ipcRenderer } = require('electron');
import axios from "axios";

let total = ref(0);
let count = ref(0);
let token = ref("");
let name = ref("");
let starsList = ref([0, 0, 0, 0, 0, 0]);
let data: any[] = [];
let page = 1;
let pageSum = 1;

const getLocalToken = () => {
  ipcRenderer.send('getLocalToken');
}

const getLocalData = () => {
  ipcRenderer.send('getLocalData', name.value);
}

const setLocalToken = () => {
  ipcRenderer.send('setLocalToken', name.value, token.value);
}

ipcRenderer.on('sendLocalToken', (event, value) => {
  let data = JSON.parse(value);
  token.value = data.token;
  name.value = data.name;
})

ipcRenderer.on('sendLocalData', async (event, localData) => {
  starsList.value = [0, 0, 0, 0, 0, 0];
  total.value = 0;
  localData = JSON.parse(localData);
  data = localData
  while (page <= pageSum) {
    let networkData = await getNetworkData();
    networkData.forEach((item: any) => {
      
      let i = 0;
      for (i = 0; i < data.length; ++i) {
        if (data[i].ts == item.ts) break;
      }
      console.log(i);
      if (i >= data.length) {
        console.log(item);
        data.push(item);
      }
    })
    page++;
  }
  data.forEach(item => {
    item.chars.forEach((item1: any) => {
      starsList.value[item1.rarity]++;
      total.value++;
    })
  })
  if (data.length > 0) {
    nextTick(() => {
      ipcRenderer.send('savaData', name.value, JSON.stringify(data));
    })
  }
})

const getNetworkData = async () => {
  let res = await axios({
    url: 'https://ak.hypergryph.com/user/api/inquiry/gacha',
    method: 'get',
    params: {
      token: token.value,
      channelId: 1,
      page: page
    }
  })
  let pagination = res.data.data.pagination;
  pageSum = Math.ceil(parseInt(pagination.total) / 10.0)
  return res.data.data.list;
}
</script>

<style lang="less" scoped>
.index-box {
  padding: 8px;
}

.token-box,
.name-box {
  display: flex;

  .arco-input-wrapper {
    margin: 0 8px 0 0;
  }
}

.button-box {
  margin: 8px 0 0 0;
}

.data-box,
.stars-list,
.name-box {
  display: flex;
  margin: 8px 0 0 0;

  .content-box {
    flex: 1;

    .title {
      font-size: 20px;
      padding: 4px;
    }

    .number {
      display: flex;
      padding: 4px;
      font-size: 18px;
    }
  }
}
</style>
