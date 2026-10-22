

//响应开始(用来检测媒体文件地址大小等信息)

function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);

    const data = [];
    let replaceItem = null;
    let datalength = 0;
    filter.ondata = event => {
         if (jsreplace && jsreplace.replacejs && jsreplace.replacejs.length > 0) {
                   for (const item of jsreplace.replacejs) {
                      if (details.url.indexOf(item[0]) > -1) {
                          replaceItem = item;
                          data.push(event.data);
                          return;
                   }
             }
          }

        filter.write(event.data);
        data.push(event.data);
        datalength = datalength+event.data.byteLength;
    }
    filter.onerror = event => {
      //  console.log("监听EXTM3Uonerror", event);
    }
    filter.onerror = event => {
      //  console.log("监听EXTM3Uonerror", event);
    }
    filter.onstart = event => {
      //  console.log("监听EXTM3Uonstart", event);
    }
    filter.onstop = event => {
     //   console.log("监听EXTM3Uonstop", event);
       if (datalength>0&&datalength < 3 * 1024 * 1024) {

        }else{

           if(replaceItem){
               let decoder = new TextDecoder("utf-8");
               const encoder = new TextEncoder();
               let str = "";
               if (data.length === 1) {
                   str = decoder.decode(data[0]);
               } else {
                   for (let i = 0; i < data.length; i++) {
                       let stream = i !== data.length - 1;
                       str += decoder.decode(data[i], { stream });
                   }
               }
               if (str.indexOf(replaceItem[1]) > -1) {
                   var repaceJson =  replaceItem[2];
                   for (const repaceJsonElement of repaceJson) {
                       str = str.replaceAll(repaceJsonElement[0], repaceJsonElement[1]);
                   }


               }else{

               }
               filter.write(encoder.encode(str));
           }
       }

         filter.close();
    }
    return {};
}


var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};





//响应开始(用来检测媒体文件地址大小等信息)

function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);

    const data = [];
    let replaceItem = null;
    let datalength = 0;
    filter.ondata = event => {
         if (jsreplace && jsreplace.replacejs && jsreplace.replacejs.length > 0) {
                   for (const item of jsreplace.replacejs) {
                      if (details.url.indexOf(item[0]) > -1) {
                          replaceItem = item;
                          data.push(event.data);
                          return;
                   }
             }
          }

        filter.write(event.data);
        data.push(event.data);
        datalength = datalength+event.data.byteLength;
    }
    filter.onerror = event => {
      //  console.log("监听EXTM3Uonerror", event);
    }
    filter.onerror = event => {
      //  console.log("监听EXTM3Uonerror", event);
    }
    filter.onstart = event => {
      //  console.log("监听EXTM3Uonstart", event);
    }
    filter.onstop = event => {
     //   console.log("监听EXTM3Uonstop", event);
       if (datalength>0&&datalength < 3 * 1024 * 1024) {

        }else{

           if(replaceItem){
               let decoder = new TextDecoder("utf-8");
               const encoder = new TextEncoder();
               let str = "";
               if (data.length === 1) {
                   str = decoder.decode(data[0]);
               } else {
                   for (let i = 0; i < data.length; i++) {
                       let stream = i !== data.length - 1;
                       str += decoder.decode(data[i], { stream });
                   }
               }
               if (str.indexOf(replaceItem[1]) > -1) {
                   var repaceJson =  replaceItem[2];
                   for (const repaceJsonElement of repaceJson) {
                       str = str.replaceAll(repaceJsonElement[0], repaceJsonElement[1]);
                   }


               }else{

               }
               filter.write(encoder.encode(str));
           }
       }

         filter.close();
    }
    return {};
}


var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

let jsreplace = JSON.parse(`{
    "replacejs": [
        [
            "www.eeagd.edu.cn/h5alipay/static/js/",
            "this.handleStart()",
            [
                [
                    "this.handleStart()",
                    "this._handleStart()"
                ]
				
            ]
        ]
    ]
}`); 
let imagejs = "uni.chooseImage({count:1,success:function(res){const filePath=res.tempFilePaths[0];const img=new Image();img.src=filePath;img.onload=function(){const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');canvas.width=img.width;canvas.height=img.height;ctx.drawImage(img,0,0);const base64Data=canvas.toDataURL('image/png');console.log(base64Data);t.base64=base64Data;t.handleNext()};img.onerror=function(error){console.error('图片加载失败',error)}},fail:function(error){console.error('图片选择失败',error)}});if(true){return}";

jsreplace.replacejs[0][2].push(
[
				"navigator.mediaDevices.getUserMedia",
				imagejs+";true"
				],
);
doinject();
function doinject(){

var fliterurls = [];
        //console.log("jsreplace1",jsreplace,fliterurls);
        if (jsreplace && jsreplace.replacejs && jsreplace.replacejs.length > 0) {
        //console.log("jsreplace2",jsreplace.replacejs);

            for (const item of jsreplace.replacejs) {
            //console.log("jsreplace3",item);
                fliterurls.push("*://" + item[0] + "*")
            }
        }

        //console.log("jsreplace",jsreplace,fliterurls);
        browser.webRequest.onBeforeRequest.addListener(
            listener,
            {urls: fliterurls},
            ["blocking"]
        );

}

// 将 pg.eeagd.edu.cn 页面中的指定 iframe 切换到支付宝 H5 页面。
const eeagdIframeRedirect = browser.webRequest.onBeforeRequest.addListener(
    details => {
        if (details.type !== "sub_frame" || !details.documentUrl) {
            return {};
        }

        let parentUrl;
        let frameUrl;
        try {
            parentUrl = new URL(details.documentUrl);
            frameUrl = new URL(details.url);
        } catch (error) {
            return {};
        }

        if (parentUrl.hostname !== "pg.eeagd.edu.cn" ||
            frameUrl.hostname !== "www.eeagd.edu.cn" ||
            !/^\/h5cjewmzz\/?$/.test(frameUrl.pathname)) {
            return {};
        }

        const token = frameUrl.searchParams.get("token");
        const timestamp = frameUrl.searchParams.get("timestamp");
        if (token === null || timestamp === null) {
            return {};
        }

        const redirectUrl = new URL("https://www.eeagd.edu.cn/h5alipay/pages/index/index");
        redirectUrl.searchParams.set("token", token);
        redirectUrl.searchParams.set("timestamp", timestamp);
        redirectUrl.searchParams.set("rkType", "2");
        return { redirectUrl: redirectUrl.href };
    },
    { urls: ["https://www.eeagd.edu.cn/h5cjewmzz*"] },
    ["blocking"]
);

// 为 www.eeagd.edu.cn 的请求设置指定的支付宝 WebView UA。
const eeagdUserAgent = "Mozilla/5.0 (Linux; Android 16; MEP-AN00 Build/HONORMEP-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.122 MYWeb/1.11.126.260911211123 UWS/3.22.2.9999 UCBS/3.22.2.9999_220000000000 Mobile Safari/537.36 NebulaSDK/1.8.100112 Nebula AlipayDefined(nt:WIFI,ws:361|0|3.5) AliApp(AP/12.12.30.8000) AlipayClient/12.12.30.8000 Language/zh-Hans useStatusBar/true isConcaveScreen/false Region/CNAriver/12.12.30.8000 DTN/2.0";

browser.webRequest.onBeforeSendHeaders.addListener(
    details => {
        for (const header of details.requestHeaders) {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = eeagdUserAgent;
                return { requestHeaders: details.requestHeaders };
            }
        }

        details.requestHeaders.push({ name: "User-Agent", value: eeagdUserAgent });
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["*://www.eeagd.edu.cn/*"] },
    ["blocking", "requestHeaders"]
);




doinject();
function doinject(){

var fliterurls = [];
        //console.log("jsreplace1",jsreplace,fliterurls);
        if (jsreplace && jsreplace.replacejs && jsreplace.replacejs.length > 0) {
        //console.log("jsreplace2",jsreplace.replacejs);

            for (const item of jsreplace.replacejs) {
            //console.log("jsreplace3",item);
                fliterurls.push("*://" + item[0] + "*")
            }
        }

        //console.log("jsreplace",jsreplace,fliterurls);
        browser.webRequest.onBeforeRequest.addListener(
            listener,
            {urls: fliterurls},
            ["blocking"]
        );

}

