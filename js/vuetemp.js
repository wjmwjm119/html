let FLEXPAGEFADEINHOLDER;

Vue.component('flexpage', {
    props: ["id", "absolute", "show", "center", "mid", "notouchblock", "vrmousehidden"],
    data: function ()
    {
        name=this.id;

        visible = 'visible';
        pos = this.absolute != undefined ? 'absolute' : 'relative';
        s = this.show != undefined ? true : false;
        fadestate=s?"fadeinend":"fadeoutend";
        touch = this.notouchblock != undefined ? 'none' : 'auto';

        m = this.mid != undefined ? 'center' : '';

        l = 0;
        r = 0;
        t = 0;
        b = 0;
        flexd = undefined;
        dis = this.vrmousehidden != undefined ? 'none' : 'flex';
        c = this.center != undefined ? 'center' : '';
        return { dis, visible, pos, s, touch, l, r, t, b, flexd, c, m ,fadestate,name};
    },
    template: XR.vrMouseUI ?
        "<transition name='fade' appear  v-on:enter='OnFadeInEnter' v-on:after-enter='OnFadeInEnd' v-on:leave='OnFadeOutEnter' v-on:after-leave='OnFadeOutEnd'><div v-if=s v-bind:id=this.id v-bind:style=\"{visibility:visible,pointerEvents:touch,display:dis,flexDirection:'column',position:'relative'}\"><slot></slot></div></transition>"
        :
        "<transition name='fade' appear  v-on:enter='OnFadeInEnter' v-on:after-enter='OnFadeInEnd' v-on:leave='OnFadeOutEnter' v-on:after-leave='OnFadeOutEnd'><div v-if=s v-bind:id=this.id v-bind:style=\"{visibility:visible,pointerEvents:touch,display:'flex',flexDirection:flexd,position:pos,left:l,right:r,top:t,bottom:b,alignItems:c,justifyContent:c,alignItems:m}\"><slot></slot></div></transition>",
    methods: {
        SetVisible(isVisible)
        {
            this.visible = isVisible;
        },
        FadeIn(callback)
        {
            console.log(this.name+" last state:"+this.fadestate+" FadeIn()");

            //如果当前状态是fadeoutstart,这种状况发生再刚开始FadeOut又立即FadeIn.这时需要添加一个小的延迟来实现这种效果
            /*
            if(this.fadestate=="fadeoutstart")
            {
                FLEXPAGEFADEINHOLDER=this;
                setTimeout(() => { FLEXPAGEFADEINHOLDER.FadeIn() }, 100);
                return;
            }
            */
           if(this.fadestate=="fadeoutstart")
           {
            if(callback)
            callback();
           }

           if(this.fadestate!="fadeinend")
           {
            this.fadestate="fadeinstart";
            this.s = true;
           }

        },
        OnFadeInEnter()
        {
            this.fadestate="fadeinenter";
            if(this.$root.OnFadeInEnter)
            this.$root.OnFadeInEnter();   
        },
        OnFadeInEnd()
        {
            console.log(this.name+" last state:"+this.fadestate+" OnFadeInEnd()");
            this.fadestate="fadeinend";
            if(this.$root.OnFadeInEnd)
            this.$root.OnFadeInEnd();    
        },
        FadeOut()
        {
            console.log(this.name+" last state:"+this.fadestate+" FadeOut()");

            if(this.fadestate!="fadeoutend")
            {
                this.fadestate="fadeoutstart";
                this.s = false;
            }
        },
        OnFadeOutEnter()
        {
            this.fadestate="fadeoutenter";
            if(this.$root.OnFadeOutEnter)
            this.$root.OnFadeOutEnter();   
        },
        OnFadeOutEnd()
        {
            console.log(this.name+" last state:"+this.fadestate+" OnFadeOutEnd()");
            this.fadestate="fadeoutend";
            if(this.$root.OnFadeOutEnd)
            this.$root.OnFadeOutEnd();        
        }
    }
})

Vue.component('rectbox', {
    props: ["id", "width", "height", "left", "right", "top", "bottom", "center", "mid", "absolute", "notouchblock", "show", "vrmousehidden", "opacity"],
    data: function ()
    {
        trans = '';
        pos = this.absolute != undefined ? 'absolute' : 'relative';
        l = this.left + 'px';
        r = this.right + 'px';
        t = this.top + 'px';
        b = this.bottom + 'px';
        w = this.width + 'px';
        h = this.height + 'px';
        c = this.center != undefined ? 'center' : '';
        m = this.mid != undefined ? 'center' : '';
        touch = this.notouchblock != undefined ? 'none' : 'auto';
        //bug,待检验 this.opacity != undefined 为true
        op = this.opacity;
        dis = this.vrmousehidden != undefined ? 'none' : 'flex';

        if (XR.vrMouseUI)
        {
            pos = 'relative';
            l = undefined;
            r = undefined;
            t = undefined;
            b = undefined;
            w = undefined;
            h = undefined;
            c = undefined;
            touch = 'none';
        }
        //console.log("88888====", typeof(this.opacity));
        return { dis, sh: this.show != undefined ? true : false, touch, pos, l, r, t, b, w, h, c, m, aniName: '', aniTime: 1, aniDir: 1, op, trans }
    },
    template: XR.vrMouseUI ?
        "<div ref='rectbox' v-bind:id=this.id v-bind:style=\"{margin:'0.0%',width:'100%',minHeight:0,minWidth:0,justifyContent:c,pointerEvents:touch,position:pos,display:dis}\"><slot></slot></div>"
        :
        "<div ref='rectbox' v-bind:id=this.id v-bind:style=\"{transform:trans,minHeight:0,minWidth:0,opacity:op,justifyContent:c,alignItems:m,pointerEvents:touch,animationName:aniName,animationDuration:aniTime+'s',animationDirection:aniDir,animationTimingFunction:'ease-in-out',animationFillMode:'both',left:l,right:r,top:t,bottom:b,position:pos,display:'flex',width: w, height: h}\"><slot></slot></div>",
    beforeDestroy: function ()
    {
        //console.log("beforeDestroy");
        //清空绑定事件
        this.$el.removeEventListener("animationend", this.OnPlayAniEnd);
    },
    methods:
    {
        //浏览器不支持动态添加到头部的opacity
        //所以先用fadein 和 fadeout keyframe 解决透明度问题用forward 来控制
        PlayAni(forward, aniFrom, aniTo, aniTime = 0.5, aniDir = 1, onEndFun)
        {
            if (!this.id)
            {
                console.log("动画需要设置 rectbox id");
                return;
            }

            if (!this.anikeyframes)
            {
                var anikeyframes = document.getElementById("ani_" + this.id);
                if (anikeyframes)
                {
                    this.anikeyframes = anikeyframes;
                } else
                {
                    this.anikeyframes = document.createElement("style");
                    this.anikeyframes.id = "ani_" + this.id;
                }

                this.$el.addEventListener("animationend", this.OnPlayAniEnd);
                document.head.appendChild(this.anikeyframes);
            }
            var aniName = this.anikeyframes.id + "_" + forward;

            if (this.aniName === aniName)
                return;

            this.aniName = aniName;

            if (aniFrom === "")
                aniFrom = this.lastAniTo;

            this.anikeyframes.innerHTML = "@keyframes " + this.aniName + " { from { " + aniFrom + " } to { " + aniTo + " }\n";

            this.aniTime = aniTime;
            this.aniDir = aniDir === 1 ? "normal" : "reverse";
            this.onEndFun = onEndFun;
            this.lastAniTo = aniTo;
            this.isplaying = true;
        },
        //会触发两次，不知道什么原因，先手动处理；
        OnPlayAniEnd()
        {
            if (this.isplaying)
            {
                this.isplaying = false;

                //清空当前动画状态
                //this.aniName='nullani';
                //this.aniTime=0;
                console.log(this.aniName + " OnPlayAniEnd");
                if (this.onEndFun)
                    this.onEndFun();
            }
        },
        Clear()
        {

        }
    }
})


//norelease 在按钮组状态下不能自身弹起
Vue.component('sbtn', {
    props: ["id", "left", "right", "top", "bottom", "center", "absolute", "state", "imgon", "imgoff", "trueevent", "falseevent", "inbtngroup", "norelease", "index", "fontsize", "fontcolor", "fonttrans", "argjson", "vrmouselabel", "label", "disable", "hidden", "fontminwidth", "margin", "bgon", "bgoff"],
    data: function ()
    {
        img1 = this.imgon;
        img2 = this.imgoff != undefined ? this.imgoff : this.imgon;
        btnstate = this.state === "true" ? true : false;
        img = btnstate ? img1 : img2;
        ingroup = this.inbtngroup != undefined ? true : false;
        event1 = this.trueevent;
        event2 = this.falseevent;
        nrelease = this.norelease != undefined ? true : false;

        arg = this.argjson != undefined ? this.argjson : {};

        fs = this.fontsize != undefined ? this.fontsize : '3';
        fc = this.fontcolor != undefined ? this.fontcolor : "rgb(0,0,0)";
        orginfc = fc;
        ftrans = this.fonttrans != "" ? this.fonttrans : "scale(1)";
        //ftrans=this.fonttrans

        pos = this.absolute != undefined ? 'absolute' : 'relative';
        l = this.left + 'px';
        r = this.right + 'px';
        t = this.top + 'px';
        b = this.bottom + 'px';
        bc = undefined;
        vlable = undefined;

        infoLabel = this.label != undefined ? this.label : "";

        disablestate = this.disable != undefined ? true : false;

        touch = 'auto';
        dis = 'none';
        lab = this.lable;

        if (XR.vrMouseUI)
        {
            fs = '1.5';
            fc = 'rgb(255,255,255)';
            pos = 'relative';
            l = undefined;
            r = undefined;
            t = undefined;
            b = undefined;
            bc = 'yellow';
            img = undefined;

            vlable = this.vrmouselabel;
            if (vlable)
                dis = 'flex';
            //				console.log(vlable);
            touch = 'auto';
        }

        filterstr = '';
        //如果没有设置图片就使用文字大小
        pos2 = this.imgon != undefined ? 'absolute' : 'relative';

        bg1 = this.bgon != undefined ? this.bgon : "image/null.png";
        bg2 = this.bgoff != undefined ? this.bgoff : "image/null.png";
        bg = 'url(' + bg2 + ')';

        btndisplaystate = this.hidden != undefined ? "none" : "flex";
        return { btndisplaystate, orginfc, dis, arg, event1, event2, ingroup, btnstate, touch, img, img1, img2, bg, bg1, bg2, fs, fc, ftrans, pos, pos2, l, r, t, b, bc, vlable, infoLabel, disablestate, filterstr, nrelease }

    },

    template: XR.vrMouseUI ?
        "<q-btn  unelevated color='primary' @click='Click' :id=this.id :tabindex=this.index  :style=\"{margin:'2px 0px',minHeight:0,padding:'4px 8px',display:dis,position:pos,pointerEvents:touch}\"><div :style=\"{ pointerEvents:touch, fontSize:fs+'rem',color:fc}\">{{vlable}}<slot></slot></div></q-btn>"
        :
        "<div @click.stop :style=\"{left:l,right:r,top:t,bottom:b,display:btndisplaystate,position:pos}\" ><img :src=this.img :style=\"{filter:filterstr,position:'relative',display:'flex',padding:0,minHeight:0,backgroundColor:bc,pointerEvents:touch,objectFit:'contain',margin:margin}\"></img><div :style=\"{backgroundImage:bg,display:'flex',position:pos2,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',width:'100%',height:'100%',padding:0,minHeight:0,minWidth:fontminwidth}\" ><div :style=\"{ fontSize:fs+'rem',color:fc,transform:ftrans}\"><slot>{{infoLabel}}</slot></div><q-btn :ripple='false' :disable=disablestate @click='Click' :id=this.id :tabindex=this.index unelevated flat  style='color:#55A;display:flex;position:absolute;width:100%;height:100%;padding:0;minHeight:0'></q-btn></div></div>",

    mounted: function ()
    {
        
        if (this.disablestate)
        {
            this.SetEnable(!this.disablestate);
        }
    },
    methods: {
        Click()
        {
            if (!ISREMOTEBUTTONEVENT && runModeType && runModeType == "remoteCtrlMode")
            {
                XR.SendRemoteButtonEvent(this.id, this.btnstate);
            }
            this.ClickDown();
            //clicktopage 会一级一级往父级传递找到匹配的函数
            //this.$emit("clicktopage", this);
        },
        ClickDown()
        {
            btnAudioPlayer_G.Play();
            if (!this.ingroup)
            {
                this.btnstate = !this.btnstate;
                this.SetButtonState(this.btnstate);
            }
            else
            {
                if (!this.nrelease)
                {
                    this.btnstate = !this.btnstate;
                    this.$emit("toggle", this);
                }
                else if (!this.btnstate)
                {
                    this.btnstate = !this.btnstate;
                    this.$emit("toggle", this);
                }

            }
        },
        SetButtonState(inState, inSendMessage = true)
        {
            this.btnstate = inState;

            if (!XR.vrMouseUI)
            {
                this.img = this.btnstate ? this.img1 : this.img2;
                this.bg = this.btnstate ? this.bg1 : this.bg2;
                this.bg = 'url(' + this.bg + ')';
            }

            if (inSendMessage)
            {
                ProcessButtonMessage(this);

                this.$emit("clicktopage", this);
            }

        },
        SetDisplayState(inState)
        {
            if (inState)
            {
                this.btndisplaystate = 'flex';
            }
            else
            {
                this.btndisplaystate = 'none';
            }
        },
        SetEnable(inState)
        {
            if (inState)
            {
                this.disablestate = false;
                this.filterstr = '';
                this.fc = this.orginfc;
            }
            else
            {
                this.disablestate = true;
                this.filterstr = 'grayscale(100%)';
                this.fc = "rgb(128,128,128)";
            }
        },


    }
})

Vue.component('slabel', {
    props: ["id", "width", "height", "left", "right", "top", "bottom", "absolute", "label", "fontsize", "fontcolor", "fontclass", "bgsrc", "opacity"],
    data: function ()
    {
        l = this.left + 'px';
        r = this.right + 'px';
        t = this.top + 'px';
        b = this.bottom + 'px';
        w = this.width;
        h = this.height;
        fs = this.fontsize != undefined ? this.fontsize : '3';
        fc = this.fontcolor != undefined ? this.fontcolor : "rgb(0,0,0)";
        fclass = this.fontclass != undefined ? this.fontclass : "";
        pos = this.absolute != undefined ? 'absolute' : 'relative';
        lab = this.label;
        bs = this.bgsrc != undefined ? "url(" + this.bgsrc + ")" : "";
        op = this.opacity != undefined ? this.opacity : "100%";
        return { op, bs, fs, fc, pos, l, r, t, b, w, h, lab }
    },

    template: XR.vrMouseUI ?
        "<div></div>"
        :
        "<div :style=\"{left:l,right:r,top:t,bottom:b,position:pos,display:'flex',width: w, height: h,padding:0,minHeight:0,alignItems:'center',justifyContent:'left',backgroundColor:'rgba(0,0,0,0)',backgroundImage:bs,opacity:op}\"><div :class=fontclass :style=\"{fontSize:fs+'rem',color:fc,fontFamily:'Microsoft YaHei'}\"><slot></slot>{{lab}}</div></div>",
    methods:
    {

    }
})

//displaycount 单次显示要显示几个按钮
Vue.component('sbtngroup', {
    props: ["sbtngroup", "function", "around", "left", "right", "top", "bottom", "absolute", "space", "flexdir", "vrmousehidden", "margin", "displaycount", "ddd"],
    data: function ()
    {
        //按钮总个数
        btncount = this.sbtngroup.length;
        //一次要显示的个数
        dcount = Math.abs(this.displaycount);
        //当前显示的位置
        cposition = Math.abs(this.displaycount);


        lastbtn = undefined;
        pos = this.absolute != undefined ? 'absolute' : 'relative';
        a = this.around != undefined ? 'space-around' : undefined;
        l = this.left + 'px';
        r = this.right + 'px';
        t = this.top + 'px';
        b = this.bottom + 'px';
        s = this.space + 'px';
        fd = this.flexdir != undefined ? this.flexdir : 'row';

        vrhidden = this.vrmousehidden != undefined ? true : false;
        fction = this.function;
        if (XR.vrMouseUI)
        {
            pos = 'relative';
            l = undefined;
            r = undefined;
            t = undefined;
            b = undefined;
            fd = 'row';
            s = this.space + 'px';
        }

        return { vrhidden, lastbtn, pos, a, l, r, t, b, s, fd, fction, dcount, cposition, btncount }
    },
    template: "<div :style=\"{flexWrap:'',flexDirection:fd,left:l,right:r,top:t,bottom:b,justifyContent:a,display:'flex',position:pos, width:'100%',maxHeight:'100%',padding:0}\">  <div :style=\"{flexDirection:fd,display:'flex',pointerEvents:'auto'}\" v-for='(sb,index) in sbtngroup'><sbtn ref='aaaa' v-on:toggle='ontoggle' v-bind=sb v-bind:key=index v-bind:index=index :margin=margin ></sbtn><div :style=\"{display:'flex',width:s,height:s,padding:0,margin:0}\" ></div></div></div>",
    mounted: function ()
    {
        if (this.dcount)
        {
            for (let i = 0;i < this.$children.length;i++)
            {
                if (i >= this.dcount)
                    this.$children[i].SetDisplayState(false);
            }
            console.log(this.btncount);
            console.log(this.dcount);
            console.log(this.cposition);
        }
    },
    methods: {
        ontoggle(inbtn)
        {
            if (this.fction)
                this.fction(inbtn);

            if (this.lastbtn && this.lastbtn != inbtn)
            {
                //              console.log("Clear Last Button:" + this.lastbtn.id);
                this.lastbtn.SetButtonState(false);
                this.lastbtn = null;
            }

            inbtn.SetButtonState(inbtn.btnstate);
            this.lastbtn = inbtn;
            //          console.log("Last Button Set : " + this.lastbtn.id);
        },
        ResetAllButtonState()
        {
            if (this.lastbtn)
            {
                console.log(" ResetAllButtonState   " + this.lastbtn.id);
                this.lastbtn.SetButtonState(false);
                this.lastbtn = null;
            }
        },
        PrePage()
        {
            if (this.cposition > this.dcount)
            {
                for (let i = 0;i < this.$children.length;i++)
                {
                    this.$children[i].SetDisplayState(false);
                }
                this.cposition -= this.dcount;
                if (this.cposition < this.dcount)
                    this.cposition = this.dcount;

                for (let i = this.cposition - this.dcount;i < this.cposition;i++)
                {
                    this.$children[i].SetDisplayState(true);
                }
            }
            return this.cposition > this.dcount ? true : false;
        },
        NextPage()
        {


            if (this.cposition < this.btncount)
            {
                for (let i = 0;i < this.$children.length;i++)
                {
                    this.$children[i].SetDisplayState(false);
                }

                this.cposition += this.dcount;
                console.log(this.cposition);
                if (this.cposition > this.btncount)
                    this.cposition = this.btncount;

                console.log(this.cposition);

                for (let i = this.cposition - this.dcount;i < this.cposition;i++)
                {
                    this.$children[i].SetDisplayState(true);
                }
            }
            return this.cposition < this.btncount ? true : false;

        }

    }
})

Vue.component('scrolllist', {
    props: ["items", "prename", "function", "left", "right", "top", "bottom", "absolute", "imgon", "imgoff", "fontcolor", "fontsize", "space", "flexdir", "vrmousehidden", "norelease"],
    data: function ()
    {
        nrelease = this.norelease != undefined ? true : false;
        pname = this.prename != undefined ? this.prename : "noset";
        pname += "_";
        vrhidden = this.vrmousehidden != undefined ? true : false;
        pos = this.absolute != undefined ? 'absolute' : 'relative';

        fs = this.fontsize;
        fc = this.fontcolor;
        its = this.items;
        fction = this.function;

        img1 = this.imgon;
        img2 = this.imgoff;

        l = this.left + 'px';
        r = this.right + 'px';
        t = this.top + 'px';
        b = this.bottom + 'px';
        s = this.space + 'px';
        fd = this.flexdir != undefined ? this.flexdir : 'row';

        return { pos, nrelease, vrhidden, pname, fs, fc, its, fction, l, r, t, b, img1, img2, s, fd }
    },
    template: XR.vrMouseUI ?
        "<div style='display:flex;flexDirection:row;flexWrap:wrap'><sbtn v-for='(item,index) in its' :key='item.id' style='margin:4px' :argjson={item} :fontsize=fs :fontcolor=fc  :ref=pname+index :id=pname+index  :index=index  :imgon=img1 :imgoff=img2 @toggle='ontoggle' inbtngroup vrmouselabel=' '>{{item.label!=undefined?item.label:item}}<slot></slot></sbtn></div>"
        :
        "<div :style=\"{left:l,right:r,top:t,bottom:b,flexDirection:fd,display:'flex',position:pos}\"><q-virtual-scroll  style='max-height:100%;width:100%;' :items=its> <template v-slot='{index,item}'> <sbtn :argjson={item} :fontsize=fs :fontcolor=fc  :ref=pname+index :id=pname+index  :index=index  :imgon=img1 :imgoff=img2 @toggle='ontoggle' inbtngroup :norelease=nrelease vrmouselabel=' '>{{item.label!=undefined?item.label:item}}<slot></slot></sbtn><div :style=\"{display:'flex',width:s,height:s,padding:0,margin:0}\" ></div></template>	</q-virtual-scroll></div>",
    methods: {
        ontoggle(inbtn)
        {
            if (this.lastbtn)
            {
                this.lastbtn.SetButtonState(false, false);
                this.lastbtn = null;
            }

            inbtn.SetButtonState(inbtn.btnstate, false);

            if (this.fction)
                this.fction(inbtn);
            //如果当前按钮是true才会记录此按钮
            if (inbtn.btnstate)
                this.lastbtn = inbtn;
        },
        getchild()
        {

        }
    }
})

Vue.component('simg', {
    props: ["id", "left", "right", "top", "bottom", "absolute", "src", "opacity"],
    data: function ()
    {
        pos = this.absolute != undefined ? 'absolute' : 'relative';
        l = this.left + 'px';
        r = this.right + 'px';
        t = this.top + 'px';
        b = this.bottom + 'px';

        //imgc=this.imgclass!=undefined?this.imgclass:"false";
        op = this.opacity != undefined ? 1 : this.opacity;

        if (XR.vrMouseUI)
        {
            pos = 'relative';
            l = undefined;
            r = undefined;
            t = undefined;
            b = undefined;
        }
        return { pos, l, r, t, b, op }
    },

    template: XR.vrMouseUI ?
        "<div></div>"
        :
        "<div><div :style=\"{left:l,right:r,top:t,bottom:b,display:'flex',position:pos}\" ><img :src=src :style=\"{position:'relative',display:'flex'}\"></img><slot></slot></div></div>",
})

Vue.component('sqimg', {
    props: ["id", "width", "height", "left", "right", "top", "bottom", "absolute", "contain", "imgclass", "src", "opacity"],
    data: function ()
    {
        pos = this.absolute != undefined ? 'absolute' : 'relative';
        l = this.left + 'px';
        r = this.right + 'px';
        t = this.top + 'px';
        b = this.bottom + 'px';

        //imgc=this.imgclass!=undefined?this.imgclass:"false";
        op = this.opacity != undefined ? 1 : this.opacity;

        w = "100%";
        h = "100%";
        if (this.width)
            w = this.width + 'px';
        if (this.height)
            h = this.height + 'px';

        if (XR.vrMouseUI)
        {
            pos = 'relative';
            l = undefined;
            r = undefined;
            t = undefined;
            b = undefined;
            w = undefined;
            h = undefined;
        }
        return { pos, l, r, t, b, w, h, op }
    },

    template: XR.vrMouseUI ?
        "<div></div>"
        :
        "<q-img basic :contain=contain :img-class=imgclass :src=src :style=\"{left:l,right:r,top:t,bottom:b,position:pos,display:'flex',width: w, height: h,padding:0,minHeight:0,opacity:op}\" ><slot></slot></q-img>"
})

Vue.component('scaleimg', {
    props: ["id", "src", "clip", "scalemin", "scalemax", "notouchblock"],
    data: function ()
    {
        trans = "";
        //scope 是否使用裁切
        classname = "scaleimgcss_" + this.id;
        classOut = "";
        classIn = ""

        if (this.clip != undefined)
        {
            classIn = classname;
        }
        else
        {
            classOut = classname;
        }

        scalecss = [];
        x = 0;
        y = 0;
        scale = 1.0;
        sMax = this.scalemax != undefined ? this.scalemax : 2;
        sMin = this.scalemin != undefined ? this.scalemin : 0.5;
        inID = this.id;
        useTouchMove = this.notouchblock != undefined ? false : true;
        return { inID, x, y, scale, sMax, sMin, trans, classname, classIn, classOut, scalecss };
    },
    mounted: function ()
    {
        let scalecss = document.getElementById(this.classname);
        if (scalecss)
        {
            this.scalecss = scalecss;
        }
        else
        {
            this.scalecss = document.createElement("style");
            this.scalecss.id = this.classname;
            document.head.appendChild(this.scalecss);
        }
        if (useTouchMove)
        {
            let scaleCtrl = new XR.TouchCtrl(document.getElementById(this.inID), false, this.OnUIMove, this.OnUIZoom);
            console.log("Set TouchCtrl scaleimg " + inID);
        }

    },
    methods:
    {
        OnUIMove(xOffset, yOffset)
        {
            this.x += xOffset / XR.globalscale;
            this.y += yOffset / XR.globalscale;
            this.trans = "transform:translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")";
            this.scalecss.innerHTML = "." + this.classname + "{" + this.trans + "}";
        },
        OnUIZoom(zoomOffset)
        {
            this.scale += -0.1 * zoomOffset;
            this.scale = this.scale <= this.sMin ? parseFloat(this.sMin) : this.scale;
            this.scale = this.scale >= this.sMax ? parseFloat(this.sMax) : this.scale;
            this.trans = "transform:translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")";
            this.scalecss.innerHTML = "." + this.classname + "{" + this.trans + "}";
        }

    },
    template: XR.vrMouseUI ?
        "<div></div>" : "<q-img :id=inID basic contain :class=classOut :img-class=classIn :src=src  style=\"{overflow: auto; left:0,right:0,top:0,bottom:0,position:'absolute',display:'flex',padding:0,minHeight:0}\" ><slot></slot></q-img>"
})

Vue.component('sxfblock', {
    props: ["id", "title", "addlabel", "items", "function", "fontminwidth", "contentwidth", "contentheight", "getreffun", "space", "displaycount"],
    data: function ()
    {
        //按钮总个数
        btncount = this.items.length;
        //一次要显示的个数
        dcount = Math.abs(this.displaycount);
        //当前显示的位置
        cposition = Math.abs(this.displaycount);

        its = this.items;
        dprepage = false;
        dnextpage = false;
        displaystate = true;
        fction = this.function;
        groupid = this.id + "_";
        scrollrefname = this.id + "_scroll";
        scrollref = {};
        cH = parseInt(this.contentheight);
        al = this.addlabel;
        prepageid = groupid + "prepage";
        nextpageid = groupid + "nextpageid";
        btns = undefined;
        return {btns, prepageid, nextpageid, al, its, cH, scrollref, scrollrefname, dprepage, dnextpage, groupid, displaystate, fction, btncount, dcount, cposition }
    },

    template: XR.vrMouseUI ?
        "<div></div>"
        :
        "<div>\
		\
			<rectbox>\
			<simg src='image/ui1/xf_name_bg.png'></simg>\
			<sbtn :id=groupid absolute right=0 imgon='image/ui1/xf_shouqi.png' imgoff='image/ui1/xf_zhankai.png'  @clicktopage='DisplayContent'></sbtn>\
			<slabel  absolute height='100%' width='150px' left=30 fontsize=3 fontclass='fontfade2' :label=title></slabel>\
			<sbtn :id=prepageid absolute left=125 top=17 imgon='image/ui1/xf_fanye_shang.png'  @clicktopage='PrePage' v-show=dprepage></sbtn>\
			<sbtn :id=nextpageid absolute left=235 top=17 imgon='image/ui1/xf_fanye_xia.png'  @clicktopage='NextPage' v-show=dnextpage></sbtn>\
			</rectbox>\
						\
				<div style='backgroundImage:url(image/ui1/xf_shuju_bg.png);'>\
			<rectbox :ref=scrollrefname :id=scrollrefname  :style=\"{maxWidth:contentwidth+'px'}\" v-show=displaystate>\
			<div style='left:0px;display:flex;flexDirection:row;flexWrap:wrap;'>\
			<div v-for='(item,index) in its'>\
			<div :style=\"{display:'flex',width:space+'px',height:space+'px'}\" ></div>\
			<sbtn style='margin: 5px;' hidden=true bgon='image/ui1/my_shaixuan_btn_bg.png' :fontminwidth=fontminwidth  :key='item.id' :argjson={item} fontcolor='rgb(255,255,255)' fontsize=3 :ref=groupid+index :id=groupid+index  :index=index  @toggle='ontoggle' inbtngroup vrmouselabel=' '>{{item.label!=undefined?item.label:item+al}}<slot></slot>\
			</sbtn>\
			<div :style=\"{display:'flex',width:space+'px',height:space+'px'}\" ></div>\
			</div>\
			</div>\
			</rectbox>\
				</div>\
		\
		\
		</div>",
    mounted: function ()
    {
        setTimeout(() => { this.InitPage() }, 0);
    },
    watch://数组观察器
    {
        its()
        {
            //console.log("watch  "+this.scrollrefname);
            //如果数组有变化需要延迟刷新一下
            setTimeout(() => { this.InitPage() }, 0);
        }
    },
    methods: {
        ontoggle(inbtn)
        {
            if (this.lastbtn)
            {
                this.lastbtn.SetButtonState(false, false);
                this.lastbtn = null;
            }

            inbtn.SetButtonState(inbtn.btnstate, false);
            if (this.fction)
                this.fction(inbtn);
            //如果当前按钮是true才会记录此按钮
            if (inbtn.btnstate)
                this.lastbtn = inbtn;
        },
        ResetLastBtn()
        {
            if (this.lastbtn)
            {
                this.lastbtn.SetButtonState(false, false);
                this.lastbtn = null;
            }
        },
        DisplayContent(state)
        {
            this.displaystate = !this.displaystate;
            console.log(this.displaystate);
        },
        InitPage()
        {

            //            console.log("InitPage");
            this.btns = this.$refs[this.scrollrefname].$children;
            this.btncount = this.btns.length;
            this.dcount = Math.abs(this.displaycount);
            this.cposition = Math.abs(this.displaycount);

            //选房的可选项默认都是hidden的,需要判断是否显示
            if (this.dcount)
            {
                for (let i = 0;i < this.btns.length;i++)
                {
                    //                    console.log(i+"-----"+this.btns[i].btndisplaystate);
                    if (i < this.dcount)
                    {
                        this.btns[i].SetDisplayState(true);
                        this.btns[i].SetButtonState(false, false);
                    }
                    else if (this.btns[i].btndisplaystate)
                    {
                        this.btns[i].SetDisplayState(false);
                    }
                }
            }
            else
            {
                for (let i = 0;i < this.btns.length;i++)
                {
                    this.btns[i].SetDisplayState(true);
                }
            }

            this.dprepage = false;
            this.dnextpage = false;
            if (this.cposition < this.btncount)
                this.dnextpage = true;

        },
        PrePage()
        {

            if (this.cposition > this.dcount)
            {
                for (let i = 0;i < this.btns.length;i++)
                {
                    this.btns[i].SetDisplayState(false);
                }
                this.cposition -= this.dcount;
                if (this.cposition < this.dcount)
                    this.cposition = this.dcount;

                for (let i = this.cposition - this.dcount;i < this.cposition;i++)
                {
                    this.btns[i].SetDisplayState(true);
                }
            }

            if (this.cposition > this.dcount)
            {
                this.dprepage = true;
                this.dnextpage = true;
            }
            else
            {
                this.dprepage = false;
                this.dnextpage = true;
            }
        },
        NextPage()
        {

            if (this.cposition < this.btncount)
            {
                for (let i = 0;i < this.btns.length;i++)
                {
                    this.btns[i].SetDisplayState(false);
                }

                this.cposition += this.dcount;
                if (this.cposition > this.btncount)
                    this.cposition = this.btncount;

                for (let i = this.cposition - this.dcount;i < this.cposition;i++)
                {
                    this.btns[i].SetDisplayState(true);
                }
            }

            if (this.cposition < this.btncount)
            {
                this.dprepage = true;
                this.dnextpage = true;
            }
            else
            {
                this.dprepage = true;
                this.dnextpage = false;
            }

        }



    }
})