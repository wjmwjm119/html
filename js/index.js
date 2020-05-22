let runModeType = "";
let webSocketAdress = "";
let runState = "";

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

function ProcessRemoteButtonEvent(jsonData)
{
    let findButton = document.getElementById(jsonData.cmdName);

    ISREMOTEBUTTONEVENT = true;
    findButton.click();
    ISREMOTEBUTTONEVENT = false;
}

function BroadcastRunState(guidHexString)
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

function ProcessURLCmd(url)
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

function SetRunMode(runModeType, webSocketAdress)
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

                        if (false)
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
                if (window.ue)
                {
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


function ProcessButtonMessage(btn)
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
            break;

        // CH
        case "btnSetViewWindows":
            if (btn.btnstate)
            {
                mainpage.isShowTouchInnerview = true;
                XR.SetViewInnerWindowSate(true, "main", 0, 400, 1800, 1800);
            } else
            {
                mainpage.isShowTouchInnerview = false;
                XR.SetViewInnerWindowSate(false, "");
            }
            break;

        case 'btninvMain':
            // if (btn.btnstate) {
            XR.SetViewInnerWindowSate(true, "main");
            //} // else {
            //     XR.SetViewInnerWindowSate(false, sceneInstanceName);
            // }

            break;

        case 'btninwmp':
            //  if (btn.btnstate) {
            XR.SetViewInnerWindowSate(true, "mp_l");
            // } //else {
            //     XR.SetViewInnerWindowSate(false, "");
            // }
            break;
        //CH

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


        ////////CH////////////////////////////////////////////////////
        case "mainbtn":
            if (btn.btnstate)
            {
                XR.PlayHXSequenceAnimation(0);
                mainpage.$root.mainmenubg = "";
                mainpage.$root.btngroup = "";
                mainpage.ejmenubtngroup = "";
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mediapage.FadeOut();
                videopage.FadeOut();
            } else
            {
                XR.StopHXSequenceAnimation();
                mainpage.$root.mainmenubg = "mainmenubgimage";
                mainpage.$root.btngroup = "mainmenubtngroup";
                mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
                mainpage.$refs.swqwbtngroup.ResetAllButtonState();
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152");
                mediapage.FadeIn();
            }


            break;

        case "qwjz":
            if (btn.btnstate)
            {
                compasspage.FadeIn();
                //                mainpage.$refs.mainmenu.PlayAni(false, "", "right:-5%");
                mainpage.$root.btngroup = "qwjzbtngroup";
                videopage.FadeIn(() => { mainpage.$refs.qwjzbtngroup.$children[0].ClickDown(); });

            } else
            {
                //                mainpage.$refs.mainmenu.PlayAni(true, "", "right:-15%");
                mainpage.$root.btngroup = "mainmenubtngroup";
                mainpage.$refs.qwjzbtngroup.ResetAllButtonState();
                videopage.FadeOut();
            }
            break;

        case "qwjz_qwzt":

            if (btn.btnstate)
            {
                videopage.Play("", "video/qw_loop");
            } else
            {

            }

            break;

        case "qwjz_jtys":
            if (btn.btnstate)
            {
                videopage.Play("video/jtys_start", "video/jtys_loop");
            } else
            {

            }
            break;

        case "qwjz_dshxq":
            if (btn.btnstate)
            {
                videopage.Play("video/dshxq_start", "video/dshxq_loop");
            } else
            {

            }
            break;

        case "qwjz_jzys":
            if (btn.btnstate)
            {
                videopage.Play("video/jzys_start", "video/jzys_loop");
            } else
            {

            }
            break;

        ////////CH////////////////////////////////////////////////////
        case "zxqw": //中心区位
            if (btn.btnstate)
            {
                compasspage.FadeIn("zxqw");
                mainpage.mainbtnShow = false;
                mainpage.ejmenubtngroup = "qwbtngroup";

                // mainpage.$refs.postrect.PlayAni(false, "", "left:-30%");
                // mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                XR.SetCameraPositionAndxyzCount("-12187.777344,1288.661865,40.125,175.010239,32.5,63750.015625");
            } else
            {
                mainpage.ejmenubtngroup = "";
            }

            XR.SendCtrlCmd("ctrlumg", "zxqw", btn.btnstate ? "true" : "false");

            break;

        case "zxqw_ewqw":
            if (btn.btnstate)
            {
                compasspage.FadeOut();
                mediapage.FadeOut();
                videopage.FadeIn(() => { videopage.Play("video/dt_start", "video/dt_loop", () => { mainpage.btngroup = "ewqwbtngroup" }); });
                mainpage.ejmenubtngroup = "";
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mainpage.mainmenubtngroup = "";
                mainpage.btngroup = "";
                mainpage.$root.mainmenubg = "";
            }
            else
            {
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
            }
            break;

        case "ewqw_gy":
            if (btn.btnstate)
            {
                videopage.Play("video/gy_start", "video/gy_loop");
            }
            else
            {
            }
            break;

        case "ewqw_xz":
            if (btn.btnstate)
            {
                videopage.Play("video/xz_start", "video/xz_loop");
            }
            else
            {
            }
            break;

        case "ewqw_jt":
            if (btn.btnstate)
            {
                videopage.Play("video/jt_start", "video/jt_loop");
            }
            else
            {
            }
            break;

        case "ewqw_jyyl":
            if (btn.btnstate)
            {
                videopage.Play("video/jyyl_start", "video/jyyl_loop");
            }
            else
            {
            }
            break;

        case "ewqw_sy":
            if (btn.btnstate)
            {
                videopage.Play("video/sy_start", "video/sy_loop");
            }
            else
            {
            }
            break;

        case "ewqw_back":
            videopage.FadeOut();
            mediapage.FadeIn();
            compasspage.FadeIn("zxqw");
            mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
            mainpage.$refs.swqwbtngroup.ResetAllButtonState();
            mainpage.$root.btngroup = "mainmenubtngroup";
            mainpage.$root.mainmenubg = "mainmenubgimage";
            mainpage.mainbtnShow = true;
            mainpage.$refs.qwbtngroup.ResetAllButtonState();
            mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
            compasspage.FadeOut();
            break;

        case "zxqw_swqw":
            if (btn.btnstate)
            {
                //videopage.FadeOut();
                mainpage.ejmenubtngroup = "";
                mainpage.$root.btngroup = "swqwbtngroup";
                mainpage.$root.mainmenubg = "";
                mainpage.$refs.swqwbtngroup.$children[0].ClickDown();

                //    XR.SetCameraPositionAndxyzCount("-16723.929688,2962.133545,40.125,-289.489746,51.25,141250.015625");
                XR.SendCtrlCmd("ctrlumg", "swqw", btn.btnstate ? "true" : "false");
            }
            break;


        case "swqw_jtpt":
            XR.SetCameraPositionAndxyzCount("-16723.929688,2962.133545,40.125,-289.489746,51.25,141250.015625");

            XR.SendCtrlCmd("ctrlumg", "jtpt", btn.btnstate ? "true" : "false");
            break;

        case "swqw_jyyl":
            XR.SetCameraPositionAndxyzCount("-21799.074219,1791.829834,40.125,-222.239807,41.25,184166.671875");

            XR.SendCtrlCmd("ctrlumg", "jyyl", btn.btnstate ? "true" : "false");
            break;

        case "swqw_jrsy":
            XR.SetCameraPositionAndxyzCount("-119631.609375,42236.046875,40.000221,-240.489716,54.0,147450.046875");

            XR.SendCtrlCmd("ctrlumg", "jrsy", btn.btnstate ? "true" : "false");
            break;

        case "swqw_stpt":
            XR.SetCameraPositionAndxyzCount("-83159.804688,27283.316406,-19.062458,-5.739746,52.5,200000.0");

            XR.SendCtrlCmd("ctrlumg", "stpt", btn.btnstate ? "true" : "false");
            break;

        case "swqw_zwbg":
            XR.SetCameraPositionAndxyzCount("-119631.609375,42236.046875,40.000221,-542.989746,53.25,149483.40625");

            XR.SendCtrlCmd("ctrlumg", "zwbg", btn.btnstate ? "true" : "false");
            break;

        case "swqw_back":
            if (btn.btnstate)
            {
                //返回
                mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
                mainpage.$refs.swqwbtngroup.ResetAllButtonState();
                mainpage.$root.btngroup = "mainmenubtngroup";
                mainpage.$root.mainmenubg = "mainmenubgimage";
                mainpage.mainbtnShow = true;
                mainpage.$refs.qwbtngroup.ResetAllButtonState();
                mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152px");
                compasspage.FadeOut();
                XR.SetCameraPositionAndxyzCount("-12187.777344,1288.661865,40.125,175.010239,32.5,63750.015625");
            }
            XR.SendCtrlCmd("ctrlumg", "swqw_back", btn.btnstate ? "true" : "false");
            break;
        ////////CH////////////////////////////////////////////////////


        // case "xmzl":
        //     if (btn.btnstate) {
        //         mainpage.$refs.mainmenu.PlayAni(false, "", "right:9%");
        //         mainpage.$root.btngroup = "xmzlbtngroup";
        //         mainpage.$refs.xmzlbtngroup.$children[0].ClickDown();
        //     } else {
        //         mainpage.$refs.mainmenu.PlayAni(true, "", "right:-15%");
        //         mainpage.$root.btngroup = "mainmenubtngroup";
        //         mainpage.$refs.xmzlbtngroup.ResetAllButtonState();
        //     }

        //     break;
        ////////////////////////////////////////////////CH
        case "xmzl": //项目简介
            if (btn.btnstate)
            {
                mainpage.ejmenubtngroup = "xmzlbtngroup";

                // videopage.FadeIn(() => { videopage.Play("video/xmjj_start", "video/xmjj_loop"); });
                // mainpage.$refs.mainmenu.PlayAni(false, "", "");
                // xmjjpage.FadeIn();
                // mainpage.FadeOut();
                // mediapage.FadeOut();
                // compasspage.FadeOut();
                console.log("项目简介-----------------------");
            } else
            {
                mainpage.ejmenubtngroup = "";
                // mainpage.$refs.xmjjbtnbackrect.PlayAni(false, "", "right:-30%");
                // mainpage.$refs.mainbtnrect.PlayAni(true, "", "right:0%");
                // mainpage.$refs.postrect.PlayAni(true, "", "left:0%");
                // mainpage.$refs.daytimerect.PlayAni(true, "", "right:-152");
                // mediapage.FadeIn();
            }
            XR.SendCtrlCmd("ctrlumg", "xmjj", btn.btnstate ? "true" : "false");


            break;
        case "xmzl_xmjj":
            if (btn.btnstate)
            {
                videopage.FadeIn(() => { videopage.Play("video/xmjj_start", "video/xmjj_loop"); });
                mainpage.$refs.mainmenu.PlayAni(false, "", "");
                xmjjpage.FadeIn();
                mainpage.$refs.mainmenuroot.PlayAni(false, "", "bottom:-30%");
                mainpage.$refs.daytimerect.PlayAni(false, "", "right:-30%");
                mediapage.FadeOut();
                compasspage.FadeOut();
                mainpage.ejmenubtngroup = "";
            } else
            {

            }
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


        case "my_hxnk":
            break;

        case "my_zyxz":
            break;

        case "my_vrbf":
            break;

        case "my_zdbf":
            break;

        case "my_back":
            mypage.FadeOut();
            mypage.$refs.mymenurighgroup.ResetAllButtonState();
            mainpage.FadeIn();
            //  mainpage.$refs.mainmenubtngroup.ResetAllButtonState();
            // mainpage.mainbtnShow = true;
            // mainpage.$root.btngroup = "mainmenubtngroup";
            // mainpage.$root.mainmenubg = "mainmenubgimage";
            console.log("my_back***********************************************");

            break;

        case "hxty":
            // if (btn.btnstate) {
            //     // mainpage.FadeOut();

            //     hxpage.FadeIn();
            //     hxpage.isShowhxroot = false;
            //     hxpage.isShowhxtyinforoot = false;
            //     // hxpage.FadeIn(() => {
            //     //     hxpage.$refs.hxxzbtngroup.$children[0].ClickDown();
            //     // });
            //     // hxpage.ChooseHx(false);

            //     hxpage.displayEnterHXBtn = false;
            //     hxpage.isShowhxtyinforoot = true;
            //     hxpage.isShowbxbg = true;
            //     hxpage.isShowhxxzbtnrect = true;
            //     XR.SetSceneActorState("loubiao", true);
            //     XR.SetCameraPositionAndxyzCount("34532.46875,-25131.072266,126.574028,-113.239761,46.75,39999.992188");

            //     //   compasspage.FadeIn("hxty");

            // } else {
            //     hxpage.isShowbxbg = false;
            //     // hxpage.isShowhxroot = false;
            //     // hxpage.isShowhxtyinforoot = false;
            //     hxpage.FadeOut();
            //     XR.SetSceneActorState("loubiao", false);
            //     XR.SetSceneActorState("HX_FB_110", false);
            //     XR.SetSceneActorState("HX_FB_125", false);
            //     XR.SetSceneActorState("HX_FB_140", false);

            // }
            //待增加

            if (btn.btnstate)
            {
                xfpage.SetChooseHouseState(true, 0, true);
            }
            else
            {
                xfpage.FadeOut();
            }

            break;

        case "hxty_hxcg":
            if (btn.btnstate)
            {
                xfpage.ishxcgbtnrect = true;
                xfpage.$refs.hxcgbtngroup.$children[0].ClickDown();
                XR.SetSceneActorState("hxcg", true);

            } else
            {
                xfpage.ishxcgbtnrect = false;
                XR.SetSceneActorState("hxcg", false);
            }

            break;

        case "hxty_fcz":
            XR.SetSceneActorState("fcz", btn.btnstate ? true : false);
            break;

        case "hxty_xsjj":
            XR.SetSceneActorState("xsjj", !btn.btnstate ? true : false);
            break;

        case "hxty_pmt":
            //  xfpage.isShowhxxzBigbtnrect = (btn.btnstate ? true : false);
            xfpage.Displaypmt(btn.btnstate);
            //  XR.SetSceneActorState("pmt", btn.btnstate ? true : false);
            break;

        case "hxty_jrmy": //户型体验中的景观漫游
            if (btn.btnstate)
            {
                xfpage.EnterMy();

            }
            break;

        case "hxty_back":
            // hxpage.ExitHX();
            xfpage.ExitRoom();

            // xfpage.ExitMy();
            console.log("户型体验返回");
            //mainpage.FadeIn();
            // hxpage.FadeOut();
            // hxpage.$refs.hxmenubtngroup.ResetAllButtonState();
            // compasspage.FadeOut();
            break;

        case "hxtymy_hxnk":
            if (btn.btnstate)
            {
                xfpage.MyToNk();
            }

            break;

        case "hxtymy_zyxz":
            break;

        case "hxtymy_vrbf":
            break;

        case "hxtymy_zdbf":
            break;

        case "hxtymy_back":
            if (btn.btnstate)
            {
                // hxpage.isShowhxroot = true;
                // hxpage.isShowhxtyinforoot = true;
                // hxpage.$refs.btngroup = "hxmenubtngroup";
                // hxpage.isShowhxtymyrect = false;
                // hxpage.isShowmymentstate = false;
                // hxpage.isShowbxbg = true;
                // hxpage.$refs.hxmenubtngroup.ResetAllButtonState();
                // hxpage.$refs.hxmenuroot.PlayAni(true, "", "bottom:0%");
                // compasspage.FadeIn("hxty");
                //xfpage.ExitMy();
                xfpage.ExitRoom();
            } else
            {

            }
            break;

        case "hxtymysy_18°":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(-1, 60);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(120, 90);
            }
            break;
        case "hxtymysy_24°":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(-1, 90);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(120, 90);
            }
            break;

        case "hxtymysy_30°":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(-1, 120);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(120, 90);
            }
            break;

        case "hxtymygd_150":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(150, 0);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(120, 0);
            }
            break;
        case "hxtymygd_160":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(160, 0);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(120, 0);
            }
            break;
        case "hxtymygd_170":
            if (btn.btnstate)
            {
                XR.SetCameraHeightAndFieldOfView(170, 0);
            } else
            {
                XR.SetCameraHeightAndFieldOfView(120, 0);
            }
            break;

        case "hxtymymenuleftstate":
            if (btn.btnstate)
            {
                xfpage.$refs.hxtymymenuleft.PlayAni(false, "", "left:-550px");
                xfpage.$refs.xfindoorinforect.PlayAni(false, "", "left:-30%");
                compasspage.$refs.compasspichxtymy.PlayAni(false, "", "left:-30%");
                minimappage.$refs.minimapsaclerect.PlayAni(false, "", "right:undefined;left:-30%");
            } else
            {
                xfpage.$refs.hxtymymenuleft.PlayAni(true, "", "left:0%");
                xfpage.$refs.xfindoorinforect.PlayAni(true, "", "left:0%");
                compasspage.$refs.compasspichxtymy.PlayAni(true, "", "left:480px");
                minimappage.$refs.minimapsaclerect.PlayAni(true, "", "right:undefined;left:50px");
            }
            break;

        case "hxtymymenustate":
            xfpage.DisPlayMyHxinfo(!btn.btnstate);
            break;

        case "hxcg_9":
            if (btn.btnstate)
            {
                console.log("户型采光9点");
                xfpage.ChangeDayLighting(9);
            } else
            {

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
            } else
            {

            }
            break;

        case "hxxz_140":
            if (btn.btnstate)
            {
                xfpage.ChooseHx(140);
            } else
            {
                XR.SetSceneActorState("HX_FB_140", false);
            }
            console.log("户型选择140");
            break;

        case "hxxz_125":
            if (btn.btnstate)
            {
                // xfpage.ChooseHx(125);
            } else
            {
                XR.SetSceneActorState("HX_FB_125", false);
            }
            break;

        case "hxxz_110":
            if (btn.btnstate)
            {
                xfpage.ChooseHx(110);
            } else
            {
                XR.SetSceneActorState("HX_FB_110", false);
            }
            break;

        case "hxxzsmallbtn":
            xfpage.ChangeHxxzbtnBigImage(true);
            xfpage.isShowhxxzsmallbtnrect = false;
            break;

        case "hxxzbtnbigBack":
            xfpage.ChangeHxxzbtnBigImage(false);
            break;

        case "enterhx":
            hxpage.EnterHX();
            // mainpage.FadeOut();
            // mainpage.isShowTouchInnerview = true;
            // mainpage.btngroup = "";
            // mainpage.mainmenubg = "";


            break;

        // case "hxxz_hxxx140":
        //     xfpage.ChangeHxInfo(140);
        //     break;

        // case "hxxz_hxxx125":
        //     xfpage.ChangeHxInfo(125);
        //     break;

        // case "hxxz_hxxx110":
        //     xfpage.ChangeHxInfo(110);

        //     break;

        ////////////////////////////////////////////////CH



        // case "xmzl_xmjj":
        //     if (btn.btnstate) {
        //         XR.SetCameraPositionAndxyzCount("19618,20867,40,-83.2,62,74166", XR.CallBack("JsRun", 'apngpage.FadeIn("image/xmjj2.png");'));
        //         //				XR.SetCameraPositionAndxyzCount("19618,20867,40,-83.2,62,74166");
        //     } else {
        //         XR.SetCameraPositionAndxyzCount(",,,,,", "", 0);
        //         apngpage.FadeOut();
        //     }
        //     break;

        // case "xmzl_ltjt":
        //     if (btn.btnstate) {
        //         XR.SetCameraPositionAndxyzCount("1134.017456,991.993164,40.0,-12.200005,28.25,82499.320313");
        //         XR.SetSceneActorState("ltjt", true);
        //     } else {
        //         XR.SetSceneActorState("ltjt", false);
        //     }
        //     break;

        // case "xmzl_jyyl":
        //     if (btn.btnstate) {
        //         XR.SetCameraPositionAndxyzCount("-9231.607422,-68738.085938,40.0,284.549988,34.75,99166.03125");
        //         XR.SetSceneActorState("jyyl", true);
        //     } else {
        //         XR.SetSceneActorState("jyyl", false);
        //     }
        //     break;

        // case "xmzl_xzxx":
        //     if (btn.btnstate) {
        //         XR.SetCameraPositionAndxyzCount("-36870.597656,-65234.496094,40.0,-22.700043,36.5,92499.328125");
        //         XR.SetSceneActorState("xzxx", true);
        //     } else {
        //         XR.SetSceneActorState("xzxx", false);
        //     }
        //     break;

        // case "xmzl_gxsq":
        //     if (btn.btnstate) {
        //         XR.SetCameraPositionAndxyzCount("-14752.675781,-2866.388428,40.0,-5.000015,66.900002,68084.117188", XR.CallBack("JsRun", 'apngpage2.FadeIn("image/gxsq_bg.png");'));
        //         //				apngpage2.FadeIn('image/gxsq_bg2.png')
        //     } else {
        //         XR.SetCameraPositionAndxyzCount(",,,,,", "", 0);
        //         apngpage2.FadeOut();
        //         slideimagepage.FadeOut();
        //     }
        //     break;

        // case "gxsq_cf":
        //     slideimagepage.FadeIn('gxcf');
        //     break;

        // case "gxsq_etg":
        //     slideimagepage.FadeIn('gxetg');
        //     console.log("共享儿童馆");
        //     break;

        // case "gxsq_hkt":
        //     slideimagepage.FadeIn('gxhkt');
        //     break;

        // case "gxsq_qf":
        //     slideimagepage.FadeIn('gxqf');
        //     break;

        // case "gxsq_xyf":
        //     slideimagepage.FadeIn('gxxyf');
        //     break;

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

        // case "hxfb_k":
        //     if (btn.btnstate) {
        //         hxpage.ChooseHX("k");
        //     }
        //     break;

        // case "hxfb_l":
        //     if (btn.btnstate) {
        //         hxpage.ChooseHX("l");
        //     }
        //     break;

        // case "hxfb_m":
        //     if (btn.btnstate) {
        //         hxpage.ChooseHX("m");
        //     }
        //     break;

        // case "hxfb_n":
        //     if (btn.btnstate) {
        //         hxpage.ChooseHX("n");
        //     }
        //     break;

        // case "hxfb_o":
        //     if (btn.btnstate) {
        //         hxpage.ChooseHX("o");
        //     }
        //     break;

        // case "hxfb_t":
        //     if (btn.btnstate) {
        //         hxpage.ChooseHX("t");
        //     }
        //     break;

        // case "hxfb_t1":
        //     if (btn.btnstate) {
        //         hxpage.ChooseHX("t1");
        //     }
        //     break;

        // case "enterhx":
        //     hxpage.EnterHX();
        //     break;

        //CH//////////////////////////////////漫游
        case "mymenustate":
            mypage.DisPlayMyHxinfo(!btn.btnstate);

            break;

        case "mymenuleftstate":
            if (btn.btnstate)
            {
                mypage.$refs.mymenuleft.PlayAni(false, "", "left:-30%");
            } else
            {
                mypage.$refs.mymenuleft.PlayAni(true, "", "left:0%");
            }
            break;


        case "mysy_one":
            break;

        case "mysy_two":
            break;

        case "mysy_three":
            break;

        case "mygd_one":
            break;

        case "mygd_two":
            break;

        case "mygd_three":
            break;

        case "myhxnk":
            break;

        case "myzyxz":
            break;

        case "myvryj":
            break;

        case "myzdbf":
            break;

        case "myback":
            break;
        ////////////////////////////////////CH



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
                console.log("进入户型..................");
                xfpage.StartEnterRoom();
            } else
            {
                XR.DebugToHtml(xfpage.hxName + "户型未设置sceneMapName");
            }
            break;

        case "exitroom":
            xfpage.ExitRoom();
            break;

        case "xfindoorzd":
            if (btn.btnstate)
            {
                xfpage.PlayHXSequenceAnimation(0);
            }
            break;

        case "xfindoormy":
            if (btn.btnstate)
            {
                xfpage.StopHXSequenceAnimation(0);
            }
            break;

        //     //CH
        case "daytime0":
            if (btn.btnstate)
            {
                XR.SetDay24Time(0);
                //				XR.SetSeason(0);
                // XR.SetCameraHorizontalOffset(500);
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
                // XR.SetSeason(2);
            }
            break;

        case "daytime3":
            if (btn.btnstate)
            {
                XR.SetDay24Time(3);
                // XR.SetSeason(3);
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
                mainpage.ejmenubtngroup = "";
            }
            break;

        case "zhpp_back":
            slideimagepage.Exitppjz();
            break;

        case "ppjz_tpjk":
            slideimagepage.FadeIn('zhpp');
            slideimagepage.Enterppjz();
            break;

        case "ppjz_spjk":
            break;
        case "fyxk":
            //
            if (btn.btnstate)
            {
                console.log(xfpage);
                xfpage.SetChooseHouseState(true, 2, true);
                xfpage.TimeLoopHttp(10000);
                XR.SetSceneActorState("loubiao", true);
                mainpage.ejmenubtngroup = "xkbtngroup";

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
            minimappage.ChoosePoint(btn.argjson);
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
                optionsPage.$refs.registerimage.style = "width: 600px;height:600px"
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

            jgmypage.StopHXSequenceAnimation();
            // XR.SetActiveSceneInstance("", "CameraUniversalMY");
            //  XR.ChangeCamera("CameraUniversalMY");

            break;

        case "jgmy_zdbf":
            if (btn.btnstate)
            {
                jgmypage.PlayHXSequenceAnimation(0, -1);
            }
            else
            {
                jgmypage.StopHXSequenceAnimation();
            }
            break;

        case "jgmy_back":
            jgmypage.FadeOut();
            break;


        case "xlz_back":
            if (btn.btnstate)
            {
                //mainpage.FadeIn();
                xlzPage.FadeOut();
                minimappage.FadeOut();
                XR.SetLevelVisible("main", true);
                XR.SetActiveSceneInstance("main");
            }
            break;
        case "xlz_change":
            if (btn.btnstate)
            {
                xlzPage.ChangeImgData("piclist/dq/DQ_", 1, 145, false);
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

                mediapage.FadeOut();
                videopage1.FadeIn(() => { videopage1.Play("video/help_main", "video/help_my", () => { videopage1.Play("video/help_main", "video/help_my") }); });
                optionsPage.$refs.optionsmenu.PlayAni(false, "", "opacity:0", 0.5);
                optionsPage.$refs.exitimagerect.PlayAni(true, "", "opacity:1", 0.5);
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
function ProcessUeMessage(mes)
{
    console.log(mes);
    let jsonObject = JSON.parse(mes.jsonData);

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
        if (jsonObject.sceneType == "ES_maopi" || jsonObject.sceneType == "ES_jz" || jsonObject.sceneType == "ES_jz_720")
        {
            xfpage.OnRoomSceneInstanceActive(jsonObject);
            xfpage.SethxinfoMenuDisplayStat(jsonObject.hxinfoMenuDisplayStat);

            // console.log("AAAAAAAAAAAA:" + jsonObject.hxinfoMenuDisplayStat);
        }
        if (jsonObject.sceneType == "ES_jgmy_xlz")
        {
            console.log("++++++++++++++++++++++++")
            xlzPage.OnRoomSceneInstanceActive(jsonObject);
        }
        if (jsonObject.sceneType == "ES_jgmy")
        {
            console.log("ES_jgmy1111111111111111111111111");
            console.log(jsonObject);
            jgmypage.OnJgmySceneInstanceActive(jsonObject);
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
    else if (mes.cmdName === "UpDataRoomString")
    {
        console.log(mes.argString);
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

    } else
    {

    }
}


XR.SetOnUeMessageDelegate(ProcessUeMessage);
XR.SetOnRemoteButtonEventDelegate(ProcessRemoteButtonEvent);
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
runModeType = "remoteCtrlMode";
//runModeType="webRTCMode";
//runModeType = "";
//本机运行状态,UE4端使用 "free" "busy"
runState = "free";

//runModeType="webRTCMode";

webSocketAdress = "127.0.0.1";
//webSocketAdress = "192.168.8.24";
//webSocketAdress="192.168.31.172";
//webSocketAdress="192.168.31.105";
//webSocketAdress="171.34.173.25";
//SetRunMode(runModeType,webSocketAdress);

//获取当前页面的url
//处理url里的参数及设置webSocketAdress的值
ProcessURLCmd(window.location.href);

if (window.ue)
{
    //	SetRunMode(runModeType,"127.0.0.1");
    SetRunMode(runModeType, webSocketAdress);
} else
{
    SetRunMode(runModeType, webSocketAdress);
}



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