




/**激励视频广告id*/
const voidAdUnitId: string = "adunit-80bb77f0c855a581";
/**条形广告id*/
const bannerUnitId: string = "adunit-7f5a5baa1cf4c0bf";
/**插屏广告id */
const interstitialId: string = "adunit-50e928fd1ef1c080";
/**格子广告 */
const gridUnitId: string = "adunit-3df25aa6f16f67e6";
/**游戏合集小程序appid*/
const appidOfGameList: string = "";

/**
 * 微信相关
 * 使用时请注意该脚本中的链接、广告id等是否正确!
 */
export default class WeChatManager {
    /**子域*/
    private static openDataContext: any = null;

    /**用户信息，使用前先调用CreateUserInfoButton()方法获取*/
    public static userInfo: any = null;

    /**GameListData游戏集合数据*/
    private static gameListData: any = null;
    private static maxIndex: number = 0;
    private static indexQR: number = 0;

    /**激励视频广告组件*/
    private static rewardAd: any = null;
    /**获取当前账号是否有广告*/
    public static isHasAd: boolean = false;

    /**条形广告组件*/
    private static bannerAd: any = null;
    /**插屏广告组件 */
    private static interstitialAd: any = null;
    /**格子广告组件*/
    private static gridAd: any = null;
    /**微信音效组件*/
    private static wxAudio1: any = null;
    private static wxAudio2: any = null;
    private static wxAudio3: any = null;
    private static wxAudio4: any = null;
    private static wxAudio5: any = null;
    private static wxBGMAudio: any = null;
    /**音效是否静音*/
    public static isSoundMute: boolean = false;
    /**背景乐是否静音*/
    public static isBGMMute: boolean = false;
    /**背景音乐和所有音效是否静音*/
    public static isMute: boolean = false;
    /**视频广告标签 */
    public static reword_index: string = "";
    /**分享奖励标签 */
    public static share_index: string = "";

    private static audioIndex: number = 0;
    private static loadGrid: boolean = false;

    public static miniGameIndex: number = 0;
    public static isFirstShare: boolean = true;
    /**分享 */
    public static shareWords: Array<string> = ["精彩又刺激的铲树皮，我知道你玩的很6！", "伐木达人在线削木头，自称“光头强”？不简单", "李老板在线砍木头，这么奇怪的花纹都能弄出来！", "这是什么铲子？铲出来的树皮竟然是大大卷！！"];

    private constructor() { }

    /**修复多点触控bug */
    public static SingletonList_expand() {
        Laya.SingletonList.prototype["_remove"] = function (index) {
            // @xd added, 如果index == -1 不执行
            if (index == -1) {
                return;
            }
            this.length--;
            if (index !== this.length) {
                var end = this.elements[this.length];
                // @xd added, 添加end是存存在判断
                if (end) {
                    this.elements[index] = end;
                    end._setIndexInList(index);
                }
            }
        }
        var old_func = Laya.SimpleSingletonList.prototype["add"];
        Laya.SimpleSingletonList.prototype["add"] = function (element) {
            var index = element._getIndexInList();
            // add, 添加安全性判断.
            if (index !== -1) {
                // LogsManager.echo("SimpleSingletonList:element has in SingletonList.");
                return;
            }
            old_func.call(this, element);
        }
    }
    /**
     * 显示当前页面的转发按钮
     * @param _withShareTicket 是否使用带 shareTicket 的转发
     * @param callBack 监听用户点击右上角菜单的「转发」按钮时触发的事件: wx.onShareAppMessage()的回调，具体用法参考微信官方文档
     */
    public static ShowShareMenu(_withShareTicket: boolean = false): void {
        if (Laya.Browser.onWeiXin) {
            wx.showShareMenu({
                withShareTicket: _withShareTicket,
                success: () => {

                    wx.onShareAppMessage(() => {
                        //  DataManager.Instance.SetTask(0,1);
                        var r = Math.random();
                        let n: number = r < 0.25 ? 1 : r < 0.5 ? 2 : r < 0.75 ? 3 : 4;
                        return {
                            title: this.shareWords[n - 1],
                            imageUrl: "subPackage/sub/share" + String(n) + ".jpg",
                            query: "",
                            success: () => {
                                //console.log("@@",this,this.shareindex);
                            }
                        }
                    });
                },
                fail: () => {
                    console.log("显示当前页面的转发按钮--失败！");
                }
            });
        }
    }
    /**
       * 
       * @param _imageUrl 转发显示图片的链接
       * @param _title 转发标题，不传则默认使用当前小游戏的昵称。
       * @param _query 查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.getLaunchOptionSync() 或 wx.onShow() 获取启动参数中的 query。
       */
    public static ShareGame(_imageUrl: string, _title: string = null, _query: string = null): void {
        if (Laya.Browser.onWeiXin) {

            wx.shareAppMessage({
                title: _title,
                imageUrl: _imageUrl,
                query: _query
            });
            var startTime = new Date().getTime();
            var LeaveBack = function () {
                wx.offHide(LeaveBack);
            }
            wx.onHide(
                LeaveBack
            );
            var callback = function () {
                wx.offShow(callback);
                var endTime = new Date().getTime();

                if (Math.abs(startTime - endTime) < 3000) {
                    if (this.isFirstShare) {
                        this.isFirstShare = false

                    }
                    else {

                    }


                }
                else {

                }
            }
            wx.onShow(
                callback
            );
        }
    }

    /**
     * 向子域传递消息
     * @param message 发送的消息，格式：{ cmd:"",dataName:"",Data:"" }
     */
    public static PostMessage(message: any): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.getOpenDataContext) {
                if (this.openDataContext == null) {

                    this.openDataContext = wx.getOpenDataContext();
                }
                this.openDataContext.postMessage(message);
            }
        }
    }

    /**
     *  创建用户信息按钮，之后直接调用 WeChatManager.userInfo 获取用户信息即可。具体参考微信wx.createUserInfoButton
     * @param _type 按钮的类型,合法值：'text'  'image'
     * @param _text 按钮上的文本，仅当 type 为 text 时有效
     * @param _image 按钮的背景图片，仅当 type 为 image 时有效
     * @param _left 左上角横坐标（以比例形式，如：0.5为屏幕横向中心点）
     * @param _top 左上角纵坐标（以比例形式，如：0.5为屏幕纵向中心点）
     * @param _width 按钮宽度
     * @param _height 按钮高度
     */
    public static CreateUserInfoButton(callBack: Function): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.createUserInfoButton) {
                var userInfoButton = wx.createUserInfoButton({
                    type: 'image',
                    image: 'LoadUI/Enter.png',
                    style: {
                        top: wx.getSystemInfoSync().windowHeight / 2,
                        left: wx.getSystemInfoSync().windowWidth / 2 - 100,
                        width: 200,
                        height: 60
                    }
                });
                userInfoButton.onTap((res) => {
                    userInfoButton.destroy();
                    this.userInfo = res.userInfo;
                    console.log("用户信息", this.userInfo);
                    if (this.userInfo == undefined) {
                        this.userInfo = { nickName: "Player", avatarUrl: "PlayerUI/h_0.png" };
                    }
                    localStorage.setItem("nickName", this.userInfo.nickName)
                    localStorage.setItem("userhead", this.userInfo.avatarUrl);
                    callBack();
                });
            }
            else {
                wx.authorize({
                    scope: "scope.userInfo",
                    success: function () {
                        wx.getUserInfo({
                            success: (res) => {
                                this.userInfo = res.userInfo;
                                console.log("***用户信息", this.userInfo);
                                if (this.userInfo == undefined) {
                                    this.userInfo = { nickName: "Player", avatarUrl: "PlayerUI/h_0.png" };
                                }
                                localStorage.setItem("nickName", this.userInfo.nickName)
                                localStorage.setItem("userhead", this.userInfo.avatarUrl);
                                callBack();
                            },
                            fail: (err) => {
                                console.log("***用户信息获取失败", err);
                                localStorage.setItem("nickName", "Player")
                                localStorage.setItem("userhead", "PlayerUI/h_0.png");
                                callBack();
                            }
                        });
                    },
                    fail: (err) => {
                        console.log("***授权失败", err);
                        localStorage.setItem("nickName", "Player")
                        localStorage.setItem("userhead", "PlayerUI/h_0.png");
                        callBack();
                    }
                });
            }
        }
    }

    public static GetUserInfo(callBack: Function): void {
        if (Laya.Browser.window.wx) {
            if (wx.authorize) {
                wx.authorize({
                    scope: "scope.userInfo",
                    success: function () {
                        wx.getUserInfo({
                            success: (res) => {
                                this.userInfo = res.userInfo;
                                console.log("***用户信息", this.userInfo);
                                if (this.userInfo == undefined) {
                                    this.userInfo = { nickName: "Player", avatarUrl: "PlayerUI/h_0.png" };
                                }
                                localStorage.setItem("nickName", this.userInfo.nickName)
                                localStorage.setItem("userhead", this.userInfo.avatarUrl);
                                callBack();
                            },
                            fail: (err) => {
                                console.log("***用户信息获取失败", err);
                                localStorage.setItem("nickName", "Player")
                                localStorage.setItem("userhead", "PlayerUI/h_0.png");
                                callBack();
                            }
                        });
                    },
                    fail: (err) => {
                        console.log("***授权失败", err);
                        localStorage.setItem("nickName", "Player")
                        localStorage.setItem("userhead", "PlayerUI/h_0.png");
                        callBack();
                    }
                });
            }
            else {
                localStorage.setItem("nickName", "Player")
                localStorage.setItem("userhead", "PlayerUI/h_0.png");
                callBack();
            }

        }
        else {
            localStorage.setItem("nickName", "Player")
            localStorage.setItem("userhead", "PlayerUI/h_0.png");
            callBack();
        }
    }

    /**
     * 分包加载
     * @param subPackageName 分包名称
     * @param callBack 分包加载成功回调
     */
    public static LoadSubpackage(subPackageName: string, callBack: Function): void {

        if (Laya.Browser.window.wx) {
            if (wx.loadSubpackage) {
                wx.loadSubpackage({
                    name: subPackageName,
                    success: (err) => {
                        console.log("分包加载成功", err);
                        callBack();
                    },
                    fail: (err) => {
                        console.log("分包加载失败", err);
                    }
                });
            }
            else {
                Laya.Browser.window.require(subPackageName + "/game.js");
                Laya.timer.once(1000, this, () => {
                    callBack();
                });
            }
        }
        else {
            callBack();
        }
    }
    public static ShowToast(title: string = "", icon: string = "none", duration: number = 1500): void {
        if (Laya.Browser.window.wx) {
            wx.showToast({
                title: title,
                icon: icon,
                duration: duration,

            });

        }
    }


    /**
     * 更多游戏跳转
     * @param _qrcodeurl 二维码图片链接
     * @param _appid 对应AppId
     */
    public static MoreGameLink(_qrcodeurl: string, _appid: string = ""): void {
        if (Laya.Browser.onWeiXin) {
            if (_appid != "") {
                if (wx.navigateToMiniProgram) {
                    wx.navigateToMiniProgram({
                        appId: _appid
                    });
                } else {
                    this.ShowQRCode(_qrcodeurl);
                }
            }
            else {
                this.ShowQRCode(_qrcodeurl);
            }
        }
    }

    /**
     * 显示二维码图片
     * @param _qrcodeurl 二维码图片链接
     */
    public static ShowQRCode(_qrcodeurl: string): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.previewImage) {
                wx.previewImage({
                    current: null,
                    urls: [_qrcodeurl]
                });
            }
        }
    }

    /**
     * 使手机发生振动
     * @param _isShort 是否是较短时间的振动，默认为true
     * @param callBack 振动成功的回调
     */
    public static SetVibration(_isShort: boolean = true, callBack: Function = null): void {
        // if(!GameData.isShake) return;
        if (Laya.Browser.onWeiXin) {

            if (_isShort) {
                if (wx.vibrateShort) wx.vibrateShort({ success: () => { if (callBack) callBack(); } });
            }
            else {
                if (wx.vibrateLong) wx.vibrateLong({ success: () => { if (callBack) callBack(); } });
            }
        }
    }

    public static getSystemInfo() {
        if (Laya.Browser.onWeiXin) {
            if (wx.getSystemInfoSync) {
                let obj = wx.getSystemInfoSync();
                console.log(obj, "systeminfo");
                return obj;
            } else {

            }
        }
    }

    /**
     * 监听小游戏回到前台的事件
     * @param callBack 小游戏回到前台的事件的回调函数
     */
    public static WxOnShow(callBack: Function = null): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.onShow) {
                wx.onShow((res) => {
                    if (callBack) {

                        callBack();
                    }

                    //  GameController.Instance().isOutStage=true;
                });
            }
        }
    }



    /**
     * 监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
     * @param callBack 小游戏隐藏到后台事件的回调函数
     */
    public static WxOnHide(callBack: Function = null): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.onHide) {
                wx.onHide((res) => {
                    if (callBack) {

                        callBack();
                    }

                    //  GameController.Instance().isOutStage=true;
                });
            }
        }
    }

    /**
     * 创建激励视频广告组件，并尝试拉取一次广告
     */
    public static CreateRewardAd(): void {
        if (Laya.Browser.onWeiXin) {
            if (voidAdUnitId == "") { console.log("视频广告ID未设置！请检查！"); return; }
            if (wx.createRewardedVideoAd) {
                if (this.rewardAd == null) {
                    this.rewardAd = wx.createRewardedVideoAd({ adUnitId: voidAdUnitId });
                }
                this.rewardAd.onLoad(() => {
                    console.log("拉取视频成功");
                    this.isHasAd = true;
                });
                this.rewardAd.onError((err) => {
                    console.log("拉取视频失败", err);
                });
                this.rewardAd.onClose((res) => {
                    this.rewardAd_CallBack(res);
                });
            }
        }
    }
    private static callBack_Success: Function = null;
    private static callBack_Fail: Function = null;
    private static rewardAd_CallBack(res: any): void {
        console.log("用户点击了【关闭广告】按钮");
        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res === undefined) {
            //可发放奖励
            // if(this.callBack_Success) this.callBack_Success();
            switch (this.reword_index) {

                default:
                    break;
            }
            //重置广告参数
            this.isHasAd = false;
            //  this.createRewardAd();
        }
        else {
            console.log("未看完广告");
            //重置广告参数
            this.isHasAd = false;
            this.ShowToast("只有观看完整视频才能获得奖励哦", "none", 1500)
        }
    }
    //视频广告
    public static RewordAD(): void {
        if (Laya.Browser.onWeiXin) {
            if (this.netWorkType == "" || this.netWorkType == "none") {
                this.ShowToast("暂无可播放的视频,请稍后再试!");
                return;
            }
            if (wx.createRewardedVideoAd) {
                if (!this.isHasAd) {
                    wx.showToast(
                        {
                            title: "暂时没有可播放的广告，请稍后再试",
                            icon: "none",
                            duration: 1500

                        });
                    this.rewardAd.onLoad();
                    return;
                }
                this.rewardAd.show();
            }
        }
    }

    public static netWorkType: any;
    public static onNetworkStatusChange(): void {
        if (Laya.Browser.window.wx && Laya.Browser.window.wx.onNetworkStatusChange) {
            Laya.Browser.window.wx.onNetworkStatusChange((res) => {
                console.log("当前是否有网络连接：", res.isConnected);
                console.log("网络类型：", res.networkType)

                console.log("在此可添加逻辑代码，并注释本行代码");
                //TODO
                this.netWorkType = res.networkType;
            });
        }
    }
    /**
       * 显示视频广告
       * @param callBack_Success 视频观看完成的回调
       * @param callBack_Fail 视频未观看完成的回调
       */
    public static showVideoAd(callBack_Success: Function, callBack_Fail: Function): void {
        if (!this.isHasAd) return;
        if (this.rewardAd) {
            this.rewardAd.show();
            this.callBack_Success = callBack_Success;
            this.callBack_Fail = callBack_Fail;
        }
    }
    /**
     * 显示视频广告
     * @param callBack 广告视频观看完成回调（下发奖励）
     */
    public static ShowRewardAd(callBack: Function, defafun: Function = () => { }): void {
        if (Laya.Browser.onWeiXin) {
            if (!this.isHasAd) {

                return;
            };
            if (this.rewardAd != null) {
                this.rewardAd.show();
                //   this.BGM_PAUSE('subPackage/audio/BGM.mp3');
                this.rewardAd.onClose((res) => {
                    this.rewardAd.offClose();
                    // 用户点击了【关闭广告】按钮
                    // 小于 2.1.0 的基础库版本，res 是一个 undefined
                    if (res && res.isEnded || res === undefined) {
                        // DataManager.Instance.SetTask(1,1)
                        //可发放奖励
                        callBack();
                        //重置广告参数
                        this.isHasAd = false;
                        // this.CreateRewardAd();
                    }
                    else {
                        console.log("未看完广告");
                        //重置广告参数
                        this.isHasAd = false;
                        defafun();
                        // this.CreateRewardAd();
                    }
                    callBack = () => { };
                    this.BGM_PLAY('subPackage/audio/BGM.mp3');
                });
            }
        }
    }

    /**
     * 创建条形广告组件，并显示
     */
    public static CreateBanner(): void {
        if (Laya.Browser.onWeiXin) {
            if (bannerUnitId == "") { console.warn("条形广告ID未设置！请检查！"); return; }
            if (wx.createBannerAd) {
                if (this.bannerAd == null) {
                    this.bannerAd = wx.createBannerAd({
                        adUnitId: bannerUnitId,
                        adIntervals: 30,
                        style: {
                            left: 0,
                            top: 0,
                            width: Laya.Browser.width
                        }
                    });
                } else return;
                this.bannerAd.onError((err) => {
                    console.log("banner 加载失败", err);
                    this.ClearBanner();
                });
                this.bannerAd.onLoad((err) => {
                    console.log("banner 加载成功", err);

                });
                this.bannerAd.onResize((res) => {
                    //console.log("*************");
                    this.bannerAd.style.left = (wx.getSystemInfoSync().screenWidth - this.bannerAd.style.realWidth) / 2;

                    if (Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2 && Laya.Browser.onIOS) {

                        this.bannerAd.style.top = wx.getSystemInfoSync().screenHeight - this.bannerAd.style.realHeight * 1.2;
                    }
                    else {
                        this.bannerAd.style.top = wx.getSystemInfoSync().screenHeight - this.bannerAd.style.realHeight;
                    }
                });
                if (Laya.Browser.clientHeight / Laya.Browser.clientWidth <= 1.34 && Laya.Browser.clientHeight / Laya.Browser.clientWidth > 1.33) {
                    this.bannerAd.style.width = 300;
                }

                else {
                    this.bannerAd.style.width = 300;
                }
                this.bannerAd.show();
            }
        }
    }

    /**
     * 清理条形广告组件
     */
    public static ClearBanner(): void {
        if (Laya.Browser.onWeiXin) {
            if (this.bannerAd != null) {
                if (this.bannerAd.destroy) this.bannerAd.destroy();
                this.bannerAd = null;
            }
        }
    }

    /**
     * 显示条形广告
     */
    public static ShowBanner(): void {
        if (Laya.Browser.onWeiXin) {
            if (this.bannerAd != null) {
                if (this.bannerAd.show) this.bannerAd.show();
            }
            else {
                this.CreateBanner();
            }
        }
    }

    /**
     * 隐藏条形广告
     */
    public static HideBanner(): void {
        if (Laya.Browser.onWeiXin) {
            if (this.bannerAd != null) {
                if (this.bannerAd.hide) {
                    this.bannerAd.hide();
                }
                else if (this.bannerAd.destroy) {
                    this.bannerAd.destroy();
                }
            }
        }
    }
    /**
     * 创建格子广告实列 
     */
    public static CreateGridAd(): void {
        if (Laya.Browser.onWeiXin) {
            if (gridUnitId == "") { console.warn("格子广告ID未设置！请检查！"); return; }
            if (wx.createGridAd) {
                console.log("开始创建格子广告");

                if (this.gridAd == null) {
                    this.gridAd = wx.createGridAd({
                        adUnitId: gridUnitId,
                        adTheme: 'white',
                        gridCount: 5,
                        style: {
                            left: 0,
                            top: 0,
                            width: 330,
                            opacity: 0.8
                        }
                    });
                }
                else return;
                this.gridAd.onError((err) => {
                    console.log("grid 加载失败", err);
                    this.loadGrid = false
                    this.ClearGrid();
                });
                this.gridAd.onLoad((err) => {
                    console.log("grid 加载成功", err);
                    this.loadGrid = true;

                });
                this.gridAd.onResize((res) => {
                    this.gridAd.style.left = (wx.getSystemInfoSync().screenWidth - this.gridAd.style.realWidth) / 2;
                    if (Laya.Browser.height / Laya.Browser.width > 2 && Laya.Browser.onIOS) {
                        this.gridAd.style.top = wx.getSystemInfoSync().screenHeight - this.gridAd.style.realHeight * 1.3;
                    } else {
                        this.gridAd.style.top = wx.getSystemInfoSync().screenHeight - this.gridAd.style.realHeight;
                    }

                });
                if (Laya.Browser.onIOS && Laya.Browser.clientHeight / Laya.Browser.clientWidth - 1.3 <= 0.04) {
                    this.gridAd.style.width = Laya.Browser.clientWidth / 2;
                } else {
                    this.gridAd.style.width = Laya.Browser.clientWidth;
                }

            }
            else {
                console.log("没有格子广告创建方法");

            }
        }

    }
    /**
   * 显示格子广告
   */
    public static ShowGrid(): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.createGridAd) {
                if (this.gridAd != null) {
                    if (this.loadGrid) {
                        if (this.gridAd.show) this.gridAd.show();
                        else {
                            console.log("格子广告没有show方法");

                        }
                    }
                    else {
                        this.ShowBanner();
                    }

                }
                else {
                    console.log("没有格子广告 重新创建");

                    this.CreateGridAd();
                }
            }
            else {
                this.ShowBanner();
            }

        }
    }
    /**
        * 清理条形广告组件
        */
    public static ClearGrid(): void {
        if (Laya.Browser.onWeiXin) {
            if (this.gridAd != null) {
                if (this.gridAd.destroy) this.gridAd.destroy();
                this.gridAd = null;
            }
        }
    }
    /**
     * 隐藏格子广告
     */
    public static HideGrid(): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.createGridAd) {
                if (this.gridAd != null) {
                    if (this.loadGrid) {
                        if (this.gridAd.hide) {
                            this.gridAd.hide();
                        }
                        else if (this.gridAd.destroy) {
                            this.gridAd.destroy();
                        }
                    } else {
                        this.HideBanner();
                    }

                }
            }
            else {
                this.HideBanner();
            }

        }
    }
    /**
     * 插屏广告
     */
    public static CreateInterstitial() {
        if (Laya.Browser.onWeiXin) {
            if (interstitialId == "") { console.warn("插屏广告ID未设置！请检查！"); return; }
            if (wx.createInterstitialAd) {
                if (this.interstitialAd == null) {
                    this.interstitialAd = wx.createInterstitialAd({
                        adUnitId: interstitialId,
                    });
                } else return;
                this.interstitialAd.onError((err) => {
                    console.log("interstitial 加载失败", err);
                    this.ClearInterstitial();
                });
                this.interstitialAd.onLoad((err) => {
                    console.log("interstitial 加载成功", err);
                });
                // this.interstitialAd.show();
            }
        }
    }
    /**
     * 清理插屏广告
     */
    public static ClearInterstitial() {
        if (Laya.Browser.onWeiXin) {
            if (this.interstitialAd != null) {
                if (this.interstitialAd.destroy) this.interstitialAd.destroy();
                this.interstitialAd = null;
            }
        }
    }
    /**
     * 显示插屏广告
     */
    public static ShowInterstitial() {
        if (Laya.Browser.onWeiXin) {
            if (this.interstitialAd != null) {
                if (this.interstitialAd.show) this.interstitialAd.show();
            }
            else {
                this.CreateInterstitial();
            }
        }
    }
    //震动效果
    public static Shake(isShort: Boolean = true): void {
        if (Laya.Browser.onWeiXin) {
            if (isShort) {
                wx.vibrateShort({});
            }
            else {
                wx.vibrateLong({});
            }
        }
    }
    /**
     * 播放音效（不支持背景乐）
     * @param url 音效路径
     */
    public static PlayerSound(url: string): void {
        if (this.isMute) return;
        if (this.isSoundMute) return;
        if (Laya.Browser.onWeiXin) {
            this.audioIndex++;
            if (this.audioIndex >= 5) {
                this.audioIndex = 0;
            }
            switch (this.audioIndex) {
                case 0:
                    if (this.wxAudio1 == null) {
                        this.wxAudio1 = wx.createInnerAudioContext();
                    }
                    this.wxAudio1.src = url;
                    this.wxAudio1.play();
                    break;
                case 1:
                    if (this.wxAudio2 == null) {
                        this.wxAudio2 = wx.createInnerAudioContext();
                    }
                    this.wxAudio2.src = url;
                    this.wxAudio2.play();
                    break;
                case 2:
                    if (this.wxAudio3 == null) {
                        this.wxAudio3 = wx.createInnerAudioContext();
                    }
                    this.wxAudio3.src = url;
                    this.wxAudio3.play();
                    break;
                case 3:
                    if (this.wxAudio4 == null) {
                        this.wxAudio4 = wx.createInnerAudioContext();
                    }
                    this.wxAudio4.src = url;
                    this.wxAudio4.play();
                    break;
                case 4:
                    if (this.wxAudio5 == null) {
                        this.wxAudio5 = wx.createInnerAudioContext();
                    }
                    this.wxAudio5.src = url;
                    this.wxAudio5.play();
                    break;
            }
        } else {
            Laya.SoundManager.playSound(url);
        }
    }

    /**
     * 播放背景音乐。背景音乐同时只能播放一个，如果在播放背景音乐时再次调用本方法，会先停止之前的背景音乐，再播发当前的背景音乐
     * @param url 背景音乐路径
     * @param isLoop 是否循环播放，默认为true
     */
    public static PlayBGM(url: string, isLoop: boolean = true): void {
        if (Laya.Browser.onWeiXin) {
            if (this.wxBGMAudio == null) {
                this.wxBGMAudio = wx.createInnerAudioContext();
                console.log(this.wxBGMAudio, "play bgm");

            }
            this.wxBGMAudio.src = url;
            this.wxBGMAudio.loop = isLoop;
            this.wxBGMAudio.play();
        }
        else {
            Laya.SoundManager.playMusic(url);
        }
    }
    public static BGM_Stop() {
        //  if(!this.isMute) return;
        if (Laya.Browser.onWeiXin) {
            console.log(this.wxBGMAudio, " this.wxBGMAudio");
            this.wxBGMAudio.stop();
            console.log("stop bgm");
        }
        else {
            Laya.SoundManager.stopMusic();
        }
    }
    public static BGM_PLAY(url: string, isLoop: boolean = true) {
        if (Laya.Browser.onWeiXin) {
            if (this.wxBGMAudio == null) {
                this.wxBGMAudio = wx.createInnerAudioContext();
                console.log(this.wxBGMAudio, "play bgm");
                this.wxBGMAudio.src = url;
                this.wxBGMAudio.loop = isLoop;
                this.wxBGMAudio.play();
            } else {
                this.wxBGMAudio.src = url;
                this.wxBGMAudio.loop = isLoop;
                this.wxBGMAudio.play();
            }


        }
    }
    public static LoadFont(url: string): void {
        if (Laya.Browser.onWeiXin) {
            if (wx.loadFont) {
                var font = wx.loadFont(url);
            }
        }
        else {
            Laya.loader.load(url, Laya.Handler.create(this, (fontRes) => {
                console.log("*************", fontRes);
            }), null, Laya.Loader.TTF);
        }
    }

    
}


export declare namespace wx {
    /**
     * 
     */
    export const env: any;
    /**
     * 显示当前页面的转发按钮
     * @param obj 
     */
    export function showShareMenu(obj): void
    /**
     * 隐藏转发按钮
     * @param obj 
     */
    export function hideShareMenu(obj): void
    /**
     * 监听小游戏回到前台的事件
     * @param fun 回调
     */
    export function onShow(fun: Function): void
    export function offShow(fun: Function): void
    /**
     * 监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
     * @param fun 回调
     */
    export function onHide(fun: Function): void
    export function offHide(fun: Function): void
    /**
     * 创建激励视频广告组件。
     * @param obj 
     */
    export function createRewardedVideoAd(obj): void
    /**
     * 创建 banner 广告组件。
     * @param obj 
     */
    export function createBannerAd(obj): void
    export function createGridAd(obj): void
    /**
     * 创建插屏广告组件
     */
    export function createInterstitialAd(obj): void
    /**
     * 创建用户信息按钮
     * @param obj 
     */
    export function createUserInfoButton(obj): any
    /**
     * 获取开放数据域
     */
    export function getOpenDataContext(): void
    /**
     * 主动拉起转发，进入选择通讯录界面。
     * @param obj 
     */
    export function shareAppMessage(obj): void
    /**
     * 监听用户点击右上角菜单的「转发」按钮时触发的事件
     * @param obj 
     */
    export function onShareAppMessage(obj): void
    /**
     * 触发分包加载
     * @param obj 
     */
    export function loadSubpackage(obj): any
    /**
     * 获取全局唯一的文件管理器
     */
    export function getFileSystemManager(): void
    /**
     * 打开另一个小程序
     * @param obj 
     */
    export function navigateToMiniProgram(obj): void;
    /**
     * 发起 HTTPS 网络请求。
     * @param obj 
     */
    export function request(obj): void
    /**
     * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
     * @param obj 
     */
    export function previewImage(obj): void
    /**
     * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
     * @param obj 
     */
    export function authorize(obj): void
    /**
     * 获取用户信息
     * @param obj 
     */
    export function getUserInfo(obj): void
    /**
     * 显示消息提示框
     * @param obj 
     */
    export function showToast(obj): void
    /**
     * 显示模态对话框
     * @param obj 
     */
    export function showModal(obj): void
    /**
     * 显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
     * @param obj 
     */
    export function showLoading(obj): void
    /**
     * 显示操作菜单
     * @param obj 
     */
    export function showActionSheet(obj): void
    /**
     * 隐藏消息提示框
     * @param obj 
     */
    export function hideToast(obj): void
    /**
     * 隐藏 loading 提示框
     * @param obj 
     */
    export function hideLoading(obj): void
    /**
     * 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
     * @param obj 
     */
    export function vibrateShort(obj): void
    /**
     * 使手机发生较长时间的振动（400 ms)
     * @param obj 
     */
    export function vibrateLong(obj): void
    /**
     * 创建内部 audio 上下文 InnerAudioContext 对象。
     */
    export function createInnerAudioContext(): void
    /**
     * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
     * @param obj 
     */
    export function getSetting(obj): void
    /**
     * wx.getSystemInfo 的同步版本
     */
    export function getSystemInfoSync(): any
    /**
     * 获取系统信息
     * @param obj 
     */
    export function getSystemInfo(obj): void
    /**
     * 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
     */
    export function getMenuButtonBoundingClientRect(): void
    /**
     * 加载字体
     */
    export function loadFont(url: string): string;
}