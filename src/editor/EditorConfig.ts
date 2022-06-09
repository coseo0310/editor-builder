import { EditorTypes } from "./types";

type Field = EditorTypes.Field;
type DrawType = EditorTypes.DrawType;
type Remain = EditorTypes.Remain;

export interface IEditorConfig {
  getScale: () => number;
}

interface Crosshair {
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  lineWidth: number;
}

interface Colors {
  confirm: string;
  miss: string;
  error: string;
  crosshair: string;
  bubble: string;
  section: string;
  pointer: string;
}
export default class EditorConfig implements IEditorConfig {
  // Editor Elements values
  protected canvasEl: HTMLCanvasElement | null;
  protected ctx: CanvasRenderingContext2D | null;
  protected imgEl: HTMLImageElement;
  protected imageCache: HTMLCanvasElement | null;
  protected imageCacheCtx: CanvasRenderingContext2D | null;

  // Editor setting values
  protected depth: number;
  protected maxDepth: number;
  protected minDepth: number;
  protected deg: number;
  protected fields: EditorTypes.Field[];
  protected sections: EditorTypes.Field[];
  protected dMargin: number;
  protected remain: Remain;
  protected crosshair: Crosshair;

  // Is
  protected isText: boolean;
  protected isIdx: boolean;
  protected isSection: boolean;
  protected isSectionControl: boolean;
  protected isReadonly: boolean;
  protected isMargin: boolean;

  // Editor Event Handler Field values;
  protected drawType: DrawType;
  protected drawField: Field | null;
  protected editField: Field | null;
  protected sectionField: Field | null;
  protected color: Colors;

  // Callback
  protected imgLoadedCallback: EditorTypes.DrawCallback | null;
  protected drawEndCallback: EditorTypes.DrawCallback | null;
  protected resizeEndCallback: EditorTypes.DrawCallback | null;
  protected boxSelectedCallback: EditorTypes.DrawCallback | null;

  constructor() {
    if (document) {
      this.canvasEl = document.createElement("canvas");
      this.ctx = this.canvasEl.getContext("2d")!;
      this.imageCache = document.createElement("canvas");
      this.imageCacheCtx = this.imageCache.getContext("2d")!;
    } else {
      this.canvasEl = null;
      this.ctx = null;
      this.imageCache = null;
      this.imageCacheCtx = null;
    }

    this.imgEl = new Image();

    this.maxDepth = 150;
    this.minDepth = -50;
    this.depth = 100;
    this.deg = 0;
    this.dMargin = 0;
    this.remain = {
      x: 0,
      y: 0,
    };
    this.fields = [];

    this.sections = [];

    this.crosshair = {
      dx: 0,
      dy: 0,
      dWidth: 0,
      dHeight: 0,
      lineWidth: 3,
    };

    this.isText = true;
    this.isIdx = true;
    this.isSection = false;
    this.isSectionControl = false;
    this.isReadonly = false;
    this.isMargin = true;

    this.drawField = null;
    this.drawType = "new";
    this.editField = null;
    this.sectionField = null;

    this.color = {
      confirm: "rgba(103, 121, 215, 1)",
      miss: "rgba(255,164, 37, 1)",
      error: "rgba(255, 119, 119, 1)",
      crosshair: "rgba(0, 148, 247, 1)",
      bubble: "#47ADB5",
      section: "#FFD59E",
      pointer: "blue",
    };

    this.drawEndCallback = null;
    this.resizeEndCallback = null;
    this.boxSelectedCallback = null;
    this.imgLoadedCallback = null;
  }

  protected getMarginSize(w: number, h: number) {
    return this.isMargin ? (w > h ? w : h) : 0;
  }

  protected async getOffset() {
    if (!this.canvasEl || !this.ctx) {
      return {
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
      };
    }
    const cOffset = this.canvasEl.getBoundingClientRect();
    return {
      offsetX: cOffset.left,
      offsetY: cOffset.top,
      offsetWidth: cOffset.width,
      offsetHeight: cOffset.height,
    };
  }

  getScale() {
    const s = Number(Math.abs(this.depth * 0.01).toFixed(2));
    return s === 0 ? 1 : s;
  }

  protected getRotate() {
    return (this.deg / 90) % 2;
  }
}
