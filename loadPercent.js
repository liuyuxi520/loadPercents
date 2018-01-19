/**
 * 
 * author: liuyuxi
 * time: 2018.1.18
 * description:页面资源加载进度条
 * @params:imgResource:图片资源;
 *         audioResource:音频资源;
 *         baseUrl:默认主机域名;
 *         beginFn:页面刚刚进入回调;
 *         progressFn:每加载完成一个资源回调;
 *         completeFn:资源全部加载完成回调;
 * how to use: new LoadPercent({});
 */
;(function() {
    var isFunction = function(fun) {
        return Object.prototype.toString.apply(fun).indexOf('Function') > -1;
    };
    function  LoadPercent(config) {
        config = config && Object.prototype.toString.apply(config).indexOf('Object') > -1 ? config : {};
        this.config = {
            imgResource: config.imgResource || [],
            audioResource: config.audioResource || [],
            baseUrl: config.baseUrl || '' ,
            beginFn: config.beginFn,
            progressFn: config.progressFn,
            completeFn: config.completeFn,
        };
        this.total = this.config.imgResource.length + this.config.audioResource.length || 0;//资源总数
        this.currentIndex = 0; //当前正在加载的资源索引
        this.start();
    };
    LoadPercent.prototype.countScale = function(index) {
        return Math.round(index / this.total *100);
    };
    LoadPercent.prototype.start = function() {
        var _this = this,
            total = _this.tatal,
            baseUrl = this.config.baseUrl,
            imgResourceLen = _this.config.imgResource.length,
            audioResourceLen = _this.config.audioResource.length;

        if(isFunction(this.config.beginFn)){//初始化判断网络
            if(!navigator.onLine)
                return this.config.beginFn(navigator.onLine);
        }

        for(var i = 0; i<imgResourceLen; i++){//imgResource load
            var url = _this.config.imgResource[i];
            var image = new Image();
            if(url.indexOf('http') !== 0){
                url = baseUrl + url;
            }
            image.onload = function(){_this.loaded();};
            image.src = url;
        }
        for(var i = 0; i<audioResourceLen; i++){//audioResource load
            var url2 = _this.config.audioResource[i];
            var audioElement = document.createElement('audio');

            if(url2.indexOf('http') !== 0){
                url2 = baseUrl + url2;
            }
            audioElement.src = url2;
            audioElement.setAttribute('preload', 'preload');
            audioElement.addEventListener('loadeddata',function() {
                if(audioElement.readyState >= 2){
                    _this.loaded();
                }
            });
        }
    };
    LoadPercent.prototype.loaded = function() {
        if(isFunction(this.config.progressFn)){
            var process = this.countScale(++this.currentIndex)
            this.config.progressFn(process);
        }
        //load completeFn
        if(this.currentIndex===this.total){
            if(isFunction(this.config.completeFn)){
                this.config.completeFn(this.total);
            }
        }
    };

    window.LoadPercent = LoadPercent;
})();