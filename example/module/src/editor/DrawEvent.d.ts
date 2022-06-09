import EditorConfig, { IEditorConfig } from "./EditorConfig";
import { EditorTypes } from "./types";
declare type RectOption = EditorTypes.RectOption;
declare type ArcOption = EditorTypes.ArcOption;
declare type TextOption = EditorTypes.TextOption;
declare type ScaleOption = EditorTypes.ScaleOption;
declare type ImgOption = EditorTypes.ImgOption;
declare type RotateOption = EditorTypes.RotateOption;
declare type Field = EditorTypes.Field;
declare type Remain = EditorTypes.Remain;
export interface IDrawEvent extends IEditorConfig {
    draw: () => Promise<void>;
}
export default class DrawEvent extends EditorConfig implements IDrawEvent {
    constructor();
    protected fillRect(ctx: CanvasRenderingContext2D, option: RectOption): Path2D;
    protected strokeRect(ctx: CanvasRenderingContext2D, option: RectOption): Path2D;
    protected fillArc(ctx: CanvasRenderingContext2D, option: ArcOption): void;
    protected strokeArc(ctx: CanvasRenderingContext2D, option: ArcOption): void;
    protected fillText(ctx: CanvasRenderingContext2D, option: TextOption): void;
    protected strokeText(ctx: CanvasRenderingContext2D, option: TextOption): void;
    protected setScale(ctx: CanvasRenderingContext2D, option: ScaleOption): void;
    protected drawImage(ctx: CanvasRenderingContext2D, option: ImgOption): void;
    protected drawRotate(ctx: CanvasRenderingContext2D, option: RotateOption): void;
    protected drawEditCircles(ctx: CanvasRenderingContext2D, field: Field, margin: number, remian: Remain): Path2D[];
    protected sectionValid(dx: number, dy: number, dWidth: number, dHeight: number): boolean;
    protected drawIndex(ctx: CanvasRenderingContext2D, f: Field, cnt: number, margin: number, remain: Remain): void;
    protected drawText(ctx: CanvasRenderingContext2D, f: Field, margin: number, remain: Remain): void;
    protected drawFields(ctx: CanvasRenderingContext2D, fields: Field[], margin: number, remain: Remain): void;
    protected drawSections(ctx: CanvasRenderingContext2D, fields: Field[], margin: number, color: string): void;
    protected drawSelectPointer(ctx: CanvasRenderingContext2D, field: Field, margin: number, remain: Remain): void;
    protected drawNewRect(ctx: CanvasRenderingContext2D, field: Field): void;
    draw(): Promise<void>;
    protected setImageCache(): void;
}
export {};
