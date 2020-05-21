
let ShttpUtil = new Vue({
    el: '',
    methods: {
        //网络post方式接口
        PostSeverHttp(utlAddress, sucCallBack, failCallBack, dataID)
        {
            this.$http.post(utlAddress).then(
                function (data)
                {
                    if (typeof (sucCallBack) == "function")
                    {
                        //console.log("post success");
                        sucCallBack(data, dataID);
                    }
                }).catch(function (response)
                {
                    if (typeof (failCallBack) == "function")
                    {
                        console.log("post fail");
                        failCallBack(response);
                    }
                })
        },
        GetSeverHttp(utlAddress, sucCallBack, failCallBack)
        {
            this.$http.get(utlAddress).then(
                function (data)
                {
                    if (typeof (sucCallBack) == "function")
                    {
                        console.log("get success");
                        sucCallBack(data);
                    }
                }).catch(function (response)
                {
                    if (typeof (failCallBack) == "function")
                    {
                        console.log("get fail");
                        failCallBack(response);
                    }
                })
        }
    }
})


//网络get方式接口