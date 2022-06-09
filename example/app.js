import Viewer from "./module/viewer.js";

const viewerWrap = document.querySelector(".viewer-wrap");
const list = document.querySelector(".list");

init();

function init() {
  const imgsUrl = [
    "/example/sample/temp1.jpg",
    "/example/sample/temp1.jpg",
    "/example/sample/temp1.jpg",
    "/example/sample/temp1.jpg",
  ];

  const pdfUrl = ["./sample/temp1.pdf"];

  const tiffUrl = ["./sample/temp1.tiff"];

  const viewer = new Viewer(imgsUrl, "images", {
    wrap: document.querySelector(".wrap"),
    fields: [getData(), getData(), getData(), getData()],
    scrollCallback: (fields) => {
      setFieldData(fields);
    },
  });
  setFieldData(getData());
}

// 필드 데이터 입력
function setFieldData(fields) {
  list.innerHTML = ``;

  fields.forEach((item, idx) => {
    const items = document.createElement("div");
    items.classList.add("items");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.text;
    label.innerText = idx + 1;

    items.appendChild(label);
    items.appendChild(input);
    list.appendChild(items);

    input.addEventListener("keyup", (event) => {
      const v = event.target.value;
      item.text = v;
      e.modifyField(item);
      e.draw();
    });
  });
}

function getData() {
  return [
    {
      id: "kv-000",
      text: "20191112",
      dx: 854.7839965820312,
      dy: 3151.008056640625,
      dWidth: 379.00799560546875,
      dHeight: 48.384033203125,
      type: "miss",
      lineWidth: 5,
    },
    {
      id: "kv-001",
      text: "박희붕외과의원",
      dx: 782.2080078125,
      dy: 3253.823974609375,
      dWidth: 306.4320068359375,
      dHeight: 48.384033203125,
      type: "error",
      lineWidth: 5,
    },
    {
      id: "kv-002",
      text: "경기 수원시 권선구 권선동 1013 지오베르크 203호",
      dx: 782.2080078125,
      dy: 3359.6640625,
      dWidth: 1052.35205078125,
      dHeight: 48.384033203125,
      type: "confirm",
      lineWidth: 5,
    },
    {
      id: "kv-003",
      text: "031-233-5571",
      dx: 778.176025390625,
      dy: 3462.47998046875,
      dWidth: 310.4639892578125,
      dHeight: 39.31201171875,
      type: "miss",
      lineWidth: 5,
    },
    {
      id: "kv-004",
      text: "유방의 진단영상검사상 이상소견 유방의 다발 양성 신생물/ 상세불명 쪽",
      dx: 693.5040283203125,
      dy: 967.6799926757812,
      dWidth: 725.760009765625,
      dHeight: 102.81597900390625,
      type: "confirm",
      lineWidth: 5,
    },
    {
      id: "kv-005",
      text: "R92 D2439",
      dx: 2342.592041015625,
      dy: 964.656005859375,
      dWidth: 129.02392578125,
      dHeight: 96.7679443359375,
      type: "error",
      lineWidth: 5,
    },
    {
      id: "kv-006",
      text: "20191112",
      dx: 806.4000244140625,
      dy: 1684.3680419921875,
      dWidth: 262.0799560546875,
      dHeight: 39.31201171875,
      type: "miss",
      lineWidth: 5,
    },
  ];
}
