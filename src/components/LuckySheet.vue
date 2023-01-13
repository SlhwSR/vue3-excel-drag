<template>
  <div style="position: absolute; top: 0">
    <input id="uploadBtn" type="file" @change="loadExcel" />

    <span>Or Load remote xlsx file:</span>

    <select v-model="selected" @change="selectExcel">
      <option disabled value="">Choose</option>
      <option
        v-for="option in options"
        :key="option.text"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
    <a href="javascript:void(0)" @click="downloadExcel"
      >Download source xlsx file</a
    >
    <Button type="primary" @click="handleSave" style="float: right"
      >暂存</Button
    >
  </div>
  <div id="luckysheet"></div>
  <div v-show="isMaskShow" id="tip">Downloading</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, onUpdated } from "vue";
import { exportExcel } from "./export";
import LuckyExcel from "luckyexcel";
import logo from "@/assets/logo.png";
import { Space, Button } from "ant-design-vue";
import { addLongtabListener } from "@/utils/longpress";
const isMaskShow = ref(false);
const selected = ref("");
const jsonData = ref({});
const props = defineProps(["isdrag", "count"]);
const options = ref([
  {
    text: "Money Manager.xlsx",
    value: "https://minio.cnbabylon.com/public/luckysheet/money-manager-2.xlsx",
  },
  {
    text: "Activity costs tracker.xlsx",
    value:
      "https://minio.cnbabylon.com/public/luckysheet/Activity%20costs%20tracker.xlsx",
  },
  {
    text: "House cleaning checklist.xlsx",
    value:
      "https://minio.cnbabylon.com/public/luckysheet/House%20cleaning%20checklist.xlsx",
  },
  {
    text: "Student assignment planner.xlsx",
    value:
      "https://minio.cnbabylon.com/public/luckysheet/Student%20assignment%20planner.xlsx",
  },
  {
    text: "Credit card tracker.xlsx",
    value:
      "https://minio.cnbabylon.com/public/luckysheet/Credit%20card%20tracker.xlsx",
  },
  {
    text: "Blue timesheet.xlsx",
    value:
      "https://minio.cnbabylon.com/public/luckysheet/Blue%20timesheet.xlsx",
  },
  {
    text: "Student calendar (Mon).xlsx",
    value:
      "https://minio.cnbabylon.com/public/luckysheet/Student%20calendar%20%28Mon%29.xlsx",
  },
  {
    text: "Blue mileage and expense report.xlsx",
    value:
      "https://minio.cnbabylon.com/public/luckysheet/Blue%20mileage%20and%20expense%20report.xlsx",
  },
]);
const onStart = (e) => {
  console.log(e);
};
const onEnd = (e) => {
  console.log(e);
};
onUpdated(() => {
  console.log(props);
});
const x = ref(0);
const y = ref(0);
const myArray = ref([
  { people: "cn", id: 1, name: "www.itxst.com" },
  { people: "cn", id: 2, name: "www.baidu.com" },
  { people: "cn", id: 3, name: "www.taobao.com" },
  { people: "us", id: 4, name: "www.google.com" },
]);
const loadExcel = (evt) => {
  const files = evt.target.files;
  if (files == null || files.length == 0) {
    alert("No files wait for import");
    return;
  }

  let name = files[0].name;
  let suffixArr = name.split("."),
    suffix = suffixArr[suffixArr.length - 1];
  if (suffix != "xlsx") {
    alert("文件类型错误!");
    return;
  }
  LuckyExcel.transformExcelToLucky(
    files[0],
    function (exportJson, luckysheetfile) {
      if (exportJson.sheets == null || exportJson.sheets.length == 0) {
        alert(
          "Failed to read the content of the excel file, currently does not support xls files!"
        );
        return;
      }
      console.log("exportJson", exportJson);
      jsonData.value = exportJson;

      window.luckysheet.destroy();
      window.luckysheet.create({
        container: "luckysheet", //luckysheet is the container id
        showinfobar: false,
        data: exportJson.sheets,
        title: exportJson.info.name,
        userInfo: exportJson.info.name.creator,
      });
    }
  );
};
const selectExcel = (evt) => {
  const value = selected.value;
  const name = evt.target.options[evt.target.selectedIndex].innerText;

  if (value == "") {
    return;
  }
  isMaskShow.value = true;

  LuckyExcel.transformExcelToLuckyByUrl(
    value,
    name,
    (exportJson, luckysheetfile) => {
      if (exportJson.sheets == null || exportJson.sheets.length == 0) {
        alert(
          "Failed to read the content of the excel file, currently does not support xls files!"
        );
        return;
      }
      console.log("exportJson", exportJson);
      jsonData.value = exportJson;

      isMaskShow.value = false;
      window.luckysheet.destroy();

      window.luckysheet.create({
        container: "luckysheet", //luckysheet is the container id
        showinfobar: true,
        data: exportJson.sheets,
        title: exportJson.info.name,
        userInfo: exportJson.info.name.creator,
      });
    }
  );
};
const downloadExcel = () => {
  // const value = selected.value;;
  //
  // if(value.length==0){
  //     alert("Please select a demo file");
  //     return;
  // }
  //
  // var elemIF = document.getElementById("Lucky-download-frame");
  // if(elemIF==null){
  //     elemIF = document.createElement("iframe");
  //     elemIF.style.display = "none";
  //     elemIF.id = "Lucky-download-frame";
  //     document.body.appendChild(elemIF);
  // }
  // elemIF.src = value;
  exportExcel(luckysheet.getAllSheets(), "下载");
};
const handleSave = () => {
  console.log(luckysheet.getAllSheets()[0]);
};
const emitS = defineEmits(["cancelDrag"]);
// !!! create luckysheet after mounted
onMounted(() => {
  luckysheet.create({
    container: "luckysheet",
    lang: "zh",
    title: "Bmos-excel",
    userName: "Bmos-excel",
    userImage: logo,
    hook: {
      cellMousedown: (a, b, c, ctx) => {
        // console.log(a);
        // console.log(b);
        // console.log(c);
      },
      sheetMousemove: (a, b, c, d) => {
        // console.log(b);
      },
      sheetMouseup: (a, { r, c }, d) => {
        // console.log(b);
        // addLongtabListener(document.querySelector(".count"), () => {
        //   console.log(111);
        // });
        // console.log(props);
        if (props.isdrag === true) {
          luckysheet.setCellValue(r, c, props.count);
          console.log("-*----------变化");
          emitS("cancelDrag", () => {
            console.log("我尽力了");
          });
          // window.removeEventListener("mousemove")
          // props.isdrag = false;
          return;
          // console.log(props.isdrag);
        }
        // props.isdrag = false;
      },
    },
  });
  window.addEventListener("mousemove", ({ pageX, pageY }) => {
    x.value = pageX;
    y.value = pageY;
    const follow = document.querySelector(".follow");
    if (props.isdrag === true) {
      console.log("//////////////////");
      // follow.clientLeft = pageX;
      follow.setAttribute(
        "style",
        `left:${pageX}px;top:${pageY}px;position:absolute;z-index:9999`
      );
      // follow.clientTop = pageY;
      console.log(follow);
    } else {
      document.body.removeChild(follow);
    }
  });
  // const text = document.querySelector(".follow");
  // text.style.left = x.value;
  // text.style.top = y.value;
  // console.log("ffffffffffffffffffffffffffff");
  // console.log(text);
  document.querySelector(".luckysheet-share-logo").remove();
  // document.addEventListener("mousemove",(e)=>{
  //   var listItem=document.querySelector(".ant-list-item div")
  //   listItem[1]?.style.left=e.clientX+8+'px'
  //   listItem[1]?.style.top=e.clientY+2+'px'
  //   console.log(listItem[1]?.innerHTML);
  // })
  document.onselectstart = new Function("event.returnValue=false");
  console.log("---------Props");

  console.log(props);
});
onBeforeUnmount(() => {
  window.removeEventListener("mousemove");
});
</script>

<style scoped>
#luckysheet {
  /* margin-top: 1000px; */
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 30px;
  bottom: 0px;
}

#uploadBtn {
  font-size: 16px;
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}

.list {
  /* background-color: red !important; */
  z-index: 9999;
}

.item {
  padding: 6px;
  background-color: #fdfdfd;
  border: solid 1px #eee;
  margin-bottom: 10px;
  cursor: move;
}

/*选中样式*/
.chosen {
  border: solid 2px #3089dc !important;
}
</style>
