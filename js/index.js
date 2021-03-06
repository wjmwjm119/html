let runModeType = "";
let webSocketAdress = "";
let runState = "";

let isoutdoor = true;


var btnAudioPlayer_G = {
    isplaying: false,
    player: document.getElementById("btnaduioplayer"),
    Play: function (audioSrc = "")
    {
        if (!btnAudioPlayer_G.isplaying)
        {
            btnAudioPlayer_G.isplaying = true;

            if (audioSrc !== "")
                btnAudioPlayer_G.player.src = audioSrc;

            btnAudioPlayer_G.player.load();
            btnAudioPlayer_G.player.onended = () => { btnAudioPlayer_G.isplaying = false; };

            var promise = btnAudioPlayer_G.player.play();
            if (promise)
            {
                promise.then(function () { }, function (e)
                {
                    console.error(e);
                    btnAudioPlayer_G.isplaying = false
                });
            } else
            {
                btnAudioPlayer_G.player.play();
            }
        }
    }
}

var bgAudioPlayer_G = {
    isplaying: false,
    player: document.getElementById("bgaduioplayer"),
    Play: function (audioSrc = "", loop = true)
    {
        if (!bgAudioPlayer_G.isplaying)
        {
            bgAudioPlayer_G.isplaying = true;

            if (audioSrc !== "")
                bgAudioPlayer_G.player.src = audioSrc;

            bgAudioPlayer_G.player.loop = loop;
            bgAudioPlayer_G.player.load();
            bgAudioPlayer_G.player.onended = () => { bgAudioPlayer_G.isplaying = false; };

            var promise = bgAudioPlayer_G.player.play();
            if (promise)
            {
                promise.then(function () { }, function (e)
                {
                    console.error(e);
                    bgAudioPlayer_G.isplaying = false;
                });
            } else
            {
                bgAudioPlayer_G.player.play();
            }
        }
    },
    Pause: function ()
    {
        bgAudioPlayer_G.isplaying = false;
        bgAudioPlayer_G.player.pause();
    }
}


let ISREMOTEBUTTONEVENT = false;

function ProcessRemoteButtonEvent (jsonData)
{
    let findButton = document.getElementById(jsonData.cmdName);

    ISREMOTEBUTTONEVENT = true;
    findButton.click();
    ISREMOTEBUTTONEVENT = false;
}

function BroadcastRunState (guidHexString)
{
    if (runState == "free")
    {
        if (XR.projectName != "")
        {
            let label = XR.projectName;
            let outString = JSON.stringify({ label, guidHexString, runState });
            websocket.SendWSMessage("BroadcastMessage", "UE4Client", outString);
        }

        setTimeout(function ()
        {
            BroadcastRunState(guidHexString);
        }, 5000);
    }
}

function ProcessURLCmd (url)
{
    selectremotepage.urlBaseString = url;
    //保存基础链接
    let baseUrlPosition = url.indexOf("?");
    if (baseUrlPosition > 0)
        selectremotepage.urlBaseString = url.substr(0, baseUrlPosition);

    let argStartPosition = url.indexOf("=");
    //判断链接里是否含有参数
    if (runModeType == "vrMouseMode" && argStartPosition > 0)
    {
        selectremotepage.urlBaseString = url.substr(0, argStartPosition);
        let urlPayLoadString = url.substr(argStartPosition + 1, url.length - argStartPosition) //取出参数字符串 这里会获得类似“id=1”这样的字符串
        let urlPayLoadJsonData = JSON.parse(decodeURI(urlPayLoadString));
        let jdata = {};

        XR.DebugToHtml(urlPayLoadString);
        switch (urlPayLoadJsonData.cmdName)
        {
            //扫描端进入
            case "VRMouseCtrl":
                runModeType = "remoteCtrlMode";
                jdata = JSON.parse(urlPayLoadJsonData.jsonData);
                //UE4端的guid
                selectremotepage.vrMouseCtrlUE4ClientGuid = jdata.guidHexString;
                webSocketAdress = jdata.ip;
                break;

            //被控制端进入
            case "EnterRemoteCtrlMode":
                runModeType = "remoteCtrlMode";
                selectremotepage.alertConectGuid = urlPayLoadJsonData.argString;

                break;

            default:
                break;
        }
    }

}

function SetRunMode (runModeType, webSocketAdress)
{
    XR.SetRunMode(runModeType);
    console.log("Start Run Mode :" + runModeType);
    switch (runModeType)
    {
        case "localMode":
            XR.OnWebUIStart();
            logopage.FadeIn();
            //		webrtcvideopage.FadeOut();
            break;
        case "vrMouseMode":
            websocket.onConnectWebSocketError = (error) =>
            {
                console.log("重试链接");
                setTimeout(function ()
                {
                    XR.ConnectWebSocket(webSocketAdress);
                }, 3000);
            };
            websocket.onConnectWebSocket = (guidHexString) =>
            {
                //由ue4端获取有多少控制用户,向用户发送本机状态
                if (window.ue)
                {
                    websocket.SendWSMessage("GetVRMouseQRCodeImage");
                }
            };
            websocket.onVRMouseQRCodeImage = (imgSrc) =>
            {
                mediapage.hasVRMouseQRCodeImage = true;
                imgQRCode_HTML = document.getElementById("imgQRCode");
                imgQRCode_HTML.src = "data:image/png;base64," + imgSrc;
            };
            websocket.onReceiveMessage = (mes) =>
            {
                switch (mes.cmdName)
                {
                    case "PrepareEnterRemoteCtrlMode":
                        let cmdName = "EnterRemoteCtrlMode";
                        let argString = mes.argString;
                        let remoteCtrlModeUrl = selectremotepage.urlBaseString + "?data=" + JSON.stringify({ cmdName, argString });
                        let jsRunString = "window.location.href = " + remoteCtrlModeUrl;
                        console.log(jsRunString);
                        window.location.href = remoteCtrlModeUrl;
                        break;
                    default:
                        break;
                }
            }

            XR.OnWebUIStart();
            logopage.FadeIn();
            break;

        case "remoteCtrlMode":
            websocket.onConnectWebSocketError = (error) =>
            {
                console.log("重试链接");
                setTimeout(function ()
                {
                    XR.ConnectWebSocket(webSocketAdress);
                }, 3000);
            };
            websocket.onConnectWebSocket = (guidHexString) =>
            {

                if (window.ue)
                {
                    if (selectremotepage.alertConectGuid != "")
                    {
                        console.log("AlertConectGuid " + selectremotepage.alertConectGuid);

                        let cmdName = "ReadyForVRMouseCtrl";
                        //传递ue4端guid
                        let argString = guidHexString;
                        let jsonData = "";
                        let mes = JSON.stringify({ cmdName, argString, jsonData });

                        XR.DebugToHtml(argString);
                        XR.DebugToHtml(selectremotepage.alertConectGuid);
                        websocket.SendWSMessage("SendMessage", selectremotepage.alertConectGuid, mes)
                        selectremotepage.alertConectGuid = "";
                    }
                    //由ue4端获取有多少控制用户,向用户发送本机状态
                    BroadcastRunState(guidHexString);
                } else
                {
                    if (selectremotepage.vrMouseCtrlUE4ClientGuid != "")
                    {
                        let cmdName = "PrepareEnterRemoteCtrlMode";
                        //扫描端的guid
                        let argString = guidHexString;
                        let jsonData = "";
                        let mes = JSON.stringify({ cmdName, argString, jsonData });

                        websocket.SendWSMessage("SendMessage", selectremotepage.vrMouseCtrlUE4ClientGuid, mes)
                        selectremotepage.vrMouseCtrlUE4ClientGuid = "";
                    }
                }
            };
            websocket.onReceiveMessage = (mes) =>
            {
                switch (mes.cmdName)
                {
                    case "ReadyForVRMouseCtrl":
                        console.log(mes);
                        websocket.SendWSMessage("SetRemoteClient", mes.argString);
                        break;
                    default:
                        break;
                }
            };
            websocket.onBroadcastMessage = (argString, jsonData) =>
            {
                switch (argString)
                {
                    case "UE4Client":

                        if (true)
                        {
                            //是否自动进入
                            console.log(jsonData);
                            if (jsonData.runState == "free")
                                websocket.SendWSMessage("SetRemoteClient", jsonData.guidHexString);
                        }
                        else
                        {
                            console.log(jsonData);
                            if (jsonData.runState == "free")
                                selectremotepage.AddRemoteClient(jsonData);
                        }

                        break;
                    default:
                        break;
                }
            };
            websocket.onGetClientList = (clientList) => { };
            websocket.onConnectRemoteClient = () =>
            {
                selectremotepage.FadeOut();
                runState = "busy";
                logopage.FadeIn();
            };

            websocket.onRemoteClientExit = () =>
            {
                XR.DebugToHtml("RemoteClient已断开");
                XR.SetViewInnerWindowSate(false);
                XR.ReStart();

                //			XR.SetWSRemoteConnectedState(false);
            };
            //			websocket.oner
            XR.OnWebUIStart();
            XR.ConnectWebSocket(webSocketAdress);
            selectremotepage.FadeIn();
            break;

        case "webRTCMode":
            websocket.onConnectWebSocketError = (error) =>
            {
                console.log("重试链接");
                setTimeout(function ()
                {
                    XR.ConnectWebSocket(webSocketAdress);
                }, 3000);
            };

            websocket.onConnectWebSocket = (guidHexString) =>
            {
                if (window.ue)
                {
                    //降低默认开启帧率，之后会被接入用户操作所替换
                    XR.ExecuteUEConsoleCommand("t.MaxFPS 10");
                    //由ue4端获取有多少控制用户,向用户发送本机状态
                    BroadcastRunState(guidHexString);
                } else
                {
                    //						websocket.SendWSMessage("GetWebRTCProxyState");	
                }
            };

            websocket.onBroadcastMessage = (argString, jsonData) =>
            {
                switch (argString)
                {
                    case "UE4Client":

                        if (true)
                        {
                            //是否自动进入
                            console.log(jsonData);
                            if (jsonData.runState == "free")
                                websocket.SendWSMessage("SetRemoteClient", jsonData.guidHexString);
                        }
                        else
                        {
                            console.log(jsonData);
                            if (jsonData.runState == "free")
                                selectremotepage.AddRemoteClient(jsonData);
                        }

                        break;
                    default:
                        break;
                }
            };
            websocket.onGetClientList = (clientList) => { };
            websocket.onConnectRemoteClient = () =>
            {

                runState = "busy";
                if (window.ue)
                {
                    selectremotepage.FadeOut();
                    let blackbg = document.getElementById("blackbg");
                    if (blackbg)
                        blackbg.remove();
                }
                else
                {
                    console.log("GetWebRTCProxyState");
                    websocket.SendWSMessage("GetWebRTCProxyState");
                }
            };
            websocket.onWebRTCProxyState = (contectState) =>
            {
                if (contectState == "True" && !window.ue)
                {
                    webrtcvideopage.SendVideoQualityMessage("mid");
                    webrtcvideopage.FadeIn();
                    //                    websocket.SendWSMessage("TransmitMessageToWebRTCProxy", "ArrayBuffer");
                }
            };
            webrtcvideopage.onVideoPlay = () =>
            {
                logopage.FadeIn();
            }
            websocket.onRemoteClientExit = () =>
            {
                XR.DebugToHtml("RemoteClient已断开");
                if (window.ue)
                {
                    XR.SetViewInnerWindowSate(false);
                    XR.ReStart();
                } else
                {
                    window.location.href = window.location.href;
                }
                //				XR.SetWSRemoteConnectedState(false);
            };
            websocket.onWebRTCMessage = webrtcvideopage.OnWebRTCMessage;

            XR.OnWebUIStart();
            XR.ConnectWebSocket(webSocketAdress);
            selectremotepage.FadeIn();
            break;
    }


}


function ProcessButtonMessage (btn)
{
    console.log((btn.index != undefined ? btn.index : -1) + ": " + btn.id + " " + btn.btnstate + " Event");
    //	XR.DebugToHtml((btn.index!=undefined?btn.index:-1)+": "+btn.id +" "+btn.btnstate+" Event");
    

    switch (btn.id)
    {
        case "btnaudio":
            if (btn.btnstate)
            {
                bgAudioPlayer_G.Play("audio/bg.wav");
            } else
            {
                bgAudioPlayer_G.Pause();
            }
            break;

        case "mfykcode":
            mediapage.$refs.about.SetButtonState(false);
            break;

        case "btnalvj":
            if (btn.btnstate)
            {
                mainpage.FadeIn();
                mainpage.$refs.postrect.PlayAni(true, "", "left:0%");
            } else
            {
                mainpage.$refs.postrect.PlayAni(false, "", "left:-30%");

            }
            break;

        case "btnshengm":
            if (btn.btnstate)
            {
                mediapage.$refs.shengmingInfo.PlayAni(true, "", "left:0%");
            }
            else
            {
                mediapage.$refs.shengmingInfo.PlayAni(false, "", "left:-800px");
            }
            break;

        case "about":
            if (btn.btnstate)
            {
                mediapage.$refs.mfykcoderect.PlayAni(true, "", "left:3%");
            } else
            {
                mediapage.$refs.mfykcoderect.PlayAni(false, "", "left:-30%");
            }
            break;

        case "displayvrmousecode":
            if (btn.btnstate)
            {
                mediapage.$refs.vrmousecoderect.PlayAni(true, "", "left:6%");
            } else
            {
                mediapage.$refs.vrmousecoderect.PlayAni(false, "", "left:-30%");
            }
            break;

        case "exitremotemode":
            XR.WebReload();
            break;

        case "xmzl_back":
        case "qwjz_back":
            mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
            break;


        case "mainbtn":
            console.log(btn)
            if (btn.btnstate)
            {
                camerscalepage.isShowButton = false;
                XR.PlaySequenceAnimation(0);
                mainpage.$root.mainmenubg = "";
                mainpage.$root.btngroup = "";
                mainpage.ejmenubtngroup = "";
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-80%");
                mediapage.FadeOut();
                videopage.FadeOut();
                compasspage.FadeOut();
                mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
                mainpage.$refs.swqwbtngroup.ResetAllButtonState();
            } else
            {
                camerscalepage.isShowButton = true;
                XR.StopSequenceAnimation();
                XR.SetCameraPositionAndxyzCount("15000.0,-15000.0,40.125,-822.239807,34.75,84166.671875");
                mainpage.$root.mainmenubg = "mainmenubgimage";
                mainpage.$root.btngroup = "mainmenubtngroup";
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:0%");
                mediapage.FadeIn();
                compasspage.FadeIn("zxqw");
            }
            break;

        case "zxqw": //中心区位
            if (btn.btnstate)
            {
                compasspage.FadeIn("zxqw");
                mainpage.ejmenubtngroup = "qwbtngroup";
                XR.SetCameraPositionAndxyzCount("-12187.777344,1288.661865,40.125,175.010239,32.5,63750.015625");
            } else
            {
                mainpage.ejmenubtngroup = "";
                mainpage.$refs.qwbtngroup.ResetAllButtonState();
            }
            XR.SendCtrlCmd("ctrlumg", "zxqw", btn.btnstate ? "true" : "false");

            break;

        case "zxqw_ewqw":
            if (btn.btnstate)
            {
                videopage.FadeIn(() => { videopage.Play("video/zlqw_start", "video/zlqw_loop"); });
                // videopage.Play("video/zlqw_start", "video/zlqw_loop");

                compasspage.FadeOut();
                // compasspage.FadeOut();
                // mediapage.FadeOut();
                // videopage.FadeIn(() => { videopage.Play("video/dt_start", "video/dt_loop", () => { mainpage.btngroup = "ewqwbtngroup" }); });
                // mainpage.ejmenubtngroup = "";
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mainpage.$refs.seasonrect.PlayAni(false, "", "right:-30%");
                // mainpage.mainmenubtngroup = "";
                // mainpage.btngroup = "";
                // mainpage.$root.mainmenubg = "";
                mainpage.mainbtnShow = false;
            }
            else
            {
                compasspage.FadeOut("zxqw");
                videopage.FadeOut();
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
                mainpage.mainbtnShow = true;
            }
            break;

        case "ewqw_gy":
            if (btn.btnstate)
            {
                videopage.Play("video/gy_start", "video/gy_loop");
                // videopage.FadeIn(() => { videopage.Play("video/gy_start", "video/gy_loop"); });
            }
            break;

        case "ewqw_xz":
            if (btn.btnstate)
            {
                videopage.Play("video/xz_start", "video/xz_loop");
            }
            break;

        case "ewqw_jt":
            if (btn.btnstate)
            {
                videopage.Play("video/jt_start", "video/jt_loop");
            }
            break;

        case "ewqw_jyyl":
            if (btn.btnstate)
            {
                videopage.Play("video/jyyl_start", "video/jyyl_loop");
            }
            break;

        case "ewqw_sy":
            if (btn.btnstate)
            {
                videopage.Play("video/sy_start", "video/sy_loop");
            }
            break;

        case "ewqw_back":
            // videopage.FadeOut();
            mediapage.FadeIn();
            compasspage.FadeIn("zxqw");
            mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
            mainpage.$refs.swqwbtngroup.ResetAllButtonState();
            mainpage.$root.btngroup = "mainmenubtngroup";
            mainpage.$root.mainmenubg = "mainmenubgimage";
            mainpage.mainbtnShow = true;
            mainpage.$refs.qwbtngroup.ResetAllButtonState();
            mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");

            break;

        case "zxqw_swqw":
            if (btn.btnstate)
            {
                mainpage.$refs.swqwbtngroup.ResetAllButtonState();
                compasspage.FadeOut();
                videopage.FadeIn(() => { videopage.Play("video/dt_start", "video/dt_loop") });
                //  videopage.FadeOut();
                mainpage.ejmenubtngroup = "";

                //  mainpage.btngroup = "";
                //  videopage.FadeIn(() => { videopage.Play("video/dt_start", "video/dt_loop", () => { mainpage.btngroup = "swqwbtngroup"; }) });
                mainpage.mainbtnShow = false;
                mainpage.btngroup = "swqwbtngroup";
                mainpage.$root.mainmenubg = "";
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mainpage.$refs.seasonrect.PlayAni(false, "", "right:-30%");
            }
            else
            {
                videopage.FadeOut();
                mainpage.mainbtnShow = true;
                //  videopage.FadeIn("zxqw");
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
            }
            break;

        case "swqw_jtpt":
            if (btn.btnstate)
            {
                videopage.Play("video/xmjj_jtpt_start", "video/xmjj_jtpt_loop");
            }
            break;

        case "swqw_jyyl":
            if (btn.btnstate)
            {
                videopage.Play("video/xmjj_jyyl_start", "video/xmjj_jyyl_loop");
            }
            break;

        case "swqw_jrsy":
            if (btn.btnstate)
            {

                videopage.Play("video/xmjj_jrsy_start", "video/xmjj_jrsy_loop");
            }
            break;

        case "swqw_stpt":
            if (btn.btnstate)
            {
                videopage.Play("video/xmjj_stpt_start", "video/xmjj_stpt_loop");
            }
            break;

        case "swqw_zwbg":
            if (btn.btnstate)
            {
                videopage.Play("video/xmjj_zwyl_start", "video/xmjj_zwyl_loop");
            }
            break;

        case "swqw_sqpt":
            if (btn.btnstate)
            {
                videopage.Play("video/xmjj_stpt_start", "video/xmjj_stpt_loop");
            }
            break;

        case "swqw_back":
            if (btn.btnstate)
            {
                mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
                //mediapage.FadeOut();

                mainpage.$root.btngroup = "mainmenubtngroup";
                mainpage.$root.mainmenubg = "mainmenubgimage";
                mainpage.mainbtnShow = true;
                mainpage.$refs.qwbtngroup.ResetAllButtonState();
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
                compasspage.FadeIn("zxqw");
                XR.SetCameraPositionAndxyzCount("-12187.777344,1288.661865,40.125,175.010239,32.5,63750.015625");
            }
            XR.SendCtrlCmd("ctrlumg", "swqw_back", btn.btnstate ? "true" : "false");
            break;

        case "xmzl": //项目简介
            if (btn.btnstate)
            {
                mainpage.ejmenubtngroup = "xmzlbtngroup";
            } else
            {
                mainpage.ejmenubtngroup = "";
                mainpage.$refs.xmzlbtngroup.ResetAllButtonState();
            }
            XR.SendCtrlCmd("ctrlumg", "xmjj", btn.btnstate ? "true" : "false");
            break;

        case "xmzl_xmjj":
            if (btn.btnstate)
            {
                compasspage.FadeOut();
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mainpage.$refs.seasonrect.PlayAni(false, "", "right:-30%");
                videopage.FadeIn(() => { videopage.Play("video/xmjj_start1", "video/xmjj_loop1"); });
                // videopage.Play("video/xmjj_start1", "video/xmjj_loop1");
                // mainpage.$refs.mainmenu.PlayAni(false, "", "");
                // xmjjpage.FadeIn();
                // mainpage.$refs.mainmenuroot.PlayAni(false, "", "bottom:-30%");
                // mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                // mediapage.FadeOut();
                // compasspage.FadeOut();
                // mainpage.ejmenubtngroup = "";
            } else
            {
                compasspage.FadeIn("zxqw");
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
                videopage.FadeOut();
            }
            break;

        case "xmzl_jtpt":
            XR.SendCtrlCmd("ctrlumg", "swqw", btn.btnstate ? "true" : "false");
            XR.SetCameraPositionAndxyzCount("-16723.929688,2962.133545,40.125,-289.489746,51.25,141250.015625");
            XR.SendCtrlCmd("ctrlumg", "jtpt", btn.btnstate ? "true" : "false");
            break;

        case "xmzl_jyyl":
            XR.SendCtrlCmd("ctrlumg", "swqw", btn.btnstate ? "true" : "false");
            XR.SetCameraPositionAndxyzCount("-21799.074219,1791.829834,40.125,-222.239807,41.25,184166.671875");
            XR.SendCtrlCmd("ctrlumg", "jyyl", btn.btnstate ? "true" : "false");
            break;

        case "xmzl_jrsy":
            XR.SendCtrlCmd("ctrlumg", "swqw", btn.btnstate ? "true" : "false");
            XR.SetCameraPositionAndxyzCount("-119631.609375,42236.046875,40.000221,-240.489716,54.0,147450.046875");
            XR.SendCtrlCmd("ctrlumg", "jrsy", btn.btnstate ? "true" : "false");
            break;

        case "xmzl_stpt":
            XR.SendCtrlCmd("ctrlumg", "swqw", btn.btnstate ? "true" : "false");
            XR.SetCameraPositionAndxyzCount("-83159.804688,27283.316406,-19.062458,-5.739746,52.5,200000.0");
            XR.SendCtrlCmd("ctrlumg", "stpt", btn.btnstate ? "true" : "false");
            break;

        case "xmzl_zwyl":
            XR.SendCtrlCmd("ctrlumg", "swqw", btn.btnstate ? "true" : "false");
            XR.SetCameraPositionAndxyzCount("-119631.609375,42236.046875,40.000221,-542.989746,53.25,149483.40625");
            XR.SendCtrlCmd("ctrlumg", "zwbg", btn.btnstate ? "true" : "false");

            break;
        case "swqw_sqpt":

            break;


        case "xmjjbtn_prev":
            videopage.PlayPrev(["video/xmjj_start", "video/zpjjyt_start"], ["video/xmjj_loop", "video/zpjjyt_loop"]);
            console.log("按钮向左");
            break;

        case "xmjjbtn_next":
            videopage.PlayNext(["video/xmjj_start", "video/zpjjyt_start"], ["video/xmjj_loop", "video/zpjjyt_loop"]);
            console.log("按钮向右");
            break;

        case "xmjj_back":
            videopage.FadeOut();
            mediapage.FadeIn();
            xmjjpage.FadeOut();
            mainpage.$refs.mainmenuroot.PlayAni(true, "", "bottom:0%");
            mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
            mainpage.ejmenubtngroup = "xmzlbtngroup";
            mainpage.$refs.xmzlbtngroup.ResetAllButtonState();
            mainpage.$root.btngroup = "mainmenubtngroup";
            mainpage.$root.mainmenubg = "mainmenubgimage";
            mainpage.mainbtnShow = true;
            break;

        case "hxty":
            if (btn.btnstate)
            {
                xfpage.SetChooseHouseState(true, 0, true);
            }
            else
            {
                XR.SetSceneActorState("loubiao", false);
                XR.SetSceneActorState("HX_FB_110", false);
                XR.SetSceneActorState("HX_FB_125", false);
                XR.SetSceneActorState("HX_FB_140", false);
                xfpage.FadeOut();
            }
            break;

        case "hxty_hxcg":
            if (btn.btnstate)
            {
                xfpage.ishxcgbtnrect = true;
                xfpage.$refs.hxcgbtngroup.$children[1].ClickDown();
                XR.SetSceneActorState("hxcg", true);

            } else
            {
                xfpage.$refs.hxcgbtngroup.ResetAllButtonState();
                xfpage.ishxcgbtnrect = false;
                XR.SetSceneActorState("hxcg", false);
            }
            break;

        case "hxty_fcz":
            XR.SetSceneActorState("fcz", btn.btnstate ? true : false);
            break;

        case "hxty_xsjj":
            XR.SetSceneActorState("xsjj", !btn.btnstate ? true : false);

            XR.SetSceneActorState("xsjjRootActor", btn.btnstate ? true : false);
            console.log("fdfdfdfdfdfdfdfdfdfdf");
            break;

        case "hxty_pmt":
            xfpage.Displaypmt(btn.btnstate);
            break;

        case "hxty_jrmy":
            if (btn.btnstate)
                xfpage.EnterMy();
            break;

        case "hxty_back":
            if (btn.btnstate)
            {
                isoutdoor = true;
                xfpage.ExitRoom(false);
            }
            break;

        case "hxtymy_hxnk":
            if (btn.btnstate)
                xfpage.MyToNk();
            break;

        case "hxtymy_zyxz":
            if (btn.btnstate)
            {
                XR.ChangeCamera("CameraUniversalMY", "", 0);
                //   minimappage.ChoosePoint(minimappage.defaultpoint);
                XR.SetCameraPositionAndxyzCount(",,,,0,", "", 0);
            }
            break;

        case "hxtymy_vrbf":
            break;

        case "hxtymy_zdbf":
            if (btn.btnstate)
            {
                XR.ChangeCamera("CameraUniversalAutoPlay", "", 0);
                XR.PlaySequenceAnimation(0);

                // XR.ChangeCamera("CameraUniversalMY");
                // XR.PlaySequenceAnimation(0);
                // XR.ChangeCamera("CameraUniversalAutoPlay");
                // XR.PlaySequenceAnimation(0);

                //  xfpage.PlaySequenceAnimation(0);

            } else
            {
                XR.StopSequenceAnimation();

            }
            break;

        case "hxtymy_back":
            if (btn.btnstate)
            {
                isoutdoor = true;
                xfpage.ExitRoom(true);
            }
            break;

        case "hxtymysy_18°":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(-1, 60);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(100, 90);
            }
            break;
        case "hxtymysy_24°":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(-1, 90);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(100, 90);
            }
            break;

        case "hxtymysy_30°":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(-1, 120);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(100, 90);
            }
            break;

        case "hxtymygd_150":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(80, 0);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(100, 0);
            }
            break;
        case "hxtymygd_160":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(100, 0);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(100, 0);
            }
            break;
        case "hxtymygd_170":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(120, 0);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(100, 0);
            }
            break;

        case "hxtymymenuleftstate":
            if (btn.btnstate)
            {
                xfpage.$refs.hxtymymenuleft.PlayAni(false, "", "left:-550px");
                xfpage.$refs.xfindoorinforect.PlayAni(false, "", "left:-30%");
                compasspage.$refs.compasspichxtymy.PlayAni(false, "", "left:-30%");
                minimappage.$refs.minimapsaclerect.PlayAni(false, "", "right:undefined;left:-30%");
                XR.SetViewInnerWindowSate(false, "main", 0, 0, 0, 0);
                xfpage.$refs.touchInnerView.PlayAni(true, "", "left:-30%;bottom:1537px");
            } else
            {
                xfpage.$refs.hxtymymenuleft.PlayAni(true, "", "left:0%");
                xfpage.$refs.xfindoorinforect.PlayAni(true, "", "left:0%");
                compasspage.$refs.compasspichxtymy.PlayAni(true, "", "left:480px");
                minimappage.$refs.minimapsaclerect.PlayAni(true, "", "right:undefined;left:50px");
                XR.SetViewInnerWindowSate(true, "main", 0, 950, 550, 400);
                xfpage.$refs.touchInnerView.PlayAni(false, "", "left:0;bottom:1537px");
            }
            break;

        case "hxtymymenustate":
            xfpage.DisPlayMyHxinfo(!btn.btnstate);
            break;

        case "hxcg_9":
            if (btn.btnstate)
            {
                xfpage.ChangeDayLighting(9);
                XR.SetSceneActorState("hxcg_110_9", true);
            } else
            {
                XR.SetSceneActorState("hxcg_110_9", false);
            }
            break;

        case "hxcg_12":
            if (btn.btnstate)
            {
                xfpage.ChangeDayLighting(12);
            } else
            {

            }
            break;

        case "hxcg_17":
            if (btn.btnstate)
            {
                xfpage.ChangeDayLighting(17);
                XR.SetSceneActorState("hxcg_110_17", true);
            } else
            {
                XR.SetSceneActorState("hxcg_110_17", false);
            }
            break;

        case "hxxz_140":
            /*
                        if (btn.btnstate)
                        {
                            xfpage.ChooseHx(140);
                        } else
                        {
                            XR.SetSceneActorState("HX_FB_140", false);
                            xfpage.isShowhxxzsmallbtnrect = false;
                        }
                        console.log("户型选择140");
            */
            break;

        case "hxxz_125":
            /*
                        if (btn.btnstate)
                        {
                            // xfpage.ChooseHx(125);
                        } else
                        {
                            XR.SetSceneActorState("HX_FB_125", false);
                            xfpage.isShowhxxzsmallbtnrect = false;
                        }
            */
            break;

        case "hxxz_110":

            /*        
                        if (btn.btnstate)
                        {
                            xfpage.ChooseHx(110);
                        } else
                        {
                            XR.SetSceneActorState("HX_FB_110", false);
                            xfpage.isShowhxxzsmallbtnrect = false;
                        }
            */
            break;

        case "hxxzsmallbtn":
            xfpage.ChangeHxxzbtnBigImage(true);
            xfpage.isShowhxxzsmallbtnrect = false;
            break;

        case "hxxzbtnbigBack":
            xfpage.ChangeHxxzbtnBigImage(false);
            break;

        case "hx":
            if (btn.btnstate)
            {
                XR.SetCameraPositionAndxyzCount("-18954.242188,12181.137695,40.0,-52.200001,42.25,37915.996094");
                XR.SetSceneActorState("loubiao", true);
                hxpage.FadeIn();
            } else
            {
                XR.SetSceneActorState("loubiao", false);
                hxpage.FadeOut();
            }
            break;

        case "hiddenhxinfo":
            hxpage.DisplayHXInfo(!btn.btnstate);
            break;

        case "hxty_fh":
            hxpage.ExitHX();
            break;

        case "xf":
            // XR.SendCtrlCmd("ctrlumg", "yfyj", btn.btnstate ? "true" : "false");
            // return;
            if (btn.btnstate)
            {
                console.log("一房一景................................");
                xfpage.dispalyState[8] = false;
                XR.SetSceneActorState("loubiao", true);
                xfpage.SetChooseHouseState(true, 1, false);
            } else
            {
                XR.SetSceneActorState("loubiao", false);
                XR.CloseAllBlock();
                xfpage.FadeOut();
            }
            break;

        case "enterroom":
            if (xfpage.sceneMapName != "")
            {
                isoutdoor = false;
                console.log("进入户型..................");
                xfpage.StartEnterRoom();
            } else
            {
                XR.DebugToHtml(xfpage.hxName + "户型未设置sceneMapName");
            }
            break;

        case "xfindoorzd":
            if (btn.btnstate)
            {
                xfpage.PlaySequenceAnimation(0);
            }
            break;

        case "xfindoormy":
            if (btn.btnstate)
            {
                xfpage.StopSequenceAnimation(0);
            }
            break;

        case "jzty":
            if (btn.btnstate)
            {
                loadingpage.FadeIn(() =>
                {
                    XR.SetLevelVisibleGroup(["A1", "A2", "b", "C_D", "KP_XP", "NDX", "ww_jz", "美术关卡"],
                        [false, false, false, false, false, false, false, false]);
                    //compasspage.FadeOut();
                    //mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
                    XR.LoadSceneLoop(["jz_161"], "", "", XR.CallBack("JsRun", 'loadingpage.FadeOut(); jzpage.FadeIn(); '));
                }
                );

            }
            else
            {
                // jzpage.FadeOut();
                //xfpage.FadeOut();
                //   XR.SetLevelVisible("美术关卡", true);
                //   XR.SetLevelVisibleGroup(["美术关卡", "A1", "A2", "b", "C_D", "E"], [true, true, true, true, true, true]);
            }
            break;

        case "jz_jrmy":
            if (btn.btnstate)
            {
                jzpage.JzEnterMy();
            }
            else
            {

            }
            break;

        case "jztymy_hxnk":
            if (btn.btnstate)
            {
                jzpage.JzMyToNk();
            }
            else
            {

            }
            break;

        case "jztymy_zyxz":
            if (btn.btnstate)
            {
                XR.SetCameraPositionAndxyzCount(",,,,0,", "", 0);
            }
            break;
        case "jztymy_zdbf":
            if (btn.btnstate)
            {
                XR.ChangeCamera("CameraUniversalMY");
                XR.PlaySequenceAnimation(0);
                /* XR.ChangeCamera("CameraUniversalAutoPlay");
                XR.PlaySequenceAnimation(1); */
            } else
            {
                XR.StopSequenceAnimation();
            }
            break;

        case "jztymymenuleftstate":
            if (btn.btnstate)
            {
                jzpage.$refs.hxtymymenuleft.PlayAni(false, "", "left:-550px");
                jzpage.$refs.xfindoorinforect.PlayAni(false, "", "left:-30%");
                compasspage.$refs.compasspichxtymy.PlayAni(false, "", "left:-30%");
                minimappage.$refs.minimapsaclerect.PlayAni(false, "", "right:undefined;left:-30%");
                //  XR.SetViewInnerWindowSate(false, "main", 0, 0, 0, 0);
                //jzpage.$refs.touchInnerView.PlayAni(true, "", "left:-30%;bottom:1537px");
            } else
            {
                jzpage.$refs.hxtymymenuleft.PlayAni(true, "", "left:0%");
                jzpage.$refs.xfindoorinforect.PlayAni(true, "", "left:0%");
                compasspage.$refs.compasspichxtymy.PlayAni(true, "", "left:480px");
                minimappage.$refs.minimapsaclerect.PlayAni(true, "", "right:undefined;left:50px");
                //  XR.SetViewInnerWindowSate(true, "main", 0, 950, 550, 400);
                //  jzpage.$refs.touchInnerView.PlayAni(false, "", "left:0;bottom:1537px");
            }
            break;

        case "jztymymenustate":
            jzpage.DisPlayMyHxinfo(!btn.btnstate);
            break;


        case "jztymy_back":
            if (btn.btnstate)
            {
                jzpage.ExitjzsRoom();
            }
            break;

        case "jz_back":
            if (btn.btnstate)
            {
                jzpage.ExitjzsRoom();
            }
            break;

        case "720qj":
            if (btn.btnstate)
            {
                loadingpage.FadeIn(() =>
                {
                    XR.LoadSceneLoop(["qj720"],
                        "", "", XR.CallBack("JsRun", 'XR.SetActiveSceneInstance("qj720");loadingpage.FadeOut();'));
                }
                );
            }
            break;


        case "daytime0":
            if (btn.btnstate)
            {
                XR.SetDay24Time(0);
                //				XR.SetSeason(0);
                // XR.SetCameraHorizontalOffset(500);
                mainpage.$refs.seasonrect.PlayAni(true, "", "right:-152px");
            }
            break;

        case "daytime1":
            if (btn.btnstate)
            {
                XR.SetDay24Time(1);
                //				XR.SetSeason(1);		
                // XR.SetCameraHorizontalOffset(0);
            }
            break;

        case "daytime2":
            if (btn.btnstate)
            {
                XR.SetDay24Time(2);
                mainpage.$refs.seasonrect.PlayAni(true, "", "right:-152px");
                // XR.SetSeason(2);
            }
            break;

        case "daytime3":
            if (btn.btnstate)
            {
                XR.SetDay24Time(3);
                mainpage.$refs.seasonrectgroup.$children[0].ClickDown();
                mainpage.$refs.seasonrect.PlayAni(false, "", "right:-30%");
                // XR.SetSeason(3);
            } else
            {
                mainpage.$refs.seasonrect.PlayAni(true, "", "right:-152px");
            }
            break;

        case "season0":
            if (btn.btnstate)
            {
                XR.SetSeason(0);
            }
            break;

        case "season1":
            if (btn.btnstate)
            {
                XR.SetSeason(1);
            }
            break;

        case "season2":
            if (btn.btnstate)
            {
                XR.SetSeason(2);
            }
            break;

        case "season3":
            if (btn.btnstate)
            {
                XR.SetSeason(3);
            }
            break;

        case "yj":
            if (btn.btnstate)
            {
                XR.SetPost("原件");
            }
            break;

        case "ls":
            if (btn.btnstate)
            {
                XR.SetPost("冷色");
            }
            break;

        case "ns":
            if (btn.btnstate)
            {
                XR.SetPost("暖色");
            }
            break;

        case "xm":
            if (btn.btnstate)
            {
                XR.SetPost("鲜明");
            }
            break;

        case "js":
            if (btn.btnstate)
            {
                XR.SetPost("景深");
            }
            break;

        case "zhpp":
            if (btn.btnstate)
            {
                mainpage.ejmenubtngroup = "ppjzbtngroup";
            } else
            {
                mainpage.$refs.ppjzbtngroup.ResetAllButtonState();
                mainpage.ejmenubtngroup = "";
            }
            break;



        case "ppjz_zhpp":
            if (btn.btnstate)
            {
                slideimagepage.FadeIn();
                compasspage.FadeOut();
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mainpage.$refs.seasonrect.PlayAni(false, "", "right:-30%");
            } else
            {
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
                compasspage.FadeIn("zxqw");
                slideimagepage.FadeOut();
            }
            // slideimagepage.Enterppjz();
            break;

        case "ppjz_xmsx":
            if (btn.btnstate)
            {
                compasspage.FadeOut();
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mainpage.$refs.seasonrect.PlayAni(false, "", "right:-30%");
                slideimagepage1.FadeIn();
            } else
            {
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
                compasspage.FadeIn("zxqw");
                slideimagepage1.FadeOut();
            }
            break;
        case "fyxk":
            //
            if (btn.btnstate)
            {
                console.log(xfpage);
                xfpage.SetChooseHouseState(true, 2, true);
                xfpage.dispalyState[8] = true;
                xfpage.TimeLoopHttp(10000);
                XR.SetSceneActorState("loubiao", true);
                mainpage.ejmenubtngroup = "xkbtngroup";
                zxkpPage.FadeIn();

            } else
            {
                xfpage.FadeOut();
                XR.CloseAllBlock();
                mainpage.ejmenubtngroup = "";
            }
            break;

        case "minipointpos0":
        case "minipointpos1":
        case "minipointpos2":
        case "minipointpos3":
        case "minipointpos4":
        case "minipointpos5":
        case "minipointpos6":
        case "minipointpos7":
        case "minipointpos8":
        case "minipointpos9":
        case "minipointpos10":
        case "minipointpos11":
        case "minipointpos12":
            if (btn.btnstate)
            {
                minimappage.ChoosePoint(btn.argjson);

            }
            break;
        case "options":
            optionsPage.FadeIn();
            break;
        case "optionsjszcPage_back":
            optionsPage.$refs.partimageroot.PlayAni(false, "", "opacity:0", 0.5);
            optionsPage.$refs.optionsmenu.PlayAni(true, "", "right:30%");
            optionsPage.$refs.optionsmenu.PlayAni(true, "", "opacity:1", 0.5);
            optionsPage.$refs.Optionsmenubtngroup.ResetAllButtonState();
            break;
        case "options_back":
            optionsPage.FadeOut();
            break;
        case "register":
            if (btn.btnstate)
            {
                optionsPage.$refs.registerimage.style = "width: 600px;height:600px";
                optionsPage.$refs.registerimagerect.PlayAni(true, "", "right:1500px");
                optionsPage.$refs.optionsmenu.PlayAni(false, "", "right:-30%");
                optionsPage.$refs.exitimagerect.PlayAni(true, "", "opacity:1", 0.5);
            } else
            {
                optionsPage.$refs.registerimagerect.PlayAni(false, "", "right:-30");
            }
            break
        case "support":
            if (btn.btnstate)
            {
                optionsPage.Displayjszcpart();

            } else
            {
                optionsPage.$refs.partimageroot.PlayAni(false, "", "opacity:0", 0.5);
                optionsPage.$refs.exitimagerect.PlayAni(false, "", "right:0%");
            }
            break;
        case "jgmy":

            if (btn.btnstate)
            {
                jgmypage.FadeIn('jgmy1');
            }
            else
            {
            }
            break;

        case "jgmy_zyxz":
            if (btn.btnstate)
            {
                XR.ChangeCamera("CameraUniversalMY");
                XR.SetCameraPositionAndxyzCount(",,,,0,", "", 0);
            }

            // XR.SetActiveSceneInstance("", "CameraUniversalMY");
            //  XR.ChangeCamera("CameraUniversalMY");

            break;

        case "jgmy_zdbf":
            if (btn.btnstate)
            {
                XR.ChangeCamera("CameraUniversalAutoPlay", "", 0);
                XR.PlaySequenceAnimation(0);
            }
            else
            {
                XR.StopSequenceAnimation();
            }
            break;

        case "jgmy_back":
            jgmypage.FadeOut();
            break;


        case "xlz_back":
            if (btn.btnstate)
            {
                mainpage.FadeIn();
                xlzPage.FadeOut();
                minimappage.FadeOut();
                XR.SetLevelVisible("main", true);
                XR.SetActiveSceneInstance("main");
                mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
            }
            break;
        case "xlz":

            if (btn.btnstate)
            {
                //mainpage.FadeOut();
                xlzPage.StartEnter();
                //xlzPage.FadeIn("piclist/jg/JG_", 1, 145, false);
            }
            else
            {
                xlzPage.FadeOut();
            }
            // mainpage.$root.mainmenubg = "";
            // mainpage.$root.btngroup = "";
            // compasspage.FadeOut();
            // mypage.FadeIn();
            //  mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
            // mainpage.FadeOut();

            //            XR.SetCameraHeightAndFieldOfView(-1,40);

            break;
        case "jgmy_xlz_zdbf":

            if (btn.btnstate)
            {
                xlzPage.StartLoop();
            }
            else
            {
                clearInterval(xlzPage.timeLoop);
            }
            break;
        case "help":
            if (btn.btnstate)
            {
                mainpage.$refs.mainmenuroot.PlayAni(false, "", "bottom:-30%");
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mainpage.$refs.seasonrect.PlayAni(false, "", "right:-30%");
                mediapage.FadeOut();
                videopage1.FadeIn(() => { videopage1.Play("video/help_main", "video/help_my", () => { videopage1.Play("video/help_main", "video/help_my") }); });
                optionsPage.$refs.optionsmenu.PlayAni(false, "", "opacity:0", 0.5);
                optionsPage.$refs.exitimagerect.PlayAni(true, "", "opacity:0", 0.5);
            } else
            {
                // optionsPage.$refs.helpimagerect.PlayAni(false, "", "opacity:0", 0.5);
            }
            break;
        case "exit":
            if (btn.btnstate)
            {
                optionsPage.$refs.exitrect.PlayAni(true, "", "right:1490px");
                optionsPage.$refs.optionsmenu.PlayAni(false, "", "right:-30%");
            }
            else
            {
                optionsPage.$refs.exitrect.PlayAni(false, "", "right:-30%");
            }

            break;

        case "exitsure":
            optionsPage.$refs.exitrect.PlayAni(false, "", "right:-30%");
            optionsPage.$refs.optionsmenu.PlayAni(false, "", "right:-30%");
            XR.Quit();
            optionsPage.FadeOut();
            break;

        case "exitcancel":
            optionsPage.$refs.exitrect.PlayAni(false, "", "right:-30%");
            optionsPage.$refs.optionsmenu.PlayAni(true, "", "opacity:1", 0.5);
            optionsPage.$refs.Optionsmenubtngroup.ResetAllButtonState();
            break;

        case "exithelpimagepage":
            videopage1.FadeOut();
            mainpage.$refs.mainmenuroot.PlayAni(true, "", "bottom:0%");
            mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
            mediapage.FadeIn();
            optionsPage.$refs.optionsmenu.PlayAni(true, "", "opacity:1", 0.5);
            optionsPage.$refs.registerimagerect.PlayAni(false, "", "opacity:0", 0.5);
            optionsPage.$refs.supportimagerect.PlayAni(false, "", "opacity:0", 0.5);
            optionsPage.$refs.exitimagerect.PlayAni(false, "", "opacity:0", 0.5);
            optionsPage.$refs.Optionsmenubtngroup.ResetAllButtonState();
            break;

        case "optionsjszcjszc_prev":
            if (btn.btnstate)
            {
                optionsPage.PlayPrevjszc();
            }
            break;

        case "optionsjszcjszc_next":
            if (btn.btnstate)
            {
                optionsPage.PlayNextjszc();
            }
            break;

        case "panoramicBtn":
            f3dpage.FadeIn("a1.jpg");
            break;
        default:
            console.log("No Process " + btn.index + ": " + btn.id + " " + btn.btnstate + " Event");
            break;
    }
}

//ue4发送过来的消息
function ProcessUeMessage (mes)
{
    let jsonObject = {};

    if (mes.cmdName != "onCameraMiniMapPos")
        console.log(mes);

    if(mes.cmdName != "isTouchScreen")
    {
        jsonObject=JSON.parse(mes.jsonData);
    }
    

    if (mes.cmdName === "JsRun")
    {
        //		XR.DebugToHtml(mes.argString);
        eval(mes.argString);
    }
    else if (mes.cmdName === "onAllHuXingBaseBlockJsonInfo")    //触发 XR.SetChooseHouseState(true, 2, true)后，ue返回（销控或选房）的选房可选项
    {
        xfpage.FadeIn(jsonObject);
    }
    else if (mes.cmdName === "GetSalasDataFromWeb")    //请求销控数据（初始化所有block后ue4触发回调消息）
    {
        xfpage.GetHttpData();
        console.log(jsonObject);
    } else if (mes.cmdName === "ReturnSalasJsonData")   //返回销控数据 （未找到使用位置）
    {
        console.log("11111");
        console.log(jsonObject);

        xfpage.FadeIn(jsonObject);
    } else if (mes.cmdName === "onSelectRoom")    //选择房间号的回调
    {
        xfpage.OnSelectRoom(jsonObject);

    } else if (mes.cmdName === "onSceneInstanceActive")   //instance初始化结束
    {
        console.log("33333333333333333333333")
        if (jsonObject.sceneType == "ES_maopi") //|| jsonObject.sceneType == "ES_jz"
        {
            xfpage.OnRoomSceneInstanceActive(jsonObject);
            xfpage.SethxinfoMenuDisplayStat(jsonObject.hxinfoMenuDisplayStat);

            // console.log("AAAAAAAAAAAA:" + jsonObject.hxinfoMenuDisplayStat);
        }
        else if (jsonObject.sceneType == "ES_jz_720")
        {
            mainpage.SetVisible("Hidden");
            minimappage.FadeIn(jsonObject);
            //xfpage.SethxinfoMenuDisplayStat(jsonObject.hxinfoMenuDisplayStat);
        }
        else if (jsonObject.sceneType == "ES_jgmy_xlz")
        {
            console.log("++++++++++++++++++++++++")
            xlzPage.OnRoomSceneInstanceActive(jsonObject);
        }
        else if (jsonObject.sceneType == "ES_jgmy")
        {
            console.log("ES_jgmy1111111111111111111111111");
            console.log(jsonObject);
            jgmypage.OnJgmySceneInstanceActive(jsonObject);
        }
        else if (jsonObject.sceneType == "ES_jz")
        {
            jzpage.OnJgmySceneInstanceActive(jsonObject);
        }

    }
    else if (mes.cmdName === "onSelectBuilding")
    {
        xfpage.OnSelectBuilding(mes.argString);
    }
    else if (mes.cmdName === "onHuXingFloorid")
    {
        //console.log(mes.jsonData);
        //minimappage.FadeIn(mes.jsonData);
    }
    else if (mes.cmdName === "onCameraMiniMapPos")
    {
        minimappage.UpdateCameraPos(jsonObject);
        compasspage.UpdateCompassRot(jsonObject);

    }
    else if (mes.cmdName === "onEnterRoomSpace")
    {
        xfpage.atRoomSpace = mes.argString;
    }
    else if (mes.cmdName === "onEnterRoom")
    {
        xfpage.OnEnterRoom(mes.argString);
    }
    else if (mes.cmdName === "onEnterHX")
    {

    }
    //双击进入
    else if (mes.cmdName === "onDoubleClickBaseBlock")
    {
        XR.DebugToHtml("onDoubleClickBaseBlock");
        console.log(mes.cmdName);
        xfpage.DoubleClickHxBlock(jsonObject);
    } else if (mes.cmdName === "onDebugInfo")
    {
        console.log(mes.argString);
    } else if (mes.cmdName === "CollisionHoverProcess")
    {
        collsionproxypage.CollisionHoverProcess(mes.argString, jsonObject);
    } else if (mes.cmdName === "UpDataSelect")
    {
        xfpage.UpDataSelect(mes.argString, jsonObject);
        //  console.log("AAAAAAAAAAAA:" + jsonObject.build + "    BBBBBBBBBBBBBB：" + jsonObject.unit);

    } else if (mes.cmdName === "isTouchScreen")
    {
        camerscalepage.isTouchSceen = mes.argString;
        //  console.log("AAAAAAAAAAAA:" + jsonObject.build + "    BBBBBBBBBBBBBB：" + jsonObject.unit);
    } else
    {

    }
}

function OnChangePage(Type)
{
    console.log("156656161516156");
    if(camerscalepage)
    {
        if(camerscalepage.isTouchSceen == "true")
        {
            if(camerscalepage.isShowButton == true){

                camerscalepage.OnChangePage(Type);
            }
        }
        
    }
}
function CmaeraScaleChange(changeType)
{
    let touchname = "touch";
    let zoomoffset = 0;
    switch (changeType) {
        case 0:
            //console.log(000000000000000000)
            if(isoutdoor)
            {
                zoomoffset =  0.81;
            }
            else{
                zoomoffset =  -0.81;
                
            }
            XR.SendMessageToUe("OnUIZoom", "", JSON.stringify({ touchname, zoomoffset }));
            break;
        case 1:
            //console.log(1111111111111111111000000000000000000)
            if(isoutdoor){

                zoomoffset =  -0.81;
            }
            else{
                zoomoffset =  0.81;
            }
            XR.SendMessageToUe("OnUIZoom", "", JSON.stringify({ touchname, zoomoffset }));
            
            break;
        case 2:
            camerscalepage.OnChangePage(false);
            break;
        default:
            break;
    }
}

XR.SetOnUeMessageDelegate(ProcessUeMessage);
XR.SetOnRemoteButtonEventDelegate(ProcessRemoteButtonEvent);
XR.SetonCameraChangeEventDelegate(OnChangePage);
XR.DebugToHtml(window.navigator.userAgent);
XR.DebugToHtml("window.devicePixelRatio :" + window.devicePixelRatio);

//音乐默认是不能自动播放的，需要被动激活
if (window.navigator.userAgent.indexOf('Mobile') != -1)
{
    window.addEventListener("touchend", () => { if (mediapage.$refs.btnaudio) { mediapage.$refs.btnaudio.SetButtonState(true) } else { bgAudioPlayer_G.Play("audio/bg.wav"); }; }, { once: true });
} else
{
    window.addEventListener("click", () => { if (mediapage.$refs.btnaudio) { mediapage.$refs.btnaudio.SetButtonState(true) } else { bgAudioPlayer_G.Play("audio/bg.wav"); }; }, { once: true });
}

runModeType = "localMode";
//runModeType="vrMouseMode";
//runModeType = "remoteCtrlMode";
//runModeType = "webRTCMode";
//runModeType = "";

webSocketAdress = "127.0.0.1";
//webSocketAdress = "192.168.8.46";
//webSocketAdress = "192.168.137.1";
//webSocketAdress = "192.168.31.172";
//webSocketAdress="192.168.31.105";
//webSocketAdress="171.34.173.25";
//SetRunMode(runModeType,webSocketAdress);

//获取当前页面的url
//处理url里的参数及设置webSocketAdress的值

ProcessURLCmd(window.location.href);

//本机运行状态,UE4端使用 "free" "busy"
runState = "free";

setTimeout(() =>
{
    if (window.ue)
    {
        //SetRunMode(runModeType,"127.0.0.1");
        SetRunMode(runModeType, webSocketAdress);
    } else
    {
        SetRunMode(runModeType, webSocketAdress);
    }
}, 3000);

//ios及安卓需要延迟
/* setTimeout(() => 
{
    if (window.ue)
    {
        //SetRunMode(runModeType,"127.0.0.1");
        SetRunMode(runModeType, webSocketAdress);
    }
    else
    {
        SetRunMode(runModeType, webSocketAdress);
    }
}, 2000); */



//slideimagepage.FadeIn();

//zxkpPage.FadeIn();
//xlzPage.FadeIn();
//scaleimgpage.FadeIn("image/hxt_a.png");
//XR.OnWebUIStart();
//mainpage.FadeIn();
//mediapage.FadeIn();
//let xfData=JSON.parse('{"huxingname":["A","B","C","D","E","F"],"area":["44.0","55.0","66.0","77.0","88.0","99.0"],"guige":["一室一厅","两室一厅","三室一厅","一室两厅","两室两厅","三室两厅"],"forward":["朝东","朝南","朝西","朝北","朝阴","朝阳"],"type":["高层","别墅"],"build":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],"unit":[],"floor":[],"room":[],"salestatus":[""]}');
//xfpage.FadeIn(xfData);
//hxpage.displayhxfloors=true;
//minimappage.FadeIn('{"minimappath":"mp_lfloor_1f.png","minimappos":[50.272461,-110.018677,1070.004517,535.002258],"camerapointpos":[{"pos":[108.16185,126.930862,21.0],"pos2":[36.025051,43.251831,21.0],"forward":[0.587792,0.809012,0.0], "isdefault":true,"roomspacename":"卧室"},{"pos":[-50.351074,-485.026154,21.0],"pos2":[-90.747986,-392.69104,21.0],"forward":[0.587783,-0.809019,0.0], "isdefault":false,"roomspacename":"厨房"},{"pos":[-426.139465,176.011505,21.0],"pos2":[-291.964661,33.180801,21.0],"forward":[-0.684537,0.728978,0.0], "isdefault":false,"roomspacename":"客厅"}]}');
//let json= '{"19":{"2":{"4":[1,12,1],"1":[1,12,1]},"1":{"4":[1,12,1],"1":[1,12,1]}},"8":{"3":{"1":[1,12,1],"2":[1,12,1]},"2":{"2":[1,12,1],"1":[1,12,1]},"1":{"1":[1,12,1]}},"5":{"2":{"3":[1,12,1],"2":[1,8,1],"1":[1,12,1]},"1":{"4":[1,12,1],"3":[1,18,1],"2":[1,12,1]}},"3":{"2":{"2":[1,12,1],"1":[1,12,1]},"1":{"2":[1,12,1]}}}';
//xfpage.FadeIn(json);


