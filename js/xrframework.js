var XR=function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e),n.d(e,"globalscale",function(){return f}),n.d(e,"targetWidth",function(){return S}),n.d(e,"targetHeight",function(){return g}),n.d(e,"viewportWidth",function(){return m}),n.d(e,"viewportHeight",function(){return O}),n.d(e,"vrMouseUI",function(){return p}),n.d(e,"projectName",function(){return v}),n.d(e,"Init",function(){return w}),n.d(e,"DebugToHtml",function(){return T}),n.d(e,"SetBrowserMark",function(){return C}),n.d(e,"UseVRMouseUI",function(){return J}),n.d(e,"SetRunMode",function(){return U}),n.d(e,"SetOnUeMessageDelegate",function(){return X}),n.d(e,"SetOnRemoteButtonEventDelegate",function(){return E}),n.d(e,"SetProjectName",function(){return Y}),n.d(e,"SetWebViewportSize",function(){return P}),n.d(e,"SetUEViewportSize",function(){return D}),n.d(e,"ExecuteUEConsoleCommand",function(){return H}),n.d(e,"SendMessageToUe",function(){return W}),n.d(e,"MessageFromUe",function(){return j}),n.d(e,"SendRemoteButtonEvent",function(){return F}),n.d(e,"TouchCtrl",function(){return k}),n.d(e,"SetViewInnerWindowSate",function(){return B}),n.d(e,"CallBack",function(){return V}),n.d(e,"WebReload",function(){return z}),n.d(e,"OnWebUIStart",function(){return Z}),n.d(e,"SetWebVisibility",function(){return Q}),n.d(e,"ChangeCamera",function(){return _}),n.d(e,"SetCameraPositionAndxyzCount",function(){return q}),n.d(e,"LookAtRedAxis",function(){return G}),n.d(e,"SetCameraHeightAndFieldOfView",function(){return K}),n.d(e,"SetCameraHorizontalOffset",function(){return $}),n.d(e,"PlaySequenceAnimation",function(){return tt}),n.d(e,"StopSequenceAnimation",function(){return et}),n.d(e,"HasOpend",function(){return nt}),n.d(e,"ReStart",function(){return it}),n.d(e,"ResetScene",function(){return ot}),n.d(e,"LoadSceneLoop",function(){return st}),n.d(e,"UnLoadSceneLoop",function(){return rt}),n.d(e,"SetActiveSceneInstance",function(){return ct}),n.d(e,"SetLevelVisible",function(){return ut}),n.d(e,"SetLevelVisibleGroup",function(){return at}),n.d(e,"SetSceneActorState",function(){return dt}),n.d(e,"SetChooseHouseState",function(){return ht}),n.d(e,"InitSalesControl",function(){return lt}),n.d(e,"SelectMinBuildMaxFloor",function(){return ft}),n.d(e,"SelectBuilding",function(){return St}),n.d(e,"SelectUnit",function(){return gt}),n.d(e,"CloseAllBlock",function(){return mt}),n.d(e,"SelectRoom",function(){return Ot}),n.d(e,"FliterSelect",function(){return Lt}),n.d(e,"EnterRoom",function(){return Mt}),n.d(e,"ExitRoom",function(){return Nt}),n.d(e,"SendCtrlCmd",function(){return yt}),n.d(e,"DisplayFloor",function(){return bt}),n.d(e,"GetHuXingFloorMinimapInfo",function(){return pt}),n.d(e,"PlayHXAutoPlayCamera",function(){return vt}),n.d(e,"SetDay24Time",function(){return wt}),n.d(e,"SetSeason",function(){return Tt}),n.d(e,"SetPost",function(){return Ct}),n.d(e,"UpdateHtmlFiles",function(){return Jt}),n.d(e,"Quit",function(){return Ut}),n.d(e,"UpDataRoomState",function(){return Xt}),n.d(e,"SelectCtrlData",function(){return Et}),n.d(e,"ClearH5DebugInfo",function(){return Rt}),n.d(e,"ConnectWebSocket",function(){return Yt}),n.d(e,"SetWSRemoteConnectedState",function(){return Pt}),n.d(e,"UseNullRender",function(){return It});let i,o,s,r,c,u,a,d,h,l,f=1,S=1920,g=1080,m=1,O=1,L=0,M="localMode",N=!1,y=window.ue,b="",p=!1,v="";function w(t=!1,e=!1,n=1920,l=1080,f){S=n,g=l,f&&((a=f).onTransmitMessage=(t,e)=>{switch(t){case"MessageFromUe":d&&d(e);break;case"SendMessageToUe":W(e.cmdName,e.argString,e.jsonData);break;case"RemoteButtonEvent":h&&h(e)}}),setInterval(()=>{L+=.1112},.1112),t&&((i=document.createElement("div")).className="debug",document.head.insertAdjacentElement("afterend",i),(o=document.createElement("div")).innerHTML="Use Debug Output!<br/>",i.insertAdjacentElement("afterbegin",o),(c=document.createElement("div")).innerHTML="touchEndDebug",i.insertAdjacentElement("afterbegin",c),(r=document.createElement("div")).innerHTML="touchMoveDebug",i.insertAdjacentElement("afterbegin",r),(s=document.createElement("div")).innerHTML="touchStartDebug",i.insertAdjacentElement("afterbegin",s),(u=document.createElement("div")).innerHTML="<button onclick='XR.Quit()'>Quit</button> <button onclick='XR.ClearH5DebugInfo()'>Clear</button> <button onclick='XR.SetWebVisibility()'>HiddenWebUI</button> <button onclick='XR.WebReload()'>WebReload</button> <button onclick='XR.ReStart()'>ReStart</button><a href=\"http://html5test.com\" draggable=\"false\">H5UI-20191029</a>",u.className="use-touch",i.insertAdjacentElement("afterbegin",u),console.log("Use Debug Output!")),y&&(console.log("Found window.ue"),T("Found window.ue")),window.innerWidth>0&&(m=window.innerWidth,O=window.innerHeight,I(m,O)),window.addEventListener("touchstart",function(t){if(s){s.innerHTML="All Touch Count:"+t.touches.length+"   ";for(let e=0;e<t.touches.length;e++)s.innerHTML+=R("start",t.touches[e])}},!1),window.addEventListener("touchmove",function(t){if(r){r.innerHTML="All Touch Count:"+t.touches.length+"   ";for(let e=0;e<t.touches.length;e++)r.innerHTML+=R("move",t.touches[e])}},{passive:!0}),window.addEventListener("touchend",function(t){if(c){c.innerHTML="All Touch Count:"+t.touches.length+"   ";for(let e=0;e<t.changedTouches.length;e++)c.innerHTML+=R("end",t.changedTouches[e])}},!0),document.addEventListener("contextmenu",t=>t.preventDefault()),-1!=window.navigator.userAgent.indexOf("Mobile")?(-1!=window.navigator.userAgent.indexOf("QQBrowser")?C("Mobile_QQBrowser"):C("Mobile"),e&&J()):C("Desktop")}function T(t,e=!0){o&&(e?o.innerHTML+=t+"<br/>":o.innerHTML=t+"<br/>")}function C(t){T("BrowserMark: "+(b=t))}function J(){p=!0,T("UseVRMouseUI!")}function U(t){"localMode"!=t&&"remoteCtrlMode"!=t&&"webRTCMode"!=t||(M=t)}function X(t){d=t}function E(t){h=t}function R(t,e){return"{type:"+t+",id:"+e.identifier+",sX:"+e.clientX+",sY:"+e.clientY+"}"}function Y(t){v=t}function P(t,e){m=parseFloat(t),O=parseFloat(e),-1==window.navigator.userAgent.indexOf("Mobile")&&y&&(T("SetUe4WebBrowserViewportSize "+t+"*"+e),I(m,O))}function I(t,e){let n=document.getElementById("globalscalestyle");if(null==n)return;f=t/S;let i=".globalscale{";i+="width:"+Math.floor(t/f)+"px;",i+="height:"+Math.floor(e/f)+"px;",i+="zoom:"+f+";}",n.innerHTML=i}function D(t,e){H("r.SetRes "+t+"x"+e+"w")}function H(t){W("ExecuteUEConsoleCommand","",JSON.stringify({ueConsoleCommand:t}))}function x(t,e){let n=-1;for(let i=0;i<t.length;i++)t[i]==e&&(n=i);n>-1&&t.splice(n,1)}function A(t,e,n,i){return Math.sqrt(Math.pow(t-n,2)+Math.pow(e-i,2))}function W(t,e="",n="{}"){if(y||"WebReload"==t||"ReStart"==t||"HiddenWebUI"==t)return void(y&&y.sender.webtouemessage(t,e,n));switch("OnMouseHover"!=t&&"UpDataRoomState"!=t&&T("JsSend: "+t+"------"+e+"------"+n),M){case"localMode":y&&y.sender.webtouemessage(t,e,n);break;case"remoteCtrlMode":if(N)if(y)y.sender.webtouemessage(t,e,n);else if("OnUIMove"==t||"OnUIZoom"==t||"OnUIPan"==t||"OnOnePointDown"==t||"OnOnePointUp"==t){let i=JSON.stringify({cmdName:t,argString:e,jsonData:n});a.SendWSMessage("TransmitMessage","SendMessageToUe",i)}break;case"webRTCMode":if(N)if(y)y.sender.webtouemessage(t,e,n);else{let i=JSON.stringify({cmdName:t,argString:e,jsonData:n});a.SendWSMessage("TransmitMessage","SendMessageToUe",i)}}}function j(t,e,n){let i="ReceiveFromUE: "+t+"------"+e+"------"+n;if(console.log(i),"onCameraMiniMapPos"!=t&&T(i),"JsRun"!=t||"XR.WebReload()"!=e)switch(M){case"localMode":d({cmdName:t,argString:e,jsonData:n});break;case"remoteCtrlMode":if(N){if(y){let i=JSON.stringify({cmdName:t,argString:e,jsonData:n});a.SendWSMessage("TransmitMessage","MessageFromUe",i)}d({cmdName:t,argString:e,jsonData:n})}break;case"webRTCMode":if(N)if(y){let i=JSON.stringify({cmdName:t,argString:e,jsonData:n});a.SendWSMessage("TransmitMessage","MessageFromUe",i)}else d({cmdName:t,argString:e,jsonData:n})}else z()}function F(t,e="",n="{}"){let i=JSON.stringify({cmdName:t,argString:e,jsonData:n});a.SendWSMessage("TransmitMessage","RemoteButtonEvent",i)}class k{constructor(t,e=!0,n=(()=>{}),i=(()=>{})){this.name=t.id,this.sendMessage=e,this.onUIMove=n,this.onUIZoom=i,this.touchList={},this.idList=new Array,-1!=window.navigator.userAgent.indexOf("Mobile")?(t.addEventListener("touchstart",t=>{this.OnTouchStart(t,this.name)},{passive:!1}),t.addEventListener("touchmove",t=>{this.OnTouchMove(t,this.name)},{passive:!1}),t.addEventListener("touchend",t=>{this.OnTouchEnd(t,this.name)},{passive:!1}),t.addEventListener("touchcancel",t=>{this.OnTouchCancel(t,this.name)},{passive:!1})):(t.addEventListener("mousedown",t=>{this.OnMouseDown(t,this.name)}),t.addEventListener("mousemove",t=>{this.OnMouseMove(t,this.name)}),t.addEventListener("mouseup",t=>{this.OnMouseUp(t,this.name)}),t.addEventListener("wheel",t=>{this.OnWheel(t,this.name)}),t.addEventListener("mousemove",t=>{this.OnMouseMove(t,this.name)}),t.addEventListener("mouseout",t=>{this.OnMouseUp(t,this.name)}))}OnMouseDown(t,e){if(0==t.button){this.touchList[0]={sX:t.clientX,sY:t.clientY,cX:t.clientX,cY:t.clientY,lX:t.clientX,lY:t.clientY},T("OnMouseDown X:"+this.touchList[0].sX+" Y:"+this.touchList[0].sY);let n=t.clientX/m,i=t.clientY/O;this.sendMessage&&W("OnOnePointDown","",JSON.stringify({touchName:e,xPosPercent:n,yPosPercent:i}))}}OnMouseHover(t,e){}OnMouseMove(t,e){if(this.touchList[0]){this.touchList[0].cX=t.clientX,this.touchList[0].cY=t.clientY;let n=this.touchList[0].cX-this.touchList[0].lX,i=this.touchList[0].cY-this.touchList[0].lY;L>1&&(L=0,T(this.name+"   xOffset:"+n+"    yOffset:"+i,!1),this.OnUIMove(n,i),this.sendMessage&&W("OnUIMove","",JSON.stringify({touchName:e,xOffset:n,yOffset:i})),this.touchList[0].lX=this.touchList[0].cX,this.touchList[0].lY=this.touchList[0].cY)}else if(L>1){L=0;let n=t.clientX,i=t.clientY;this.sendMessage&&W("OnMouseHover","",JSON.stringify({touchName:e,xPos:n,yPos:i}))}}OnMouseUp(t,e){this.touchList[0]&&delete this.touchList[0],this.sendMessage&&W("OnOnePointUp","",JSON.stringify({touchName:e}))}OnWheel(t,e){T("OnWheel Y:"+t.deltaY,!1);let n=.01*t.deltaY;this.OnUIZoom(n),this.sendMessage&&W("OnUIZoom","",JSON.stringify({touchName:e,zoomOffset:n}))}OnTouchStart(t,e){for(let e=0;e<t.changedTouches.length;e++)t.currentTarget.id===this.name&&(this.touchList[t.changedTouches[e].identifier]={sX:t.changedTouches[e].clientX,sY:t.changedTouches[e].clientY,cX:t.changedTouches[e].clientX,cY:t.changedTouches[e].clientY,lX:t.changedTouches[e].clientX,lY:t.changedTouches[e].clientY},this.idList.push(t.changedTouches[e].identifier));if(1==t.touches.length){let n=t.touches[0].clientX/m,i=t.touches[0].clientY/O;this.sendMessage&&W("OnOnePointDown","",JSON.stringify({touchName:e,xPosPercent:n,yPosPercent:i}))}}OnTouchMove(t,e){for(let e=0;e<t.touches.length;e++)t.currentTarget.id===this.name&&this.touchList[t.touches[e].identifier]&&(this.touchList[t.touches[e].identifier].cX=t.touches[e].clientX,this.touchList[t.touches[e].identifier].cY=t.touches[e].clientY);if(1==this.idList.length){let t=this.touchList[this.idList[0]].cX-this.touchList[this.idList[0]].lX,n=this.touchList[this.idList[0]].cY-this.touchList[this.idList[0]].lY;L>1&&(L=0,T(this.name+"  "+this.idList.length+"   xOffset:"+t+"    yOffset:"+n,!1),this.OnUIMove(t,n),this.sendMessage&&W("OnUIMove","",JSON.stringify({touchName:e,xOffset:t,yOffset:n})),this.touchList[this.idList[0]].lX=this.touchList[this.idList[0]].cX,this.touchList[this.idList[0]].lY=this.touchList[this.idList[0]].cY)}else if(2==this.idList.length){let t=.1*(A(this.touchList[this.idList[1]].lX,this.touchList[this.idList[1]].lY,this.touchList[this.idList[0]].lX,this.touchList[this.idList[0]].lY)-A(this.touchList[this.idList[1]].cX,this.touchList[this.idList[1]].cY,this.touchList[this.idList[0]].cX,this.touchList[this.idList[0]].cY));L>1&&(L=0,T(this.name+" zoomOffset:"+t,!1),this.OnUIZoom(t),this.sendMessage&&W("OnUIZoom","",JSON.stringify({touchName:e,zoomOffset:t})),this.touchList[this.idList[0]].lX=this.touchList[this.idList[0]].cX,this.touchList[this.idList[0]].lY=this.touchList[this.idList[0]].cY,this.touchList[this.idList[1]].lX=this.touchList[this.idList[1]].cX,this.touchList[this.idList[1]].lY=this.touchList[this.idList[1]].cY)}else if(3==this.idList.length){let t=this.touchList[this.idList[0]].cX-this.touchList[this.idList[0]].lX,n=this.touchList[this.idList[0]].cY-this.touchList[this.idList[0]].lY;L>1&&(L=0,T(this.name+" panX:"+t+";panY:"+n,!1),this.sendMessage&&W("OnUIPan","",JSON.stringify({touchName:e,xOffset:t,yOffset:n})),this.touchList[this.idList[0]].lX=this.touchList[this.idList[0]].cX,this.touchList[this.idList[0]].lY=this.touchList[this.idList[0]].cY)}}OnTouchEnd(t,e){for(let e=0;e<t.changedTouches.length;e++)t.currentTarget.id===this.name&&(delete this.touchList[t.changedTouches[e].identifier],x(this.idList,t.changedTouches[e].identifier));if(T(this.name+"  "+this.idList.length+JSON.stringify(this.touchList)),1==t.touches.length){let n=t.touches[0].clientX/m,i=t.touches[0].clientY/O;this.sendMessage&&W("OnOnePointDown","",JSON.stringify({touchName:e,xPosPercent:n,yPosPercent:i}))}else this.sendMessage&&W("OnOnePointUp","",JSON.stringify({touchName:e}))}OnTouchCancel(t,e){delete this.touchList,this.touchList={},this.idList=new Array,console.log("TouchCancel"),T("TouchCancel")}OnUIMove(t,e){this.onUIMove(t,e)}OnUIZoom(t){this.onUIZoom(t)}OnUIPan(t,e){}}function B(t,e,n,i,o,s){W("SetViewInnerWindowSate","",JSON.stringify({state:t,sceneInstanceName:e,xPos:n,yPos:i,xSize:o,ySize:s}))}function V(t="",e="",n){let i;return i=n?JSON.stringify(n):"",JSON.stringify({cmdName:t,argString:e,jsonData:i})}function z(){W("WebReload")}function Z(){W("OnWebUIStart")}function Q(){W("SetWebVisibility",l?"true":"false","{}"),l=!l}function _(t,e="",n=2,i=!0){""!=e&&JSON.parse(e),W("ChangeCamera","",JSON.stringify({cameraName:t,onChangeCameraEnd:e,useTime:n,endEnableCtrl:i}))}function q(t,e="",n=1,i=!0){""!=e&&JSON.parse(e),W("SetCameraPositionAndxyzCount","",JSON.stringify({posAndxyzCount:t,onCameraMoveEnd:e,useTime:n,endEnableCtrl:i}))}function G(t,e,n,i,o,s,r,c,u,a="",d="",h="",l=1,f=!0){""!=h&&JSON.parse(h),W("LookAtRedAxis","",JSON.stringify({posX:t,posY:e,posZ:n,forwardX:i,forwardY:o,forwardZ:s,mirrorX:r,mirrorY:c,mirrorZ:u,inYCount:a,inZCount:d,onCameraMoveEnd:h,useTime:l,endEnableCtrl:f}))}function K(t=-1,e=-1){W("SetCameraHeightAndFieldOfView","",JSON.stringify({height:t,view:e}))}function $(t){W("SetCameraHorizontalOffset","",JSON.stringify({offset:t}))}function tt(t,e=-1){W("PlaySequenceAnimation","",JSON.stringify({animationID:t,loopTime:e}))}function et(){W("StopSequenceAnimation","","{}")}function nt(){W("HasOpend","","{}")}function it(t=""){""!=t?JSON.parse(t):t=V("JsRun","XR.WebReload()",{}),W("ReStart","",JSON.stringify({onEndReStart:t}))}function ot(t,e="",n){""!=e&&JSON.parse(e),W("ResetScene","",JSON.stringify({sceneName:t,onEndResetScene:e,visibleOnEnd:n}))}function st(t,e="",n="",i="",o=!0){""!=e&&JSON.parse(e),""!=n&&JSON.parse(n),""!=i&&JSON.parse(i),W("LoadSceneLoop","",JSON.stringify({sceneNames:t,onStartLoad:e,onLoading:n,onEndLoad:i,visibleDefault:o}))}function rt(t,e="",n="",i=""){""!=e&&JSON.parse(e),""!=n&&JSON.parse(n),""!=i&&JSON.parse(i),W("UnLoadSceneLoop","",JSON.stringify({sceneNames:t,onStartUnLoad:e,onUnLoading:n,onEndUnLoad:i}))}function ct(t,e="",n=""){W("SetActiveSceneInstance","",JSON.stringify({sceneName:t,defaultCameraName:e,onEnd:n}))}function ut(t,e,n=""){""!=n&&JSON.parse(n),W("SetLevelVisible","",JSON.stringify({sceneName:t,visible:e,onLevelVisible:n}))}function at(t,e){W("SetLevelVisibleGroup","",JSON.stringify({sceneNames:t,visibles:e}))}function dt(t,e,n=!1){W("SetSceneActorState","",JSON.stringify({actorName:t,state:e,ignoreCurrentState:n}))}function ht(t,e=0,n=!1){W("SetChooseHouseState","",JSON.stringify({active:t,entranceType:e,isSalasState:n}))}function lt(t){W("InitSalesControl","",JSON.stringify({active:t}))}function ft(t){W("SelectMinBuildMaxFloor","",JSON.stringify({hxName:t}))}function St(t){W("SelectBuilding","",JSON.stringify({inSelect:t}))}function gt(t){W("SelectUnit","",JSON.stringify({inSelect:t}))}function mt(){W("CloseAllBlock","")}function Ot(t="",e){W("SelectRoom","",JSON.stringify({roomNumber:t,isEnterroomState:e}))}function Lt(t="",e,n){W("FliterSelect","",JSON.stringify({filterStr:t,startFloor:e,endFloor:n}))}function Mt(t){W("EnterRoom","",JSON.stringify({isEnterroomState:t}))}function Nt(t){W("ExitRoom","",JSON.stringify({isEnterroomState:t}))}function yt(t,e="",n="{}"){W("SendCtrlCmd","",JSON.stringify({cmdName:t,argString:e,jsonData:n}))}function bt(t,e=!1){W("DisplayFloor","",JSON.stringify({floorid:t,hiddenTopFloorMesh:e}))}function pt(t){W("GetHuXingFloorMinimapInfo","",JSON.stringify({floorid:t}))}function vt(t){W("PlayHXAutoPlayCamera","",JSON.stringify({state:t}))}function wt(t){W("SetDay24Time","",JSON.stringify({id:t}))}function Tt(t){W("SetSeason","",JSON.stringify({id:t}))}function Ct(t){W("SetPost","",JSON.stringify({postType:t}))}function Jt(){W("UpdateHtmlFiles")}function Ut(){W("Quit")}function Xt(t,e="",n="",i="",o="",s=""){W("UpDataRoomState","",JSON.stringify({cmdName:t,roomIdString:e,saleStatuString:n,ConsPrice:i,CustomName:o,CustomPhone:s}))}function Et(t,e=""){W("SelectCtrlData","",JSON.stringify({cmdName:t,selectDataString:e}))}function Rt(){o.innerHTML=""}function Yt(t){a&&a.ConnectWebSocket(t)}function Pt(t){N=t}function It(t){W("UseNullRender","",JSON.stringify({state:t}))}}]);