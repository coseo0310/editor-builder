import EventHandler, { IEventHandler } from "./EventHandler";
import { EditorTypes } from "./types";

type Field = EditorTypes.Field;
type DrawType = EditorTypes.DrawType;
type Event = EditorTypes.Event;
type DrawCallback = EditorTypes.DrawCallback;
type FitType = EditorTypes.FitType;
type ScrollType = EditorTypes.ScrollType;

interface Options {
  canvas?: HTMLCanvasElement;
  isReadonly?: boolean;
}

export interface IEditorContorller extends IEventHandler {
  setImgUrl: (url: string) => Promise<void>;
  setZoomInOut: (depth: number) => Promise<void>;
  setRotate: (deg: number) => Promise<void>;
  setDraw: (drawType: DrawType, field?: Field) => Promise<void>;
  getCanvas: () => HTMLCanvasElement | null;
  getMargin: () => number;
  setIsReadonly: (isText: boolean) => Promise<void>;
  setIsText: (isText: boolean) => Promise<void>;
  setIsIdx: (isIdx: boolean) => Promise<void>;
  setField: (field: Field) => Promise<void>;
  setMaxScale: (s: number) => Promise<void>;
  setMinScale: (s: number) => Promise<void>;
  modifyField: (field: Field) => Promise<void>;
  setSection: (field: Field) => Promise<void>;
  setSections: (fields: Field[]) => Promise<void>;
  setSectionField: (n: number) => Promise<void>;
  setSectionDraw: (b: boolean) => Promise<void>;
  setSectionControl: (b: boolean) => Promise<void>;
  setCalculatedScale: (fit: FitType, isScroll?: boolean) => Promise<void>;
  setScroll: (type: ScrollType) => void;
  setEditField: (id: string) => Promise<void>;
  getFields: () => Field[];
  getSections: () => Field[];
  getSectionIdx: () => number;
  getSectionLength: () => number;
  getSectionField: () => Field | null;
  getEditField: () => Field | null;
  getDeg: () => number;
  getIsIdx: () => boolean;
  getIsText: () => boolean;
  clearEditField: () => Promise<void>;
  clearSectionField: () => Promise<void>;
  removeField: (id: string) => void;
  removeFields: () => void;
  removeSection: (id: string) => void;
  removeSections: () => void;
  downloadImage: () => void;
  addEventListener: (e: Event, c: DrawCallback) => void;
}

export default class EditorContorller
  extends EventHandler
  implements IEditorContorller
{
  constructor(options?: Options) {
    super();

    if (options?.canvas) {
      this.canvasEl = options.canvas;
      this.ctx = options.canvas.getContext("2d")!;
      this.setDrawEvent();
      this.setEditEvent();
    }
    if (options?.isReadonly) {
      this.isReadonly = options.isReadonly;
    }
  }

  getCanvas() {
    return this.canvasEl;
  }

  async setImgUrl(url: string) {
    const image = new Image();
    image.src = url;
    this.imgEl = image;

    this.imgEl.onload = async () => {
      await this.setImageCache();
      await this.draw();
      if (!this.imgLoadedCallback) {
        return;
      }
      this.imgLoadedCallback();
    };
  }

  async setMaxScale(s: number) {
    this.maxDepth = s;
  }

  async setMinScale(s: number) {
    this.minDepth = s;
  }

  async setIsReadonly(isReadonly: boolean) {
    this.isReadonly = isReadonly;
  }

  async setIsText(isText: boolean) {
    this.isText = isText;
  }

  async setIsIdx(isIdx: boolean) {
    this.isIdx = isIdx;
  }

  async setSections(fields: Field[]) {
    this.sections = fields;
    if (this.isSection) {
      this.sectionField = this.sections[0];
    }
  }

  async setSection(field: Field) {
    this.sections.push(field);
  }

  async setSectionField(n: number) {
    if (this.sections.length === 0) {
      return;
    }
    this.sectionField = this.sections[n];
    this.draw();
  }

  async setSectionDraw(b: boolean) {
    this.isSection = b;
  }

  async setSectionControl(b: boolean) {
    this.isSectionControl = b;
  }

  async setField(field: Field) {
    this.fields.push(field);
  }

  async setFields(fields: Field[]) {
    this.fields = fields;
  }

  async setEditField(id: string) {
    if (this.fields.length === 0) {
      return;
    }
    this.editField = this.fields.find((f) => f.id === id) || null;
    this.draw();
  }

  async clearEditField() {
    this.editField = null;
  }

  async clearSectionField() {
    this.sectionField = null;
  }

  async modifyField(field: Field) {
    const f = this.fields.find((f) => f.id === field.id);
    if (!f) {
      return;
    }
    f.text = field.text;
  }

  async removeSection(id: string) {
    this.sections = this.sections.filter((s) => s.id !== id);
  }

  async removeSections() {
    this.sections = [];
  }

  async removeField(id: string) {
    this.fields = this.fields.filter((f) => f.id !== id);
  }

  async removeFields() {
    this.fields = [];
  }

  getMargin() {
    return this.dMargin;
  }

  getSections() {
    return this.sections;
  }

  getSectionIdx() {
    return this.sectionField ? this.sections.indexOf(this.sectionField) : 0;
  }

  getSectionLength() {
    return this.sectionField ? this.sections.length : 1;
  }

  getSectionField() {
    return this.sectionField;
  }

  getEditField() {
    return this.editField;
  }

  getFields() {
    if (this.sectionField) {
      return this.fields.filter((f) =>
        this.sectionValid(f.dx, f.dy, f.dWidth, f.dHeight)
      );
    }
    return this.fields;
  }

  getDeg() {
    return this.deg;
  }

  getIsIdx() {
    return this.isIdx;
  }

  getIsText() {
    return this.isText;
  }

  async setZoomInOut(depth: number) {
    if (depth > this.maxDepth && depth < this.maxDepth) {
      return;
    }

    this.depth = depth;

    if (!this.canvasEl?.parentElement) {
      return;
    }

    await this.setImageCache();
    await this.draw();
  }

  async setRotate(deg: number) {
    this.deg = deg;
    await this.setImageCache();
    await this.draw();
  }

  async setCalculatedScale(fit: FitType = "width", isScroll: boolean = true) {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.imgEl) {
      return;
    }
    if (!this.canvasEl.parentElement) {
      return;
    }

    const cWidth = this.imgEl.naturalWidth;
    const cHeight = this.imgEl.naturalHeight;
    const pWidth = this.canvasEl.parentElement.clientWidth;
    const pHeight = this.canvasEl.parentElement.clientHeight;
    const r = this.getRotate();

    const width = r === 1 || r === -1 ? cHeight : cWidth;
    const height = r === 1 || r === -1 ? cWidth : cHeight;

    const p =
      fit === "width" ? (pWidth / width) * 100 : (pHeight / height) * 100;

    const depth = Math.abs(Math.floor(p));
    const scroll = fit === "width" ? "leftTop" : "top";
    this.depth = depth;
    this.setImageCache();
    this.draw();
    if (isScroll) {
      this.setScroll(scroll);
    }
  }

  async setScroll(type: ScrollType = "leftTop") {
    if (!this.canvasEl || !this.ctx) {
      return;
    }

    if (!this.canvasEl.parentElement?.scrollTo) {
      return;
    }
    const scale = this.getScale();
    const mWidth = this.imgEl.naturalWidth * scale;
    const mHeight = this.imgEl.naturalHeight * scale;

    const r = this.getRotate();

    const mTop =
      r === 1 || r === -1
        ? (mWidth - this.canvasEl.clientHeight) / 2
        : (mHeight - this.canvasEl.clientHeight) / 2;

    const mLeft =
      r === 1 || r === -1
        ? (mHeight - this.canvasEl.clientWidth) / 2
        : (mWidth - this.canvasEl.clientWidth) / 2;

    await this.canvasEl.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "start",
    });

    await this.canvasEl.parentElement.scrollBy({
      top: Math.abs(Math.floor(mTop)),
      left: type === "leftTop" ? Math.abs(Math.floor(mLeft)) : 0,
      behavior: "auto",
    });
  }

  async setDraw(drawType: DrawType, field?: Field) {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    this.drawField = field
      ? field
      : {
          id: `tmp-${Date.now()}`,
          text: "",
          dx: 0,
          dy: 0,
          dWidth: 0,
          dHeight: 0,
          type: "new",
          lineWidth: 5,
          draw: true,
        };
    this.canvasEl.style.cursor = "crosshair";
    this.drawType = drawType;
  }

  downloadImage() {
    if (!this.canvasEl) {
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const cWidth = this.imgEl.naturalWidth;
    const cHeight = this.imgEl.naturalHeight;

    const w = cWidth;
    const h = cHeight;

    canvas.width = w;
    canvas.height = h;

    this.drawImage(ctx, {
      img: this.imgEl,
      sx: 0,
      sy: 0,
      sWidth: Math.floor(cWidth),
      sHeight: Math.floor(cHeight),
      dx: 0,
      dy: 0,
      dWidth: Math.floor(cWidth),
      dHeight: Math.floor(cHeight),
    });

    this.drawFields(ctx, this.fields, 0, { x: 0, y: 0 });

    const link = document.createElement("a");
    const image = canvas.toDataURL("image/png");
    link.href = image;
    link.download = `${Date.now()}`;
    link.click();
  }

  getCurrenImages() {
    if (!this.canvasEl) {
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const cWidth = this.imgEl.naturalWidth;
    const cHeight = this.imgEl.naturalHeight;

    const w = cWidth;
    const h = cHeight;

    canvas.width = w;
    canvas.height = h;

    this.drawImage(ctx, {
      img: this.imgEl,
      sx: 0,
      sy: 0,
      sWidth: Math.floor(cWidth),
      sHeight: Math.floor(cHeight),
      dx: 0,
      dy: 0,
      dWidth: Math.floor(cWidth),
      dHeight: Math.floor(cHeight),
    });

    this.drawFields(ctx, this.fields, 0, { x: 0, y: 0 });

    return canvas;
  }

  addEventListener(e: Event, c: DrawCallback) {
    switch (e) {
      case "imgLoaded":
        this.imgLoadedCallback = c;
      case "draw":
        this.drawEndCallback = c;
        break;
      case "draw":
        this.drawEndCallback = c;
        break;
      case "resize":
        this.resizeEndCallback = c;
        break;
      case "selected":
        this.boxSelectedCallback = c;
        break;
      default:
        break;
    }
  }
}
