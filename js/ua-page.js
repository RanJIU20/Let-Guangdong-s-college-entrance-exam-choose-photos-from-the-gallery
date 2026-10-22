// This file is loaded by ua-injector.js into the webpage's main world.
(function overridePageUserAgent() {
    const userAgent = "Mozilla/5.0 (Linux; Android 16; MEP-AN00 Build/HONORMEP-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.122 MYWeb/1.11.126.260911211123 UWS/3.22.2.9999 UCBS/3.22.2.9999_220000000000 Mobile Safari/537.36 NebulaSDK/1.8.100112 Nebula AlipayDefined(nt:WIFI,ws:361|0|3.5) AliApp(AP/12.12.30.8000) AlipayClient/12.12.30.8000 Language/zh-Hans useStatusBar/true isConcaveScreen/false Region/CNAriver/12.12.30.8000 DTN/2.0";

    Object.defineProperty(Navigator.prototype, "userAgent", {
        configurable: true,
        get: function () {
            return userAgent;
        }
    });
})();
