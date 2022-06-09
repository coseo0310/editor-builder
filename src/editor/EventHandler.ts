import DrawEvent, { IDrawEvent } from "./DrawEvent";

export interface IEventHandler extends IDrawEvent {
  init: () => void;
}

export default class EventHandler extends DrawEvent implements IEventHandler {
  // Events callback
  private isDraw: boolean;
  private isEdit: boolean;
  private isMove: boolean;
  private isResize: boolean;
  private resizePointer: string;
  private resizeDirection: number;
  private startX: number;
  private startY: number;
  private mouseX: number;
  private mouseY: number;

  constructor() {
    super();

    this.isDraw = false;
    this.isEdit = false;
    this.isMove = false;
    this.isResize = false;
    this.resizePointer = "default";
    this.resizeDirection = 0;
    this.startX = 0;
    this.startY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.setEditEvent();
    this.setDrawEvent();
  }

  init() {
    this.editField = null;
    this.drawField = null;
    this.isDraw = false;
    this.isEdit = false;
    this.isMove = false;
    this.isResize = false;
    this.resizePointer = "default";
    this.resizeDirection = 0;
    this.startX = 0;
    this.startY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.fields = [];
  }

  protected setEditEvent() {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    this.canvasEl.addEventListener("mousemove", this.handleBoxHover.bind(this));
    this.canvasEl.addEventListener(
      "mousemove",
      this.handleCircleHover.bind(this)
    );
    this.canvasEl.addEventListener("mousemove", this.handleResize.bind(this));
    this.canvasEl.addEventListener("mousemove", this.handleBoxMove.bind(this));
    this.canvasEl.addEventListener(
      "mousedown",
      this.handleBoxSelect.bind(this)
    );
    this.canvasEl.addEventListener(
      "mousedown",
      this.handleCircleSelect.bind(this)
    );
    this.canvasEl.addEventListener(
      "mouseup",
      this.handleBoxSelected.bind(this)
    );
    this.canvasEl.addEventListener("mouseup", this.handleResized.bind(this));
    // this.canvasEl.addEventListener(
    //   "mouseleave",
    //   this.handleBoxSelected.bind(this)
    // );
    this.canvasEl.addEventListener("mouseleave", this.handleResized.bind(this));
  }

  protected removeEditEvent() {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    this.canvasEl.removeEventListener(
      "mousemove",
      this.handleBoxHover.bind(this)
    );
    this.canvasEl.removeEventListener(
      "mousemove",
      this.handleCircleHover.bind(this)
    );
    this.canvasEl.removeEventListener(
      "mousemove",
      this.handleResize.bind(this)
    );
    this.canvasEl.removeEventListener(
      "mousemove",
      this.handleBoxMove.bind(this)
    );
    this.canvasEl.removeEventListener(
      "mousedown",
      this.handleBoxSelect.bind(this)
    );
    this.canvasEl.removeEventListener(
      "mousedown",
      this.handleCircleSelect.bind(this)
    );
    this.canvasEl.removeEventListener(
      "mouseup",
      this.handleBoxSelected.bind(this)
    );
    this.canvasEl.removeEventListener("mouseup", this.handleResized.bind(this));
    this.canvasEl.removeEventListener(
      "mouseleave",
      this.handleBoxSelected.bind(this)
    );
    this.canvasEl.removeEventListener(
      "mouseleave",
      this.handleResized.bind(this)
    );
  }

  protected setDrawEvent() {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    this.canvasEl.addEventListener(
      "mousedown",
      this.handleDrawStart.bind(this)
    );
    this.canvasEl.addEventListener("mousemove", this.handleDraw.bind(this));
    this.canvasEl.addEventListener("mouseup", this.handleDrawEnd.bind(this));
    this.canvasEl.addEventListener("mouseleave", this.handleDrawEnd.bind(this));

    this.canvasEl.addEventListener(
      "mousemove",
      this.handleCrosshair.bind(this)
    );
  }

  protected removeDrawEvent() {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    this.canvasEl.removeEventListener(
      "mousedown",
      this.handleDrawStart.bind(this)
    );
    this.canvasEl.removeEventListener("mousemove", this.handleDraw.bind(this));
    this.canvasEl.removeEventListener("mouseup", this.handleDrawEnd.bind(this));
    this.canvasEl.removeEventListener(
      "mouseleave",
      this.handleDrawEnd.bind(this)
    );
  }

  private async handleCircleHover(e: MouseEvent) {
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.editField?.circle || this.isResize || !this.isEdit) {
      return;
    }
    for (let i = 0; i < this.editField.circle.length; i++) {
      if (
        !this.ctx.isPointInPath(this.editField.circle[i], e.offsetX, e.offsetY)
      ) {
        continue;
      }
      if (i === 0 || i === 4) {
        this.resizePointer = "nwse-resize";
      } else if (i === 2 || i === 6) {
        this.resizePointer = "nesw-resize";
      } else if (i === 1 || i === 5) {
        this.resizePointer = "ns-resize";
      } else {
        this.resizePointer = "ew-resize";
      }
      this.canvasEl.style.cursor = this.resizePointer;
      this.resizeDirection = i;
      break;
    }
  }

  private async handleCircleSelect(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.isEdit || this.isMove || this.isResize) {
      return;
    }
    this.isResize = true;
    const { offsetX, offsetY } = await this.getOffset();
    const mouseX = e.clientX - offsetX;
    const mouseY = e.clientY - offsetY;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  private async handleResize(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.isResize) {
      return;
    }
    if (!this.editField) {
      return;
    }
    const { offsetX, offsetY } = await this.getOffset();
    const mouseX = e.clientX - offsetX;
    const mouseY = e.clientY - offsetY;

    const scale = this.getScale();
    if (this.mouseX !== mouseX) {
      const x = (this.mouseX - mouseX) / scale;
      this.mouseX = mouseX;
      if (
        this.resizeDirection === 0 ||
        this.resizeDirection === 6 ||
        this.resizeDirection === 7
      ) {
        this.editField.dx = this.editField.dx - x;
        this.editField.dWidth = this.editField.dWidth + x;
      } else if (
        this.resizeDirection === 2 ||
        this.resizeDirection === 3 ||
        this.resizeDirection === 4
      ) {
        this.editField.dWidth = this.editField.dWidth - x;
      }
    }
    if (this.mouseY !== mouseY) {
      const y = (this.mouseY - mouseY) / scale;
      this.mouseY = mouseY;
      if (
        this.resizeDirection === 0 ||
        this.resizeDirection === 1 ||
        this.resizeDirection === 2
      ) {
        this.editField.dy = this.editField.dy - y;
        this.editField.dHeight = this.editField.dHeight + y;
      } else if (
        this.resizeDirection === 4 ||
        this.resizeDirection === 5 ||
        this.resizeDirection === 6
      ) {
        this.editField.dHeight = this.editField.dHeight - y;
      }
    }

    this.canvasEl.style.cursor = this.resizePointer;
    this.draw();
  }

  private async handleResized(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.isResize) {
      return;
    }
    if (!this.editField) {
      return;
    }
    if (this.resizeEndCallback && this.editField) {
      this.resizeEndCallback(this.editField);
    }
    this.isResize = false;
  }

  private async handleBoxHover(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }

    for (const f of this.fields) {
      if (!f.box || !this.ctx.isPointInPath(f.box, e.offsetX, e.offsetY)) {
        if (!this.drawField) {
          this.canvasEl.style.cursor = "default";
        }
        continue;
      }
      this.canvasEl.style.cursor = "pointer";
      break;
    }

    for (const s of this.sections) {
      if (!s.box || !this.ctx.isPointInPath(s.box, e.offsetX, e.offsetY)) {
        if (!this.drawField) {
          this.canvasEl.style.cursor = "default";
        }
        continue;
      }
      this.canvasEl.style.cursor = "pointer";
      break;
    }
  }

  private async handleBoxSelect(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }

    if (this.editField?.circle) {
      for (const c of this.editField.circle) {
        if (this.ctx.isPointInPath(c, e.offsetX, e.offsetY)) {
          return;
        }
      }
    }
    this.isEdit = false;
    this.editField = null;
    // this.drawType = "new";
    const scale = this.getScale();

    for (const f of this.fields) {
      if (!f.box || !this.ctx.isPointInPath(f.box, e.offsetX, e.offsetY)) {
        continue;
      } else {
        if (
          this.sectionField &&
          !this.sectionValid(f.dx, f.dy, f.dWidth, f.dHeight)
        ) {
          continue;
        }
        const prev: number = this.editField
          ? this.editField.dWidth * this.editField.dHeight
          : 0;
        const next = f.dWidth * f.dHeight * scale;

        this.isEdit = true;
        this.isMove = true;
        this.editField = this.editField
          ? prev > next
            ? f
            : this.editField
          : f;
        const { offsetX, offsetY } = await this.getOffset();
        const mouseX = e.clientX - offsetX;
        const mouseY = e.clientY - offsetY;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
      }
    }
    if (!this.editField) {
      // this.drawType = "section";
      this.sectionField = null;
      for (const s of this.sections) {
        if (!s.box || !this.ctx.isPointInPath(s.box, e.offsetX, e.offsetY)) {
          continue;
        } else {
          const prev: number = this.editField
            ? this.editField.dWidth * this.editField.dHeight
            : 0;
          const next = s.dWidth * s.dHeight * scale;

          this.isEdit = true;
          this.isMove = true;
          this.editField = this.editField
            ? prev > next
              ? s
              : this.editField
            : s;
          this.sectionField = this.editField;
          const { offsetX, offsetY } = await this.getOffset();
          const mouseX = e.clientX - offsetX;
          const mouseY = e.clientY - offsetY;
          this.mouseX = mouseX;
          this.mouseY = mouseY;

          this.editField = this.isSectionControl ? this.editField : null;
        }
      }
      if (this.boxSelectedCallback && !this.editField) {
        this.boxSelectedCallback(this.sectionField || undefined);
      }
    }
    this.draw();
  }

  private async handleBoxMove(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }

    if (!this.isMove || this.isReadonly) {
      return;
    }
    if (!this.editField) {
      return;
    }
    const { offsetX, offsetY } = await this.getOffset();
    const mouseX = e.clientX - offsetX;
    const mouseY = e.clientY - offsetY;

    const scale = this.getScale();
    if (this.mouseX !== mouseX) {
      const x = (this.mouseX - mouseX) / scale;
      this.mouseX = mouseX;
      this.editField.dx = this.editField.dx - x;
    }
    if (this.mouseY !== mouseY) {
      const y = (this.mouseY - mouseY) / scale;
      this.mouseY = mouseY;
      this.editField.dy = this.editField.dy - y;
    }

    this.canvasEl.style.cursor = "grabbing";
    this.draw();
  }

  private async handleBoxSelected(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }

    this.isMove = false;
    this.canvasEl.style.cursor = "default";

    if (this.editField && this.drawType === "section") {
      this.sectionField = this.editField;
    }

    this.draw();

    if (this.boxSelectedCallback && this.editField) {
      this.boxSelectedCallback(this.editField);
    }
  }

  private async handleDrawStart(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }

    if (!this.drawField) {
      return;
    }

    console.log("start", this.drawType);

    const { offsetX, offsetY } = await this.getOffset();
    this.startX = e.clientX - offsetX;
    this.startY = e.clientY - offsetY;

    const scale = this.getScale();

    this.drawField.dx = this.startX / scale;
    this.drawField.dy = this.startY / scale;
    this.isDraw = true;
  }

  private async handleCrosshair(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }

    if (!this.drawField) {
      return;
    }

    const { offsetX, offsetY, offsetWidth, offsetHeight } =
      await this.getOffset();
    const startX = e.clientX - offsetX;
    const startY = e.clientY - offsetY;
    const scale = this.getScale();
    this.crosshair.dx = startX / scale;
    this.crosshair.dy = startY / scale;
    this.crosshair.dWidth = offsetWidth / scale;
    this.crosshair.dHeight = offsetHeight / scale;
    this.draw();
  }

  private async handleDrawEnd(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.drawField) {
      return;
    }
    this.isDraw = false;
    this.drawField.draw = false;

    this.drawField.dx = this.drawField.dx - this.dMargin;
    this.drawField.dy = this.drawField.dy - this.dMargin;

    if (this.drawField.dWidth > 0) {
      if (this.drawType === "new") {
        if (!this.sectionField) {
          this.fields = [...this.fields, this.drawField];
        } else {
          if (
            this.sectionValid(
              this.drawField.dx,
              this.drawField.dy,
              this.drawField.dWidth,
              this.drawField.dHeight
            )
          ) {
            this.fields = [...this.fields, this.drawField];
          }
        }
      } else if (this.drawType === "section") {
        this.sections = [...this.sections, this.drawField];
      }
    }

    if (this.drawEndCallback && this.drawField) {
      this.drawEndCallback(this.drawField);
    }
    console.log("end:>>", this.drawType);
    this.drawField = null;

    this.canvasEl.style.cursor = "default";
    this.draw();
  }

  private async handleDraw(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canvasEl || !this.ctx) {
      return;
    }
    if (!this.isDraw) {
      return;
    }
    if (!this.drawField) {
      return;
    }
    const scale = this.getScale();
    const { offsetX, offsetY } = await this.getOffset();
    const mouseX = e.clientX - offsetX;
    const mouseY = e.clientY - offsetY;
    this.drawField.dWidth = (mouseX - this.startX) / scale;
    this.drawField.dHeight = (mouseY - this.startY) / scale;

    this.draw();
  }
}
