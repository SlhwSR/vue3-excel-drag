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
    <Button type="primary" @click="logElement" style="float: right"
      >打印</Button
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
};
const logElement = () => {
  let uid = uuid();
  // 截图区域是testCanvas
  //planA
  // console.log(document.getElementById("luckysheetTableContent"));
  // document.getElementById("luckysheetTableContent").style.height = "1800px";
  // html2canvas(document.getElementById("luckysheetTableContent"), {
  //   background: "#ffffff",
  //   useCORS: true,
  // }).then(function (canvas) {
  //   console.log("----------------------------------------------------------");
  //   console.log(canvas);
  //   let contentWidth = canvas.width;
  //   let contentHeight = canvas.height;
  //   let imgWidth = 595.28;
  //   let imgHeight = (592.28 / contentWidth) * contentHeight;
  //   let pageData = canvas.toDataURL("image/jpeg", 3.0);
  //   let pdf = new jsPDF("", "pt", "a4");
  //   pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
  //   pdf.save(uid + "**************.pdf");
  // });
  //planB
  // document.getElementById("luckysheet-left-top").click();
  let src = window.luckysheet.getScreenshot();
  let $img = `<img src=${src} style="max-width: 90%;" />`;
  let pdf = new jsPDF("", "pt", "a4");
  // let imgWidth = 595.28;
  // let contentWidth = 500;
  // let contentHeight = 500;
  // let imgHeight = (592.28 / contentWidth) * contentHeight;
  // pdf.addImage(src, "JPEG", 0, 0, imgWidth, imgHeight);
  // pdf.save(uid + "**************.pdf");
  console.log($img);
  // var canvas = document.getElementById("luckysheetTableContent");
  // canvas.toBlob(function (blob) {
  //   saveAs(blob, "测试.xlsx");
  // });
};
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
  exportExcel(luckysheet.getAllSheets(), "下载").then((res) => {
    console.log(">>>>>>");
    console.log(res);
  });
};
// const logElement = () => {
//   const table = document.querySelector(".luckysheet-grid-window-2");
//   const canvas = document.querySelector(".luckysheetTableContent");
//   console.log(canvas);
//   console.log(table);
// };
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
      onTogglePager: (pageConfig) => {
        console.log(pageConfig);
      },
    },
    showtoolbarConfig: {
      screenshot: true,
    },
    // pager: {
    //   pageIndex: 1, //当前的页码
    //   pageSize: 10, //每页显示多少行数据
    //   total: 50, //数据总行数
    //   selectOption: [10, 20], //允许设置每页行数的选项
    // },
    // data: [
    //   {
    //     column: 23,
    //     row: 10,
    //     lang: "zh",
    //   },
    // ],
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
