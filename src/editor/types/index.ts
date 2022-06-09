export declare module EditorTypes {
  interface Field {
    id: string;
    text: string;
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
    type: "confirm" | "miss" | "error" | "section" | "new";
    lineWidth?: number;
    draw?: boolean;
    circle?: Path2D[];
    box?: Path2D;
  }

  interface RectOption {
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
    color: string;
    lineWidth?: number;
  }

  interface ArcOption {
    dx: number;
    dy: number;
    startArc: number;
    endArc: number;
    color: string;
    radius: number;
    lineWidth?: number;
  }

  interface TextOption {
    text: string;
    dx: number;
    dy: number;
    font: string;
    color: string;
    lineWidth?: number;
  }

  interface ImgOption {
    img: HTMLImageElement | HTMLCanvasElement;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
  }

  interface RotateOption {
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
    deg: number;
  }

  interface ScaleOption {
    x: number;
    y: number;
  }

  interface Remain {
    x: number;
    y: number;
  }

  type DrawType = "new" | "section";

  type DrawCallback = (field?: Field) => void;

  type Event = "imgLoaded" | "draw" | "resize" | "selected";

  type FitType = "width" | "height";

  type ScrollType = "top" | "leftTop";
}
