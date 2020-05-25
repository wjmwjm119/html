//netsh http add urlacl url=http://192.168.31.172:23456/  user=Everyone

let websocket =
{
	onConnectWebSocket: function () { },
	onConnectWebSocketError: function () { },
	onGetClientList: function () { },
	onConnectRemoteClient: function () { },
	onRemoteClientExit: function () { },
	onTransmitMessage: function () { },
	onWebRTCProxyState: function () { },
	onWebRTCMessage: function () { },
	onBroadcastMessage: function () { },
	onVRMouseQRCodeImage: function () { },
	onReceiveMessage: function () { },

	webSocketMessage:
	{
		cmdName: "",
		argString: "",
		jsonData: "{}"
	},
	ws: {},
	MESSAGEEND: "#FILEEND#",
	yourGuid: "9475c19f31ba4c028b0b56fa44533d90",
	remoteGuid: "",
	toUnicode: function (s)
	{
		return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function (newStr)
		{
			return "\\u" + newStr.charCodeAt(0).toString(16);
		});
	},

	hexCharCodeToStr: function (hexCharCodeStr) 
	{
		var trimedStr = hexCharCodeStr.trim();
		var rawStr =
			trimedStr.substr(0, 2).toLowerCase() === "0x"
				?
				trimedStr.substr(2)
				:
				trimedStr;
		var len = rawStr.length;
		if (len % 2 !== 0)
		{
			alert("Illegal Format ASCII Code!");
			return "";
		}
		var curCharCode;
		var resultStr = [];
		for (var i = 0; i < len; i = i + 2)
		{
			curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
			resultStr.push(String.fromCharCode(curCharCode));
		}
		return resultStr.join("");
	},
	ConnectWebSocket: function (ipString = "127.0.0.1")
	{
		websocket.ws = new WebSocket("ws://" + ipString + ":23456/");
		websocket.ws.onopen = function (open)
		{
			console.log("WebSocket已连接");
		};

		websocket.ws.onmessage = function (message) 
		{
			//		   console.log("***ReceiveData***:"+message.data);
			websocket.ProcessReceiveWSMessage(message.data);
		};

		websocket.ws.onerror = function (error)
		{
			console.log(error);
			console.log("WebSocket发生错误");
			websocket.onConnectWebSocketError(error);
		};

		websocket.ws.onclose = function (close)
		{
			console.log(close);
			console.log("已关闭WebSocket");
		};
	},
	ProcessReceiveWSMessage: function (message)
	{
		//		console.log(message);
		if (message.match(websocket.MESSAGEEND))
		{
			var usefulValue = JSON.parse(message.replace(websocket.MESSAGEEND, ""));
			var messagePayloadJsonData = JSON.parse(usefulValue.jsonData);

			switch (usefulValue.cmdName)
			{
				case "YourGuid":
					console.log("YourGuid:" + usefulValue.argString);
					XR.DebugToHtml("YourGuid:" + usefulValue.argString);
					websocket.yourGuid = usefulValue.argString;
					websocket.onConnectWebSocket(usefulValue.argString);
					break;

				case "VRMouseQRCodeImage":
					//					console.log(usefulValue.argString);
					websocket.onVRMouseQRCodeImage(usefulValue.argString);
					break;

				case "ACKSetRemoteClient":
					if (usefulValue.argString == "true")
					{
						console.log("RemoteClient已找到");
						websocket.SendWSMessage("ConnectRemoteClient", "");
					}
					else
					{
						console.log("RemoteClient未找到");
						//重新获取列表
						websocket.SendWSMessage("GetClientList");
					}
					break;

				case "ACKConnectRemoteClient":
					{
						if (usefulValue.argString == "true")
						{
							websocket.remoteGuid = messagePayloadJsonData.guidHexString;
							console.log("RemoteClient已连接");
							XR.DebugToHtml("RemoteClient已连接");
							XR.SetWSRemoteConnectedState(true);
							websocket.onConnectRemoteClient();
						}
						else
						{
							console.log("RemoteClient连接失败");
							XR.DebugToHtml("RemoteClient连接失败");
							XR.SetWSRemoteConnectedState(false);
						}
					}
					break;

				case "RemoteClientExit":
					console.log("RemoteClient断开连接");
					websocket.onRemoteClientExit();
					break;

				case "ClientList":
					console.log(messagePayloadJsonData);
					websocket.onGetClientList(messagePayloadJsonData);
					break;

				case "ACKWebRTCProxyState":
					console.log("WebRTCProxy is Connected:" + usefulValue.argString);
					XR.DebugToHtml("WebRTCProxy is Connected: " + usefulValue.argString);
					websocket.onWebRTCProxyState(usefulValue.argString);
					break;

				case "TransmitMessage":
					//console.log(usefulValue.argString);
					websocket.onTransmitMessage(usefulValue.argString, messagePayloadJsonData);
					break;

				case "WebRTCMessageToWebBrowser":
					websocket.onWebRTCMessage(messagePayloadJsonData);
					break;

				case "BroadcastMessage":
					websocket.onBroadcastMessage(usefulValue.argString, messagePayloadJsonData);
					break;

				case "ReceiveMessage":
					websocket.onReceiveMessage(messagePayloadJsonData);
					break;

				default:
					break;

			}
		}
	},

	SendWSData: function (inData)
	{
		if (websocket.ws.readyState == 1)
		{
			//			console.log("***SendWSData***:"+inData);	;
			websocket.ws.send(inData + websocket.MESSAGEEND);
		}
	},

	SendWSMessage: function (inCmdName, inArgString = "", inJsonData = "{}")
	{
		websocket.webSocketMessage.cmdName = inCmdName;
		websocket.webSocketMessage.argString = inArgString;
		websocket.webSocketMessage.jsonData = inJsonData;
		websocket.SendWSData(JSON.stringify(websocket.webSocketMessage));
	},

	ChangeGuid: function (newGuid)
	{
		websocket.SendWSMessage("ChangeGuid", newGuid);
	}

}


//console.log("WebInit");

//ConnectWebSocket();
//console.log(toUnicode('{"uievent": {"environment": [{"id":"music","displayname":"音乐","state":false,"opt1":"","opt2":""},{"id":"skylight","displayname":"skylight","state":true,"minValue":0,"maxValue":100,"value":68}],"buttons":[[{"id":"1J_01","displayname":"超级区位","state":false,"opt1":"","opt2":""},{"id":"1J_02","displayname":"快速交通","state":false,"opt1":"","opt2":""},{"id":"1J_03","displayname":"十全配套","state":false,"opt1":"","opt2":""},{"id":"1J_04","displayname":"户型","state":false,"opt1":"","opt2":""},{"id":"1J_05","displayname":"选房","state":true,"opt1":"","opt2":""}],[{"id":"xfRemoteButton_C_21","displayname":"1号楼","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_22","displayname":"2号楼","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_23","displayname":"3号楼","state":true,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_24","displayname":"4号楼","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_25","displayname":"5号楼","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_26","displayname":"6号楼","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_27","displayname":"7号楼","state":false,"opt1":"","opt2":""}],[{"id":"xfRemoteButton_C_28","displayname":"1单元","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_29","displayname":"2单元","state":true,"opt1":"","opt2":""}],[{"id":"xfRemoteButton_C_30","displayname":"102","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_31","displayname":"202","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_32","displayname":"302","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_33","displayname":"402","state":false,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_34","displayname":"502","state":true,"opt1":"","opt2":""},{"id":"xfRemoteButton_C_35","displayname":"602","state":false,"opt1":"","opt2":""}]]}}'));
//console.log(document.title);

