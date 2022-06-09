import { type } from "os";
import EditorConfig, { IEditorConfig } from "./EditorConfig";

import { EditorTypes } from "./types";

type RectOption = EditorTypes.RectOption;
type ArcOption = EditorTypes.ArcOption;
type TextOption = EditorTypes.TextOption;
type ScaleOption = EditorTypes.ScaleOption;
type ImgOption = EditorTypes.ImgOption;
type RotateOption = EditorTypes.RotateOption;
type Field = EditorTypes.Field;
type Remain = EditorTypes.Remain;

export interface IDrawEvent extends IEditorConfig {
  draw: () => Promise<void>;
}

export default class DrawEvent extends EditorConfig implements IDrawEvent {
  constructor() {
    super();
  }

  protected fillRect(ctx: CanvasRenderingContext2D, option: RectOption) {
    ctx.save();
    ctx.fillStyle = option.color;
    const box = new Path2D();
    box.rect(option.dx, option.dy, option.dWidth, option.dHeight);
    ctx.fill(box);
    ctx.restore();
    return box;
  }

  protected strokeRect(ctx: CanvasRenderingContext2D, option: RectOption) {
    ctx.save();
    ctx.lineWidth = option.lineWidth ? option.lineWidth : 1;
    ctx.strokeStyle = option.color;
    const box = new Path2D();
    box.rect(option.dx, option.dy, option.dWidth, option.dHeight);
    ctx.stroke(box);
    ctx.restore();
    return box;
  }

  protected fillArc(ctx: CanvasRenderingContext2D, option: ArcOption) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = option.color;
    ctx.arc(
      option.dx,
      option.dy,
      option.radius,
      option.startArc,
      option.endArc
    );
    ctx.fill();
    ctx.restore();
  }

  protected strokeArc(ctx: CanvasRenderingContext2D, option: ArcOption) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = option.lineWidth ? option.lineWidth : 1;
    ctx.strokeStyle = option.color;
    ctx.arc(
      option.dx,
      option.dy,
      option.radius,
      option.startArc,
      option.endArc
    );
    ctx.stroke();
    ctx.restore();
  }

  protected fillText(ctx: CanvasRenderingContext2D, option: TextOption) {
    ctx.save();
    ctx.font = option.font;
    ctx.fillStyle = option.color;
    ctx.fillText(option.text, option.dx, option.dy);
    ctx.restore();
  }

  protected strokeText(ctx: CanvasRenderingContext2D, option: TextOption) {
    ctx.save();
    ctx.font = option.font;
    ctx.lineWidth = option.lineWidth ? option.lineWidth : 1;
    ctx.strokeStyle = option.color;
    ctx.strokeText(option.text, option.dx, option.dy);
    ctx.restore();
  }

  protected setScale(ctx: CanvasRenderingContext2D, option: ScaleOption) {
    ctx.scale(option.x, option.y);
  }

  protected drawImage(ctx: CanvasRenderingContext2D, option: ImgOption) {
    ctx.drawImage(
      option.img,
      option.sx,
      option.sy,
      option.sWidth,
      option.sHeight,
      option.dx,
      option.dy,
      option.dWidth,
      option.dHeight
    );
  }

  protected drawRotate(ctx: CanvasRenderingContext2D, option: RotateOption) {
    const tx = option.dx + option.dWidth / 2;
    const ty = option.dy + option.dHeight / 2;

    // const r = this.getRotate();

    // if (r === 1) {
    //   // ctx.translate(0, -option.dHeight);
    //   ctx.rotate((option.deg * Math.PI) / 180);
    //   ctx.translate(-option.dHeight, 0);
    // } else {
    //   // ctx.translate(0, ty);
    //   // ctx.rotate((option.deg * Math.PI) / 180);
    //   // ctx.translate(0, -ty);
    // }

    ctx.translate(tx, ty);
    ctx.rotate((option.deg * Math.PI) / 180);
    ctx.translate(-tx, -ty);
  }

  protected drawEditCircles(
    ctx: CanvasRenderingContext2D,
    field: Field,
    margin: number = 0,
    remian: Remain
  ) {
    const dx = Math.floor(field.dx + margin + remian.x);
    const dy = Math.floor(field.dy + margin + remian.y);
    const circle1 = new Path2D();
    const circle2 = new Path2D();
    const circle3 = new Path2D();
    const circle4 = new Path2D();
    const circle5 = new Path2D();
    const circle6 = new Path2D();
    const circle7 = new Path2D();
    const circle8 = new Path2D();
    circle1.arc(dx, dy, 10, 0, 2 * Math.PI);
    circle2.arc(dx + Math.floor(field.dWidth) / 2, dy, 10, 0, 2 * Math.PI);
    circle3.arc(dx + Math.floor(field.dWidth), dy, 10, 0, 2 * Math.PI);
    circle4.arc(
      dx + Math.floor(field.dWidth),
      dy + Math.floor(field.dHeight) / 2,
      10,
      0,
      2 * Math.PI
    );
    circle5.arc(
      dx + Math.floor(field.dWidth),
      dy + Math.floor(field.dHeight),
      10,
      0,
      2 * Math.PI
    );
    circle6.arc(
      dx + Math.floor(field.dWidth) / 2,
      dy + Math.floor(field.dHeight),
      10,
      0,
      2 * Math.PI
    );
    circle7.arc(dx, dy + Math.floor(field.dHeight), 10, 0, 2 * Math.PI);
    circle8.arc(dx, dy + Math.floor(field.dHeight) / 2, 10, 0, 2 * Math.PI);

    ctx.save();
    ctx.fillStyle = this.color.pointer;
    ctx.fill(circle1);
    ctx.fill(circle2);
    ctx.fill(circle3);
    ctx.fill(circle4);
    ctx.fill(circle5);
    ctx.fill(circle6);
    ctx.fill(circle7);
    ctx.fill(circle8);
    ctx.restore();

    return [
      circle1,
      circle2,
      circle3,
      circle4,
      circle5,
      circle6,
      circle7,
      circle8,
    ];
  }

  protected sectionValid(
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number
  ) {
    const sdx = this.sectionField?.dx || 0;
    const sWidth = this.sectionField?.dWidth || 0;
    const sw = sdx + sWidth;

    const sdy = this.sectionField?.dy || 0;
    const sHeight = this.sectionField?.dHeight || 0;
    const sh = sdy + sHeight;

    const cw = sdx <= dx && sw >= dx;
    const ch = sdy <= dy && sh >= dy;

    const ew = sdx <= dx + dWidth && sw >= dx + dWidth;
    const eh = sdy <= dy + dHeight && sh >= dy + dHeight;

    return cw && ch && ew && eh;
  }

  protected drawIndex(
    ctx: CanvasRenderingContext2D,
    f: Field,
    cnt: number,
    margin: number = 0,
    remain: Remain
  ) {
    const dx = Math.floor(f.draw ? f.dx : f.dx + margin + remain.x);
    const dy = Math.floor(f.draw ? f.dy : f.dy + margin + remain.y);

    const color =
      f.type === "confirm"
        ? this.color.confirm
        : f.type === "miss"
        ? this.color.miss
        : this.color.error;

    const arcOption: ArcOption = {
      dx: dx - 40,
      dy: dy + 30,
      startArc: 0,
      endArc: 2 * Math.PI,
      color,
      radius: 30,
    };
    const rectOption: RectOption = {
      dx: dx - 40,
      dy: dy,
      dWidth: 40,
      dHeight: 60,
      color,
      lineWidth: 5,
    };
    const len = String(cnt).length;
    const sx = len === 1 ? 40 : 40 + 5 * len;
    const sy = -42;

    const indexOption: TextOption = {
      text: `${cnt}`,
      dx: Math.floor(dx - sx),
      dy: dy - sy,
      font: `32px Pretendard serif`,
      color: "white",
    };
    this.fillArc(ctx, arcOption);
    this.fillRect(ctx, rectOption);
    this.fillText(ctx, indexOption);
    ctx.restore();
  }

  protected drawText(
    ctx: CanvasRenderingContext2D,
    f: Field,
    margin: number = 0,
    remain: Remain
  ) {
    const dx = Math.floor(f.draw ? f.dx : f.dx + margin + remain.x);
    const dy = Math.floor(f.draw ? f.dy : f.dy + margin + remain.y);

    ctx.save();

    const bColor = f.type === "error" ? this.color.error : this.color.bubble;
    const angle = new Path2D();

    const x = dx + Math.floor(f.dWidth) / 2 - 20;
    const y = dy - 40;
    angle.moveTo(x, y);
    angle.lineTo(x + 20, y + 40);
    angle.lineTo(x + 40, y);
    angle.closePath();

    ctx.fillStyle = bColor;
    ctx.fill(angle);
    ctx.restore();

    const text = f.type === "error" ? "인식실패" : f.text;

    ctx.save();
    ctx.font = `38px Pretendard serif`;
    const w = ctx.measureText(text).width;
    ctx.restore();

    const textOption: TextOption = {
      text,
      dx: dx - (w - f.dWidth) / 2,
      dy: dy - 55,
      font: `38px Pretendard serif`,
      color: "white",
    };

    const rectOption: RectOption = {
      dx: dx - (w - f.dWidth) / 2,
      dy: dy - 98,
      dWidth: Math.floor(w),
      dHeight: 60,
      color: bColor,
      lineWidth: 5,
    };

    const arcOption1: ArcOption = {
      dx: dx - (w - f.dWidth) / 2,
      dy: dy - 68,
      startArc: 0,
      endArc: 2 * Math.PI,
      color: bColor,
      radius: 30,
    };

    const arcOption2: ArcOption = {
      dx: dx - (w - f.dWidth) / 2 + w,
      dy: dy - 68,
      startArc: 0,
      endArc: 2 * Math.PI,
      color: bColor,
      radius: 30,
    };

    this.fillArc(ctx, arcOption1);
    this.fillArc(ctx, arcOption2);
    this.fillRect(ctx, rectOption);
    this.fillText(ctx, textOption);
  }

  protected drawFields(
    ctx: CanvasRenderingContext2D,
    fields: Field[],
    margin: number = 0,
    remain: Remain
  ) {
    let cnt = 1;
    for (const f of fields) {
      if (
        this.sectionField &&
        !this.sectionValid(f.dx, f.dy, f.dWidth, f.dHeight)
      ) {
        continue;
      }

      const dx = Math.floor(f.draw ? f.dx : f.dx + margin + remain.x);
      const dy = Math.floor(f.draw ? f.dy : f.dy + margin + remain.y);
      const color =
        f.type === "confirm"
          ? this.color.confirm
          : f.type === "miss"
          ? this.color.miss
          : this.color.error;

      const rectOption: RectOption = {
        dx,
        dy,
        dWidth: Math.floor(f.dWidth),
        dHeight: Math.floor(f.dHeight),
        color,
        lineWidth: 5,
      };
      ctx.save();
      ctx.globalAlpha = 0.5;
      f.box = this.fillRect(ctx, rectOption);
      ctx.restore();

      if (this.isText) {
        this.drawText(ctx, f, margin, remain);
      }

      if (this.isIdx) {
        this.drawIndex(ctx, f, cnt++, margin, remain);
      }
    }
  }

  protected drawSections(
    ctx: CanvasRenderingContext2D,
    fields: Field[],
    margin: number = 0,
    color: string
  ) {
    for (const f of fields) {
      const dx = Math.floor(f.draw ? f.dx : f.dx + margin);
      const dy = Math.floor(f.draw ? f.dy : f.dy + margin);

      f.box = new Path2D();
      f.box.rect(dx, dy, Math.floor(f.dWidth), Math.floor(f.dHeight));

      if (this.sectionField?.box) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = color;
        ctx.fill(this.sectionField.box);
        ctx.restore();
      }

      ctx.save();

      ctx.strokeStyle = color;
      ctx.lineWidth = f.lineWidth || 15;
      ctx.setLineDash([25, 10]);
      ctx.stroke(f.box);

      ctx.restore();
    }
  }

  protected drawSelectPointer(
    ctx: CanvasRenderingContext2D,
    field: Field,
    margin: number,
    remain: Remain
  ) {
    const dx = Math.floor(field.draw ? field.dx : field.dx + margin + remain.x);
    const dy = Math.floor(field.draw ? field.dy : field.dy + margin + remain.y);
    const rectOption: RectOption = {
      dx,
      dy,
      dWidth: Math.floor(field.dWidth),
      dHeight: Math.floor(field.dHeight),
      color: this.color.pointer,
      lineWidth: 5,
    };
    this.strokeRect(ctx, rectOption);
    if (!this.isReadonly) {
      field.circle = this.drawEditCircles(
        ctx,
        field,
        this.dMargin,
        this.remain
      );
    }
  }

  protected drawNewRect(ctx: CanvasRenderingContext2D, field: Field) {
    this.fillRect(ctx, {
      dx: 0,
      dy: this.crosshair.dy,
      dWidth: this.crosshair.dWidth,
      dHeight: this.crosshair.lineWidth,
      color: this.color.crosshair,
    });
    this.fillRect(ctx, {
      dx: this.crosshair.dx,
      dy: 0,
      dWidth: this.crosshair.lineWidth,
      dHeight: this.crosshair.dHeight,
      color: this.color.crosshair,
    });
    this.strokeRect(ctx, {
      dx: field.dx,
      dy: field.dy,
      dWidth: field.dWidth,
      dHeight: field.dHeight,
      color: this.color.pointer,
      lineWidth: field.lineWidth,
    });
  }

  async draw() {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.imgEl || !this.imageCache) {
      return;
    }
    if (this.imageCache.width === 0 || this.imageCache.height === 0) {
      return;
    }
    if (!this.ctx) {
      return;
    }

    const scale = this.getScale();

    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

    this.canvasEl.width = this.imageCache.width;
    this.canvasEl.height = this.imageCache.height;

    this.drawImage(this.ctx, {
      img: this.imageCache,
      sx: 0,
      sy: 0,
      sWidth: Math.floor(this.imageCache.width),
      sHeight: Math.floor(this.imageCache.height),
      dx: 0,
      dy: 0,
      dWidth: Math.floor(this.imageCache.width),
      dHeight: Math.floor(this.imageCache.height),
    });

    this.setScale(this.ctx, { x: scale, y: scale });

    if (this.isSection) {
      this.drawSections(
        this.ctx,
        this.sections,
        this.dMargin,
        this.color.section
      );
    }

    this.drawFields(this.ctx, this.fields, this.dMargin, this.remain);

    if (this.editField) {
      this.drawSelectPointer(
        this.ctx,
        this.editField,
        this.dMargin,
        this.remain
      );
    }
    if (this.drawField) {
      this.drawNewRect(this.ctx, this.drawField);
    }
  }

  protected setImageCache() {
    if (!this.imageCache || !this.imageCacheCtx) {
      return;
    }
    if (!this.imgEl) {
      return;
    }

    const pWidth = this.canvasEl?.parentElement?.clientWidth || 0;
    const pHeight = this.canvasEl?.parentElement?.clientHeight || 0;

    const scale = this.getScale();
    const cWidth = this.imgEl.naturalWidth * scale;
    const cHeight = this.imgEl.naturalHeight * scale;

    const margin = this.getMarginSize(cWidth, cHeight);

    const width = cWidth + margin * scale;
    const height = cHeight + margin * scale;

    const wRemain = width < pWidth ? Math.floor(pWidth - width) : 0;
    const hRemain = height < pHeight ? Math.floor(pHeight - height) : 0;

    this.imageCache.width = cWidth + margin * scale + wRemain;
    this.imageCache.height = cHeight + margin * scale;

    this.dMargin = margin / 2;
    this.remain = {
      x: wRemain / 2 / scale,
      y: hRemain / 2 / scale,
    };

    if (this.imageCache.width === 0 || this.imageCache.height === 0) {
      return;
    }

    const dWidth = this.imgEl.naturalWidth;
    const dHeight = this.imgEl.naturalHeight;

    this.setScale(this.imageCacheCtx, { x: scale, y: scale });

    this.drawRotate(this.imageCacheCtx, {
      dx: this.dMargin + this.remain.x,
      dy: this.dMargin + this.remain.y,
      dWidth,
      dHeight,
      deg: this.deg,
    });

    this.drawImage(this.imageCacheCtx, {
      img: this.imgEl,
      sx: 0,
      sy: 0,
      sWidth: Math.floor(dWidth),
      sHeight: Math.floor(dHeight),
      dx: Math.floor(this.dMargin + this.remain.x),
      dy: Math.floor(this.dMargin + this.remain.y),
      dWidth: Math.floor(dWidth),
      dHeight: Math.floor(dHeight),
    });
  }
}
