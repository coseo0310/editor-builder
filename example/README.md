# API documentation

## 📙 인스턴스 생성 및 Canvas Element 반환

---

```html
<body>
  <div class="wrap"></div>
</body>
```

```ts
import Viewer from "./module/viewer.js";

type Field = {
  id: string;
  text: string;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  type: "confirm" | "miss" | "error" | "new";
};

type ImageType = "images" | "pdf" | "tiff";

const fileds: Field = [{ ...n }, ...n];

const viwerWrap: HTMLElement = document.querySelector(".wrap");

const imgs: string[] = [
  "/example/sample/temp1.jpg",
  "/example/sample/temp1.jpg",
  "/example/sample/temp1.jpg",
  "/example/sample/temp1.jpg",
];

const imageType: ImageType = "images";

const viewer: Viewer = new Viewer(imgs, imageType, {
  wrap: viwerWrap,
  fields: [fileds, ...n],
  scrollCallback: (fields: Field) => {
    // ... scroll event callback
  },
});
```
