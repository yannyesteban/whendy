import {_sgQuery}  from './Query.js';

export var Float = (($) => {

    class InfoElem {
        e = false;
        left=null;
        top=null;
        z=null;
        deltaX=null;
        deltaY=null;
    }

    let zIndex = 10000;

    let getIndex = () => {
        return zIndex++;
    };

    let on = function(obj, _event, _function){
        if(obj.addEventListener){
            _event = _event.replace(/^\s*on/gi, "");
            obj.addEventListener(_event, _function, false);
        }else if(obj.attachEvent){
            obj.attachEvent(_event, _function);
        }
    };

    let off = function(obj, _event, _function) {
        if(obj.removeEventListener){
            _event = _event.replace(/^\s*on/gi, "");
            obj.removeEventListener(_event, _function, false);
        }else if(obj.detachEvent){
            obj.detachEvent(_event, _function);
        }
    };

    class Float{

		static init(e){
			on(e, "mousedown", (event) => {
				e.style.zIndex = getIndex();
			});
			on(e, "touchstart", (event) => {
				e.style.zIndex = getIndex();
			});
		}

		static setIndex(e){
			e.style.zIndex = getIndex();
		}

		static getXY(e){

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
                cW: cW, cH: cH, sT: sT,sL: sL
			};

		}


		static showElem(opt:any){

			let
				e = opt.e,
				left = opt.left,
				top = opt.top,
				z = (opt.z !== undefined)? opt.z: undefined;

            if(top !== null){
                e.style.top = top + "px";
            }
			if(left !== null){
                e.style.left = left + "px";
            }

			if(z !== undefined){
				if(z > 0){
					e.style.zIndex = z;
				}
			}else{
				z = e.style.zIndex = getIndex();
			}

			return {e: e, left: left, top: top, z: z};

		}

		static show(opt:any){

			let
				e = opt.e,
				xx = (opt.left === undefined)? null: opt.left,
				yy = (opt.top === undefined)? null: opt.top,
				z = opt.z || undefined,
				deltaX = opt.deltaX || 0,
				deltaY = opt.deltaY || 0,

				left = null,
				top = null;

            let c = this.getXY(opt.e);

			if(typeof xx === "string"){
				switch(xx){
					case "center":
						left = c.sL +(c.cW - c.width) /2;
						break;
					case "left":
						left = c.sL;
						break;
					case "right":
						left = c.sL + c.cW - c.width;
						break;
					case "acenter":
						left = (c.cW - c.width) /2;
						break;
				}
			}else{
				left = xx;
			}

			if(typeof yy === "string"){
				switch(yy){
					case "middle":
						top = c.sT + (c.cH - c.height) /2;
						break;
					case "top":
						top = c.sT;
						break;
					case "bottom":
						top = c.sT + c.cH - c.height;
						break;
					case "amiddle":
						top = (c.cH - c.height) /2;
						break;
				}
			}else{
				top = yy;
			}
            if(left !== null){
                left = left + (deltaX || 0)
            }
            if(top !== null){
                top = top + (deltaY || 0)
            }
			return this.showElem({e: e, left: left ,top: top,z: z});

		}

		static showMenu(opt){

			let
				e = opt.e,
				context = opt.context,
				xx = opt.left || "",
				yy = opt.top || "",
				deltaX = opt.deltaX || 0,
				deltaY = opt.deltaY || 0,
				z = (opt.z !== undefined)? opt.z: undefined,


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

			switch(xx){
				case "center":
					left = c.left + c.width /2 - width /2;
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

			switch(yy){
				case "middle":
					top = c.top + c.height /2 - height /2;
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

			if(!fixed){
				top = top + sT;
				left = left + sL;
			}

			left = left + deltaX;
			top = top + deltaY;

			if ((left + width) > (cW + sL)){
				left = cW + sL - width;
            }

            if (left < sL){
				left = sL;
			}

			if ((top + height) > (cH + sT)){
				top = cH + sT - height;
			}

			if (top < sT && !fixed){
				top = sT;
            }

			return this.showElem({e: e, left: left, top: top, z: z});
		}

		static dropDown(opt){

			let
				e = opt.e,
				context = opt.context,
				xx = opt.left || "",
				yy = opt.top || "",
				deltaX = opt.deltaX || 0,
				deltaY = opt.deltaY || 0,
				z = (opt.z !== undefined)? opt.z: undefined,

				left:any = null,
				top:any = null,
				c = this.getXY(context),

				width = e.offsetWidth,
				height = e.offsetHeight,
				cW = c.cW,
				cH = c.cH,
				sL = c.sL,
				sT = c.sT;

			switch(xx){
				case "center":
					left = c.left + c.width /2;
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

			switch(yy){
				case "middle":
					top = c.top + c.height /2;
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

			if ((left + width) > (cW + sL)){
				left = cW + sL - width;
			}
			if (left < sL){
				left = sL;
			}
			if ((top + height) > (cH + sT)){
				//top = cH + sT - height;
			}
			if (top < sT){

				top = sT;
			}

			if ((c.top + c.height + height) > (cH + sT)){
				top = c.top - height;
			}

			return this.showElem({e: e, left: left, top: top, z: z});

		}

		static center(e){
			e.style.position = "fixed";
			e.style.top = "50%";
			e.style.left = "50%";
			e.style.transform = "translate(-50%, -50%)";

        }

        static floatCenter(e){
            let
            cW = document.documentElement.clientWidth,
            cH = document.documentElement.clientHeight
            let rect = e.getBoundingClientRect();
			e.style.position = "fixed";
			e.style.top = "50%";
			e.style.left = "50%";
			e.style.transform = "translate(-50%, -50%)";

		}

		static move(e, left, top){
			//e.style.position = "fixed";
			e.style.left = left;
			e.style.top = top;
		}

		static float(opt){


			let
				e = opt.e,
				left = opt.left,
				top = opt.top;

			let tx:any = null, ty:any = null;


			switch(left){
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

			switch(top){
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

			e.style.transform = "translate("+tx+","+ty+")";

		}

		static max(e:any){
			e.style.position = "fixed";
			e.style.top = "0%";
			e.style.left = "0%";
			e.style.width = "100%";
			e.style.height = "100%";
			e.style.border = "3px solid green";
			//e.style.transform = "translate(-50%, -50%)";

		}

	}

	class Drag {

		static iniX = 0;
        static iniY = 0;

        static capture = null;
        static release = null;

		static init(opt_x) {

			let opt = {
				main: null,
				onstart: () => {},
				oncapture: (clientX, clientY, iniX, iniY, offsetLeft, offsetTop) => {},
				onrelease: (clientX, clientY, iniX, iniY, offsetLeft, offsetTop) => {}
			};

			for(let x in opt_x){
				opt[x] = opt_x[x];
			}

			let e:HTMLElement = opt.main;

			e.onmousedown = (event) => {

				this.iniX = event.clientX;
				this.iniY = event.clientY;
				let offsetLeft = e.offsetLeft;
				let offsetTop = e.offsetTop;

				opt.onstart();

				if(this.capture){
					off(document, "mousemove", this.capture);
				}

				if(this.release){
					off(document, "mouseup", this.release);
				}

				on(document, "mousemove", this.capture = (event) => {
					opt.oncapture(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
				});

				on(document, "mouseup", this.release = (event) => {
					event.preventDefault();
					off(document, "mousemove", this.capture);
					off(document, "mouseup", this.release);
					opt.onrelease(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
				});


			};
			e.ontouchstart = (event:any) => {
				//event.preventDefault();
				event = event.changedTouches[0];

				event = event || window.event;
				this.iniX = event.clientX;
				this.iniY = event.clientY;
				let offsetLeft = e.offsetLeft;
				let offsetTop = e.offsetTop;

				opt.onstart();

				if(this.capture){
					off(document, "touchmove", this.capture);
				}

				if(this.release){
					off(document, "touchend", this.release);
				}

				on(document, "touchmove", this.capture = (event) => {
					event.preventDefault();
					event = event.changedTouches[0];
					event = event || window.event;
					opt.oncapture(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
				});

				on(document, "touchend", this.release = (event) => {
					event = event.changedTouches[0];
					off(document, "touchmove", this.capture);
					off(document, "touchend", this.release);
					opt.onrelease(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
				});

			};
		}

	}

    class Move{
        static main = null;
        static info = null;

        static sX = null;
        static sY = null;

        static posX = null;
        static posY = null;

        static init(info){
            Drag.init({
                main: info.hand,
                onstart: this.start(info.main, info),
                oncapture: this.capture,
                onrelease: this.release
            });

        }
        static start(main, info){

            return function(){
                this.main = main;
                this.info = info;
                this.sX = main.offsetLeft;
                this.sY = main.offsetTop;
                if(this.info.onstart){
                    this.info.onstart({left: this.sX, top: this.sY});
                }
            };
        }

        static restart(){
            this.sX = this.main.offsetLeft;
            this.sY = this.main.offsetTop;
        }

        static capture(left, top, iniX, iniY){

            this.posX = this.sX + (left - iniX);
            this.posY = this.sY + (top - iniY);

            if(this.posX <= 0){
                this.posX = 0;
            }

            if(this.posY <= 0){
                this.posY = 0;
            }

            this.main.style.left = this.posX + "px";
            this.main.style.top = this.posY + "px";

            if(this.info.onmove && this.info.onmove(this.posX, this.posY, left, top)){
                this.sX = this.main.offsetLeft;
            this.sY = this.main.offsetTop;
                //this.restart();
            }

        }

        static release(left, top, iniX, iniY){

            let info = Float.getXY(this.main);

            if(info.left > info.cW - 80 || info.top > info.cH - 20){

                left = (info.left > info.cW - 80)?info.cW - 80: info.left;
                top = (info.top > info.cH - 20)?info.cH - 20: info.top;

                Float.move(this.main, left + "px", top + "px");
            }

            if(this.info.onrelease){
                this.info.onrelease(this.posX, this.posY, left, top, iniX, iniY);
            }
        }

	};

    class Resize{

        static init(opt){

            this.setHolders(opt.main, opt);
        }

        static start(main, info, mode){

            return function() {

                this.main = main;
                this.info = info;
                this.xA = main.offsetWidth;
                this.yA = main.offsetHeight;

                this.mode = mode;

                this.cW = document.documentElement.clientWidth;
                this.cH = document.documentElement.clientHeight;

                let _info = Float.getXY(main);

                this.width = _info.width;

                let st = window.getComputedStyle(main, null);

                let minWidth = parseFloat(st.minWidth) || 0;
                let minHeight = parseFloat(st.minHeight) || 0;

                this.sX = _info.left;
                this.sY = _info.top;

                this.maxLeft = _info.left + main.clientWidth - minWidth;
                this.maxTop = _info.top + main.clientHeight - minHeight;

                this.maxWidth = info.maxWidth || 500;
                this.minWidth = info.minWidth || (_info.width - main.clientWidth + minWidth);
                this.maxHeight = info.maxHeight || 500;
                this.minHeight = info.minHeight || (_info.height - main.clientHeight + minHeight);

                if(this.info.onstart){
                    this.info.onstart({left: info.left, top: info.top, width: this.xA, height: this.yA});
                }

            };
        }

        static capture(_left, _top, iniX, iniY, offsetLeft, offsetTop){

            if(_left < 0){
                _left = 0;
            }else if(_left > this.cW){
                _left = this.cW;
            }

            if(_top < 0){
                _top = 0;
            }else if(_top > this.cH){
                _top = this.cH;
            }

            let dx = (_left - iniX),
                dy = (_top - iniY),
                W = null,
                H = null,
                top = null,
                left = null;

            switch(this.mode){
                case "t":
                    top = this.sY + dy;
                    H = this.yA - dy;
                    break;
                case "l":
                    left = this.sX + dx;
                    W = this.xA - dx;
                    break;
                case "r":
                    W = this.xA + _left - iniX;
                    break;
                case "b":
                    H = this.yA + _top - iniY;
                    break;
                case "lt":
                    left = this.sX + dx;
                    top = this.sY + dy;
                    W = this.xA - dx;
                    H = this.yA - dy;
                    break;
                case "rt":
                    top = this.sY + dy;
                    W = this.xA + _left - iniX;
                    H = this.yA - dy;
                    break;
                case "lb":
                    left = this.sX + dx;
                    W = this.xA - dx;
                    H = this.yA + _top - iniY;
                    break;
                case "rb":
                    W = this.xA + _left - iniX;
                    H = this.yA + _top - iniY;
                    break;
            }

            if(W !== null){
                if(W<this.minWidth){
                    W = this.minWidth;
                }
                this.main.style.width = W + "px";
            }
            if(H !== null){
                if(H < this.minHeight){
                    H = this.minHeight;
                }
                this.main.style.height = H + "px";
            }
            if(left !== null){
                if(left>this.maxLeft){
                    left = this.maxLeft;
                }
                this.main.style.left = left + "px";
            }
            if(top !== null){
                if(top > this.maxTop){
                    top = this.maxTop;
                }
                this.main.style.top = top + "px";
            }

            if(this.info.onresize){
                this.info.onresize(this.xA + left - iniX, this.yA + top - iniY, this.mode);
            }

        }

        static release (left, top, iniX, iniY){
            var info = Float.getXY(this.main);

            if(info.left > info.cW - 80 || info.top > info.cH - 20){

                left = (info.left > info.cW - 80)? info.cW - 80: info.left;
                top = (info.top > info.cH - 20)? info.cH - 20: info.top;

                Float.move(this.main, left + "px", top + "px");
            }

            if(this.info.onrelease){
                this.info.onrelease(left, top, iniX, iniY);
            }

        }

        static setHolders(main, opt){
            let rs = ["t","r","b","l","lt","rt","rb","lb"];

            let left = ["0","100%","0","0","0","100%","100%","0"];
            let top = ["0","0","100%","0","0","0%","100%","100%"];
            let width = ["100%","","100%","","10px","10px","10px","10px"];
            let height = ["","100%","","100%","10px","10px","10px","10px"];
            let margin = ["-2px","-2px","-2px","-2px","-5px","-5px","-5px","-5px"];
            //let margin = ["-20px","-20px","-20px","-20px","-20px","-20px","-20px","-20px"];
            let bg = ["","","","","","","blue",""];
            //let bg = ["yellow","red","purple","green","brown","purple","blue","#ea1234"];
            let cursor = "s-resize,e-resize,n-resize,w-resize,nwse-resize,sw-resize,nwse-resize,ne-resize".split(",");
            let lt, k=[];

            for(let i in rs){
                k[i] = lt = document.createElement("div");
                lt.style.cssText = "position:absolute;min-height:3px;min-width:3px;z-index:10";

                lt.className = "rs "+rs[i];

                lt.style.backgroundColor = bg[i];

                lt.style.width = width[i];
                lt.style.height = height[i];

                lt.style.left = left[i];
                lt.style.top = top[i];
                lt.style.cursor = cursor[i];
                lt.style.margin = margin[i];

                Drag.init({
                    main:k[i],
                    context:main,
                    onstart: this.start(main, opt, rs[i]),
                    oncapture: this.capture,
                    onrelease: this.release
                });



                main.appendChild(lt);
            }


        };
    }


    $(window).on("load_", function(){
        //let div = $().create("div").addClass("drag2");
        let div2 = $().create("div").addClass("drag4");

        //Float.init(div.get());
        //Float.show({e:div.get(), left:"center",top:"top"});
        //Move.init({main:div.get(),hand:div.get()});

        Float.init(div2.get());


        Resize.init({main:div2.get()});
        Float.show({e:div2.get(), left:"center",top:"middle"});
        //$().create("div").addClass("drag3");
        //Move.init({main:div2.get(),hand:div2.get()});
        $().create("div").addClass("drag5");
        let main5 = $().create("div").addClass("drag6");

        Float.init({main:main5.get()});
        Float.getXY(main5.get());

        let e7 = $().create("div").addClass("drag7");
        Move.init({main:e7.get(),hand:e7.get()});
    });

    $(window).on("load_", function(){

        let div = $().create("div").addClass("drag");

        let a = div.create("div").addClass("a").text("a");
        let b = div.create("div").addClass("b").text("b");

        let c = div.create("div").addClass("c").text("c");
        let d = div.create("div").addClass("d").text("d");
        let e = div.create("div").addClass("e").text("e");


        a.on("click",(e)=>{
            let rect = a.get().getBoundingClientRect();
           // db (a.get())
            //a.get().style.flex = "0 0 "+(a.get().offsetWidth-5)+"px";
            db (a.get().offsetWidth)
            let _a = (a.get().offsetWidth+5)+"px";
            let _b = (b.get().offsetWidth-5)+"px";

            div.get().style.gridTemplateColumns = `${_a} ${_b} auto`;
        });
        b.on("click",(e)=>{
            let rect = a.get().getBoundingClientRect();
            let _a = (a.get().offsetWidth-5)+"px";
            let _b = (b.get().offsetWidth+5)+"px";
            div.get().style.gridTemplateColumns = `${_a} ${_b} auto`;
        });
        d.on("click",(e)=>{
            let rect = a.get().getBoundingClientRect();
            let _a = (a.get().offsetHeight+1)+"px";
            let _b = (d.get().offsetHeight-1)+"px";
            div.get().style.gridTemplateRows = `${_a} auto`;
        });
        e.on("click",(e)=>{
            let xx= document.defaultView.getComputedStyle(div.get());

            db (xx.gridTemplateRows)
            let rect = a.get().getBoundingClientRect();
            let _a = (a.get().offsetHeight-1)+"px";
            let _b = (d.get().offsetHeight+1)+"px";
            div.get().style.gridTemplateRows = `${_a} auto`;
        });


    db (document.defaultView.getComputedStyle(div.get()).gridTemplateColumns);
    });

    return {Float: Float, Resize: Resize, Move: Move, Window: null, Popup: null, Message: null};
})(_sgQuery);


Float.Window = (($) => {


    var _last = false;

	var setActive = function(w){
		if(_last){
			_last.setActive(false);
			_last.active = false;
			_last._main.removeClass("active");

		}
		w.setActive(true);
		_last = w;
	}

    class Window{
        name:string = "";
        id:any = null;
        caption:string = "";
        className:any = "sevian";
        iconClass:string = "";
        visible:boolean = false;
        mode:string = "custom";

        buttons:string[] = ["min","auto","max","close"];

        resizable:boolean = true;
        draggable:boolean = true;
        closable:boolean = true;

        autoClose:boolean = false;

        delay:number = 3000;
        width:string = null;
        height:string = null;

        left:any = null;
        top:any = null;

        child:object = null;
        _main:object = null;
        _active:boolean = false;
        active:boolean = null;
        _timer:number = null;

        private deltaX:number = 0;
        private deltaY:number = 0;
        public onshow:Function = (info)=>{};
        public onhide:Function = (info)=>{};

        constructor(info: any){

            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;

            if(main){

                if(main.ds("sgWin")){
                    return;
                }

                if(main.hasClass("sg-win")){
                    this._load(main);
                }else{

                    this._create(main);
                }

            }else{

                main = $("").create("div");
                this._create(main);

            }
            if(this.closable){
                $(main.query(".win-btn.close")).on("click", () => this.setVisible(false));
            }
            main.on("mousedown", () => setActive(this));

            Float.Float.init(main.get());

            Float.Float.show({
                e: main.get(),
                left: this.left,
                top: this.top,
                deltaX: this.deltaX
            });

            if(this.draggable){

                Float.Move.init({
                    main:main.get(),
                    hand:main.query(".caption"),
                    onstart:() => main.addClass("moving"),
                    onrelease:() => main.removeClass("moving"),
                    onmove:(posX, posY, eX, eY) => {
                        if(this.mode === "max") {
                            let w = main.get().offsetWidth;
                            this.setMode("auto");
                            let w2 = main.get().offsetWidth;
                            main.get().style.left = (eX - (w2 * (eX - posX) /w)) + "px";
                            return true;
                        }
                    }
                });
            }

            if(this.resizable){
                Float.Resize.init({
                    main:main.get(),
                    onstart: ()=> main.addClass("resizing"),
                    onrelease: ()=> main.removeClass("resizing"),
                    onresize:(x, y, mode) => {

                        if(mode == "l" || mode == "r" || mode == "lt" || mode == "lb" || mode == "rt" || mode == "rb"){
                            this._main.removeClass("w-auto");
                        }
                        if(mode == "b" || mode == "t" || mode == "lt" || mode == "lb" || mode == "rt" || mode == "rb"){
                            this._main.removeClass("h-auto");
                        }
                        this.setMode("custom");
                    }
                });

                $(main.query(".win-btn.min")).on("click", () => this.setMode("min"));
                $(main.query(".win-btn.auto")).on("click", () => this.setMode("auto"));
                $(main.query(".win-btn.max")).on("click", () => this.setMode("max"));

                $(main.query(".rs.b")).on("dblclick", () => {this.setMode("custom");this._main.addClass("h-auto");});
                $(main.query(".rs.r")).on("dblclick", () => {this.setMode("custom");this._main.addClass("w-auto");});


                $(main.query(".caption")).on("dblclick", () => {
                    if(this.mode === "max"){
                        this.setMode("auto");
                    }else{
                        this.setMode("max");
                    }
                });
            }

            if(this.autoClose){

                $().on("click", () => {

                    if(this._active === true || this._active === null){
                        if(this._active === null){
                            this._active = false;
                        }
                        return;
                    }

                    this.setVisible(false);
                });

                main.on("mouseover", (event) => {
                    this._active = true;
                    this.resetTimer();
                });

                main.on("mouseout", (event) => {
                    this._active = false;
                    this.setTimer();
                });
            }

            this.setSize(this.width, this.height);

            this.setMode(this.mode);

            if(this.visible){

                this.show({
                    left:this.left,
                    top:this.top,
                    deltaX: this.deltaX,
                    deltaY: this.deltaY,
                });
                this._active = false;
            }

        }
        _load(main:any){


        }
        _create(main:any){

            this._main = main.addClass(["sgWin", "hidden"]);
            if(this.className){
				main.addClass(this.className);
			}

            let caption = main.create("div").addClass("caption");
            caption.create("span").addClass("icon").addClass(this.iconClass || "");
            caption.create("span").addClass(["text"]).text(this.caption);

            if(this.resizable){
                caption.create("span").addClass(["win-btn", "min"]).text("");
                caption.create("span").addClass(["win-btn", "auto"]).text("");
                caption.create("span").addClass(["win-btn", "max"]).text("");
            }
            if(this.closable){
                caption.create("span").addClass(["win-btn", "close"]).text("");
            }
            let body = main.create("div").addClass("body");
            if(this.child){
                let child = $(this.child);
                body.append(child);
            }

        }
        get(){
            return this._main.get();
        }
        getMain(){
            return this._main;
        }
        setBody(e){
            $(this._main.query(".body")).append(e);
        }

        getBody(){

            return $(this._main.query(".body"));
        }
        setCaption(text:string){
            let caption = this._main.query(".caption > .text");
            caption.innerHTML = text;
        }

        getCaption(){
            return $(this._main.query(".caption > .text"));
        }
        setMode(mode:string){

			this._main.ds("sgMode", mode);
			this._main.removeClass(this.mode);
            this._main.addClass(mode);
            this.mode = mode;

        }

        setVisible(value){

            this._active = null;
            this.visible = value;
            if(value){

                this._main.removeClass("hidden");
                this._main.addClass("visible");
                this.setTimer();
                this.onshow({});

            }else{
                this._main.removeClass("visible");
                this._main.addClass("hidden");
                this.resetTimer();
                this.onhide({});
            }
        }
        getVisible(){
            return this.visible;
        }

        setActive(value){
            this.active = value;
            if(value){
                this._main.addClass("active");
            }else{
                this._main.removeClass("active");
            }
        }
        show(info = null){
            if(info !== null){
                info.e = this._main.get();

                if(info.context){
                    Float.Float.showMenu(info);
                }else{
                    Float.Float.show(info);
                }
            }

            Float.Float.setIndex(this._main.get());
            this.setVisible(true);
            setActive(this);

        }
        hide(){
            if(!this.visible){
                return false;
            }
            this.setVisible(false);
        }

        setSize(width=null, height=null){

            if(width !== null || height !==null){
                this.setMode("custom");
            }

            if(width !== null){
                this._main.get().style.width = width;
                //this.getBody().get().style.width = "auto";
            }
            if(height !== null){
                this._main.get().style.height = height;
			    //this.getBody().get().style.height = "auto";
            }

        }

        resetTimer(){
			if(this._timer){
				clearTimeout(this._timer);
			}
		}

		setTimer(){
			if(this.autoClose && this.delay > 0){
				this.resetTimer();
				this._timer = setTimeout(() => this.setVisible(false), this.delay);
			}
		}

    }

    return Window;
})(_sgQuery);


Float.Popup = (($) => {






    class Popup{

        id:any = null;
        target:any = null;
        className:any = null;
        draggable:boolean = null;
        autoClose:boolean = true;
		modeTip:boolean = true;
        delay:number = 3000;
        visible:boolean = false;


        width:any = "400px";
		height:any = "400px";

        child:any = null;

        left:any = "";
        top:any = "";

        _main:any = null;
        _active:boolean = false;
		_timer:number = null;

        constructor(info){
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;
            if(main){

                if(main.ds("sgPopup")){
                    return;
                }

                if(main.hasClass("sg-popup")){
                    this._load(main);
                }else{

                    this._create(main);
                }

            }else{

                main = $("").create("div");
                this._create(main);

            }


            if(this.autoClose){

                $().on("mousedown", (event) => {

                    if(this.modeTip){
                        this.hide();
                        return;
                    }

                    if(this._active === true || this._active === null){
                        if(this._active === null){
                            this._active = false;
                        }
                        return;
                    }
                    this.hide();
                });

                main.on("mouseover", (event) => {
                    this._active = true;
                    this.resetTimer();
                });

                main.on("mouseout", (event) => {
                    this._active = false;
                    this.setTimer();
                });

            }
            this._main = main;
            if(this.visible){
                this.show();
            }else{
                this.setVisible(false);
            }
        }

        _create(main){
            main.addClass("sg-popup").addClass(this.className);

            if(this.child){
                main.append(this.child);
            }

            Float.Float.init(main.get());
        }
        _load(main){

        }

        getMain(){
            return this._main;
        }
        setBody(e){
            this._main.append(e);
        }

        getBody(){

        }

        setVisible(value){
            this._active = null;
            this.visible = value;
            if(value){

                this._main.removeClass("hidden");
                this._main.addClass("visible");
                this.setTimer();

            }else{
                this._main.removeClass("visible");
                this._main.addClass("hidden");
                this.resetTimer();
            }
        }

        show(info = null){


            if(info !== null){


                info.e = this._main.get();

                info.left = info.left || this.left;
                info.top = info.top || this.top;

                if(info.context){
                    Float.Float.showMenu(info);
                }else{
                    Float.Float.show(info);
                }


            }

            Float.Float.setIndex(this._main.get());
            this.setVisible(true);


        }

        hide(){
            if(!this.visible){
                return false;
            }
            this.setVisible(false);
        }

        resetTimer(){
            if(this._timer){
				clearTimeout(this._timer);
			}
        }

        setTimer(){
            if(this.autoClose && this.delay > 0){
				this.resetTimer();
				this._timer = setTimeout(() => this.setVisible(false), this.delay);
			}
        }

        setMenu(e, info){
            $(e).on("click", (event) =>{
                event.preventDefault();
                event.returnValue = false;
                event.cancelBubble = true;
                this.show(info);
            });
        }
    }

    class Message extends Popup{
        caption:string = null;
        text:any = null;
        constructor(info){

            super(info);

            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            this.setCaption(this.caption);
            this.setText(this.text);
        }

        _create(main:any){
            //Popup._create(main);
            main.addClass("sg-message-box").addClass(this.className);

            if(this.child){
                main.append(this.child);
            }

            Float.Float.init(main.get());
            main.create("div").addClass("caption");
            main.create("div").addClass("text");

        }

        setCaption(caption:any){
            this.caption  = caption;
            let elem = this._main.query(".caption");
            if(elem){
                $(elem).text(caption);
            }
        }
        setText(text:any){
            this.text  = text;
            let elem = this._main.query(".text");
            if(elem){
                $(elem).text(text);
            }
        }
    }
    Float.Message = Message;
    $(window).on("load_", ()=>{
        let div = $("").create("div").addClass("popup").text("Help?");

        let popup = new Float.Popup({child:div});


        let div2 = $("#form_p4").create("input").attr("type","button").val("Help?");

        popup.setMenu(div2.get(), {context:$.query(".drag4"), left:"right", top:"middle"} );

        return;



    });
    return Popup;

})(_sgQuery);
