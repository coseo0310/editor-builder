# API documentation

주의❗️) PDF 또는 TIFF 변환 시 원본 이미지 상태에 따라서 이미지가 깨지거나 변환이 되지 않을 수 있음

## 📙 인스턴스 생성 및 Canvas Element 반환

---

```html
\<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./module/style.css" />
    <title>Example</title>
  </head>
  <body>
    <div class="viewer-wrap">
      <div class="wrap"></div>
    </div>
    <script type="module" src="./app.js"></script>
  </body>
</html>
```

```ts
import Viewer from "./module/viewer.js";

interface Field {
  id: string;
  text: string;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  type: "confirm" | "miss" | "error" | "new";
}

interface Options {
  wrap: HTMLElement;
  fields: Field[][];
  scrollCallback: (fields: Field) => void;
}

type ImageType = "images" | "pdf" | "tiff";

const fileds: Field = [{
      id: "kv-003",
      text: "031-233-5571",
      dx: 778.176025390625,
      dy: 3462.47998046875,
      dWidth: 310.4639892578125,
      dHeight: 39.31201171875,
      type: "miss",
      lineWidth: 5,
    }, ...n];

const viwerWrap: HTMLElement = document.querySelector(".viewer-wrap");

const imgs: string[] = [
  "/example/sample/temp1.jpg",
  "/example/sample/temp1.jpg",
  "/example/sample/temp1.jpg",
  "/example/sample/temp1.jpg",
];

const imageType: ImageType = "images";

const options: Options = {
  wrap: viwerWrap;
  fields: [fileds, ...n];
  scrollCallback: (fields: Field) => {
    // ... scroll event callback
  };
}

const viewer: Viewer = new Viewer(imgs, imageType, options);
```
