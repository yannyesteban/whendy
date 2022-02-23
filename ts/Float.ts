interface IMoveInfo {
    x: number,
    y: number,
    startX: number,
    startY: number,
    left: number,
    top: number,
    deltaX: number,
    deltaY: number

}

let zIndex = 10000;

const getIndex = (index?) => {

    if (index !== undefined && index > 0 && index >= zIndex) {
        return zIndex;
    }
    return ++zIndex;
};

const on = function (obj, _event, _function) {
    obj.addEventListener(_event, _function, false);
};

const off = function (obj, _event, _function) {
    obj.removeEventListener(_event, _function, false);
};

export class Float {

    static init(e) {
        on(e, "mousedown", (event) => {
            e.style.zIndex = getIndex(e.style.zIndex);
        });
        on(e, "touchstart", (event) => {
            e.style.zIndex = getIndex(e.style.zIndex);
        });
    }

    static setIndex(e) {
        e.style.zIndex = getIndex(e.style.zIndex);
    }

    static getXY(e) {

        let
            cW = document.documentElement.clientWidth,
            cH = document.documentElement.clientHeight,
            sT = document.documentElement.scrollTop,
            sL = document.documentElement.scrollLeft,

            rect = e.getBoundingClientRect();

        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            cW: cW, cH: cH, sT: sT, sL: sL
        };

    }


    static showElem(opt: any) {

        let
            e = opt.e,
            left = opt.left,
            top = opt.top,
            z = (opt.z !== undefined) ? opt.z : undefined;

        if (top !== null) {
            e.style.top = top + "px";
        }
        if (left !== null) {
            e.style.left = left + "px";
        }

        if (z !== undefined) {
            if (z > 0) {
                e.style.zIndex = z;
            }
        } else {
            z = e.style.zIndex = getIndex();
        }

        return { e: e, left: left, top: top, z: z };

    }

    static show(opt: any) {

        let
            e = opt.e,
            xx = (opt.left === undefined) ? null : opt.left,
            yy = (opt.top === undefined) ? null : opt.top,
            z = opt.z || undefined,
            deltaX = opt.deltaX || 0,
            deltaY = opt.deltaY || 0,

            left = null,
            top = null;

        let c = this.getXY(opt.e);

        if (typeof xx === "string") {
            switch (xx) {
                case "center":
                    left = c.sL + (c.cW - c.width) / 2;
                    break;
                case "left":
                    left = c.sL;
                    break;
                case "right":
                    left = c.sL + c.cW - c.width;
                    break;
                case "acenter":
                    left = (c.cW - c.width) / 2;
                    break;
            }
        } else {
            left = xx;
        }

        if (typeof yy === "string") {
            switch (yy) {
                case "middle":
                    top = c.sT + (c.cH - c.height) / 2;
                    break;
                case "top":
                    top = c.sT;
                    break;
                case "bottom":
                    top = c.sT + c.cH - c.height;
                    break;
                case "amiddle":
                    top = (c.cH - c.height) / 2;
                    break;
            }
        } else {
            top = yy;
        }
        if (left !== null) {
            left = left + (deltaX || 0)
        }
        if (top !== null) {
            top = top + (deltaY || 0)
        }
        return this.showElem({ e: e, left: left, top: top, z: z });

    }

    static showMenu(opt) {

        let
            e = opt.e,
            context = opt.context,
            xx = opt.left || "",
            yy = opt.top || "",
            deltaX = opt.deltaX || 0,
            deltaY = opt.deltaY || 0,
            z = (opt.z !== undefined) ? opt.z : undefined,


            left = null,
            top = null,
            c = this.getXY(context),

            fixed = (e.style.position === "fixed"),
            width = e.offsetWidth,
            height = e.offsetHeight,
            cW = c.cW,
            cH = c.cH,
            sL = c.sL,
            sT = c.sT;

        switch (xx) {
            case "center":
                left = c.left + c.width / 2 - width / 2;
                break;
            case "left":
                left = c.left;
                break;
            case "front":
                left = c.left + c.width;
                break;
            case "back":
                left = c.left - width;
                break;
            case "right":
                left = c.left + c.width - width;
                break;
            default:
                left = c.left + c.width - 10;

        }

        switch (yy) {
            case "middle":
                top = c.top + c.height / 2 - height / 2;
                break;
            case "top":
                top = c.top;
                break;
            case "bottom":
                top = c.top + c.height - height;
                break;
            case "down":
                top = c.top + c.height;
                break;
            case "up":
                top = c.top - height;
                break;
            default:
                top = c.top + c.height - 10;
        }

        if (!fixed) {
            top = top + sT;
            left = left + sL;
        }

        left = left + deltaX;
        top = top + deltaY;

        if ((left + width) > (cW + sL)) {
            left = cW + sL - width;
        }

        if (left < sL) {
            left = sL;
        }

        if ((top + height) > (cH + sT)) {
            top = cH + sT - height;
        }

        if (top < sT && !fixed) {
            top = sT;
        }

        return this.showElem({ e: e, left: left, top: top, z: z });
    }

    static dropDown(opt) {

        let
            e = opt.e,
            context = opt.context,
            xx = opt.left || "",
            yy = opt.top || "",
            deltaX = opt.deltaX || 0,
            deltaY = opt.deltaY || 0,
            z = (opt.z !== undefined) ? opt.z : undefined,

            left: any = null,
            top: any = null,
            c = this.getXY(context),

            width = e.offsetWidth,
            height = e.offsetHeight,
            cW = c.cW,
            cH = c.cH,
            sL = c.sL,
            sT = c.sT;

        switch (xx) {
            case "center":
                left = c.left + c.width / 2;
                break;
            case "left":
                left = c.left;
                break;
            case "right":
                left = c.left + c.width;
                break;
            case "back":
                left = c.left - width;
                break;
            default:
                left = c.left + c.width - 10;

        }

        switch (yy) {
            case "middle":
                top = c.top + c.height / 2;
                break;
            case "top":
                top = c.top;
                break;
            case "bottom":

                top = c.top + c.height;
                break;
            case "up":

                top = c.top - height;
                break;
            default:
                top = c.top + c.height - 10;
        }

        left = left + deltaX;
        top = top + deltaY;

        if ((left + width) > (cW + sL)) {
            left = cW + sL - width;
        }
        if (left < sL) {
            left = sL;
        }
        if ((top + height) > (cH + sT)) {
            //top = cH + sT - height;
        }
        if (top < sT) {

            top = sT;
        }

        if ((c.top + c.height + height) > (cH + sT)) {
            top = c.top - height;
        }

        return this.showElem({ e: e, left: left, top: top, z: z });

    }

    static center(e) {
        e.style.position = "fixed";
        e.style.top = "50%";
        e.style.left = "50%";
        e.style.transform = "translate(-50%, -50%)";

    }

    static floatCenter(e) {
        let
            cW = document.documentElement.clientWidth,
            cH = document.documentElement.clientHeight
        let rect = e.getBoundingClientRect();
        e.style.position = "fixed";
        e.style.top = "50%";
        e.style.left = "50%";
        e.style.transform = "translate(-50%, -50%)";

    }

    static move(e, left, top) {
        //e.style.position = "fixed";
        e.style.left = left;
        e.style.top = top;
    }

    static float(opt) {

        let
            e = opt.e,
            left = opt.left,
            top = opt.top;

        let tx: any = null, ty: any = null;


        switch (left) {
            default:
            case "center":
                e.style.left = "50%";
                tx = "-50%";
                break;
            case "left":
                e.style.left = "0%";
                tx = "0%";
                break;
            case "right":
                e.style.left = "100%";
                tx = "-100%";
                break;
        }

        switch (top) {
            default:
            case "middle":
                e.style.top = "50%";
                ty = "-50%";
                break;
            case "top":
                e.style.top = "0%";
                ty = "0%";
                break;
            case "bottom":
                e.style.top = "100%";
                ty = "-100%";
                break;
        }

        e.style.transform = "translate(" + tx + "," + ty + ")";

    }

    static max(e: any) {
        e.style.position = "fixed";
        e.style.top = "0%";
        e.style.left = "0%";
        e.style.width = "100%";
        e.style.height = "100%";
        e.style.border = "3px solid green";
        //e.style.transform = "translate(-50%, -50%)";

    }

}

export class Drag {

    static stop = () => { };
    static init(config) {

        const onCapture = config.onCapture || ((config) => { });
        const onDrag = config.onDrag || ((config) => { });
        const onRelease = config.onRelease || ((config) => { });

        let element: HTMLElement = config.main;

        const _mouseDown = (event) => {
            
            if (event.target && event.target.classList.contains("_drag_start_")) {
                return;
            }
            
            element.classList.add("_drag_start_");

            const startX = event.clientX;
            const startY = event.clientY;
            const left = element.offsetLeft;
            const top = element.offsetTop;

            onCapture({ startX, startY, left, top });

            const drag = (event) => {
                onDrag({
                    x: event.clientX,
                    y: event.clientY,
                    startX,
                    startY,
                    left,
                    top,
                    deltaX: event.clientX - startX,
                    deltaY: event.clientY - startY
                });
            };

            const release = (event) => {
                element.classList.remove("_drag_start_");
                
                off(document, "mousemove", drag);
                off(document, "mouseup", release);

                onRelease({
                    x: event.clientX,
                    y: event.clientY,
                    startX,
                    startY,
                    left,
                    top,
                    deltaX: event.clientX - startX,
                    deltaY: event.clientY - startY
                });

            }
            on(document, "mousemove", drag);
            on(document, "mouseup", release);
        };

        on(element, "mousedown", _mouseDown);
    }
}

export class Move {

    static init(config) {

        const main = config.main;
        const hand = config.hand;

        let startLeft = 0;
        let startTop = 0;

        const minVisibleX = (config.minVisibleX !== undefined) ? config.minVisibleX : 40;
        const minVisibleY = (config.minVisibleY !== undefined) ? config.minVisibleX : 40;

        const drag = (reps: IMoveInfo) => {

            let left = startLeft + reps.deltaX;
            let top = startTop + reps.deltaY;

            if (left <= 0) {
                left = 0;
            }

            if (top <= 0) {
                top = 0;
            }

            main.style.left = left + "px";
            main.style.top = top + "px";

            if (config.onDrag) {
                config.onDrag({ left, top });
            }
        };

        const release = (reps: IMoveInfo) => {

            const info = Float.getXY(main);

            if (info.left > info.cW - minVisibleX || info.top > info.cH - minVisibleY) {

                const left = (info.left > info.cW - minVisibleX) ? info.cW - minVisibleX : info.left;
                const top = (info.top > info.cH - minVisibleY) ? info.cH - minVisibleY : info.top;

                reps.left = left;
                reps.top = top;

                Float.move(main, left + "px", top + "px");
            }

            if (config.onRelease) {
                config.onRelease(reps);
            }
        };

        Drag.init({
            main: hand,
            onCapture: (response) => {

                startLeft = main.offsetLeft;
                startTop = main.offsetTop;

                if (config.position) {
                    main.style.position = config.position;
                }

                if (config.onCapture) {
                    config.onCapture({ left: startLeft, top: startTop });
                }
            },
            onDrag: drag,
            onRelease: release
        });
    }
};

export class Resize {
    static mode = "";
    static holders = [
        {
            className: "rs t", backgroundColor: "", cursor: "s-resize",
            left: "0", top: "0", width: "100%", height: "", margin: "-2px",
        },
        {
            className: "rs r", backgroundColor: "", cursor: "e-resize",
            left: "100%", top: "0", width: "", height: "100%", margin: "-2px",
        },
        {
            className: "rs b", backgroundColor: "", cursor: "n-resize",
            left: "0", top: "100%", width: "100%", height: "", margin: "-2px",
        },
        {
            className: "rs l", backgroundColor: "", cursor: "w-resize",
            left: "0", top: "0", width: "", height: "100%", margin: "-2px",
        },


        {
            className: "rs lt", backgroundColor: "red", cursor: "nwse-resize",
            left: "0", top: "0", width: "10px", height: "10px", margin: "-5px",
        },
        {
            className: "rs rt", backgroundColor: "", cursor: "sw-resize",
            left: "100%", top: "0", width: "10px", height: "10px", margin: "-5px",
        },
        {
            className: "rs lb", backgroundColor: "", cursor: "ne-resize",
            left: "0", top: "100%", width: "10px", height: "10px", margin: "-5px",
        },
        {
            className: "rs rb", backgroundColor: "blue", cursor: "nwse-resize",
            left: "100%", top: "100%", width: "10px", height: "10px", margin: "-5px",
        },
    ]
    
    static init(config) {

        const main = config.main;
        main.style.userSelect = "none";

        let left = 0;
        let top = 0;
        let bottom = 0;
        let right = 0;

        let width = 0;
        let height = 0;

        let clientWidth = 0;
        let clientHeight = 0;
        
        let minLeft = 0;
        let maxLeft = 0;
        let minRight = 0;
        let maxRight = 0;
        let minTop = 0;
        let maxTop = 0;
        let minBottom = 0;
        let maxBottom = 0;

        const capture = () => {

            const rect = main.getBoundingClientRect();
            bottom = rect.bottom;
            right = rect.right;
            left = rect.left;
            top = rect.top;

            clientWidth = document.documentElement.clientWidth;
            clientHeight = document.documentElement.clientHeight;

            width = main.offsetWidth;
            height = main.offsetHeight;

            const compute = window.getComputedStyle(main, null);

            const minWidth = parseFloat(compute.minWidth) || 0;
            const minHeight = parseFloat(compute.minHeight) || 0;
            const maxWidth = parseFloat(compute.maxWidth) || clientWidth;
            const maxHeight = parseFloat(compute.maxHeight) || clientHeight;
            

            minLeft = left - (maxWidth - width);
            maxLeft = left + (width - minWidth);

            minRight = left + minWidth;
            maxRight = right + (maxWidth - width);

            minTop = top - (maxHeight - height);
            maxTop = bottom - minHeight;

            minBottom = top + minHeight;
            maxBottom = bottom + (maxHeight - height);

            if (config.onStart) {
                config.onStart({ left, top, right, bottom, width, height });
            }

        }

        const resize = ({ x, y }) => {

            if (x < 0) {
                x = 0;
            }
            if (x > clientWidth) {
                x = clientWidth;
            }

            if (y < 0) {
                y = 0;
            }
            if (y > clientHeight) {
                y = clientHeight;
            }
            
            let x1 = null;
            let x2 = null;

            let y1 = null;
            let y2 = null;

            switch (this.mode) {
                case "t":
                    y1 = y;
                    break;
                case "l":
                    x1 = x;
                    break;
                case "r":
                    x2 = x;
                    break;
                case "b":
                    y2 = y;
                    break;
                case "lt":
                    x1 = x;
                    y1 = y;
                    break;
                case "rt":
                    x2 = x;
                    y1 = y;
                    break;
                case "lb":
                    x1 = x;
                    y2 = y;
                    break;
                case "rb":
                    x2 = x;
                    y2 = y
                    break;
            }

            if (x1 !== null) {
                x2 = right;
                if (x1 < minLeft) {
                    x1 = minLeft;
                }
                if (x1 > maxLeft) {
                    x1 = maxLeft;
                }
                
            } else if (x2 !== null) {
                x1 = left;
                if (x2 > maxRight) {
                    x2 = maxRight;
                }
                if (x2 < minRight) {
                    x2 = minRight;
                }
            } else {
                x1 = left;
                x2 = right;
            }

            if (y1 !== null) {
                y2 = bottom;
                if (y1 < minTop) {
                    y1 = minTop;
                }
                if (y1 > maxTop) {
                    y1 = maxTop;
                }
                
            } else if (y2 !== null) {
                y1 = top;
                if (y2 < minBottom) {
                    y2 = minBottom;
                }
                if (y2 > maxBottom) {
                    y2 = maxBottom;
                }

            } else {
                y1 = top;
                y2 = bottom;
            }

            left = x1;
            right = x2;
            top = y1;
            bottom = y2;

            width = x2 - x1;
            height = y2 - y1;

            main.style.left = left + "px";
            main.style.top = top + "px";
            main.style.width = width + "px";
            main.style.height = height + "px";

            if (config.onResize) {
                config.onResize({ left, top, right, bottom, width, height });
            }
        }

        const release = (resp) => {
            if (config.onStart) {
                config.onStart({ left, top, right, bottom, width, height });
            }
        }

        this.holders.forEach((h) => {
            const holder = document.createElement("div");
            holder.style.cssText = "position:absolute;min-height:3px;min-width:3px;z-index:10";

            holder.className = h.className;
            for (let x in h) {
                if (x === "className") {
                    continue;
                }
                holder.style[x] = h[x];

            }
            main.appendChild(holder);

            on(holder, "mousedown", (event) => {
                this.mode = holder.className.split(" ")[1];

            });

            Drag.init({
                main: holder,
                context: main,
                onCapture: capture,
                onDrag: resize,
                onRelease: release
            });

        });
    }
}
