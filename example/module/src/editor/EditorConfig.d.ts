import { EditorTypes } from "./types";
declare type Field = EditorTypes.Field;
declare type DrawType = EditorTypes.DrawType;
declare type Remain = EditorTypes.Remain;
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
    protected canvasEl: HTMLCanvasElement | null;
    protected ctx: CanvasRenderingContext2D | null;
    protected imgEl: HTMLImageElement;
    protected imageCache: HTMLCanvasElement | null;
    protected imageCacheCtx: CanvasRenderingContext2D | null;
    protected depth: number;
    protected maxDepth: number;
    protected minDepth: number;
    protected deg: number;
    protected fields: EditorTypes.Field[];
    protected sections: EditorTypes.Field[];
    protected dMargin: number;
    protected remain: Remain;
    protected crosshair: Crosshair;
    protected isText: boolean;
    protected isIdx: boolean;
    protected isSection: boolean;
    protected isSectionControl: boolean;
    protected isReadonly: boolean;
    protected isMargin: boolean;
    protected drawType: DrawType;
    protected drawField: Field | null;
    protected editField: Field | null;
    protected sectionField: Field | null;
    protected color: Colors;
    protected imgLoadedCallback: EditorTypes.DrawCallback | null;
    protected drawEndCallback: EditorTypes.DrawCallback | null;
    protected resizeEndCallback: EditorTypes.DrawCallback | null;
    protected boxSelectedCallback: EditorTypes.DrawCallback | null;
    constructor();
    protected getMarginSize(w: number, h: number): number;
    protected getOffset(): Promise<{
        offsetX: number;
        offsetY: number;
        offsetWidth: number;
        offsetHeight: number;
    }>;
    getScale(): number;
    protected getRotate(): number;
}
export {};
