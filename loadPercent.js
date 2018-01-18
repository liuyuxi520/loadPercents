/**
 * Created by liufeifeng on 1/18/18.
 */
;(function() {
    var isFunction = function(fun) {
        return typeof fun === 'function';
    };

    function  LoadPercent(config) {
        this.config = {
            imgResource:config && config.imgResource || [],
            audioResource:config && config.audioResource || [],
            begin:config && config.begin || null,
            progress:config && config.progress || null,
            complete:config && config.complete || null
        };
        this.total = this.config.imgResource.length + this.config.audioResource.length || 0;//资源总数
        this.currentIndex = 0; //当前正在加载的资源索引
    };
    LoadPercent.prototype.countScale = function(index) {
        return Math.round(index / this.total *100);
    };
    LoadPercent.prototype.start = function() {
        var _this = this,
            total = _this.tatal,
            imgResourceLen = _this.config.imgResource.length,
            audioResourceLen = _this.config.audioResource.length;

        if(isFunction(this.config.begin)){//初始化判断网络
            if(!navigator.onLine)
                return this.config.begin(navigator.onLine);
        }

        for(var i = 0; i<imgResourceLen; i++){//imgResource load
            var url = _this.config.imgResource[i];
            var image = new Image();
            image.onload = function(){_this.loaded();};
            image.src = url;
        }
        for(var i = 0; i<audioResourceLen; i++){//audioResource load
            var url = _this.config.audioResource[i];

            var audioElement = document.createElement('audio');
            audioElement.src = url;
            audioElement.setAttribute('preload', 'preload');
            audioElement.addEventListener('loadeddata',function() {
                if(audioElement.readyState >= 2){
                    _this.loaded();
                }
            });
        }
    };
    LoadPercent.prototype.loaded = function() {
        if(isFunction(this.config.progress)){
            var process = this.countScale(++this.currentIndex)
            this.config.progress(process);
        }
        //加载完毕
        if(this.currentIndex===this.total){
            if(isFunction(this.config.complete)){
                this.config.complete(this.total);
            }
        }
    };

    window.LoadPercent = LoadPercent;
})();