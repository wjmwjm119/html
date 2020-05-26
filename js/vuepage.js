function sort(arr)
{
    for (var i = 0;i < arr.length - 1;i++)
    {
        for (var j = 0;j < arr.length - i - 1;j++)
        {
            if (arr[j] > arr[j + 1])
            { // 相邻元素两两对比
                var hand = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = hand;
            }
        }
    }
    return arr;
}

let loadingpage = new Vue({
    el: '#loadingpage',
    methods: {
        FadeIn(callBack)
        {
            this.$refs.base.FadeIn(callBack);
        },
        OnFadeInEnter()
        {
            this.$q.loading.show({ backgroundColor: 'loading', message: '正在加载', customClass: 'loading' });
        },
        OnFadeInEnd() { },
        FadeOut(callBack)
        {
            let blackbg = document.getElementById("blackbg");
            if (blackbg)
            {
                blackbg.remove();
                XR.DebugToHtml("Remove blackbg");
            }
            this.$refs.base.FadeOut(callBack);
            this.$q.loading.hide();
        },
        OnFadeOutEnd() { }
    }
})

let logopage = new Vue({
    el: '#logopage',
    methods: {
        FadeIn()
        {
            this.$refs.base.FadeIn();
            XR.DebugToHtml("logopage FadeIn");
        },
        OnFadeInEnter()
        {
            let v = document.getElementById("logoplayer");
            if (v && !XR.vrMouseUI && false)
            {
                v.style = "width:100%;height:100%";
                v.play();
                XR.DebugToHtml("logoplayer Play");
            } else
            {
                this.FadeOut();
            }
        },
        OnFadeInEnd()
        {

        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            //			let json= '{"19":{"2":{"4":[1,12,1],"1":[1,12,1]},"1":{"4":[1,12,1],"1":[1,12,1]}},"8":{"3":{"1":[1,12,1],"2":[1,12,1]},"2":{"2":[1,12,1],"1":[1,12,1]},"1":{"1":[1,12,1]}},"5":{"2":{"3":[1,12,1],"2":[1,8,1],"1":[1,12,1]},"1":{"4":[1,12,1],"3":[1,18,1],"2":[1,12,1]}},"3":{"2":{"2":[1,12,1],"1":[1,12,1]},"1":{"2":[1,12,1]}}}';
            //			xfpage.FadeIn(json);
            //	      	return;
            loadingpage.FadeIn({
                onFadeInEnd: () =>
                {
                    XR.LoadSceneLoop(["main", "美术关卡", "Night", "mp_140", "mp_110", "jgmy_xlz"],
                        "", "", XR.CallBack("JsRun", 'XR.SetActiveSceneInstance("main","CameraUniversalNK", XR.SetLevelVisible("mp_140", false)); loadingpage.FadeOut();mainpage.FadeIn();mediapage.FadeIn();'));
                    //XR.LoadSceneLoop(["main", "A1", "A2", "b", "C_D", "E", "KP_XP", "NDX", "nw_shu_dd", "PG_GQ", "ww_dx", "ww_dx_JRBK", "ww_dx_WWBK", "ww_jz", "美术关卡", "Night", "mp_110", "mp_140", "mp_125", "jgmy_xlz"],
                    //    "", "", XR.CallBack("JsRun", 'XR.SetActiveSceneInstance("main");loadingpage.FadeOut();mainpage.FadeIn();mediapage.FadeIn();'));

                    // 


                }
            });

        },
        OnPlayEnd()
        {
            XR.DebugToHtml("OnPlayEnd");
            this.FadeOut();
        }
    }
})


let mediapage = new Vue({
    el: '#mediapage',
    data: {
        hasVRMouseQRCodeImage: false,
        vrmouseqrcodeimg: "",
        isWebRtcMode: false,
    },
    methods: {
        FadeIn()
        {
            this.$refs.base.FadeIn();
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeInEnter()
        {
            if (bgAudioPlayer_G.isplaying)
            {
                this.$refs.btnaudio.SetButtonState(true, false);
            }
            if (runModeType && runModeType == "webRTCMode")
                this.isWebRtcMode = true;
        },
        OnFadeInEnd()
        {
            if (runModeType && runModeType == "vrMouseMode")
                XR.ConnectWebSocket(webSocketAdress);
        },
        OnFadeOutEnd()
        {

        },
        SetWebRtcQuality(level)
        {
            webrtcvideopage.SendVideoQualityMessage(level);
        }
    }
})

let mainpage = new Vue({
    el: '#mainpage',
    data: {
        btngroup: 'mainmenubtngroup',
        tianqiurl: "null.html",
        mainmenubg: 'mainmenubgimage',
        mainbtnShow: true,
        ejmenubtngroup: ''
    },
    methods: {
        SetVisible(isVisible)
        {
            this.$refs.base.SetVisible(isVisible);
        },
        FadeIn(callBack)
        {
            this.$refs.base.FadeIn(callBack);
        },
        FadeOut(callBack)
        {
            this.$refs.base.FadeOut(callBack);
        },
        OnFadeInEnter()
        {
            //            this.$refs.mainmenu.PlayAni(true, "right:-50%;", "right:-15%;");
            this.$refs.mainbtn.ClickDown();
            this.$refs.daytimebtngroup.$children[1].ClickDown();

            //            XR.SetLevelVisible("mp_140", false);
            //            XR.SetLevelVisible("mp_110", false);
        },
        OnFadeInEnd()
        {
            let touchCtrl = new XR.TouchCtrl(document.getElementById("touch")); //CH 初始化Touch web界面

        },
        OnFadeOutEnd()
        {

        },
        PlayMainSceneSequenceAnimation(animationID, loopTime = -1)
        {
            XR.PlayHXSequenceAnimation(animationID, loopTime);
        },
        StopMainSceneSequenceAnimation()
        {
            XR.StopHXSequenceAnimation();
        },
        Mainbtnstate(btn)
        {
            if (btn)
            {
                mainpage.$root.mainmenubg = "mainmenubgimage";
                mainpage.$root.btngroup = "mainmenubtngroup";
                mediapage.FadeOut();

                //mainpage.$refs.mainmenuroot.PlayAni(false, "", "bottom:-30%");
                mainpage.btngroup = "";
                mainpage.mainmenubg = "";
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");

                mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
                mainpage.$refs.swqwbtngroup.ResetAllButtonState();
                videopage.FadeOut();
                XR.PlayHXSequenceAnimation(0);
            } else
            {
                mediapage.FadeIn();
                mainpage.btngroup = "mainmenubtngroup";
                mainpage.mainmenubg = "mainmenubgimage";
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-152px");
                XR.StopHXSequenceAnimation();
            }
        },



    }
})


let videopage = new Vue({
    el: '#videopage',
    data: {
        src: 'video/null',
        loopsrc: 'video/null',
        rectFadeStat: false,
        srcindex: 0,
        srcArray: ['video/xmjj_start'],
        loopsrcArray: ['video/xmjj_loop']
    },
    methods: {
        FadeIn(inOnFadeInEnter)
        {
            this.onFadeInEnter = inOnFadeInEnter;
            this.$refs.base.FadeIn();
            this.srcindex = 0;
            XR.DebugToHtml("videopage FadeIn");
        },
        OnFadeInEnter()
        {
            if (this.onFadeInEnter)
                this.onFadeInEnter();
        },
        OnFadeInEnd()
        {
            XR.DebugToHtml("videopage OnFadeInEnd");
        },
        FadeOut()
        {
            if (this.$refs.player)
                this.$refs.player.oncanplay = null;
            if (this.$refs.loopplayer)
                this.$refs.loopplayer.oncanplay = null;

            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("videopage OnFadeOutEnd");
        },
        PlayNext(srcArray, loopsrcArray)
        {
            this.srcindex++;
            if (this.srcindex >= srcArray.length)
            {
                this.srcindex = 0;
            }
            this.Play(srcArray[this.srcindex], loopsrcArray[this.srcindex], "");
        },
        PlayPrev(srcArray, loopsrcArray)
        {
            this.srcindex--;
            if (this.srcindex < 0)
            {
                this.srcindex = srcArray.length - 1;
            }
            this.Play(srcArray[this.srcindex], loopsrcArray[this.srcindex], "");
        },
        Play(insrc, inloopsrc, inOnPlayEnd)
        {
            if (this.$refs.player)
                this.$refs.player.oncanplay = null;

            if (this.$refs.loopplayer)
                this.$refs.loopplayer.oncanplay = null;

            this.onPlayEnd = inOnPlayEnd;

            this.rectFadeStat = !this.rectFadeStat;
            this.$refs.videorect.PlayAni(this.rectFadeStat, "", "opacity:0", 0.5, 1, () => { videopage.OnEnterPlay(insrc, inloopsrc); });

        },
        OnEnterPlay(insrc, inloopsrc)
        {
            this.$refs.player.style = "width:0%;height:0%;display:flex;position:absolute;";
            this.$refs.loopplayer.style = "width:0%;height:0%;display:flex;position:absolute;";

            if (insrc != "")
            {
                this.src = insrc;
                this.$refs.player.load();
                this.$refs.player.oncanplay = () =>
                {
                    this.rectFadeStat = !this.rectFadeStat;
                    this.$refs.videorect.PlayAni(this.rectFadeStat, "", "opacity:1", 0.5);
                    this.$refs.player.style = "width:100%;height:100%;display:flex;position:absolute;";
                    this.$refs.player.play();
                };

                if (inloopsrc != "")
                {
                    this.loopsrc = inloopsrc;
                    this.$refs.loopplayer.load();
                }
            } else if (inloopsrc != "")
            {
                this.loopsrc = inloopsrc;
                this.$refs.loopplayer.load();
                this.$refs.loopplayer.oncanplay = () =>
                {
                    this.rectFadeStat = !this.rectFadeStat;
                    this.$refs.videorect.PlayAni(this.rectFadeStat, "", "opacity:1", 0.5);
                    this.$refs.loopplayer.style = "width:100%;height:100%;display:flex;position:absolute;";
                    this.$refs.loopplayer.play();
                    this.$refs.loopplayer.oncanplay = null;
                };
            }

            XR.DebugToHtml("videopage Play");
        },
        OnPlayEnd()
        {
            if (this.loopsrc != "")
            {
                this.$refs.player.style = "width:0%;height:0%;display:flex;position:absolute;";
                this.$refs.loopplayer.style = "width:100%;height:100%;display:flex;position:absolute;";
                this.$refs.loopplayer.play();
            }

            if (this.onPlayEnd)
                this.onPlayEnd();

            console.log("视频播放完毕");

            XR.DebugToHtml("videopage OnPlayEnd");
        },
    }
})

let videopage1 = new Vue({
    el: '#videopage1',
    data: {
        src: 'video/null',
        loopsrc: 'video/null',
        rectFadeStat: false,
        srcindex: 0,
        srcArray: ['video/xmjj_start'],
        loopsrcArray: ['video/xmjj_loop']
    },
    methods: {
        FadeIn(inOnFadeInEnter)
        {
            this.onFadeInEnter = inOnFadeInEnter;
            this.$refs.base.FadeIn();
            this.srcindex = 0;
            console.log("Fadein00000000000000000000");
            XR.DebugToHtml("videopage FadeIn");
        },
        OnFadeInEnter()
        {
            if (this.onFadeInEnter)
                this.onFadeInEnter();

        },
        OnFadeInEnd()
        {
            XR.DebugToHtml("videopage OnFadeInEnd");
        },
        FadeOut()
        {
            if (this.$refs.player)
                this.$refs.player.oncanplay = null;
            if (this.$refs.loopplayer)
                this.$refs.loopplayer.oncanplay = null;

            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("videopage OnFadeOutEnd");
        },
        //////////////////////////////////////////CH
        PlayNext(srcArray, loopsrcArray)
        {
            this.srcindex++;
            if (this.srcindex >= srcArray.length)
            {
                this.srcindex = 0;
            }
            this.Play(srcArray[this.srcindex], loopsrcArray[this.srcindex], "");
        },
        PlayPrev(srcArray, loopsrcArray)
        {
            this.srcindex--;
            if (this.srcindex < 0)
            {
                this.srcindex = srcArray.length - 1;
            }
            this.Play(srcArray[this.srcindex], loopsrcArray[this.srcindex], "");
        },
        Play(insrc, inloopsrc, inOnPlayEnd)
        {
            console.log("Play100000000000000000000");
            if (this.$refs.player)
                this.$refs.player.oncanplay = null;

            if (this.$refs.loopplayer)
                this.$refs.loopplayer.oncanplay = null;

            this.onPlayEnd = inOnPlayEnd;

            this.rectFadeStat = !this.rectFadeStat;
            this.$refs.videorect.PlayAni(this.rectFadeStat, "", "opacity:0", 0.5, 1, () => { videopage1.OnEnterPlay(insrc, inloopsrc); });

        },
        OnEnterPlay(insrc, inloopsrc)
        {
            this.$refs.player.style = "width:0%;height:0%;display:flex;position:absolute;";
            this.$refs.loopplayer.style = "width:0%;height:0%;display:flex;position:absolute;";

            if (insrc != "")
            {
                this.src = insrc;
                this.$refs.player.load();
                this.$refs.player.oncanplay = () =>
                {
                    this.rectFadeStat = !this.rectFadeStat;
                    this.$refs.videorect.PlayAni(this.rectFadeStat, "", "opacity:1", 0.5);
                    this.$refs.player.style = "width:100%;height:100%;display:flex;position:absolute;";
                    this.$refs.player.play();
                };

                if (inloopsrc != "")
                {
                    this.loopsrc = inloopsrc;
                    this.$refs.loopplayer.load();
                }
            } else if (inloopsrc != "")
            {
                this.loopsrc = inloopsrc;
                this.$refs.loopplayer.load();
                this.$refs.loopplayer.oncanplay = () =>
                {
                    this.rectFadeStat = !this.rectFadeStat;
                    this.$refs.videorect.PlayAni(this.rectFadeStat, "", "opacity:1", 0.5);
                    this.$refs.loopplayer.style = "width:100%;height:100%;display:flex;position:absolute;";
                    this.$refs.loopplayer.play();
                    this.$refs.loopplayer.oncanplay = null;
                };
            }

            XR.DebugToHtml("videopage Play");
        },
        OnPlayEnd()
        {
            if (this.loopsrc != "")
            {
                this.$refs.player.style = "width:0%;height:0%;display:flex;position:absolute;";
                this.$refs.loopplayer.style = "width:100%;height:100%;display:flex;position:absolute;";
                this.$refs.loopplayer.play();
            }

            if (this.onPlayEnd)
                this.onPlayEnd();

            XR.DebugToHtml("videopage OnPlayEnd");
        },
    }
})





let apngpage = new Vue({
    el: '#apngpage',
    data: { src: '' },
    methods: {
        FadeIn(targetimage)
        {
            this.src = targetimage;
            this.$refs.base.FadeIn();
            XR.DebugToHtml("apngpage FadeIn");
        },
        OnFadeInEnter()
        {
            XR.DebugToHtml("apngpage Play");
        },
        OnFadeInEnd()
        {
            XR.DebugToHtml("apngpage OnFadeInEnd");
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("apngpage OnFadeOutEnd");
        }
    }
})


let apngpage2 = new Vue({
    el: '#apngpage2',
    data: { src: '' },
    methods: {
        FadeIn(targetimage)
        {
            this.src = targetimage;
            this.$refs.base.FadeIn();
            XR.DebugToHtml("apngpage2 FadeIn");
        },
        OnFadeInEnter() { },
        OnFadeInEnd()
        {
            XR.DebugToHtml("apngpage2 OnFadeInEnd");
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("apngpage2 OnFadeOutEnd");
        }
    }
})




let slideimagepage = new Vue({
    el: '#slideimagepage',
    data: {
        slideimagegroup: "",
        slide: 1,
        isShowppjztexture: false,
    },
    methods: {
        FadeIn(targetslideimagegroup)
        {
            this.slideimagegroup = targetslideimagegroup;
            this.slide = 1;
            this.$refs.base.FadeIn();
            XR.DebugToHtml("slideimagepage FadeIn");
        },
        OnFadeInEnter()
        {
            XR.DebugToHtml("slideimagepage Play");
        },
        OnFadeInEnd()
        {
            XR.DebugToHtml("slideimagepage OnFadeInEnd");
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("slideimagepage OnFadeOutEnd");
        },
        Enterppjz()
        {
            compasspage.FadeOut();
            console.log("中海品牌");
            mainpage.$refs.mainmenuroot.PlayAni(false, "", "bottom:-30%");
            mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
            mediapage.FadeOut();
            slideimagepage.isShowppjztexture = true;

        },
        Exitppjz()
        {
            compasspage.FadeIn("main");
            slideimagepage.FadeOut();
            mainpage.$refs.ppjzbtngroup.ResetAllButtonState();
            mainpage.$refs.mainmenuroot.PlayAni(true, "", "bottom:0%");
            mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152");
            mainpage.ejmenubtngroup = "ppjzbtngroup";
            mediapage.FadeIn();
            slideimagepage.isShowppjztexture = false;
        },
    }
})


let mypage = new Vue({
    el: '#mypage',
    date: {},
    methods: {
        FadeIn()
        {
            this.$refs.base.FadeIn();

        },
        OnFadeInEnter() { },
        OnFadeInEnd() { },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd() { },
        DisPlayMyHxinfo(display)
        {
            if (display)
            {
                console.log("显示户型*************");
                this.$refs.mymenuleft.PlayAni(true, "", "left:0%");
                this.$refs.mymenurigh.PlayAni(true, "", "right:0%");
                this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
            } else
            {
                this.$refs.mymenuleft.PlayAni(false, "", "left:-22%");
                this.$refs.mymenurigh.PlayAni(false, "", "right:-30%");
                this.$refs.xfmenurect.PlayAni(false, "", "right:-30%");
                console.log("不显示户型*************");
            }
        },
    },



})

let xmjjpage = new Vue({
    el: '#xmjjpage',
    date: {},
    methods: {
        FadeIn()
        {
            this.$refs.base.FadeIn();

        },
        OnFadeInEnter() { },
        OnFadeInEnd() { },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd() { },
    },


})



let xfpage = new Vue({
    el: '#xfpage',
    data: {

        enterType: '',

        hxName: "",
        sceneMapName: "",
        sceneType: "",
        allHXRoomInfo: {
            "110": ['mp_110', '3', '2', '2', '110', 'A'],
            "125": ['mp_125', '4', '2', '2', '125', 'B'],
            "140": ['mp_140', '4', '3', '2', '140', 'C'],
        },
        currentRoom: [],
        unitNos: [],
        unitInfo: "",
        buildInfo: "",
        roomNum: 0,
        atRoomSpace: "",
        hxxzbtngroupid: 0,
        //选房1级数据模板list
        title: ["build", "unit", "floor", "room", "huxingname", "guige", "type", "forward", "salestatus"],
        selectState: ["", "", "", "", "", "", "", "", ""],
        dispalyState: [true, true, true, true, true, true, true, true, true, true],
        //requirTitleOrder,如果全部为空,就应该清除所有状态//selectState[0],selectState
        requirTitleOrder: ["0", "4", "5", "6", "7", "8"],
        //对应数据文字list
        titlelabel: ["号楼", "单元", "楼层", "房间", "户型", "规格", "类型", "朝向", "销售状态"],
        btnminwidth: ["95px", "100px", "100px", "150px", "120px", "250px", "250px", "120px", "100px"],
        addlabel: [" #", "", "", "", "", "", "", "", ""],
        //每一项显示多少按钮
        displaycount: [10, 10, 10, 10, 10, 4, 10, 10, 10],

        //楼层映射表,替换传进来的floor
        floorRemap: ["2-5", "6-10", "11-15", "16-20", "21-25", "26-30", "31-35", "36-40"],
        //筛选的开始层
        startFloor: "",
        //筛选的结束层
        endFloor: "",

        displayEnterRoomBtn: false,
        roomfloors: [],
        displayUnit: false,
        displayRoom: false,
        mirrorVector: [1, 1, 1],
        selectUnitBtn: undefined,
        selectRoomBtn: undefined,
        currentBuilding: -1,
        buildinglist: [],
        unitlist: [],
        roomlist: [],
        //选房数据循环数组
        viewlistgroup: [],
        currentSelectColumnName: "",
        currentSelectColumn: [],
        buildIDarr: [],
        buildNamearr: [],
        timeBool: false,
        buildName: 0,
        timeLoop: {},
        lognumber: 0,

        ////////////CH
        hxcgSrc: "", //CH
        hxcgbg: "",
        hxxzsmallbtnSrc: "",
        hxxzbigbtnSrc: "",
        isShowhxxzBigbtnrect: "",
        isShowhxxzsmallbtnrect: false,
        isShowTouchInnerview: false,
        // hxxzbtngroupid: 0,
        hxSize: 140,
        isShowhxroot: false,
        btngroup: "", //CH
        dayLingthing: 9, //CH
        ishxcgbtnrect: false,
        isShowhxtymyrect: false,
        isShowmymentstate: false,
        hxxzinfoSrc: "",
        isEnterroom: false,

        nextbtnstat: false,
        perbtnstat: false,

        xfmenurectStyle: "",
        xfmenurectStyle2: "",
        xfmenurectStyle3: "",

        ///////////////////////////////////////CH
        selectbuilding: (btn) =>
        {
            xfpage.SelectBuildingFun(btn);
        },
        roompoints: [],
        selectposition: (btn) =>
        {
            minimappage.ChoosePoint(btn.argjson.item.argjson);
        },

    },
    methods:
    {
        UpdataRoomPoints(p)
        {
            for (let i = 0;i < 20;i++)
            {
                this.roompoints.pop();
            }

            for (let i = 0;i < p.length;i++)
            {
                this.roompoints.push(p[i]);
            }
        },
        //0:户型入口，1：选房入口，2：销控入口
        SetChooseHouseState(nouse = false, inEnterType = 0, isDisplayXiaoKongColor = false)
        {
            this.enterType = inEnterType;
            XR.SetChooseHouseState(nouse, inEnterType, isDisplayXiaoKongColor)
        },
        FadeIn(allHuXingBaseBlockJsonInfo)
        {
            this.$refs.base.FadeIn();
            XR.DebugToHtml("xfpage FadeIn");
            console.log("xfpage FadeIn");
            //            this.xfData = JSON.parse(allHuXingBaseBlockJsonInfo);
            // console.log(allHuXingBaseBlockJsonInfo)
            //通过json数据及选房1级数据模板list添加数据并保存数据
            /*             for (let index = 0; index < this.title.length; index++) {
                            let element = this.xfData[this.title[index]];
                            this.viewlistgroup.push(element)
                        } */
            for (let index = 0;index < this.title.length;index++) //根据表头插入空数据占位
            {
                this.viewlistgroup.push([]);
            }
            //console.log(this.viewlistgroup);
            this.UpDataSelect("firstfadein", allHuXingBaseBlockJsonInfo)
        },
        OnFadeInEnter()
        {
            XR.DebugToHtml("xfpage Play");
            console.log("xfpage OnFadeInEnter");

            switch (this.enterType)
            {
                case 0:

                    this.xfmenurectStyle = "width: 100%; display: flex;flex-direction: column;"
                    //                    this.xfmenurectStyle = "width: 100%;height:100%; display: flex;flex-direction: column;"
                    //                    this.xfmenurectStyle2 = "margin-top: 0px";

                    this.$refs.hxxzbtngrouprect.PlayAni(true, "", "right:0%");
                    XR.SetSceneActorState("loubiao", true);
                    XR.SetCameraPositionAndxyzCount("34532.46875,-25131.072266,126.574028,-113.239761,46.75,39999.992188");
                    break;
                case 1:

                    this.xfmenurectStyle = "width: 100%; display: flex;flex-direction: column;"
                    //                    this.xfmenurectStyle2 = "margin-top: 10px";

                    this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
                    XR.SetCameraPositionAndxyzCount("34532.46875,-25131.072266,126.574028,-113.239761,46.75,39999.992188");
                    break;
                case 2:

                    this.xfmenurectStyle = "width: 100%; display: flex;flex-direction: column;"
                    //                    this.xfmenurectStyle2 = "margin-top: 10px";

                    this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
                    XR.SetCameraPositionAndxyzCount("34532.46875,-25131.072266,126.574028,-113.239761,46.75,39999.992188");
                    break;
                default:
                    break;
            }

            //初始化画中画界面CH
            // let tochCtrl2 = new XR.TouchCtrl(document.getElementById("touchInnerView"));

            if (this.$refs.hxxzbtnrootgroup.cposition < this.$refs.hxxzbtnrootgroup.btncount)
                this.nextbtnstat = true;
        },
        TimeLoopHttp(time)
        {
            if (time == undefined)
            {
                time = 10000;
            }
            this.timeLoop = setInterval(this.GetHttpData, time);
        },
        OnFadeInEnd()
        {
            var xftouchmodifer = document.getElementById("xftouchmodifer");
            xftouchmodifer.addEventListener("touchstart", (e) => { e.stopPropagation(); }, { passive: false });
            xftouchmodifer.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: false });
            xftouchmodifer.addEventListener("touchend", (e) => { e.stopPropagation(); }, { passive: false });

            XR.DebugToHtml("xfpage OnFadeInEnd");
        },
        FadeOut()
        {
            this.displayUnit = false;
            this.displayRoom = false;

            if (this.selectUnitBtn != undefined)
                this.selectUnitBtn.SetButtonState(false, false);

            if (this.selectRoomBtn != undefined)
                this.selectRoomBtn.SetButtonState(false, false);

            this.buildinglist = [];
            this.unitlist = [];
            this.roomlist = [];

            XR.SetSceneActorState("xsjj", false);

            //					if(this.$refs.enterroomrect!=undefined)
            //					this.$refs.enterroomrect.PlayAni(false,"","opacity:0;bottom:-15%");

            //清空缓存,恢复到默认状态

            for (let i = 0;i < this.selectState.length;i++)
            {
                this.selectState[i] = "";
            }

            //this.UpdateDisplayState();

            let l = this.viewlistgroup.length;

            for (let index = 0;index < l;index++)
            {
                let b = this.viewlistgroup[index].length
                for (let j = 0;j < b;j++)
                {
                    this.viewlistgroup[index].pop();
                }
            }

            for (let i = 0;i < l;i++)
            {
                this.viewlistgroup.pop();
            }

            this.startFloor = "";
            this.endFloor = "";

            this.displayEnterRoomBtn = false;
            clearInterval(this.timeLoop);

            ////////////////////CH
            this.isShowhxxzsmallbtnrect = false;
            XR.SetSceneActorState("loubiao", false);
            this.isShowhxxzBigbtnrect = false;
            this.isShowhxxzsmallbtnrect = false;


            this.$refs.base.FadeOut();

        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("xfpage OnFadeOutEnd");
            clearInterval(this.timeLoop);
        },
        Next()
        {
            if (this.$refs.hxxzbtnrootgroup.NextPage())
            {
                this.perbtnstat = true;
                this.nextbtnstat = true;
            }
            else
            {
                this.perbtnstat = true;
                this.nextbtnstat = false;
            }
        },
        Pre()
        {
            if (this.$refs.hxxzbtnrootgroup.PrePage())
            {
                this.perbtnstat = true;
                this.nextbtnstat = true;
            }
            else
            {
                this.perbtnstat = false;
                this.nextbtnstat = true;
            }
        },
        //////////////////////////////////////////////////////////////////////////CH
        ChangeHxInfo(hxxxinfo)
        {
            this.hxxzinfoSrc = "image/ui1/hxty_hxxx_" + hxxxinfo + ".png";

        },
        ChangeDayLighting(dayLingthing)
        { //设置采光时间
            this.hxcgbg = "hxcgbgDayLighting"; //此处html部分已经修改
            this.hxcgSrc = "image/ui1/hxty_cg_" + dayLingthing + ".png";
            console.log("设置采光时间", +this.hxcgSrc);
        },
        ChooseHx2(inBtn)
        {
            console.log(inBtn);
            console.log(inBtn.argjson);
        },
        ChooseHx(hxname)
        {
            this.isShowhxxzsmallbtnrect = true;
            this.hxxzsmallbtnSrc = "image/ui1/hxty_btn_" + hxname + "_down_pmt" + ".png";
            this.hxSize = hxname;
            this.sceneMapName = xfpage.allHXRoomInfo[hxname][0];
            XR.SelectMinBuildMaxFloor(hxname);
            this.ChangeHxInfo(hxname);
            this.currentRoom = xfpage.allHXRoomInfo[hxname];
            this.$refs.hxmenubtngroup.ResetAllButtonState();
            XR.SetSceneActorState(this.hxSize, false);
            if (this.isEnterroom)
            {
                this.StartEnterRoom();
                this.isShowhxxzsmallbtnrect = false;
                this.displayEnterRoomBtn = false;
            } else
            {
                switch (hxname)
                {
                    case 140:
                        this.hxxzbtngroupid = 0;
                        this.displayEnterRoomBtn = true;
                        XR.SetSceneActorState("HX_FB_140", true);
                        XR.SetCameraPositionAndxyzCount("42117.710938,-19127.083984,126.574028,13.760231,37.5,39999.992188");
                        break;
                    case 125:
                        this.hxxzbtngroupid = 1;
                        this.displayEnterRoomBtn = false;
                        XR.SetSceneActorState("HX_FB_125", true);
                        XR.SetCameraPositionAndxyzCount("34532.46875,-25131.072266,126.574028,-113.239761,46.75,39999.992188");
                        break;
                    case 110:
                        this.hxxzbtngroupid = 1;
                        this.displayEnterRoomBtn = true;
                        XR.SetSceneActorState("HX_FB_110", true);
                        XR.SetCameraPositionAndxyzCount("47970.757813,-22487.259766,126.574028,-194.989761,52.5,31249.990234");
                        break;
                }

                //  this.displayEnterRoomBtn = true;
            }
            //
        },
        ChangeHxxzbtnBigImage(hxxzState)
        {
            this.isShowhxxzBigbtnrect = hxxzState;
            this.hxxzbigbtnSrc = "image/ui1/hxty_btn_" + this.hxSize + "_down_pmt_da" + ".png";
            this.isShowhxxzsmallbtnrect = true;
        },
        Displaypmt(btn)
        {
            console.log("000000000000000000000000000000000");
            XR.SetSceneActorState("pmt", btn ? true : false);
            XR.SetSceneActorState("xsjj", false);
        },
        DisPlayMyHxinfo(display)
        {
            if (display)
            {
                this.$refs.hxtymymenuleftstate.SetButtonState(false, true);
                this.$refs.hxtymymenurect.PlayAni(true, "", "right:0%");
                this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
                compasspage.$refs.compasspichxtymy.PlayAni(true, "", "left:480px");

            } else
            {
                this.$refs.hxtymymenuleftstate.SetButtonState(true, true);
                this.$refs.hxtymymenurect.PlayAni(false, "", "right:-30%");
                compasspage.$refs.compasspichxtymy.PlayAni(false, "", "left:-30%");
                this.$refs.xfmenurect.PlayAni(false, "", "right:-30%");
            }
        },
        EnterMy()
        {
            XR.ChangeCamera("CameraUniversalMY");
            XR.SetViewInnerWindowSate(true, "main", 0, 950, 550, 400);
            this.$refs.hxtymymenurighgroup.$children[3].ClickDown();
            this.$refs.hxxzbtngrouprect.PlayAni(false, "", "right:-800px");
            this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
            this.isShowhxtymyrect = true;
            this.isShowmymentstate = true;
            this.$refs.hxxzinforect.PlayAni(false, "", "left:-30%");
            xfpage.$refs.hxtymymenurighgroup.ResetAllButtonState()
            this.$refs.hxmenuroot.PlayAni(false, "", "bottom:-30%");
            this.$refs.xfindoorinforect.PlayAni(true, "", "left:0%");
            compasspage.FadeIn("hxtymy");
            minimappage.displayxfroomfloors = true;
            minimappage.FadeIn(minimappage.mInfo);
            minimappage.UpDateFloorMinimap(0);
            XR.SetSceneActorState("xsjj", false);
            // minimappage.$refs.minimapsaclerect.PlayAni(true, "", "right:undefined;left:50px");
            //画中画
            // hxpage.isShowTouchInnerview = true;
            // hxpage.$refs.touchInnerView.PlayAni(true, "", "bottm:1507px");
            // XR.SetViewInnerWindowSate(true, "main", 00, 1507, 1100, 800);

            // XR.SetSceneActorState("jrmy", false);
        },
        MyToNk()
        {
            XR.ChangeCamera("CameraUniversalNK");
            switch (this.hxSize)
            {
                case 140:
                    XR.SetCameraPositionAndxyzCount("-160043.234375,0.453316,40.125,-810.489746,34.75,1466.666504");
                    break;
                case 125:
                    break;

                case 110:
                    XR.SetCameraPositionAndxyzCount("320044.21875,-18.731598,-20.32373,-810.489746,25.0,1466.666504");
                    break;
            }

            xfpage.$refs.hxmenubtngroup.ResetAllButtonState();
            this.isShowhxtymyrect = false;
            this.isShowmymentstate = false;
            XR.SetViewInnerWindowSate(true, "main", 165, 640, 590, 330);
            this.$refs.xfmenurect.PlayAni(false, "", "right:-30%");
            this.$refs.hxxzbtngrouprect.PlayAni(true, "", "right:0%");
            this.$refs.xfindoorinforect.PlayAni(false, "", "left:-30%");
            xfpage.$refs.hxxzinforect.PlayAni(true, "", "left:50px");
            xfpage.$refs.hxmenuroot.PlayAni(true, "", "bottom:0%");
            minimappage.FadeOut();
            xfpage.$refs.btngroup = "hxmenubtngroup";
            compasspage.FadeIn("hxty");

        },
        UpDataRoomString(argString)
        {
            if (!argString)
                return;
            let newArray = argString.split("-");
            this.buildInfo = newArray[0];
            this.unitInfo = newArray[1];
            this.roomNum = newArray[2];
        },
        Exit()
        {

        },
        SethxinfoMenuDisplayStat(hxinfoMenuDisplayStat)
        {
            for (let index = 0;index < hxinfoMenuDisplayStat.length;index++)
            {
                if (hxinfoMenuDisplayStat[index] == "true")
                {
                    xfpage.$refs.hxmenubtngroup.$children[index].SetDisplayState(true);
                } else
                {
                    xfpage.$refs.hxmenubtngroup.$children[index].SetDisplayState(false);
                }
            }
        },
        ////////////////////////////////////////////////////////////////CH
        //export function SendCtrlCmd(cmdName: string, argString: string = "", jsonData: string = "{}")
        SelectBuildingFun(btn)
        {
            console.log(btn.id);
            //通过对按钮id的重构判断点击不同的筛选项做不同的逻辑处理
            let baseUrlPosition = btn.id.indexOf("_");
            this.currentSelectColumnName = "";
            if (baseUrlPosition > 0)
            {
                this.currentSelectColumnName = btn.id.substr(0, baseUrlPosition);
            }


            for (let index = 0;index < this.title.length;index++)
            {
                if (this.title[index] == this.currentSelectColumnName)
                {
                    if (btn.btnstate)
                    {
                        this.selectState[index] = btn.argjson.item;
                        //使用floorRemap

                        if (this.currentSelectColumnName == "floor")
                        {
                            this.selectState[index] = "";
                            let splitArray = btn.argjson.item.split("-");
                            //                            console.log(splitArray);
                            if (splitArray.length != 2)
                            {
                                console.error("floor item error");
                                break;
                            }
                            this.startFloor = splitArray[0];
                            this.endFloor = splitArray[1];
                        } else if (this.currentSelectColumnName == "build")
                        {
                            this.currentBuilding = btn.argjson.item;
                            XR.SelectBuilding(this.currentBuilding);

                        }
                        else if (this.currentSelectColumnName == "unit")
                        {
                            XR.SelectUnit(btn.argjson.item);
                        }
                    } else
                    {
                        this.selectState[index] = "";

                        this.displayEnterRoomBtn = false;
                        if (this.currentSelectColumnName == "floor")
                        {
                            this.startFloor = "";
                            this.endFloor = "";
                        }

                    }


                }
            }

            //this.UpdateDisplayState();
            let selectDataString = this.title.join(",") + "/" + this.selectState.join(",");
            console.log(selectDataString + " " + this.startFloor + "----" + this.endFloor);


            if (this.currentSelectColumnName == "room") //选中房间后触发
            {
                if (btn.btnstate)
                {
                    if (this.isEnterroom)
                    {
                        this.displayEnterRoomBtn = false;
                    }
                    else
                    {
                        this.displayEnterRoomBtn = true;
                    }

                    XR.SelectRoom(selectDataString, this.isEnterroom);
                    console.log("+++++++++++++++++++++   " + this.isEnterroom)
                } else
                {
                    this.displayEnterRoomBtn = false;
                    XR.FliterSelect(selectDataString, this.startFloor, this.endFloor);
                }

            } else //选中除房间以外
            {
                XR.FliterSelect(selectDataString, this.startFloor, this.endFloor);
            }

            /*for (let i = 0; i < 3; i++) {
                this.unitlist.pop();
            }
         
            for (var unit in this.xfData[this.currentBuilding])
            {
                //console.log("|-"+unit);	
                this.unitlist.push(unit);
            }
            //					console.log(this.unitlist);
         
            this.displayRoom = false;
            this.displayUnit = true;
            this.selectBuildingBtn = btn;
            //					this.$refs.enterroomrect.PlayAni(false,"","opacity:0;bottom:-15%");
            this.displayEnterRoomBtn = false;
            this.$refs.unitanimation.PlayAni(true, "", "", 0.2, 1, () => { XR.SelectBuilding(this.currentBuilding) }); */
        },//判断是否要显示单元楼层房间

        OnSelectBuilding(building)
        {
            //			console.log(this.$refs.unitbtn.$refs.unitbtn0);
            //			console.log(this.$refs.unitbtn.$refs.unitbtn0[0]);

            /*let defaultUnitBtn = this.$refs.unitbtn.$refs.unitbtn0;
           ///处理vr飞鼠适配问题
           if (this.$refs.unitbtn.$refs.unitbtn0.length > 0)
           {
               defaultUnitBtn = this.$refs.unitbtn.$refs.unitbtn0[0];
           }
           /////
        
           this.$refs.unitanimation.PlayAni(false, "", "");
           defaultUnitBtn.SetButtonState(true, false);
           this.$refs.unitbtn.lastbtn = defaultUnitBtn;
           xfpage.SelectUnitFun(defaultUnitBtn);
           XR.DebugToHtml("OnSelectBuilding " + building);*/

        },
        OnSelectRoom(jsonObject)
        {
            xfpage.hxName = jsonObject.hxName;
            xfpage.sceneMapName = xfpage.allHXRoomInfo[xfpage.hxName][0];
            console.log("==============     " + xfpage.sceneMapName);
            xfpage.sceneType = jsonObject.sceneType;
            console.log(jsonObject)
        },
        DoubleClickHxBlock(jsonObject)
        {
            xfpage.hxName = jsonObject.hxName;
            xfpage.sceneMapName = xfpage.allHXRoomInfo[xfpage.hxName][0];
            console.log("==============     " + xfpage.sceneMapName);
            xfpage.sceneType = jsonObject.sceneType;
            xfpage.StartEnterRoom();
        },
        SelectHXFloorFun(btn)
        {
            minimappage.FadeOut();
            //XR.GetHuXingFloorMinimapInfo(btn.index);
        },
        StartEnterRoom()
        {
            XR.SetSceneActorState("HX_FB_" + this.hxSize, false);
            XR.SetSceneActorState("pmt", false);
            //            XR.SetLevelVisible("美术关卡", false);
            //            XR.SetLevelVisible(this.sceneMapName, true);

            setTimeout(() => { xfpage.OnLoadRoom(); }, 1000);
            //title: ["build", "unit", "floor", "room", "huxingname", "guige", "type", "forward", "salestatus"],
            //dispalyState: [true, true, true, true, true, true, true, true, true, true],
            xfpage.dispalyState[4] = false;
            xfpage.dispalyState[9] = true;
            //xfpage.OnLoadRoom();
            //console.log("this.enterType      " + this.enterType)
            // loadingpage.FadeIn({
            //     onFadeInEnd: () => {
            //         XR.LoadSceneLoop([this.sceneMapName], "", "", XR.CallBack("JsRun", 'xfpage.OnLoadRoom();'));
            //     }
            // });

        },
        OnLoadRoom()
        {

            console.log("户型名：" + this.sceneMapName);
            XR.SetActiveSceneInstance(this.sceneMapName, this.enterType == 0 ? "CameraUniversalNK" : "CameraUniversalMY");
        },
        OnRoomSceneInstanceActive(jsonObject)
        {
            console.log(jsonObject);
            mainpage.SetVisible("Hidden");
            this.displayEnterRoomBtn = false;
            this.isEnterroom = true;
            console.log(this.isEnterroom)
            //            this.$refs.xfindoorinforect.PlayAni(true, "", "top:4%");
            //compasspage.FadeOut();
            minimappage.mInfo = jsonObject;


            switch (this.enterType)
            {
                case 0:
                    //进入户型
                    //  hxpage.$refs.touchInnerView.PlayAni(true, "", "left:0%");
                    //    XR.SetViewInnerWindowSate(true, "main", 00, 1507, 1100, 800);
                    xfpage.$refs.hxxzinforect.PlayAni(true, "", "left:50px");
                    this.$refs.hxmenuroot.PlayAni(true, "", "bottom:0%");

                    this.isShowhxxzsmallbtnrect = false;
                    this.isShowhxroot = true;

                    XR.SetViewInnerWindowSate(true, "main", 165, 640, 590, 330);

                    compasspage.FadeIn("hxty");
                    XR.SetSceneActorState("xsjj", true);
                    compasspage.FadeIn("hxty");


                    break;
                case 1:
                    console.log("=======================")
                    this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
                    minimappage.displayxfroomfloors = true;
                    minimappage.FadeIn(jsonObject);
                    xfpage.EnterMy();
                    break;
                case 2:
                    console.log("=======================")
                    this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
                    minimappage.displayxfroomfloors = true;
                    minimappage.FadeIn(jsonObject);
                    xfpage.EnterMy();
                    break;
                default:
                    break;
            }

            XR.EnterRoom(this.isEnterroom);
            loadingpage.FadeOut({ onFadeOutEnd: () => { } });
        },
        OnEnterRoom(hxName)
        {
            let huxingButton = xfpage.$refs["huxingname"][0].$children[1].$children;
            for (let index = 0;index < huxingButton.length;index++)
            {
                if (hxName == huxingButton[index].argjson.item)
                {
                    if (!huxingButton[index].btnstate)
                    {
                        huxingButton[index].ClickDown();
                    }
                    console.log("===============================================         ");
                    console.log(hxName);
                }

            }


        },
        PlayHXSequenceAnimation(animationID, loopTime = -1)
        {
            let callBackString = "XR.PlayHXSequenceAnimation(" + animationID + "," + loopTime + "," + this.mirrorVector[0] + "," + this.mirrorVector[1] + "," + this.mirrorVector[2] + ")";
            XR.ChangeCamera("CameraUniversalAutoPlay", XR.CallBack("JsRun", callBackString), 0, false);
        },
        StopHXSequenceAnimation()
        {
            XR.StopHXSequenceAnimation();
        },
        ExitRoom()
        {
            compasspage.FadeIn();
            minimappage.FadeOut();
            XR.SetViewInnerWindowSate(false, "", 0, 0, 0, 0);
            //            XR.SetLevelVisible("美术关卡", true);
            xfpage.dispalyState[9] = false;
            xfpage.dispalyState[4] = true;
            mainpage.SetVisible("visible");
            this.isEnterroom = false;
            //this.$refs.enterroomrect.PlayAni(true,"","opacity:1;bottom:15%");	
            this.displayEnterRoomBtn = true;

            //    this.$refs.xfmenurect.PlayAni(true, "", "opacity:1;right:0%");

            //this.$refs.xfindoorinforect.PlayAni(false, "", "top:-10%");

            //           XR.SetLevelVisible(this.sceneMapName, false);
            switch (this.enterType)
            {
                case 0:
                    this.isShowhxxzsmallbtnrect = true;
                    this.$refs.hxxzbtngrouprect.PlayAni(true, "", "right:0%");
                    this.$refs.xfmenurect.PlayAni(false, "", "right:-30%");
                    this.$refs.hxxzbtnrootgroup.$children[xfpage.hxxzbtngroupid].SetButtonState(true, true);
                    break;

                case 1:
                    this.$refs.xfmenurect.PlayAni(true, "", "right:0%");
                    break;
            }


            //this.$refs.hxmenubtngroup.ResetAllButtonState();
            this.$refs.hxmenuroot.PlayAni(false, "", "bottom:-30%");
            this.$refs.hxxzinforect.PlayAni(false, "", "left:-30%");
            this.$refs.hxmenuroot.PlayAni(false, "", "bottom:-30%");
            this.$refs.xfindoorinforect.PlayAni(false, "", "left:-30%");
            this.isShowhxtymyrect = false;
            this.isShowmymentstate = false;


            XR.SetLevelVisible("main", true);
            XR.SetActiveSceneInstance("main");
            XR.ExitRoom(this.isEnterroom);

            xfpage.OnExitRoom();
            //            XR.ResetScene(this.sceneMapName);
            //XR.UnLoadSceneLoop([this.sceneMapName], "", "", XR.CallBack("JsRun", 'xfpage.OnExitRoom();'));
        },
        OnExitRoom()
        {
            minimappage.displayxfroomfloors = false;

            loadingpage.FadeOut();

        },
        onVirtualScroll({ index })
        {

        },
        RemapFloorItems(inFloors)
        {

            let outArray = [];
            for (let i = 0;i < this.floorRemap.length;i++)
            {
                let splitArray = this.floorRemap[i].split("-");
                if (splitArray.length != 2)
                {
                    console.error("floor item error");
                    break;
                }
                let start = parseInt(splitArray[0]);
                let end = parseInt(splitArray[1]);

                for (let j = 0;j < inFloors.length;j++)
                {
                    if (inFloors[j] >= start && inFloors[j] <= end)
                    {
                        outArray.push(this.floorRemap[i]);
                        break;
                    }
                }
            }
            console.log(outArray);
            return outArray;
        },
        UpDataSelect(argString, jsonData)
        {
            if (!jsonData)
                return;
            console.log(jsonData);
            //                        title: ["build", "unit", "floor", "room", "huxingname", "guige", "type", "forward", "salestatus"],
            //                        selectState: ["", "", "", "", "", "", "", "", ""],

            ///CH
            this.buildInfo = jsonData.build[0];
            this.unitInfo = jsonData.unit[0];

            console.log("KKKKKKKKKKK:" + jsonData.room);


            for (let index = 0;index < this.title.length;index++) //循环筛选项头
            {
                let coloumName = this.title[index];
                let vGroup = this.viewlistgroup[index];
                let eGroup = jsonData[this.title[index]];


                if (coloumName == "unit" && jsonData[this.title[index]].length == 0)
                {
                    //如果unit数组长度为0需要清空unit的已选项
                    this.selectState[index] = "";
                }

                if (coloumName == "floor")
                {
                    eGroup = this.RemapFloorItems(jsonData[this.title[index]]);

                    //如果floor数组长度为0需要清空floor的已选项
                    if (jsonData[this.title[index]].length == 0)
                    {
                        this.selectState[index] = "";
                        this.startFloor = "";
                        this.endFloor = "";
                    }
                }


                if (coloumName == "room") //每次都需要清空room房间
                {
                    if (vGroup.length > 0) //如果ViewGroup中的数组数据大于0
                    {
                        let l = vGroup.length;
                        for (let j = 0;j < l;j++) //pop数据
                        {
                            vGroup.pop();
                        }
                    }
                }

                if (eGroup.length > 0) //如果这组含有数据
                {
                    if (vGroup.length == 0) //如果ViewGroup中的数组数据为0
                    {
                        for (let i = 0;i < eGroup.length;i++) //塞数据
                        {
                            e = eGroup[i];
                            vGroup.push(e);
                        }
                    } //没有数据
                    else //更新按钮状态
                    {
                        for (let j = 0;j < vGroup.length;j++) //遍历数据按钮组
                        {
                            if (coloumName == "floor")
                                break;
                            for (let k = 0;k < eGroup.length;k++) //遍历json数据组
                            {
                                let refsname = coloumName + '_' + j;
                                let b = this.$refs[coloumName][0].$refs[refsname][0];
                                if (b.argjson.item == jsonData[coloumName][k]) //两组数据对比
                                {
                                    b.SetEnable(true);
                                    break;
                                } else //更新按钮状态
                                {
                                    b.SetEnable(false);
                                }

                            }
                        }
                    }
                } else // 如果这组没有含有数据
                {
                    if (vGroup.length > 0) //如果ViewGroup中的数组数据大于0
                    {
                        let l = vGroup.length;
                        for (let j = 0;j < l;j++) //pop数据
                        {
                            vGroup.pop();

                        }
                    }
                }
            }

        },
        GetHttpData()
        {
            //之请求一次
            ShttpUtil.GetSeverHttp("http://mfzs.mfyke.com/MfAssistant/project/queryProjectAllHouse?projectId=202005080001", xfpage.sucCallBack, xfpage.failCallBack);
        },
        sucCallBack(data)
        {
            console.log(data)
            let roomNameArray = [];
            let roomSaleStatusArray = [];
            let roomConstructionPriceArray = [];
            let roomCustomNameArray = [];
            let roomCustomPhoneArray = [];
            if (data == undefined)
            {
                console.log("server http requset is error");
            }

            for (let i = 0;i < data.body.data.length;i++)
            {
                //blocksArray.push(data.body.data[i]);
                for (let index = 0;index < data.body.data[i].length;index++)
                {
                    //buildName - unitNo - roomName 
                    //console.log(data.body.data[i][index])
                    let roomData = data.body.data[i][index];
                    let roomName = roomData.buildName + "-" + roomData.unitNo + "-" + roomData.roomName;

                    let roomSale = roomData.saleStatus;
                    let roomConstructionPrice = roomData.constructionPrice;
                    let roomCustomName = roomData.customName;
                    let roomCustomPhone = roomData.customPhone;
                    roomNameArray.push(roomName);
                    roomSaleStatusArray.push(roomSale);
                    roomConstructionPriceArray.push(roomConstructionPrice);
                    roomCustomNameArray.push(roomCustomName);
                    roomCustomPhoneArray.push(roomCustomPhone);
                }
            }
            let allRoomStr = roomNameArray.join(",");
            let allRoomSaleStr = roomSaleStatusArray.join(",");
            let allRoomConsPriceStr = roomConstructionPriceArray.join(",");
            let allRoomCustomNameStr = roomCustomNameArray.join(",");
            let allRoomCustomPhoneStr = roomCustomPhoneArray.join(",");
            XR.UpDataRoomState("updataroom", allRoomStr, allRoomSaleStr, allRoomConsPriceStr, allRoomCustomNameStr, allRoomCustomPhoneStr);
            /* console.log(allRoomStr);
            console.log(allRoomSaleStr);
            console.log(allRoomConsPriceStr);
            console.log(allRoomCustomNameStr);
            console.log(allRoomCustomPhoneStr); */
            /* let allRoomStr = room.join(",");
            let allState = saleStatusarr.join(",");
            let allStandStr = standardTotalPricearr.join(","); */
            //let roomstr = dataID + "-" + uniton[index] + "-" + roomname[index];


            /*let blocksArray = [];
            let buildsArray = [];
            let buildIDArray = [];
            for (let i = 0;i < data.body.blocks.length;i++)
            {
                blocksArray.push(data.body.blocks[i]);
                //console.log(data.body.blocks[i])
            }
            for (let j = 0;j < blocksArray.length;j++)
            {
                buildsArray.push(blocksArray[j].builds)
            }
            for (let k = 0;k < buildsArray.length;k++)
            {
                if (buildsArray[k].length > 0)
                {
                    buildIDArray.push(buildsArray[k]);
                }

            }
            for (let index = 0;index < buildIDArray.length;index++)
            {
                for (let i = 0;i < buildIDArray[index].length;i++)
                {
                    this.buildIDarr.push(buildIDArray[index][i].buildId);
                    this.buildNamearr.push(buildIDArray[index][i].buildName);
                }
            }
            console.log(this.buildIDarr)
            this.TimeToUpdataRoomState(); */
        },
        failCallBack(data)
        {
            console.log("22222222222")
        },
        BuildIDPostSuc(data, dataID)
        {
            //console.log(data);
            //console.log(dataID);
            this.unitNos = data.body.unitNos;
            console.log(this.unitNos);
            this.TimeToUpdataRoomStateAndUnit();
            /* console.log(room);
            console.log(saleStatusarr);
            console.log(standardTotalPricearr); */
            //console.log("0000000000000000000000000")
            //unitNos
        },
        BuildIDPostSucs(data, dataID)
        {
            //console.log(data);
            //console.log(dataID);
            let uniton = [];
            let roomname = [];
            let room = [];
            let saleStatusarr = [];
            let standardTotalPricearr = [];
            for (let index = 0;index < data.body.houses.length;index++)
            {
                uniton.push(data.body.houses[index].unitNo);
                roomname.push(data.body.houses[index].roomName);
                saleStatusarr.push(data.body.houses[index].saleStatus);
                standardTotalPricearr.push(data.body.houses[index].standardTotalPrice);
                //console.log(data.body.houses[index].houseId);
            }
            for (let index = 0;index < roomname.length;index++)
            {
                let roomstr = dataID + "-" + uniton[index] + "-" + roomname[index];
                room.push(roomstr);
            }
            let allRoomStr = room.join(",");
            let allState = saleStatusarr.join(",");
            let allStandStr = standardTotalPricearr.join(",");
            //            console.log(allRoomStr)           
            XR.UpDataRoomState("updataroom", allRoomStr, allState, allStandStr);
            /* console.log(room);
            console.log(saleStatusarr);
            console.log(standardTotalPricearr); */
            //console.log("0000000000000000000000000")
            //unitNos
        },
        TimeToUpdataRoomState()
        {
            this.lognumber = 0;
            let str = "http://e.meifangquan.com/MfAssistant/project/getHouseList?"
            for (let index = 0;index < this.buildIDarr.length;index++)
            {

                let newstr = str + "buildId=" + this.buildIDarr[index];
                this.buildName = this.buildNamearr[index];
                ShttpUtil.PostSeverHttp(newstr, xfpage.BuildIDPostSuc, xfpage.failCallBack, this.buildName);
                this.lognumber++;
            }
            console.log(this.lognumber);
        },
        TimeToUpdataRoomStateAndUnit()
        {
            this.lognumber = 0;
            let str = "http://e.meifangquan.com/MfAssistant/project/getHouseList?"
            for (let index = 0;index < this.buildIDarr.length;index++)
            {
                for (let i = 0;i < this.unitNos.length;i++)
                {
                    let newstr = str + "buildId=" + this.buildIDarr[index] + "&unitNo=" + this.unitNos[i];
                    this.buildName = this.buildNamearr[index];
                    ShttpUtil.PostSeverHttp(newstr, xfpage.BuildIDPostSucs, xfpage.failCallBack, this.buildName);
                    this.lognumber++;
                }

            }
            console.log(this.lognumber);
        },
    }
})

let jgmypage = new Vue({

    el: '#jgmypage',
    data: {
        needLoadMapName: "",
    },
    methods: {
        FadeIn(inNeedLoadMapName)
        {
            this.needLoadMapName = inNeedLoadMapName;
            this.$refs.base.FadeIn();
            compasspage.FadeIn('jgmy');
        },
        OnFadeInEnter()
        {
            loadingpage.FadeIn({
                onFadeInEnd: () =>
                {
                    compasspage.FadeOut();
                    mainpage.SetVisible("hidden");
                    mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
                    XR.LoadSceneLoop([this.needLoadMapName], "", "", XR.CallBack("JsRun", 'jgmypage.OnLoadSceneLoop();'));
                    compasspage.FadeIn('jgmy');

                    //jgmypage.$refs.jgroambtngroup.$children[1].SetButtonState(true, true);
                }
            });
        },
        OnFadeInEnd()
        {

        },
        OnUnloadSceneloop()
        {
            //XR.LoadSceneLoop([this.needLoadMapName,"JGMY","JG_HP","KP_DH","nw_jz_my_hp"],"",XR.CallBack("JsRun",'XR.DebugToHtml("?????")'),XR.CallBack("JsRun",'jgroampage.OnLoadSceneLoop2();'));
            XR.LoadSceneLoop([this.needLoadMapName], "", "", XR.CallBack("JsRun", 'jgmypage.OnLoadSceneLoop2();'));

        },
        OnLoadSceneLoop()
        {
            XR.SetActiveSceneInstance(this.needLoadMapName, "CameraUniversalMY", XR.CallBack("JsRun", 'jgmypage.OnEnterJGMY();'));

        },
        OnEnterJGMY()
        {
            //  jgroampage.$refs.jgroambtngroup.$children[0].SetButtonState(true, true);
            //  jgroampage.$refs.jgroambtngroup.lastbtn = jgroampage.$refs.jgroambtngroup.$children[0];
            // jgmypage.$refs.jgroambtngroup.$children[1].SetButtonState(true, true);
            XR.DebugToHtml("5555555555555555");

            loadingpage.FadeOut({
                onFadeOutEnd: () =>
                {
                    jgmypage.$refs.jgroambtngroup.$children[1].ClickDown();

                }
            });

        },
        OnJgmySceneInstanceActive(jsonObject)
        {
            mainpage.SetVisible("Hidden");
            minimappage.FadeIn(jsonObject);
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
            // this.ExitjgRoam();
            jgmypage.StopHXSequenceAnimation();
            this.OnExitjgRoam();
            compasspage.FadeOut();
            XR.SetLevelVisible("jgmy1", false);
        },
        OnFadeOutEnd()
        {

        },
        ExitjgRoam()
        {

            loadingpage.FadeIn({
                onFadeInEnd: () =>
                {
                    XR.UnLoadSceneLoop([this.needLoadMapName, "JGMY", "JG_HP", "KP_DH", "nw_jz_my_hp"], "", "", XR.CallBack("JsRun", 'jgroampage.OnExitjgRoam();'));
                }
            });

            //XR.UnLoadSceneLoop([this.needLoadMapName,"JGMY","JG_HP","KP_DH","nw_jz_my_hp"],"","",XR.CallBack("JsRun",'jgroampage.OnExitjgRoam();'));	
        },
        OnExitjgRoam()
        {
            XR.SetLevelVisible("main", true);
            // XR.LoadSceneLoop(["WW_8dk_JM", "NW_DX", "WW_DX", "WW_JM", "XP"], "", "", XR.CallBack("JsRun", 'jgroampage.OnExitjgRoamEnd();'));
            jgroampage.OnExitjgRoamEnd();
        },
        OnExitjgRoamEnd()
        {
            XR.SetActiveSceneInstance("main", "CameraUniversalNY", XR.CallBack("JsRun", 'loadingpage.FadeOut();'));
            mainpage.SetVisible("visible");
            mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
            compasspage.FadeIn();
            minimappage.FadeOut();

        },
        PlayHXSequenceAnimation(animationID, loopTime = -1)
        {
            XR.PlayHXSequenceAnimation(animationID, loopTime);
        },
        StopHXSequenceAnimation()
        {
            XR.StopHXSequenceAnimation();
        },
    },

}
)



let jgroampage = new Vue({
    el: '#jgroampage',
    data: {
        needLoadMapName: ""
    },
    methods: {
        FadeIn(inNeedLoadMapName)
        {
            this.needLoadMapName = inNeedLoadMapName;
            this.$refs.base.FadeIn();
        },
        OnFadeInEnter()
        {
            loadingpage.FadeIn({
                onFadeInEnd: () =>
                {
                    compasspage.FadeOut();
                    mainpage.SetVisible("hidden");
                    XR.SetLevelVisible("main", false);
                    XR.UnLoadSceneLoop(["WW_8dk_JM", "NW_DX", "WW_DX", "WW_JM", "XP"], "", "", XR.CallBack("JsRun", 'jgroampage.OnUnloadSceneloop()'));
                }
            });
        },
        OnFadeInEnd()
        {

        },
        OnUnloadSceneloop()
        {
            //XR.LoadSceneLoop([this.needLoadMapName,"JGMY","JG_HP","KP_DH","nw_jz_my_hp"],"",XR.CallBack("JsRun",'XR.DebugToHtml("?????")'),XR.CallBack("JsRun",'jgroampage.OnLoadSceneLoop2();'));
            XR.LoadSceneLoop([this.needLoadMapName, "JGMY", "JG_HP", "KP_DH", "nw_jz_my_hp"], "", "", XR.CallBack("JsRun", 'jgroampage.OnLoadSceneLoop2();'));

        },
        OnLoadSceneLoop2()
        {
            XR.DebugToHtml("333333333333333333");
            XR.SetActiveSceneInstance(this.needLoadMapName, "CameraUniversalMY", XR.CallBack("JsRun", 'jgroampage.OnEnterJGMY();'));
            XR.DebugToHtml("444444444444444444");
        },
        OnEnterJGMY()
        {
            jgroampage.$refs.jgroambtngroup.$children[0].SetButtonState(true, true);
            jgroampage.$refs.jgroambtngroup.lastbtn = jgroampage.$refs.jgroambtngroup.$children[0];
            XR.DebugToHtml("5555555555555555");

            xfpage.mirrorVector = [1, 1, 1];
            minimappage.SetMirrorState(1, 1);
            XR.GetHuXingFloorMinimapInfo(0);

            loadingpage.FadeOut({
                onFadeOutEnd: () =>
                {

                }
            });

        },
        OnFadeInEnd()
        {

        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
            this.ExitjgRoam();
        },
        OnFadeOutEnd()
        {

        },
        ExitjgRoam()
        {

            loadingpage.FadeIn({
                onFadeInEnd: () =>
                {

                    XR.UnLoadSceneLoop([this.needLoadMapName, "JGMY", "JG_HP", "KP_DH", "nw_jz_my_hp"], "", "", XR.CallBack("JsRun", 'jgroampage.OnExitjgRoam();'));
                }
            });

            //XR.UnLoadSceneLoop([this.needLoadMapName,"JGMY","JG_HP","KP_DH","nw_jz_my_hp"],"","",XR.CallBack("JsRun",'jgroampage.OnExitjgRoam();'));	
        },
        OnExitjgRoam()
        {
            XR.SetLevelVisible("main", true);
            XR.LoadSceneLoop(["WW_8dk_JM", "NW_DX", "WW_DX", "WW_JM", "XP"], "", "", XR.CallBack("JsRun", 'jgroampage.OnExitjgRoamEnd();'));
        },
        OnExitjgRoamEnd()
        {
            XR.SetActiveSceneInstance("main", "CameraUniversalNY", XR.CallBack("JsRun", 'loadingpage.FadeOut();'));
            mainpage.SetVisible("visible");
            compasspage.FadeIn();
            minimappage.FadeOut();

        },
        PlayHXSequenceAnimation(animationID, loopTime = -1)
        {
            let callBackString = "XR.PlayHXSequenceAnimation(" + animationID + "," + loopTime + ")";
            XR.ChangeCamera("CameraUniversalAutoPlay", XR.CallBack("JsRun", callBackString), 0, false);
        },
        StopHXSequenceAnimation()
        {
            XR.StopHXSequenceAnimation();
        },
    }
})

let compasspage = new Vue({
    el: '#compasspage',
    data: {
        compassstyle: "",
        compassname: ""
    },
    methods: {
        FadeIn(compassname)
        {
            this.DisPlayCompass(compassname);
            this.$refs.base.FadeIn();
        },
        OnFadeInEnter()
        {

        },

        OnFadeInEnd()
        {

        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd() { },
        UpdateCompassRot(mainPos)
        {
            let rotx = 270 - mainPos.posAndxCount[3];
            this.compassstyle = 'transform:rotate(' + rotx + 'deg);';
        },
        DisPlayCompass(compassname)
        {
            this.compassname = compassname;
        }
    }
})

let minimappage = new Vue({
    el: '#minimappage',
    data: {
        zoomState: false,
        campos: "",
        mirrorx: 1,
        mirrory: 1,
        mirrorstyle: "",
        minimapsrc: "",
        points: [],
        roomfloors: [],
        roompoint: [],
        defaultpoint: {},
        mapcx: 0,
        mapcx: 0,
        mapmaxside: 0,
        mapmaxsidehalf: 0,
        miniMapPth: [],
        displayxfroomfloors: false,
        mInfo: {},
        selecthxfloor: (btn) =>
        {
            minimappage.UpDateFloorMinimap(btn.index)
        },
        selectpoints: (btn) =>
        {
            minimappage.ChoosePoint(btn.argjson.item.argjson);
        }
    },
    methods: {
        FadeIn(inMinimapInfo, defaultfloor = 0)
        {
            minimappage.mInfo = inMinimapInfo;

            console.log(minimappage.mInfo + "      --------------      " + defaultfloor)

            for (let i = 0;i < 9;i++)
            {
                minimappage.roomfloors.pop();
            }
            for (let i = 0;i < minimappage.mInfo.floors.length;i++)
            {
                minimappage.roomfloors.push(minimappage.mInfo.floors[i] + "FFF");
            }
            if (minimappage.mInfo.floorsmapjson[defaultfloor] == undefined)
            {
                minimappage.FadeOut();
                return;
            }
            minimappage.UpDateFloorMinimap(0);

            this.$refs.base.FadeIn();
        },
        UpDateFloorMinimap(floor)
        {

            let mp = minimappage.mInfo.floorsmapjson[floor];
            for (let i = 0;i < 20;i++)
            {
                minimappage.points.pop();
            }

            console.log(this.points.length)
            this.defaultpoint = {};

            this.minimapsrc = "image/minimap/" + mp.minimappath;

            if (mp.camerapointpos.length > 0)
                this.defaultpoint = mp.camerapointpos[0];

            this.mapcx = mp.minimappos[0];
            this.mapcy = mp.minimappos[1];
            this.mapmaxside = mp.minimappos[2];
            this.mapmaxsidehalf = mp.minimappos[3];

            for (let i = 0;i < mp.camerapointpos.length;i++)
            {
                if (mp.camerapointpos[i].isdefaultpos)
                {
                    this.defaultpoint = mp.camerapointpos[i];
                }
                let p = mp.camerapointpos[i];

                let leftPos = (p.pos2[0] - this.mapcx) / this.mapmaxsidehalf * 200 + 200 - 16;
                let topPos = (p.pos2[1] - this.mapcy) / this.mapmaxsidehalf * 200 + 200 - 16;

                let fonttrans = "scale(" + this.mirrorx + "," + this.mirrory + ")";
                let poi = { fonttrans: fonttrans, fontsize: 0, fontcolor: 'rgb(255,255,255)', label: p.roomspacename, absolute: 'absolute', vrmouselabel: p.roomspacename, id: 'minipointpos' + i, left: leftPos, top: topPos, imgon: 'image/my_dingwei.png', argjson: p };
                this.points.push(poi);
                // this.points[i] =poi;
                this.miniMapPth.push(p.panoramicPath);
                console.log(this.points);
            }



            // ES_outdoor
            // ES_outdoor_720
            // ES_maopi
            // ES_maopi_720
            // ES_jz
            // ES_jz_720

            switch (minimappage.mInfo.sceneType)
            {
                case "ES_maopi":
                    xfpage.UpdataRoomPoints(this.points);
                    break;

                case "ES_jz_720":
                    f3dpage.FadeIn(this.defaultpoint.panoramicPath);
                    XR.UseNullRender(true);
                    break;

                case "ES_jgmy_xlz":
                    xlzPage.FadeIn("piclist/" + this.defaultpoint.xlzBasePath, this.defaultpoint.xlzStar, this.defaultpoint.xlzEnd, this.defaultpoint.xlzIsLoop);
                    XR.UseNullRender(true);
                    break;

                default:
                    break;
            }

        },
        OnFadeInEnter()
        {
            //example
            if (minimappage.mInfo.sceneType == "ES_jz_720")
            {
                minimappage.$refs.minimapsaclerect.PlayAni(true, "", "right:undefined;left:50px", 0.0);
            }
            else if (minimappage.mInfo.sceneType == "ES_jgmy_xlz")
            {
                minimappage.$refs.minimapsaclerect.PlayAni(true, "", "left:undefined;right:50px", 0.0);
            }
            else if (minimappage.mInfo.sceneType == "ES_jgmy")
            {
                minimappage.$refs.minimapsaclerect.PlayAni(true, "", "left:undefined;right:50px", 0.0);
            }
            else
            {
                minimappage.$refs.minimapsaclerect.PlayAni(true, "", "right:undefined;left:50px", 0.0);
                console.log("小地图进入：00000000000000000000000000");
            }
        },
        OnFadeInEnd()
        {
            this.ChoosePoint(this.defaultpoint);
        },
        FadeOut()
        {
            minimapsrc = "";
            if (minimappage.mInfo.sceneType == "ES_jz_720")
            {
                f3dpage.FadeOut();
            }
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {

        },
        ChoosePoint(p)
        {
            if (p.pos)
                XR.LookAtRedAxis(p.pos[0], p.pos[1], p.pos[2], p.forward[0], p.forward[1], p.forward[2], xfpage.mirrorVector[0], xfpage.mirrorVector[1], xfpage.mirrorVector[2]);

            if (minimappage.mInfo.sceneType == "ES_jz_720")
            {
                f3dpage.LoadMap(p.panoramicPath);
            }
            else if (minimappage.mInfo.sceneType == "ES_jgmy_xlz")
            {
                xlzPage.LoadXlz("piclist/" + p.xlzBasePath, p.xlzStar, p.xlzEnd);
            }
            else if (minimappage.mInfo.sceneType == "ES_jgmy")
            {
                jgmypage.StopHXSequenceAnimation();
            }
        },
        UpdateCameraPos(mainPos)
        {
            let leftPos = ((mainPos.posAndxCount[0] * xfpage.mirrorVector[0] - this.mapcx) / this.mapmaxsidehalf * 200 + 200 - 32);
            let topPos = ((mainPos.posAndxCount[1] * xfpage.mirrorVector[1] - this.mapcy) / this.mapmaxsidehalf * 200 + 200 - 32);

            let rotx = mainPos.posAndxCount[3] + 90;
            rotx *= xfpage.mirrorVector[0];
            if (xfpage.mirrorVector[1] == -1)
                rotx = 180 - rotx;

            this.campos = 'transform:rotate(' + rotx + 'deg);';
            this.campos += 'left:' + leftPos + 'px;';
            this.campos += 'top:' + topPos + 'px;';
        },
        SetMirrorState(mX, mY) //此函数会比FadeIn函数更早被调用
        {
            this.mirrorx = mX;
            this.mirrory = mY;
            minimappage.mirrorstyle = "transform:scale(" + mX + "," + mY + ")";
        },
        OnScale(scale)
        {
            if (!this.zoomState)
            {
                console.log("minimap ZoomLarge!");
                this.$refs.minimapsaclerect.pos = "relative";
                this.$refs.minimapsaclerect.trans = "scale(" + scale + ")";
            } else
            {

                console.log("minimap ZoomSmall!");
                this.$refs.minimapsaclerect.pos = "absolute";
                this.$refs.minimapsaclerect.trans = "scale(1)";
            }
            this.zoomState = !this.zoomState;

        }


    }
})


let selectremotepage = new Vue({
    el: '#selectremotepage',
    data: {
        urlBaseString: "",
        vrMouseCtrlUE4ClientGuid: "",
        isWaitingChoose: true,
        remoteClientList: [],
        //发送通知控制端,本端已经准备好被控制
        alertConectGuid: "",
        selectRemoteClient: (btn) =>
        {
            selectremotepage.OnSelectRemoteClient(btn);
        }
    },
    methods: {
        FadeIn(clientList)
        {
            let finalClientList = [];
            if (clientList)
            {
                for (let i = 0;i < clientList.clientList.length;i++)
                {
                    if (websocket.yourGuid != clientList.clientList[i].guidHexString)
                    {
                        console.log(clientList.clientList[i].guidHexString);
                        finalClientList.push(clientList.clientList[i].guidHexString);
                    }
                }
            }

            this.remoteClientList = finalClientList;
            this.$refs.base.FadeIn();
            XR.DebugToHtml("selectremotepage FadeIn");

            isWaitingChoose = true;
            this.LoopProcess();
        },
        LoopProcess()
        {
            if (selectremotepage.isWaitingChoose)
            {
                setTimeout(function ()
                {
                    let now = new Date();

                    for (let i = 0;i < selectremotepage.remoteClientList.length;i++)
                    {
                        if (selectremotepage.remoteClientList[i].addTime + 5000 < now.getTime())
                        {
                            selectremotepage.remoteClientList.shift();
                        }
                    }

                    selectremotepage.LoopProcess();
                }, 1000);
            }
        },
        AddRemoteClient(jsonData)
        {
            let now = new Date();
            jsonData.addTime = now.getTime();

            for (let i = 0;i < this.remoteClientList.length;i++)
            {
                if (this.remoteClientList[i].guidHexString == jsonData.guidHexString)
                {
                    this.remoteClientList[i].addTime = now.getTime();
                    console.log(this.remoteClientList[i].addTime);
                    return;
                }
            }

            this.remoteClientList.push(jsonData);

        },
        OnFadeInEnter()
        {

        },
        OnFadeInEnd()
        {

        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
            isWaitingChoose = false;
        },
        OnFadeOutEnd()
        {


        },
        OnSelectRemoteClient(btn)
        {
            console.log(btn.argjson.item);
            websocket.SendWSMessage("SetRemoteClient", btn.argjson.item.guidHexString);
        }
    }
})

let webrtcvideopage = new Vue({
    el: '#webrtcvideopage',
    data: {
        playerId: -1,
        webRtcPlayerObj: undefined,
        onVideoPlay: function () { }
    },
    methods: {
        FadeIn(clientList)
        {
            this.$refs.base.FadeIn();
            XR.DebugToHtml("webrtcvideopage FadeIn");
        },
        OnFadeInEnter()
        {

        },
        OnFadeInEnd()
        {

        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {


        },
        SendVideoQualityMessage(level)
        {
            let maxW = 1920.0;
            let maxH = 1080.0;
            let scaleFactor = maxW / maxH;
            let w = window.innerWidth * window.devicePixelRatio;
            let h = window.innerHeight * window.devicePixelRatio;
            let currentScaleFactor = w / h;

            //如果比较宽,用宽做大边
            if (currentScaleFactor > scaleFactor)
            {
                if (w > maxW)
                {
                    h *= maxW / w;
                    w = maxW;
                }
            }
            else//如果比较窄，用高做大边
            {
                if (h > maxH)
                {
                    w *= maxH / h;
                    h = maxH;
                }
            }


            XR.SetUEViewportSize(Math.floor(w), Math.floor(h));
            XR.ExecuteUEConsoleCommand("Encoder.RateControl ConstQP");
            XR.ExecuteUEConsoleCommand("t.MaxFPS 24");

            switch (level)
            {
                case "low":
                    XR.ExecuteUEConsoleCommand("Encoder.MinQP 42");
                    break;

                case "mid":
                    XR.ExecuteUEConsoleCommand("Encoder.MinQP 36");
                    break;

                case "high":
                    XR.ExecuteUEConsoleCommand("Encoder.MinQP 30");

                    break;

            }

        },
        OnWebRTCMessage(jsonData)
        {
            console.log(jsonData)
            switch (jsonData.type)
            {
                case "config":
                    webrtcvideopage.onConfig(jsonData);
                    webrtcvideopage.playerId = jsonData.playerId;
                    console.log("webrtcvideopage.playerId " + webrtcvideopage.playerId);
                    break;
                case "answer":
                    webrtcvideopage.onWebRtcAnswer(jsonData);
                    break;
                case "iceCandidate":
                    webrtcvideopage.onWebRtcIce(jsonData.candidate);
                    break;
                default:
                    console.log(`invalid SS message type: ${jsonData.type}`);
                    break;
            }
        },
        setupWebRtcPlayer(htmlElement, config)
        {
            webrtcvideopage.webRtcPlayerObj = new webRtcPlayer({ peerConnectionOptions: config.peerConnectionOptions });
            htmlElement.appendChild(webrtcvideopage.webRtcPlayerObj.video);
            //            htmlElement.appendChild(freezeFrameOverlay);

            webrtcvideopage.webRtcPlayerObj.onWebRtcOffer = function (offer)
            {
                //                if (ws && ws.readyState === WS_OPEN_STATE) {
                //                    let offerStr = JSON.stringify(offer);
                //                    console.log(`-> SS: offer:\n${offerStr}`);
                //                   ws.send(offerStr);
                //               }
                let offerStr = JSON.stringify({ type: offer.type, playerId: webrtcvideopage.playerId, sdp: offer.sdp });
                console.log(offerStr);
                websocket.SendWSMessage("TransmitMessageToWebRTCProxy", "", offerStr);
            };

            webrtcvideopage.webRtcPlayerObj.onWebRtcCandidate = function (candidate)
            {
                //                if (ws && ws.readyState === WS_OPEN_STATE) {
                //                    console.log(`-> SS: iceCandidate\n${JSON.stringify(candidate, undefined, 4)}`);
                //                    ws.send(JSON.stringify({ type: 'iceCandidate', candidate: candidate }));
                //                }

                let candidateStr = JSON.stringify({ type: 'iceCandidate', playerId: webrtcvideopage.playerId, candidate: candidate });
                console.log(candidateStr);
                websocket.SendWSMessage("TransmitMessageToWebRTCProxy", "", candidateStr);

            };

            webrtcvideopage.webRtcPlayerObj.onVideoInitialised = function ()
            {

                if (webrtcvideopage.webRtcPlayerObj)
                {
                    XR.DebugToHtml("WebRTC Video Start Play!");
                    console.log('WebRTC Video Start Play!');
                    webrtcvideopage.webRtcPlayerObj.video.muted = true;
                    webrtcvideopage.webRtcPlayerObj.video.play();
                    webrtcvideopage.onVideoPlay();
                }

            };

            webrtcvideopage.webRtcPlayerObj.onDataChannelConnected = function ()
            {
                console.log('WebRTC connected, waiting for video');
            };

            function showFreezeFrame()
            {
                let base64 = btoa(freezeFrame.jpeg.reduce((data, byte) => data + String.fromCharCode(byte), ''));
                freezeFrameOverlay.src = 'data:image/jpeg;base64,' + base64;
                freezeFrameOverlay.onload = function ()
                {
                    freezeFrame.height = freezeFrameOverlay.naturalHeight;
                    freezeFrame.width = freezeFrameOverlay.naturalWidth;
                    resizeFreezeFrameOverlay();
                    if (shouldShowPlayOverlay)
                    {
                        showPlayOverlay();
                        resizePlayerStyle();
                    } else
                    {
                        showFreezeFrameOverlay();
                    }
                };
            }

            webrtcvideopage.webRtcPlayerObj.onDataChannelMessage = function (data)
            {
                var view = new Uint8Array(data);
                if (freezeFrame.receiving)
                {
                    let jpeg = new Uint8Array(freezeFrame.jpeg.length + view.length);
                    jpeg.set(freezeFrame.jpeg, 0);
                    jpeg.set(view, freezeFrame.jpeg.length);
                    freezeFrame.jpeg = jpeg;
                    if (freezeFrame.jpeg.length === freezeFrame.size)
                    {
                        freezeFrame.receiving = false;
                        freezeFrame.valid = true;
                        console.log(`received complete freeze frame ${freezeFrame.size}`);
                        showFreezeFrame();
                    } else if (freezeFrame.jpeg.length > freezeFrame.size)
                    {
                        console.error(`received bigger freeze frame than advertised: ${freezeFrame.jpeg.length}/${freezeFrame.size}`);
                        freezeFrame.jpeg = undefined;
                        freezeFrame.receiving = false;
                    } else
                    {
                        console.log(`received next chunk (${view.length} bytes) of freeze frame: ${freezeFrame.jpeg.length}/${freezeFrame.size}`);
                    }
                } else if (view[0] === ToClientMessageType.QualityControlOwnership)
                {
                    let ownership = view[1] === 0 ? false : true;
                    // If we own the quality control, we can't relenquish it. We only loose
                    // quality control when another peer asks for it
                    if (qualityControlOwnershipCheckBox !== null)
                    {
                        qualityControlOwnershipCheckBox.disabled = ownership;
                        qualityControlOwnershipCheckBox.checked = ownership;
                    }
                } else if (view[0] === ToClientMessageType.Response)
                {
                    let response = new TextDecoder("utf-16").decode(data.slice(1));
                    for (let listener of responseEventListeners.values())
                    {
                        listener(response);
                    }
                } else if (view[0] === ToClientMessageType.Command)
                {
                    let commandAsString = new TextDecoder("utf-16").decode(data.slice(1));
                    console.log(commandAsString);
                    let command = JSON.parse(commandAsString);
                    if (command.command === 'onScreenKeyboard')
                    {
                        showOnScreenKeyboard(command);
                    }
                } else if (view[0] === ToClientMessageType.FreezeFrame)
                {
                    freezeFrame.size = (new DataView(view.slice(1, 5).buffer)).getInt32(0, true);
                    freezeFrame.jpeg = view.slice(1 + 4);
                    if (freezeFrame.jpeg.length < freezeFrame.size)
                    {
                        console.log(`received first chunk of freeze frame: ${freezeFrame.jpeg.length}/${freezeFrame.size}`);
                        freezeFrame.receiving = true;
                    } else
                    {
                        console.log(`received complete freeze frame: ${freezeFrame.jpeg.length}/${freezeFrame.size}`);
                        showFreezeFrame();
                    }
                } else if (view[0] === ToClientMessageType.UnfreezeFrame)
                {
                    invalidateFreezeFrameOverlay();
                } else
                {
                    console.error(`unrecognised data received, packet ID ${view[0]}`);
                }
            };

            //            registerInputs(webrtcvideopage.webRtcPlayerObj.video);

            // On a touch device we will need special ways to show the on-screen keyboard.
            //            if ('ontouchstart' in document.documentElement) {
            //               createOnScreenKeyboardHelpers(htmlElement);
            //            }

            if (webrtcvideopage.webRtcPlayerObj)
            {
                console.log('Creating offer');
                webrtcvideopage.webRtcPlayerObj.createOffer();
            } else
            {
                console.log('WebRTC player not setup, cannot create offer');
            }

            return webrtcvideopage.webRtcPlayerObj.video;
        },
        // Config data received from WebRTC sender via the Cirrus web server
        onConfig(config)
        {
            let playerDiv = document.getElementById('player');
            let playerElement = webrtcvideopage.setupWebRtcPlayer(playerDiv, config);
        },
        onWebRtcAnswer(webRTCData)
        {
            webrtcvideopage.webRtcPlayerObj.receiveAnswer(webRTCData);

            let printInterval = 1 * 60 * 1000; /*Print every 5 minutes*/
            let nextPrintDuration = printInterval;

            webrtcvideopage.webRtcPlayerObj.onAggregatedStats = (aggregatedStats) =>
            {
                let numberFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 0 });
                let timeFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 0, minimumIntegerDigits: 2 });
                let statsText = '';

                // Calculate duration of run
                let runTime = (aggregatedStats.timestamp - aggregatedStats.timestampStart) / 1000;
                let timeValues = [];
                let timeDurations = [60, 60];
                for (let timeIndex = 0;timeIndex < timeDurations.length;timeIndex++)
                {
                    timeValues.push(runTime % timeDurations[timeIndex]);
                    runTime = runTime / timeDurations[timeIndex];
                }
                timeValues.push(runTime);

                let runTimeSeconds = timeValues[0];
                let runTimeMinutes = Math.floor(timeValues[1]);
                let runTimeHours = Math.floor([timeValues[2]]);

                receivedBytesMeasurement = 'B';
                receivedBytes = aggregatedStats.hasOwnProperty('bytesReceived') ? aggregatedStats.bytesReceived : 0;
                let dataMeasurements = ['kB', 'MB', 'GB'];
                for (let index = 0;index < dataMeasurements.length;index++)
                {
                    if (receivedBytes < 100 * 1000)
                        break;
                    receivedBytes = receivedBytes / 1000;
                    receivedBytesMeasurement = dataMeasurements[index];
                }

                statsText += `Duration: ${timeFormat.format(runTimeHours)}:${timeFormat.format(runTimeMinutes)}:${timeFormat.format(runTimeSeconds)}</br>`;
                statsText += `Video Resolution: ${
                    aggregatedStats.hasOwnProperty('frameWidth') && aggregatedStats.frameWidth && aggregatedStats.hasOwnProperty('frameHeight') && aggregatedStats.frameHeight ?
                        aggregatedStats.frameWidth + 'x' + aggregatedStats.frameHeight : 'N/A'
                    }</br>`;
                statsText += `Received (${receivedBytesMeasurement}): ${numberFormat.format(receivedBytes)}</br>`;
                statsText += `Frames Decoded: ${aggregatedStats.hasOwnProperty('framesDecoded') ? numberFormat.format(aggregatedStats.framesDecoded) : 'N/A'}</br>`;
                statsText += `Packets Lost: ${aggregatedStats.hasOwnProperty('packetsLost') ? numberFormat.format(aggregatedStats.packetsLost) : 'N/A'}</br>`;
                statsText += `Bitrate (kbps): ${aggregatedStats.hasOwnProperty('bitrate') ? numberFormat.format(aggregatedStats.bitrate) : 'N/A'}</br>`;
                statsText += `Framerate: ${aggregatedStats.hasOwnProperty('framerate') ? numberFormat.format(aggregatedStats.framerate) : 'N/A'}</br>`;
                statsText += `Frames dropped: ${aggregatedStats.hasOwnProperty('framesDropped') ? numberFormat.format(aggregatedStats.framesDropped) : 'N/A'}</br>`;
                statsText += `Latency (ms): ${aggregatedStats.hasOwnProperty('currentRoundTripTime') ? numberFormat.format(aggregatedStats.currentRoundTripTime * 1000) : 'N/A'}</br>`;

                let statsDiv = document.getElementById("stats");
                if (statsDiv)
                {
                    statsDiv.innerHTML = statsText;
                }

                if (true)
                {
                    if (aggregatedStats.timestampStart)
                    {
                        if ((aggregatedStats.timestamp - aggregatedStats.timestampStart) > nextPrintDuration)
                        {
                            console.log(JSON.stringify(aggregatedStats));
                            nextPrintDuration += printInterval;
                        }
                    }
                }
            };

            webrtcvideopage.webRtcPlayerObj.aggregateStats(1 * 1000 /*Check every 1 second*/);

            //let displayStats = () => { webrtcvideopage.webRtcPlayerObj.getStats( (s) => { s.forEach(stat => { console.log(JSON.stringify(stat)); }); } ); }
            //var displayStatsIntervalId = setInterval(displayStats, 30 * 1000);
        },
        onWebRtcIce(iceCandidate)
        {
            if (webrtcvideopage.webRtcPlayerObj)
                webrtcvideopage.webRtcPlayerObj.handleCandidateFromServer(iceCandidate);
        }
    }

})

let optionsPage = new Vue({
    el: '#optionsPage',
    data: {
        infogroup: '',
        exitshow: '',
        Srcimage: "",
        Srcimagearray: ["image/ui1/jszc_part1.jpg", "image/ui1/jszc_part2.jpg"],
        jszcimageIndex: 0,
    },
    methods: {
        FadeIn(targetimage)
        {
            this.src = targetimage;
            this.$refs.base.FadeIn();
            XR.DebugToHtml("OptionsPage FadeIn");

        },
        OnFadeInEnter() { },
        OnFadeInEnd()
        {
            XR.DebugToHtml("OptionsPage OnFadeInEnd");
            // optionsPage.$refs.registerimagerect.PlayAni(false, "", "transform:scale(0,0)", 0.0);
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("OptionsPage OnFadeOutEnd");

        },
        PlayNextjszc()
        {
            this.jszcimageIndex++;
            if (this.jszcimageIndex >= this.Srcimagearray.length)
            {
                this.jszcimageIndex = 0;
            }
            this.Srcimage = this.Srcimagearray[this.jszcimageIndex];
        },
        PlayPrevjszc()
        {
            this.jszcimageIndex--;
            if (this.jszcimageIndex < 0)
            {
                this.jszcimageIndex = this.Srcimagearray.length - 1;
            }
            this.Srcimage = this.Srcimagearray[this.jszcimageIndex];
        },
        Displayjszcpart()
        {
            optionsPage.$refs.partimageroot.PlayAni(true, "", "opacity:1", 0.5);
            this.$refs.exitimagerect.PlayAni(false, "", "right:-30%");
            // optionsPage.$refs.optionsmenu.PlayAni(false, "", "opacity:0", 0.5);
            optionsPage.$refs.optionsmenu.PlayAni(false, "", "right:-30%");
            this.Srcimage = this.Srcimagearray[this.jszcimageIndex];
        },

    }
})






let collsionproxypage = new Vue({
    el: '#collsionproxypage',
    data: {
        inforectpos: "",
        infovalue: ""
    },
    methods: {
        FadeIn()
        {
            this.$refs.base.FadeIn();
            XR.DebugToHtml("collsionproxypage FadeIn");
        },
        OnFadeInEnter() { },
        OnFadeInEnd()
        {
            XR.DebugToHtml("collsionproxypage OnFadeInEnd");
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("collsionproxypage OnFadeOutEnd");
        },
        CollisionHoverProcess(argString, jsonData)
        {
            switch (argString)
            {
                case "begin":
                    collsionproxypage.FadeIn();
                    this.infovalue = jsonData.guid;
                    this.inforectpos = 'left:' + parseFloat(jsonData.pos[0]) / XR.globalscale + 'px;';
                    this.inforectpos += 'top:' + parseFloat(jsonData.pos[1]) / XR.globalscale + 'px;';
                    break;
                case "updata":
                    this.inforectpos = 'left:' + parseFloat(jsonData.pos[0]) / XR.globalscale + 'px;';
                    this.inforectpos += 'top:' + parseFloat(jsonData.pos[1]) / XR.globalscale + 'px;';
                    break;
                case "end":
                    collsionproxypage.FadeOut();
                    break;
                default:
                    break;
            }
        }
    }
})


let scaleimgpage = new Vue({
    el: '#scaleimgpage',
    data: {
        src: "image/error.png",
    },
    methods: {
        FadeIn(imgurl)
        {
            if (imgurl)
                this.src = imgurl;
            this.$refs.base.FadeIn();
            XR.DebugToHtml("scaleimgpage FadeIn");
        },
        OnFadeInEnter()
        {

        },
        OnFadeInEnd()
        {
            XR.DebugToHtml("scaleimgpage OnFadeInEnd");
        },
        FadeOut()
        {
            this.$refs.base.FadeOut();
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("scaleimgpage OnFadeOutEnd");
        }
    }
})
let xlzPage = new Vue({
    el: '#xlzPage',
    data: {
        currentStarIndex: 0,
        targetIndex: 0,
        imgdivgroup: [],
        isLooping: false,
        currentEndIndex: 0,
        loopImgArray: [],
        startIndex: 1,
        endIndex: 0,
        urlStr: "",
        format: ".jpg",
        mapName: "",
        canLoop: false,
        mouseMoveNumber: 0,
        mouseNumber: 0,
        lazy: 1,
        lazy1: 1,
        lazy2: 145,
        timeLoop: {},
        k: 0,
    },
    methods: {
        FadeIn(baseUrl, startIndex, dIndex, isLoop)
        {
            this.$refs.aaa.FadeIn();
            this.startIndex = 1;
            this.endIndex = dIndex;
            this.currentStarIndex = this.startIndex;
            this.currentEndIndex = dIndex;
            this.urlStr = baseUrl;
            this.canLoop = isLoop;
            //this.beginPlay(1, 5);
            //this.$refs.base.FadeIn();
            xlzPage.currentStarIndex = 1;
            xlzPage.lazy = 1;
            console.log(startIndex)
            console.log(dIndex)
            xlzPage.lazy1 = parseInt(startIndex);
            xlzPage.lazy2 = parseInt(dIndex);
            xlzPage.mouseMoveNumber = 0;
            xlzPage.mouseNumber = 0;
            xlzPage.targetIndex = 1;
            XR.DebugToHtml("scaleimgpage FadeIn");

        },
        StartEnter()
        {
            XR.SetLevelVisible("jgmy_xlz", true);
            XR.SetActiveSceneInstance("jgmy_xlz", "CameraUniversalMY");
        },
        StartLoop()
        {
            xlzPage.timeLoop = setInterval(() =>
            {
                if (xlzPage.currentStarIndex == this.currentEndIndex)
                {
                    xlzPage.currentStarIndex = 0;
                    xlzPage.k = 0;
                }
                xlzPage.k++;
                xlzPage.mouseNumber = xlzPage.k;
                this.ToTargetValue(xlzPage.k);
            }, 50)
        },
        OnRoomSceneInstanceActive(jsonObject)
        {
            console.log(jsonObject);
            minimappage.displayxfroomfloors = true;
            mainpage.SetVisible("Hidden");
            minimappage.FadeIn(jsonObject);
            //            minimappage.UpDateFloorMinimap(0);
        },
        OnFadeInEnter()
        {
            this.InitXLZ();
        },
        LoadXlz(baseUrl, startIndex, dIndex, isLoop)
        {
            this.startIndex = 1;
            this.endIndex = dIndex;
            this.currentStarIndex = this.startIndex;
            this.currentEndIndex = dIndex;
            this.urlStr = baseUrl;
            this.canLoop = isLoop;
            //this.beginPlay(1, 5);
            //this.$refs.base.FadeIn();
            xlzPage.currentStarIndex = 1;
            xlzPage.lazy = 1;
            xlzPage.lazy1 = parseInt(startIndex);
            xlzPage.lazy2 = parseInt(dIndex);
            xlzPage.targetIndex = 1;
            xlzPage.mouseMoveNumber = 0;
            xlzPage.mouseNumber = 0;
            this.InitXLZ();
        },
        InitXLZ()
        {
            console.log("++++++++++++++++++++++")
            let b = document.getElementById("xlzPage");
            this.imgdivgroup = b.getElementsByTagName("img");
            xlzPage.imgdivgroup[0].src = this.urlStr + xlzPage.currentStarIndex + this.format;
            let tochCtrl3 = new XR.TouchCtrl(document.getElementById("xlztouch"));
            let touchDiv = document.getElementById("xlztouch");
            touchDiv.style = "width:100%;height:100%;background: url(image/loading_bg.png) no-repeat;background-size: 100% 100%;text-align: center;display: flex;";
            tochCtrl3.onUIMove = (x, y, z) =>
            {
                if (x > 0)
                {
                    if (xlzPage.mouseNumber < xlzPage.lazy2)
                    {
                        xlzPage.mouseMoveNumber++;

                    }

                }
                else
                {
                    if (xlzPage.mouseNumber > xlzPage.lazy1)
                    {
                        xlzPage.mouseMoveNumber--;
                    }
                }
                if (xlzPage.mouseMoveNumber == 1)
                {
                    xlzPage.mouseNumber++;
                    this.ToTargetValue(xlzPage.mouseNumber);
                    xlzPage.mouseMoveNumber = 0;
                    xlzPage.currentStarIndex = xlzPage.mouseNumber;
                    this.startIndex = xlzPage.mouseNumber;
                }
                else if (xlzPage.mouseMoveNumber == -1)
                {
                    xlzPage.mouseNumber--
                    this.ToTargetValue(xlzPage.mouseNumber);
                    xlzPage.mouseMoveNumber = 0;
                    xlzPage.currentStarIndex = xlzPage.mouseNumber;
                    this.startIndex = xlzPage.mouseNumber;

                }
                xlzPage.k = xlzPage.mouseNumber;
            };
            /* minimappage.displayxfroomfloors = true;
        minimappage.FadeIn(minimappage.mInfo);
        minimappage.UpDateFloorMinimap(0); */
            //setInterval(this.leftButtonClick, 100);
        },
        ToTargetValue(value)
        {
            xlzPage.targetIndex = value;
            if (!this.isLooping)
            {
                this.isLooping = true;
                this.LoopLoadImg();
            }


        },
        LoopLoadImg()
        {
            if (xlzPage.targetIndex > xlzPage.currentStarIndex)
            {
                xlzPage.currentStarIndex++;
            }
            else if (xlzPage.targetIndex == xlzPage.currentStarIndex)
            {
                xlzPage.isLooping = false;
                return;
            }
            else
            {
                xlzPage.currentStarIndex--;
            }
            xlzPage.imgdivgroup[0].src = this.urlStr + xlzPage.currentStarIndex + this.format; "piclist/jg/JG_1.png"
            //xlzPage.lazy = xlzPage.currentStarIndex;
            //xlzPage.mouseNumber = xlzPage.currentStarIndex;
            xlzPage.imgdivgroup[0].onload = function ()
            {
                xlzPage.LoopLoadImg();
            };

        },
        SliderChange(v)
        {
            console.log(v)
            //this.ToTargetValue(v);
        },
        ChangeImgData(newImgSrcStr, newStar, newEnd, newLoop)
        {
            this.ClearData();
            xlzPage.urlStr = newImgSrcStr;
            xlzPage.lazy1 = newStar;
            xlzPage.lazy2 = newEnd;
            xlzPage.isLooping = newLoop;
            this.InitImg();
        },
        InitImg()
        {
            this.imgdivgroup[0].src = xlzPage.urlStr + xlzPage.currentStarIndex + xlzPage.format;
        },
        ClearData()
        {
            xlzPage.currentStarIndex = 1;
            xlzPage.targetIndex = 1;
            xlzPage.isLooping = false;
            xlzPage.currentEndIndex = 0;
            xlzPage.loopImgArray = [];
            xlzPage.startIndex = 1;
            xlzPage.endIndex = 0;
            xlzPage.urlStr = "";
            xlzPage.format = ".jpg";
            xlzPage.canLoop = false;
            xlzPage.endIndex = 0;
            xlzPage.mouseMoveNumber = 0;
            xlzPage.mouseNumber = 0;
            xlzPage.lazy = 0;
            xlzPage.lazy1 = 0;
            xlzPage.lazy2 = 0;
        },
        OnFadeInEnd()
        {
            XR.DebugToHtml("scaleimgpage OnFadeInEnd");
        },
        FadeOut()
        {
            this.$refs.aaa.FadeOut();
            mainpage.SetVisible("visible");
        },
        OnFadeOutEnd()
        {
            XR.DebugToHtml("scaleimgpage OnFadeOutEnd");
        },
    }

})


let cameraUniversal =
{
    cameraName: "",
    sommthFactor: 0.08,

    countXBegin: 0.0,
    countYBegin: 0.0,
    countZBegin: 0.0,

    Xcount: 0.0,
    Ycount: 0.0,
    Zcount: 0.0,

    Xsmooth: 0.0,
    Ysmooth: 0.0,
    Zsmooth: 0.0,

    minimumX: -70,
    maximumX: 70,

    minimumZ: -10.0,
    maximumZ: 45.0,

    camera: "",
    camBase: "",
    cameraRotX: "",
    cameraRotY: "",

    //	
    defaultXcount: 0.0,
    defaultYcount: 0.0,
    defaultZcount: 0.0,

    defaultPosX: 0.0,
    defaultPosY: 0.0,
    defaultPosZ: 0.0,

    posX: 0.0,
    posY: 0.0,
    posZ: 0.0,

    smoothPosX: 0.0,
    smoothPosY: 0.0,
    smoothPosZ: 0.0,

    Init: function ()
    {

        cameraUniversal.camera = new THREE.PerspectiveCamera(70, XR.viewportWidth / XR.viewportHeight, 0.1, 100);

        cameraUniversal.camBase = new THREE.Object3D();
        cameraUniversal.cameraRotX = new THREE.Object3D();
        cameraUniversal.cameraRotY = new THREE.Object3D();

        cameraUniversal.camBase.name = "camBase";
        cameraUniversal.cameraRotX.name = "cameraRotX";
        cameraUniversal.cameraRotY.name = "cameraRotY";

        cameraUniversal.cameraRotX.add(cameraUniversal.camera);
        cameraUniversal.cameraRotY.add(cameraUniversal.cameraRotX);
        cameraUniversal.camBase.add(cameraUniversal.cameraRotY);

    },

    SetInitStates: function (inCamAspect, fieldOfView, nearClip, farClip)
    {
        cameraUniversal.camera.aspect = inCamAspect;
        cameraUniversal.camera.fov = fieldOfView;
        cameraUniversal.camera.near = nearClip;
        cameraUniversal.camera.far = farClip;
        cameraUniversal.camera.updateProjectionMatrix();
    },


    SetupCameraCtrl: function (json, fastTo)
    {

        cameraUniversal.RecordDefaultState(json[0], json[1], json[2], -json[3], -json[4], json[5]);
        cameraUniversal.SetCameraPos(json[0], json[1], json[2]);

        console.log();

        cameraUniversal.minimumX = json[9];
        cameraUniversal.maximumX = json[10];

        cameraUniversal.minimumZ = json[11];
        cameraUniversal.maximumZ = json[12];

        cameraUniversal.zhiBeiZhenCorrect = json[13];

        cameraUniversal.camBase.updateMatrix();
        cameraUniversal.ResetCameraState(fastTo);
        //添加微量变化,以便会渲染动画
        cameraUniversal.Zcount += 0.01;
        RenderOneFrame();
    },

    RecordDefaultState: function (iposX, iposY, iposZ, defaultX, defaultY, defaultZ)
    {
        cameraUniversal.defaultPosX = iposX;
        cameraUniversal.defaultPosY = iposY;
        cameraUniversal.defaultPosZ = iposZ;

        cameraUniversal.defaultXcount = defaultX;
        cameraUniversal.defaultYcount = cameraUniversal.ModiferYCount(cameraUniversal.Ycount, defaultY);
        cameraUniversal.defaultZcount = defaultZ;
    },

    SetCameraPos: function (iPosX, iPosY, iPosZ)
    {

        if (iPosX !== "")
        {
            cameraUniversal.posX = Number(iPosX);
        }

        if (iPosY !== "")
        {
            cameraUniversal.posY = Number(iPosY);
            cameraUniversal.camBase.position.y = cameraUniversal.posY;
        }

        if (iPosZ !== "")
        {
            cameraUniversal.posZ = Number(iPosZ);
        }

        //		console.log(cameraUniversal.posX);
        //		console.log(cameraUniversal.posY);
        //		console.log(cameraUniversal.posZ);

    },


    ModiferYCount: function (currentYcount, toYcount)
    {
        var outYcount;
        var currentLess360 = currentYcount % 360.0;
        var yLess360 = toYcount % 360.0;

        if (yLess360 < 0.0)
        {
            yLess360 += 360.0;
        }

        if (currentLess360 < 0.0)
        {
            currentLess360 += 360.0;
        }

        if (currentLess360 > yLess360)
        {
            if (currentLess360 - yLess360 > 180.0)
            {
                yLess360 = yLess360 + 360.0;
            }
            outYcount = currentYcount + yLess360 - currentLess360;
        }
        else
        {
            if (currentLess360 - yLess360 < -180.0)
            {
                currentLess360 = currentLess360 + 360.0;
            }
            outYcount = currentYcount - (currentLess360 - yLess360);
        }

        return outYcount;

    },


    SetCameraXYZcount: function (iXcount, iYcount, iZcount)
    {
        if (iXcount != "")
        {
            cameraUniversal.Xcount = -Number(iXcount);
            cameraUniversal.countXBegin = cameraUniversal.Xcount;
        }

        if (iYcount != "")
        {
            //			cameraUniversal.Ycount=iYcount;
            cameraUniversal.Ycount = cameraUniversal.ModiferYCount(cameraUniversal.Ycount, -Number(iYcount));
            cameraUniversal.countYBegin = cameraUniversal.Ycount;
        }
        if (iZcount != "")
        {
            cameraUniversal.Zcount = Number(iZcount);
            cameraUniversal.countZBegin = cameraUniversal.Zcount;
        }
        //		console.log(cameraUniversal);

    },

    SetCameraStates: function (inCameraStates)
    {
        //		console.log(inCameraStates);		
        cameraUniversal.SetCameraPos(inCameraStates[0], inCameraStates[1], inCameraStates[2]);
        cameraUniversal.SetCameraXYZcount(inCameraStates[3], inCameraStates[4], inCameraStates[5]);
    },

    ResetCameraState: function (isFast)
    {

        cameraUniversal.countXBegin = cameraUniversal.defaultXcount;
        cameraUniversal.countYBegin = cameraUniversal.defaultYcount;
        cameraUniversal.countZBegin = cameraUniversal.defaultZcount;

        cameraUniversal.Xcount = cameraUniversal.defaultXcount;
        cameraUniversal.Ycount = cameraUniversal.defaultYcount;
        cameraUniversal.Zcount = cameraUniversal.defaultZcount;

        cameraUniversal.posX = cameraUniversal.defaultPosX;
        cameraUniversal.posY = cameraUniversal.defaultPosY;
        cameraUniversal.posZ = cameraUniversal.defaultPosZ;

        TouchCtrl.XcountOffset = 0;
        TouchCtrl.YcountOffset = 0;
        TouchCtrl.ZcountOffset = 0;

        if (isFast)
        {
            cameraUniversal.Xsmooth = cameraUniversal.Xcount;
            cameraUniversal.Ysmooth = cameraUniversal.Ycount;
            cameraUniversal.Zsmooth = cameraUniversal.Zcount;

            cameraUniversal.smoothPosX = cameraUniversal.defaultPosX;
            cameraUniversal.smoothPosY = cameraUniversal.defaultPosY;
            cameraUniversal.smoothPosZ = cameraUniversal.defaultPosZ;
        }
    },

    setUpdateState: function (iXconutOffset, iYconutOffset, iZconutOffset)
    {
        cameraUniversal.Xcount = cameraUniversal.countXBegin + 0.5 * iYconutOffset;
        cameraUniversal.Ycount = cameraUniversal.countYBegin + 0.5 * iXconutOffset;
        cameraUniversal.Zcount = cameraUniversal.countZBegin + 0.1 * iZconutOffset;
    },
    NeedUpdate: function ()
    {

        cameraUniversal.Xcount = THREE.Math.clamp(cameraUniversal.Xcount, -cameraUniversal.maximumX, -cameraUniversal.minimumX);
        cameraUniversal.Zcount = THREE.Math.clamp(cameraUniversal.Zcount, cameraUniversal.minimumZ, cameraUniversal.maximumZ);

        cameraUniversal.Xsmooth = cameraUniversal.Xsmooth * (1 - cameraUniversal.sommthFactor) + cameraUniversal.Xcount * cameraUniversal.sommthFactor;
        cameraUniversal.Ysmooth = cameraUniversal.Ysmooth * (1 - cameraUniversal.sommthFactor) + cameraUniversal.Ycount * cameraUniversal.sommthFactor;
        cameraUniversal.Zsmooth = cameraUniversal.Zsmooth * (1 - cameraUniversal.sommthFactor) + cameraUniversal.Zcount * cameraUniversal.sommthFactor;

        cameraUniversal.smoothPosX = cameraUniversal.smoothPosX * (1 - cameraUniversal.sommthFactor) + cameraUniversal.posX * cameraUniversal.sommthFactor;
        cameraUniversal.smoothPosZ = cameraUniversal.smoothPosZ * (1 - cameraUniversal.sommthFactor) + cameraUniversal.posZ * cameraUniversal.sommthFactor;

        cameraUniversal.camBase.position.x = cameraUniversal.smoothPosX;
        cameraUniversal.camBase.position.z = cameraUniversal.smoothPosZ;

        cameraUniversal.cameraRotX.rotation.x = cameraUniversal.Xsmooth / 57.3;
        cameraUniversal.cameraRotY.rotation.y = cameraUniversal.Ysmooth / 57.3;

        cameraUniversal.camera.position.z = cameraUniversal.Zsmooth;

        if (Math.abs(cameraUniversal.Xsmooth - cameraUniversal.Xcount) > 0.001 || Math.abs(cameraUniversal.Ysmooth - cameraUniversal.Ycount) > 0.001 || Math.abs(cameraUniversal.Zsmooth - cameraUniversal.Zcount) > 0.001)
        {
            return true;
        }
        else
        {
            return false;
        }
    },
    OnUIMove(xOffset, yOffset)
    {
        cameraUniversal.Xcount += 0.2 * yOffset;
        cameraUniversal.Ycount += 0.2 * xOffset;
    },
    OnUIZoom(zoomOffset)
    {
        cameraUniversal.Zcount += 0.5 * zoomOffset;
    }

}


let f3dpage = new Vue({
    el: '#f3dpage',
    data:
    {
        requestAinitionID: undefined,
        scene: {},
        camera: {},
        renderer: {},
        mat: {},
        tex: {},
        texLoader: {},
        sphere: {},
        path720: ''
    },
    methods: {
        FadeIn(texUrl)
        {
            this.path720 = texUrl;
            this.texLoader = new THREE.TextureLoader();

            XR.DebugToHtml("f3dpage FadeIn");
            this.$refs.base.FadeIn();
        },
        OnFadeInEnter()
        {
            this.StartRender();
            this.LoadMap(this.path720);
        },
        OnFadeInEnd()
        {

        },
        FadeOut(callBack)
        {
            XR.DebugToHtml("f3dpage FadeOut");
            this.$refs.base.FadeOut(callBack);
        },
        OnFadeOutEnd()
        {

        },
        LoadMap(texUrl)
        {
            console.log(texUrl);
            console.log(this.mapMat);
            this.texLoader.load('panorama/' + texUrl, (t) => { this.mapMat.map = t; this.mapMat.needsUpdate = true; });
        },
        StartRender()
        {
            // 建立场景
            this.scene = new THREE.Scene();
            //建立相机
            cameraUniversal.Init();
            //添加相机到场景
            this.scene.add(cameraUniversal.camBase);
            //建立渲染器
            this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.webglCanvas, antialias: false, precision: "lowp" });
            this.renderer.setSize(XR.viewportWidth, XR.viewportHeight, false);

            //建立控制器
            let touchWebgl = new XR.TouchCtrl(document.getElementById("webglCanvas"));
            touchWebgl.onUIMove = cameraUniversal.OnUIMove;
            touchWebgl.onUIZoom = cameraUniversal.OnUIZoom;
            /*
                        debug use
                        let geometry = new THREE.BoxGeometry();
                        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                        this.cube = new THREE.Mesh(geometry, material);
                        this.cube.position.z=-5;
                        this.scene.add(this.cube);
            */
            this.mapMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            this.mapMat.side = 1;

            //            console.log(this.mapMat);
            this.sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 64, 32), this.mapMat);
            let s = new THREE.Spherical(50, 0, 0);
            //            console.log(s);
            //          this.sphere.position.z=-2;
            //            console.log(this.sphere);

            this.scene.add(this.sphere);

            this.Update();
            this.LoopRenderFrame();
        },
        StopRender: function ()
        {
            cancelAnimationFrame(f3dpage.requestAinitionID);
        },
        RenderOneFrame()
        {
            requestAnimationFrame(f3dpage.Update);
        },
        LoopRenderFrame()
        {
            f3dpage.requestAinitionID = requestAnimationFrame(f3dpage.LoopRenderFrame);
            //            if(cameraUniversal.NeedUpdate())
            cameraUniversal.NeedUpdate();
            f3dpage.Update();

        },
        Update()
        {
            this.renderer.render(this.scene, cameraUniversal.camera);
        },

    }
})