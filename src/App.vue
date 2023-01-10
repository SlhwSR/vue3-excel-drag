<script setup lang="jsx">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import LuckySheet from "./components/LuckySheet.vue";
import { Col, List, Row, Tree } from "ant-design-vue";
import { ref } from "vue";
const currentCount = ref(0);
const list = ref([
  {
    id: 1,
    count: 232,
  },
  {
    id: 2,
    count: 111,
  },
  {
    id: 3,
    count: 2345,
  },
  {
    id: 4,
    count: 91,
  },
  {
    id: 5,
    count: 74,
  },
  {
    id: 6,
    count: 600,
  },
  {
    id: 7,
    count: 544,
  },
  {
    id: 8,
    count: 211,
  },
  {
    id: 4,
    count: 9114,
  },
]);
const isdrag = ref(false);
const hanleList = (count) => {
  console.log(count);
  isdrag.value = true;
  currentCount.value = count;
};
const treeData = ref([
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          {
            title: "leaf",
            key: "0-0-0-0",
          },
          {
            key: "0-0-0-1",
          },
          {
            title: "leaf",
            key: "0-0-0-2",
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: "leaf",
            key: "0-0-1-0",
          },
        ],
      },
      {
        title: "parent 1-2",
        key: "0-0-2",
        children: [
          {
            title: "leaf 1",
            key: "0-0-2-0",
          },
          {
            title: "leaf 2",
            key: "0-0-2-1",
          },
        ],
      },
    ],
  },
  {
    title: "parent 2",
    key: "0-1",
    children: [
      {
        title: "parent 2-0",
        key: "0-1-0",
        children: [
          {
            title: "leaf",
            key: "0-1-0-0",
          },
          {
            title: "leaf",
            key: "0-1-0-1",
          },
        ],
      },
    ],
  },
]);
const overDrag = () => {
  if (isdrag.value === true) {
    console.log("-拖拽中");
  } else {
    return;
  }
};
const mouseUp = () => {
  // console.log("松开了");
  isdrag.value = false;
};
const mouseOver = () => {
  if (isdrag.value === true) {
    console.log("出来了哦");
  }
};
const cancelDrag = () => {
  isdrag.value = false;
};
</script>
<template>
  <Row :gutter="24">
    <Col style="height: 900px">
      <!-- <List.Item
        @mouseover="mouseOver"
        @mouseleave="overDrag"
        v-for="(item, index) in list"
        :key="item.id"
        ><div
          style="cursor: pointer"
          @mousedown="hanleList(item.count)"
          @mouseup="mouseUp"
        >
          {{ item.count }}
        </div>
      </List.Item> -->
      <Tree>
        <List.Item
          @mouseover="mouseOver"
          @mouseleave="overDrag"
          v-for="(item, index) in list"
          :key="item.id"
          ><div
            style="cursor: pointer"
            @mousedown="hanleList(item.count)"
            @mouseup="mouseUp"
          >
            {{ item.count }}
          </div>
        </List.Item>
      </Tree>
    </Col>
    <Col style="width: 96%">
      <LuckySheet
        :isdrag="isdrag"
        :count="currentCount"
        @cancelDrag="cancelDrag"
      />
    </Col>
  </Row>
</template>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
