<template>
  <div class="index-box">
    <div class="token-box">
      <a-input placeholder="请输入token" allow-clear v-model="token" />
      <a-button @click="getLocalToken">确认</a-button>
    </div>
    <div class="button-box">
      <a-space>
        <a-button>获取</a-button>
        <a-button>重置</a-button>
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
import { ref, onMounted } from "vue";
const { ipcRenderer } = require('electron');

let total = ref(0);
let count = ref(0);
let token = ref("");
let starsList = ref([0, 0, 0, 0, 0, 0]);

const getLocalToken = () => {
  ipcRenderer.send('getLocalToken');
}

const getLoaclData = () => {
  ipcRenderer.send('getLoaclData');
}

ipcRenderer.on('sendLocalToken', (event, value) => {
  token.value = value;
})

onMounted(() => {
  getLocalToken();
})

</script>

<style lang="less" scoped>
.index-box {
  padding: 8px;
}

.token-box {
  display: flex;

  .arco-btn {
    margin: 0 0 0 8px;
  }
}

.button-box {
  margin: 8px 0 0 0;
}

.data-box,
.stars-list {
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
