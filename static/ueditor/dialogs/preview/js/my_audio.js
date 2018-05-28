
var music_bar = function (btn,bar,progerss){
	this.btn=btn;
	this.bar=bar;
	this.step=progerss;
	this.init();
};
music_bar.prototype={
	init:function (){
		
		var that=this,g=document,b=window,m=Math;
		that.btn.onmousedown=function (e){
			var x=(e||b.event).clientX;
			var l=this.offsetLeft;
			var max=that.bar.offsetWidth-this.offsetWidth;
			g.onmousemove=function (e){
				var thisX=(e||b.event).clientX;
				var to=m.min(max,m.max(-2,l+(thisX-x)));
				that.btn.style.left=to+'px';
				that.ondrag(e.target,m.round(m.max(0,to/max)*100),to);
				b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
			};
			g.onmouseup=new Function('this.onmousemove=null');
		};
		that.btn.ontouchstart=function (e){
			var x=(e||b.event).touches[0].clientX;
			var l=this.offsetLeft;
			var max=that.bar.offsetWidth-this.offsetWidth;
			g.ontouchmove=function (e){
				var thisX=(e||b.event).touches[0].clientX;
				var to=m.min(max,m.max(-2,l+(thisX-x)));
				that.btn.style.left=to+'px';
				that.ondrag(e.target,m.round(m.max(0,to/max)*100),to);
				b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
			};
			g.ontouchend=new Function('this.ontouchmove=null');
		};
	},
	ondrag:function (target,pos,x){
		this.step.style.width=Math.max(0,x)+'px';
		//this.callback&&this.callback(pos+'%');
		//设置播放器播放时间进度和显示时间进度
		var percent=x/(this.bar.offsetWidth-this.btn.offsetWidth);
		percent=Math.ceil(parseFloat(percent)*100)/100;
		
        var _audio=target.parentNode.parentNode.parentNode.querySelector("audio");
        _audio.currentTime=parseInt(_audio.duration*percent);
        _audio.parentNode.querySelector(".play_seconds").innerHTML=formatTime(_audio.currentTime);
	
	}
}

//audio,cursor_bar,show_bar,total_time,current_time,title
function MyAudio(audio){
	this.audio=audio;
	this.init();
	// this.cursor_bar=json.cursor_bar;
	// this.show_bar=json.show_bar;
	// this.total_time=json.total_time;
	// this.current_time=json.current_time;
	// this.title=json.title;
}
MyAudio.prototype={

	init:function(){
		var f= this;
		var _identity="my_audio_"+(new Date()).getTime();
		f.audio.setAttribute("data-identity",_identity);
		f[_identity]='';
		//初始化audio数据
		//当前播放到的位置
			
		f.audio.onloadedmetadata=function(){
			
			//当前播放到的位置
			this.parentNode.querySelector(".play_seconds").innerHTML=formatTime(this.currentTime);
			//总时长
			this.parentNode.querySelector(".total_seconds").innerHTML=formatTime(this.duration);
			
		}
		if(f.audio.duration){
			//当前播放到的位置
			f.audio.parentNode.querySelector(".play_seconds").innerHTML=formatTime(f.audio.currentTime);
			//总时长
			f.audio.parentNode.querySelector(".total_seconds").innerHTML=formatTime(f.audio.duration);
			
		}
		
		//绑定音频播放器播放暂停按钮
		f.audio.parentNode.querySelector(".audio-btn").addEventListener("click",function(){
			
			var _audio = this.parentNode.querySelector("audio");

			if(_audio){
				if(_audio.paused){
					//点击播放
					_audio.play();
					this.className=this.className+' paused';
					var _this=this;
					f[_audio.getAttribute("data-identity")]=setInterval(function(){
						_this.parentNode.querySelector(".play_seconds").innerHTML=formatTime(_audio.currentTime);
						var currentProgress=(_audio.currentTime/_audio.duration)*95;
						_this.parentNode.querySelector(".cursor-btn").style.left=currentProgress+"%";
						_this.parentNode.querySelector(".audio-progress").style.width=currentProgress+'%';
						if(_audio.currentTime>=_audio.duration){
							//播放完成，自动暂停
							_audio.pause();
							_this.className="audio-btn";
							clearInterval(f[_audio.getAttribute("data-identity")]);
						}
					},100);
				}else{
					//点击暂停
					_audio.pause();
					this.className="audio-btn";
					clearInterval(f[_audio.getAttribute("data-identity")]);
				}
			}
		});
		//绑定bar拖动事件
		var cursor_btn=f.audio.parentNode.querySelector(".cursor-btn"),
			audio_bar=f.audio.parentNode.querySelector(".audio-bar"),
			audio_progress=f.audio.parentNode.querySelector(".audio-progress");
		new music_bar(cursor_btn,audio_bar,audio_progress);

	},

}


//单位：秒
function formatTime(seconds) {
    return [
        // parseInt(seconds / 60 / 60),
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
}