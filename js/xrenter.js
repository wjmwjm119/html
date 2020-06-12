
XR.Init(false,false,1920,1080);

//ue4发送过来的消息
function ProcessUeMessage(mes)
{
    console.log(mes);
    let jsonObject = JSON.parse(mes.jsonData);

    if (mes.cmdName === "JsRun")
    {
        eval(mes.argString);
    }
    else if (mes.cmdName === "XXXXXXXXXX")   
    {
        xfpage.FadeIn(jsonObject);
    }
    else
    {

    }
}


XR.SetOnUeMessageDelegate(ProcessUeMessage);


let touchCtrl = new XR.TouchCtrl(document.getElementById("touch")); //CH 初始化Touch web界面

XR.LoadSceneLoop(["indoor_110", "outdoor"],"", "", XR.CallBack("JsRun", 'XR.SetActiveSceneInstance("indoor_110");XR.SetCameraPositionAndxyzCount(",,,45,,");'));


