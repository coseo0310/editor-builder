import { Field } from "../editor";
import "../../lib/pdfjs-dist@2.6.347/pdf.js";
import "jspdf/dist/jspdf.umd.js";
declare global {
    interface Window {
        pdfjsLib: any;
        jspdf: any;
    }
}
interface ViewerOptions {
    fields: Field[][];
    zoom?: number;
    deg?: number;
    scrollCallback?: (f: Field[]) => void;
}
declare type ScrollCallback = (f: Field[]) => void;
declare type ImgType = "image" | "pdf" | "tiff";
interface IViewerController {
    getViewerElement: () => HTMLDivElement;
    setScrollCallback: (c: ScrollCallback) => void;
}
export default class ViewerController implements IViewerController {
    private imgs;
    private fields;
    private rotate;
    private deg;
    private zoom;
    private maxZoom;
    private minZoom;
    private viewerEl;
    private editors;
    private currentEditor;
    private currentIdx;
    private observer;
    private isDraw;
    private isReadOnly;
    private isAnnotation;
    private isPreview;
    private scrollCallback;
    constructor(url: string[], imgType: ImgType, options: ViewerOptions);
    setScrollCallback(c: ScrollCallback): void;
    getViewerElement(): HTMLDivElement;
    private setViewer;
    private setHeader;
    private setRemote;
    private setPreview;
    private setPreviewToggle;
    private setObserve;
    private setRotate;
    private setFit;
    private setZoomInOut;
    private setAnnotation;
    private init;
    private PDFConversion;
    private imgConversion;
}
export {};
