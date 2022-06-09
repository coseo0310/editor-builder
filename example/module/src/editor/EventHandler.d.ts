import DrawEvent, { IDrawEvent } from "./DrawEvent";
export interface IEventHandler extends IDrawEvent {
    init: () => void;
}
export default class EventHandler extends DrawEvent implements IEventHandler {
    private isDraw;
    private isEdit;
    private isMove;
    private isResize;
    private resizePointer;
    private resizeDirection;
    private startX;
    private startY;
    private mouseX;
    private mouseY;
    constructor();
    init(): void;
    protected setEditEvent(): void;
    protected removeEditEvent(): void;
    protected setDrawEvent(): void;
    protected removeDrawEvent(): void;
    private handleCircleHover;
    private handleCircleSelect;
    private handleResize;
    private handleResized;
    private handleBoxHover;
    private handleBoxSelect;
    private handleBoxMove;
    private handleBoxSelected;
    private handleDrawStart;
    private handleCrosshair;
    private handleDrawEnd;
    private handleDraw;
}
