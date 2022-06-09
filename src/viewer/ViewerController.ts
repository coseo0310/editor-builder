import Editor, { Field } from "../editor";
import "../../lib/pdfjs-dist@2.6.347/pdf.js";
import "../../lib/jspdf/jspdf.umd.js";

window.pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../lib/pdfjs-dist@2.6.347/pdf.worker.js";

=
declare global {
  interface Window {
    pdfjsLib: any;
    jspdf: any;
  }
}

interface ViewerOptions {
  wrap: HTMLElement;
  fields: Field[][];
  zoom?: number;
  deg?: number;
  scrollCallback?: (f: Field[]) => void;
}

type ScrollCallback = (f: Field[]) => void;

type ImgType = "image" | "pdf" | "tiff";

interface IViewerController {
  getViewerElement: () => HTMLElement;
  setScrollCallback: (c: ScrollCallback) => void;
}

export default class ViewerController implements IViewerController {
  private imgs: string[];
  private fields: Field[][];

  private rotate: number = 0;

  private deg: number = 90;
  private zoom: number = 10;

  private maxZoom: number = 150;
  private minZoom: number = 20;

  private viewerEl: HTMLElement;
  private editors: Editor[] = [];
  private currentEditor: Editor | null = null;
  private currentIdx: number = 0;

  private observer: IntersectionObserver | null = null;

  private isDraw: boolean = true;
  private isReadOnly: boolean = true;
  private isAnnotation: boolean = false;
  private isPreview: boolean = true;

  private scrollCallback: ScrollCallback = (f: Field[]) => {};

  constructor(url: string[], imgType: ImgType, options: ViewerOptions) {
    this.fields = options.fields;
    this.deg = options.deg ? options.deg : this.deg;
    this.zoom = options.zoom ? options.zoom : this.zoom;
    this.viewerEl = options.wrap;
    // this.isDraw = !!options.isDraw;
    // this.isReadOnly = !!options.isReadOnly;
    // this.isAnnotation = !!options.isAnnotation;
    this.scrollCallback = options.scrollCallback
      ? options.scrollCallback
      : (f: Field[]) => {};

    this.viewerEl.classList.add("viewer");
    this.viewerEl.style.position = "relative";
    this.viewerEl.style.width = "100%";
    this.viewerEl.style.height = "100%";
    this.viewerEl.style.overflow = "scroll";

    this.imgs = url;
    this.imgConversion(imgType);
  }
  setScrollCallback(c: ScrollCallback) {
    this.scrollCallback = c;
  }

  getViewerElement() {
    return this.viewerEl;
  }

  private async setViewer() {
    try {
      await this.setObserve();
      const header = document.createElement("div");
      const preview = document.createElement("div");
      const remote = document.createElement("div");
      await this.setHeader(header);
      await this.setPreview(preview);
      await this.setRemote(remote);
      this.viewerEl.appendChild(remote);
      this.viewerEl.appendChild(header);
      this.viewerEl.appendChild(preview);

      for (const [k, v] of Object.entries(this.imgs)) {
        const idx = Number(k);
        const editor = new Editor();
        const canvas = editor.getCanvas();
        canvas.classList.add(`editor-${idx}`);
        this.viewerEl.insertBefore(canvas, header);
        editor.setImgUrl(v);
        editor.setIsReadonly(this.isReadOnly);
        editor.addEventListener("imgLoaded", () => {
          editor.setCalculatedScale("height", idx === 0);
          editor.setFields(this.fields[idx] || []);
          editor.setIsIdx(this.isAnnotation);
          editor.setIsText(this.isAnnotation);
          editor.draw();
        });
        this.editors.push(editor);
        if (this.observer) {
          this.observer.observe(canvas);
        }
        if (idx === 0) {
          this.currentEditor = editor;
          this.setPreviewToggle();
        }
      }
    } catch (error) {
      console.error(error);
      alert("초기화에 실패하였습니다. 이미지를 확인해주세요.");
    }
  }

  private async setHeader(el: HTMLDivElement) {
    el.classList.add("header");
  }

  private async setRemote(el: HTMLDivElement) {
    const zoomIn = document.createElement("button");
    const zoomOut = document.createElement("button");
    const left = document.createElement("button");
    const right = document.createElement("button");
    const widthFit = document.createElement("button");
    const heightFit = document.createElement("button");
    const annotation = document.createElement("button");
    const download = document.createElement("button");
    const initial = document.createElement("button");

    el.classList.add("remote");

    zoomIn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>`;

    zoomOut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
    </svg>`;

    left.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.84 12.48H8M8 12.48C8 12.48 11.2 8 16 8C18.1217 8 20.1566 8.84285 21.6569 10.3431C23.1571 11.8434 24 13.8783 24 16C24 18.1217 23.1571 20.1566 21.6569 21.6569C20.1566 23.1571 18.1217 24 16 24C11.5814 24 8 20.16 8 16.96M8 12.48V8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    right.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.16 12.48H24M24 12.48C24 12.48 20.8 8 16 8C13.8783 8 11.8434 8.84285 10.3431 10.3431C8.84286 11.8434 8 13.8783 8 16C8 18.1217 8.84286 20.1566 10.3431 21.6569C11.8434 23.1571 13.8783 24 16 24C20.4186 24 24 20.16 24 16.96M24 12.48V8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    widthFit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>`;
    heightFit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>`;

    annotation.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>`;

    download.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>`;

    initial.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>`;

    left.classList.add("rotate-left");
    right.classList.add("rotate-right");
    zoomIn.classList.add("zoom-in");
    zoomOut.classList.add("zoom-out");
    widthFit.classList.add("width-fit");
    heightFit.classList.add("height-fit");
    annotation.classList.add("annotation");
    download.classList.add("downlaod");
    initial.classList.add("initial");

    left.addEventListener(
      "click",
      (() => {
        this.setRotate("left");
      }).bind(this)
    );
    right.addEventListener(
      "click",
      (() => {
        this.setRotate("right");
      }).bind(this)
    );
    zoomIn.addEventListener(
      "click",
      (() => {
        this.setZoomInOut("in");
      }).bind(this)
    );
    zoomOut.addEventListener(
      "click",
      (() => {
        this.setZoomInOut("out");
      }).bind(this)
    );
    widthFit.addEventListener(
      "click",
      (() => {
        this.setFit("width");
      }).bind(this)
    );
    heightFit.addEventListener(
      "click",
      (() => {
        this.setFit("height");
      }).bind(this)
    );
    annotation.addEventListener(
      "click",
      (() => {
        this.setAnnotation();
      }).bind(this)
    );

    download.addEventListener(
      "click",
      (() => {
        this.downlad();
      }).bind(this)
    );

    initial.addEventListener(
      "click",
      (async () => {
        const c = await confirm("초기화 하시겠습니까?");
        if (c) {
          this.init();
        }
      }).bind(this)
    );

    el.appendChild(initial);
    el.appendChild(left);
    el.appendChild(right);
    el.appendChild(zoomIn);
    el.appendChild(zoomOut);
    el.appendChild(widthFit);
    el.appendChild(heightFit);
    el.appendChild(annotation);
    el.appendChild(download);
  }

  private async setPreview(el: HTMLDivElement) {
    const btn = document.createElement("div");
    const wrap = document.createElement("div");
    btn.classList.add("preview-btn");

    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>`;

    btn.addEventListener(
      "click",
      (() => {
        if (this.isPreview) {
          el.style.height = "25px";
          wrap.style.display = "none";
          this.isPreview = false;
        } else {
          el.style.height = "20vh";
          wrap.style.display = "flex";
          this.isPreview = true;
        }
      }).bind(this)
    );

    el.appendChild(btn);
    el.appendChild(wrap);
    el.classList.add("preview");
    wrap.classList.add("preview-wrap");

    for (const [k, v] of Object.entries(this.imgs)) {
      const idx = Number(k);
      const card = document.createElement("div");
      card.classList.add("card");
      card.style.backgroundImage = `url(${v})`;
      card.style.backgroundPosition = "center";
      card.style.backgroundSize = "cover";
      card.style.backgroundRepeat = "no-repeat";
      card.addEventListener(
        "click",
        (() => {
          const c = this.editors[idx].getCanvas();
          c.scrollIntoView({ behavior: "smooth", block: "center" });
        }).bind(this)
      );
      wrap.appendChild(card);
    }
  }

  private async setPreviewToggle() {
    const els = document.querySelectorAll(".card");
    if (els.length === 0) {
      return;
    }
    for (const el of els) {
      el.classList.remove("on");
    }
    els[this.currentIdx].classList.add("on");
  }

  private async setObserve() {
    const observerOptions = {
      root: this.viewerEl,
      rootMargin: "0px",
      // threshold: 0.1,
    };
    const observerCallback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      if (entries.length > 1) {
        return;
      }
      entries.forEach((entry) => {
        const {
          target,
          isIntersecting,
          boundingClientRect,
          intersectionRatio,
        } = entry;
        const idx = Number(target.classList.value.split("-")[1]);
        if (!isIntersecting && intersectionRatio <= 0) {
          if (boundingClientRect.y < 0) {
            this.currentIdx = idx + 1;
            this.currentEditor = this.editors[this.currentIdx];
            this.setPreviewToggle();
          } else {
            this.currentIdx = idx - 1;
            this.currentEditor = this.editors[this.currentIdx];
            this.setPreviewToggle();
          }
          const fields = this.currentEditor.getFields();
          this.scrollCallback(fields);
        }
      });
    };
    this.observer = new IntersectionObserver(observerCallback, observerOptions);
  }

  private async setRotate(t: "right" | "left") {
    if (!this.currentEditor) {
      return;
    }
    const deg = this.currentEditor.getDeg();
    this.rotate = t === "left" ? deg - this.deg : deg + this.deg;
    this.currentEditor.setRotate(this.rotate);
  }

  private async setFit(t: "width" | "height") {
    if (!this.currentEditor) {
      return;
    }

    this.currentEditor.setCalculatedScale(t);
  }

  private async setZoomInOut(t: "in" | "out") {
    if (!this.currentEditor) {
      return;
    }
    let zoom = this.currentEditor.getScale() * 100;
    zoom = t === "in" ? zoom + this.zoom : zoom - this.zoom;

    zoom = this.minZoom > zoom ? this.minZoom : zoom;

    if (zoom < this.minZoom || zoom > this.maxZoom) {
      return;
    }
    this.currentEditor.setZoomInOut(zoom);
  }

  private async setAnnotation() {
    if (!this.currentEditor) {
      return;
    }

    const isAnnotation = !this.currentEditor.getIsIdx();
    this.currentEditor.setIsIdx(isAnnotation);
    this.currentEditor.setIsText(isAnnotation);
    this.currentEditor.draw();
  }

  private async init() {
    this.editors = [];
    this.viewerEl.innerHTML = "";
    this.setViewer();
  }

  private async PDFConversion() {
    try {
      const pdfs: any[] = [];
      for (const url of this.imgs) {
        const p = await window.pdfjsLib.getDocument(url);
        pdfs.push(p);
      }

      this.imgs = [];
      const iter = pdfs[Symbol.iterator]();
      const promises: Promise<any>[] = [];

      const PDFProgress = (i: IterableIterator<any>, idx = 0) => {
        const { value, done } = i.next();
        if (!!done) {
          return;
        }
        const pdf = value;

        pdf.onProgress = async ({ loaded, total }) => {
          if (!pdf._transport._numPages) {
            return;
          }
          for (let i = 1; i <= pdf._transport._numPages; i++) {
            const page = await pdf._transport.getPage(i);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;

            const viewport = page.getViewport({
              scale: 1,
              rotate: 0,
              dontFlip: false,
            });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const p = page.render({ viewport, canvasContext: ctx });

            p._internalRenderTask.capability.promise.then(() => {
              this.imgs.push(canvas.toDataURL());
            });

            promises.push(p._internalRenderTask.capability.promise);
          }

          if (idx === pdfs.length - 1) {
            Promise.all(promises).then(() => {
              this.setViewer();
            });
          }
        };
        PDFProgress(i, idx + 1);
      };

      PDFProgress.bind(this);
      PDFProgress(iter);
    } catch (error) {
      console.error(error);
      alert("잘못된 형식의 파일입니다.");
    }
  }

  private async imgConversion(imgType: ImgType) {
    switch (imgType) {
      case "pdf":
        await this.PDFConversion();
        break;
      case "tiff":
      default:
        this.setViewer();
        break;
    }
  }

  private async downlad() {
    if (this.editors.length === 0) {
      return;
    }
    const doc = new window.jspdf.jsPDF();
    const images: string[] = [];

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    let cnt = 1;
    for (const editor of this.editors) {
      const canvas = editor.getCurrenImages();
      const image = canvas.toDataURL();
      await doc.addImage(image, "PNG", 0, 0, width, height);
      images.push(image);
      if (cnt === this.editors.length) {
        break;
      }
      doc.addPage();
      cnt++;
    }

    doc.save("test.pdf");
  }
}
