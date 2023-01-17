<script setup lang="jsx">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import LuckySheet from "./components/LuckySheet.vue";
import { Col, List, Row, Tree } from "ant-design-vue";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
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
  const text = document.createElement("span");
  text.className = "follow";
  text.style.display = "inline-block";
  text.style.width = "22px";
  text.style.height = "22px";
  text.style.backgroundColor = "red";
  text.style.left = x.value;
  text.style.top = y.value;
  text.innerHTML = count;
  currentCount.value = count;
  document.body.appendChild(text);
};
const treeData = [
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
            title: "leaf",
            key: "0-0-0-1",
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            key: "0-0-1-0",
            title: "sss",
          },
        ],
      },
    ],
  },
  {
    title: "parent 2",
    key: "1-0",
    children: [
      {
        title: "parent 2-0",
        key: "1-0-0",
      },
      {
        title: "parent 2-1",
        key: "2-0-1",
      },
    ],
  },
];
const overDrag = () => {
  if (isdrag.value === true) {
    console.log("-拖拽中");
    const following = document.querySelector(".follow");
    console.log(following);
    following.style.left = x.value;
    following.style.top = y.value;
    document.body.appendChild(following);
  } else {
    return;
  }
};
const mouseUp = () => {
  // console.log("松开了");
  window.removeEventListener("mousemove");
  isdrag.value = false;
};
const x = ref(0);
const y = ref(0);
const selectedKeys = ref(["0-0-0", "0-0-1"]);
const checkedKeys = ref(["0-0-0", "0-0-1"]);
const expandedKeys = ref([]);
watch(expandedKeys, () => {
  console.log("expandedKeys", expandedKeys);
});
watch(selectedKeys, () => {
  console.log("selectedKeys", selectedKeys);
});
watch(checkedKeys, () => {
  console.log("checkedKeys", checkedKeys);
});
const mouseOver = () => {
  if (isdrag.value === true) {
    console.log("出来了哦");
  }
};
const cancelDrag = () => {
  isdrag.value = false;
  // const res= document.getElementsByTagName("span")
};
const handleExpand = (keys, { expanded, node }) => {
  // node.parent add from 3.0.0-alpha.10
  const tempKeys = ((node.parent ? node.parent.children : treeData) || []).map(
    ({ key }) => key
  );
  if (expanded) {
    expandedKeys.value = _.difference(keys, tempKeys).concat(node.key);
  } else {
    expandedKeys.value = keys;
  }
};
onMounted(() => {
  // if (isdrag.value === true) {
  window.addEventListener("mousemove", ({ pageX, pageY }) => {
    x.value = pageX;
    y.value = pageY;
  });
  // }
});
onBeforeUnmount(() => {
  window.removeEventListener("mousemove");
});
</script>
<template>
  <Row :gutter="24">
    <Col style="height: 900px; width: 150px">
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
      <Tree
        v-model:selectedKeys="selectedKeys"
        :expanded-keys="expandedKeys"
        :tree-data="treeData"
        @expand="handleExpand"
      >
        <template #title="{ title, key }">
          <!-- <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span> -->
          <List.Item
            v-if="key === '0-0-1-0'"
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
          <template v-else>{{ title }}</template>
        </template>
      </Tree>
    </Col>
    <Col style="width: 92%; height: 800px">
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
