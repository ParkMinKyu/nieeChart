<<<<<<< HEAD
/**
 * html5 canvas를 이용한 간단한 막대 그래프
 * @author park min gue , niee@naver.com || niee@urielsoft.co.kr
 * @version 0.0.1 2014-03-27
 * 기본틀 완성
 * 
 * @version 0.0.2 2014/04/01
 * 익스 9버전에서 안되는 현상 수정
 * 막대 그래프에 마우스 오버시 툴팁기능 추가
 * 그래프를 라인위로 변경
 * 
 * @version 0.0.3 2014/04/02
 * 툴팁 버그수정
 * 라인 차트 추가
 * 소수점 적용
 * 
 * <pre>
 *
 * 1.<script type="text/javascript" src="min-canvas-chart001.js"></script> //해당 라이브러리 사용을 위해 그래프를 표시할 페이지에 선언
 * 
 * 2.var array = new Array(); //그래프에 표시할 막대 Object정보를 담을 Array 선언
 * 그래프상에 보일 막대 정보 객체 선언
 * ex) 
 * 학생수 : 13, 
 * 학교명 : '야동초등학교', 
 * 막대기시작색 : 'red',
 * 막대기종료색 : 'white',
 * text색상 : 'black',
 * textSize : 10
 *  
 * 3.var obj = { //막대 OBJ 정보   
 * 	val : 13,  //필수
 * 	label : '야동초등학교',//필수
 * 	stColor : 'red', 
 * 	edColor : 'white', 
 * 	textColor : 'black', 
 * 	textSize : 10 
 * };
 * 
 * 생성한 객체를 array에 담는다
 * 4.array.push(chart);
 * 
 * 
 * setObj함수에 그래프 정보를 넘긴다.
 * 
 * var myChart = new nieeChart(); // 차트 객체를 생성한다.
 * 
 * 5.myChart.setChart({ 
 * 	array : array, //막대정보가 담긴 Array //필수 
 * 	id : 'chartCanvas', //canvas id //필수
 *  type : 'rect||line', //차트 타입 선택
 * 	width : 600,  //넓이 없을경우 canvas의 width를 셋팅
 * 	height : 500, //높이 없을경우 canvas의 height를 셋팅
 *  labelWidth : 100, //라벨영역 width
 * 	isLine :true,  //경계바생성
 * 	title : 'niee@naver.com', //타이틀
 * 	titleSize : 10, //타이틀 글자크기
 * 	lineCount : 20, //경계선수
 *  maxNum : 100000, //라인에 보여질 최대수 지정
 *  isTooltip : true, //막대기 마우스 오버시 툴팁 여부
 *  toolStyle : "border:1px solid #000;width:100px;height:50px;" //툴팁에 적용할 style
 * 	});
 * </pre> 
 * 
 */

(function(window){

	var toolArray = null;
	var nieeChart = function(){
			this.objCnt = 0;
			this.maxVal = 0;
			this.minVal = 0;
			this.lineCount  =  0;
			this.array = null;
			this.type = 'rect';
			this.canvas = null;
			this.context = null;
			this.width = 0;
			this.height = 0;
			this.labelWidth = 100;
			this.isLine = false;
			this.title = '';
			this.maxNum  =  0;
			this.titleSize  =  10;
			this.isTooltip  =  false;
			this.tooltipArray  =  null;
			this.toolStyle  =  "border:1px solid #000;width:100px;height:50px;";
	};
	
	nieeChart.prototype.setChart = function(options) {
		this.array = options ? options.array:new Array();
		this.canvas = document.getElementById(options ? options.id : 'chartCanvas');
		this.context = this.canvas.getContext('2d');
		this.objCnt = this.setObjCnt(this.array);
		this.maxVal = this.findMaxVal(this.array);
		this.minVal = this.findMinVal(this.array);
		this.type =	options ? options.type || this.type : this.type;
		this.width =	options ? options.width || this.canvas.width : this.canvas.width;
		this.height = options ? options.height || this.canvas.height : this.canvas.height;
		this.labelWidth = options ? options.labelWidth || this.labelWidth : this.labelWidth;
		this.isLine = options ? options.isLine || this.isLine : this.isLine;
		this.title = options ? options.title || this.title : this.title;
		this.titleSize = options ? options.titleSize || this.titleSize : this.titleSize;
		this.maxNum = options ? options.maxNum || this.maxNum : this.maxNum;
		this.lineCount = options ? options.lineCount || 10 : 10;
		this.isTooltip = options ? options.isTooltip || this.isTooltip : this.isTooltip;
		this.tooltipArray = new Array();
		this.toolStyle = options ? options.toolStyle || this.toolStyle : this.toolStyle;
		
		this.createChart();
		this.createLine();
		this.createObjVal();
		this.createLabel();
	};
	
	nieeChart.prototype.tooltip  =  function(obj){
		this.tooltipArray.push(obj);
	};

	nieeChart.prototype.setObjCnt = function (array) {
		return array.length | 0;
	};

	nieeChart.prototype.findMaxVal = function (array) {
		var max = 0;
		for ( var i = 0; i < array.length; i++) {
			if (max < parseInt(array[i].val)) {
				max = parseInt(array[i].val);
			}
		}
		return max;
	};

	nieeChart.prototype.findMinVal = function (array) {
		var min = 0;
		for ( var i = 0; i < array.length; i++) {
			if (min > parseInt(array[i].val)) {
				min = parseInt(array[i].val);
			}
		}
		return min;
	};

	nieeChart.prototype.createChart = function(){
		var c = this.canvas;
		c.style.display = 'none';
		var ctx = this.context;
		var width = this.width;
		var height = this.height;
		c.width = width+this.labelWidth;
		c.height = height+20;
		ctx.save();
		ctx.clearRect(0,0,c.width,c.height);
		ctx.restore();
		//ctx.strokeRect(0, 0 ,width  , height);
		if(this.title){
			ctx.font = this.titleSize + 'px Arial' || '15px Arial';
			ctx.fillStyle = '#000';
			var txtWidth = ctx.measureText(this.title).width;
			ctx.fillText(this.title,width - txtWidth-5,20);
		}
		c.style.display = 'block';
	};

	nieeChart.prototype.getMaxLineNum = function(){
		
		if(this.maxNum > 0){
			return this.maxNum;
		}
		
		var maxVal = this.maxVal;
		var sMaxVal = maxVal.toString();
		var tempLen = 1;
		var idx = sMaxVal.length;
		var tempNum = '';

		var rem = parseInt(maxVal%5);
		return parseInt(maxVal) + rem;
		/*
		if(Math.round(parseInt(sMaxVal.charAt(0))*0.1) == 1){
			if(parseInt(sMaxVal.charAt(0)) < 8){
				tempNum = parseInt(sMaxVal.charAt(0)) + 1 ;
				tempLen = 1;
			}else{
				tempNum = 1 ;
				tempLen = 0;
			}
		}else{
			if(idx > 1 && Math.round(parseInt(sMaxVal.charAt(1))*0.1) == 1){
				tempNum = parseInt(sMaxVal.charAt(0)) + 1 ;
				tempLen = 1;
			}else{
				tempNum = sMaxVal.charAt(0) + 5 ;
				tempLen = 1;
			}
		}
		
		for(var i = 0 ; i < (sMaxVal.length - tempLen) ; i++){
			tempNum += "0";
		}
		
		return parseInt(tempNum);
		*/
	};

	nieeChart.prototype.createObjVal = function(){
		var ctx = this.context;
		var array = this.array;
		var objCnt = this.objCnt;
		var spaceY = this.height*0.1;
		var height = this.height;
		var maxNum = this.getMaxLineNum();
		var spaceX = ctx.measureText(maxNum.toString()).width;
		var width = this.width - spaceX;
		var x = spaceX;
		for(var i = 0 ; i < array.length ; i++){
			var obj = array[i];
			x+=(width/objCnt)/4;
			var y = height- (((height-spaceY) * (obj.val)/maxNum));

			if(this.isTooltip){
				var toolObj = {
					x:x,
					y:parseInt(y),
					width:(width/objCnt)/2,
					height:(((height-spaceY) * (obj.val)/maxNum))-2,
					label : obj.label,
					val : obj.val
				};
				this.tooltip(toolObj);
			}
			
			if(this.type == 'rect'){
				var grd = ctx.createLinearGradient(0,0,0,height);
				grd.addColorStop(0.0,obj.stColor||'black');
				grd.addColorStop(1.0,obj.edColor||'white');
				ctx.fillStyle=grd;
				ctx.fillRect(x, parseInt(y),(width/objCnt)/2 , (((height-spaceY) * (obj.val)/maxNum))-1);
			}else if(this.type == 'line'){
				var obj2;
				if(i < array.length - 1){
					obj2 = array[i+1];
					var y2 = height- (((height-spaceY) * (obj2.val)/maxNum));
					var nextX = (x+((width/objCnt)/2)/2)+(((width/objCnt)/2)+((width/objCnt)/4))+((width/objCnt)/4);
					ctx.beginPath();
					ctx.strokeStyle='#9684ff';
					ctx.shadowBlur=20;
					ctx.shadowColor="black";
					ctx.lineWidth=2;
					ctx.arc(x+((width/objCnt)/2)/2,parseInt(y),3,0,2*Math.PI);
					ctx.moveTo(x+((width/objCnt)/2)/2,parseInt(y));
					ctx.lineTo(nextX,parseInt(y2));
					if(i == (array.length-2)){
						ctx.arc(nextX,parseInt(y2),3,0,2*Math.PI);
					}
					ctx.stroke();
				}
			}
			x+=((width/objCnt)/2)+((width/objCnt)/4);
		}
		if(this.isTooltip){
			this.toolTipEvent();
		}
	};

	nieeChart.prototype.createLine = function(){
		if(this.isLine){
			var ctx = this.context;
			var width = this.width;
			var spaceY = this.height*0.1;
			var height = this.height;
			var maxNum = this.getMaxLineNum();
			var rowsY = ((height-spaceY)*(100/this.lineCount*0.01));
			
			for(var i = 0 ; i < this.lineCount+1 ; i ++){
				var y = (rowsY*i)+spaceY;
				ctx.beginPath();
				ctx.strokeStyle='#9684ff';
				ctx.shadowBlur=0;
				ctx.lineWidth=2;
				ctx.font = this.titleSize +'px Arial' || '10px Arial';
				ctx.lineWidth=1;
				ctx.moveTo(0,y-1);
				ctx.lineTo(width,y-1);
				ctx.stroke();			
				
				ctx.fillText(parseInt(maxNum-(maxNum*((i/this.lineCount*100)/100))), 0, y-1);
			}
			
		}
	};

	nieeChart.prototype.createLabel = function(){
		var ctx = this.context;
		var array = this.array;
		var objCnt = this.objCnt;
		var spaceY = this.height*0.1;
		var height = this.height;
		var maxNum = this.getMaxLineNum();
		var spaceX = ctx.measureText(maxNum.toString()).width;
		var width = this.width - spaceX;
		var x = spaceX;
		for(var i = 0 ; i < array.length ; i++){
			x+=(width/objCnt)/4;
			var obj = array[i];
			var y = height- (((height-spaceY) * (obj.val)/maxNum));
			var textSize = obj.textSize || 10;
			ctx.shadowBlur=0;
			ctx.fillStyle= obj.textColor || '#000';
			ctx.font = textSize > ((width/objCnt)/4/2)? (width/objCnt)/4/2 : textSize +'px Arial';
			var textX = x +((width/objCnt)/2)/2-textSize;
			var textY = y;
			var labelY = (((height / objCnt)>20?20:height / objCnt) * i) + (textSize > ((width/objCnt)/4/2)? (width/objCnt)/4/2 : textSize);
			
			ctx.fillStyle=obj.stColor||'black';
			ctx.textBaseline="top";
			ctx.fillRect(width + spaceX + 2 , labelY , (height/objCnt < 20 ? height/objCnt : 20) , (height/objCnt < 20 ? height/objCnt : 20));
			ctx.fillText(obj.label, (width + spaceX + 2)+(height/objCnt < 20 ? height/objCnt : 20),labelY);
			ctx.textBaseline="bottom";
			ctx.fillText(obj.val, textX, textY - 1);
			x+=((width/objCnt)/2)+((width/objCnt)/4);
		}
	};

	nieeChart.prototype.toolTipEvent = function(){
		var toolDiv = document.getElementById("toolTip"); ;
		if(toolDiv == null){
			toolDiv = document.createElement("div");
			toolDiv.setAttribute('id','toolTip');
			toolDiv.setAttribute('style',"position:fixed;display:none;"+this.toolStyle);
			document.body.appendChild(toolDiv);
		}
		toolArray = this.tooltipArray;
		this.canvas.addEventListener('mousemove',function(e){
			for(var i = 0 ; i < toolArray.length ; i ++){
				var obj = toolArray[i];
				if((e.offsetX > obj.x && e.offsetX < (obj.x + obj.width) )&& (e.offsetY > obj.y-20  && e.offsetY < (obj.y + obj.height))){
					toolDiv.style.display = 'block';
					toolDiv.style.top = (e.y+10)+"px";
					toolDiv.style.left = (e.x)+10+"px";
					toolDiv.innerHTML = obj.label + '<br>' + obj.val;
					break;
				}else{
					toolDiv.style.display = 'none';
				}
			}
		},true);
	};
	
	window.nieeChart = nieeChart;
})(window);
=======
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('(m(1e){7 X=E;7 n=m(){6.h=0;6.R=0;6.1y=0;6.H=0;6.d=E;6.D=\'1k\';6.t=E;6.L=E;6.9=0;6.b=0;6.F=1l;6.v=\'\';6.j=0;6.w=10;6.B=1l;6.V=E;6.I="21:1X 29 #15;9:2e;b:2c;"};n.p.26=m(f){6.d=f?f.d:1z 1x();6.t=12.1H(f?f.1L:\'27\');6.L=6.t.25(\'2d\');6.h=6.1v(6.d);6.R=6.1w(6.d);6.1y=6.1A(6.d);6.D=f?f.D||6.D:6.D;6.9=f?f.9||6.t.9:6.t.9;6.b=f?f.b||6.t.b:6.t.b;6.F=f?f.F||6.F:6.F;6.v=f?f.v||6.v:6.v;6.w=f?f.w||6.w:6.w;6.j=f?f.j||6.j:6.j;6.H=f?f.H||10:10;6.B=f?f.B||6.B:6.B;6.V=1z 1x();6.I=f?f.I||6.I:6.I;6.1E();6.1q();6.1C();6.1O()};n.p.1u=m(g){6.V.28(g)};n.p.1v=m(d){M d.s|0};n.p.1w=m(d){7 Y=0;z(7 i=0;i<d.s;i++){k(Y<l(d[i].o)){Y=l(d[i].o)}}M Y};n.p.1A=m(d){7 T=0;z(7 i=0;i<d.s;i++){k(T>l(d[i].o)){T=l(d[i].o)}}M T};n.p.1E=m(){7 c=6.t;c.A.P=\'1g\';7 a=6.L;7 9=6.9;7 b=6.b;k(9>c.9){c.9=9}k(b>c.b){c.b=b}a.1U();a.1W(0,0,c.9,c.b);a.1T();k(6.v){a.16=6.w+\'O N\'||\'22 N\';a.14=\'#15\';7 1F=a.17(6.v).9;a.Z(6.v,9-1F-5,20)}c.A.P=\'1j\'};n.p.11=m(){k(6.j>0){M 6.j}7 R=6.R;7 u=R.1b();7 J=1;7 1D=u.s;7 C=\'\';k(W.1B(l(u.K(0))*0.1)==1){k(l(u.K(0))<8){C=l(u.K(0))+1;J=1}S{C=1;J=0}}S{k(1D>1&&W.1B(l(u.K(1))*0.1)==1){C=l(u.K(0))+1;J=1}S{C=u.K(0)+5;J=1}}z(7 i=0;i<(u.s-J);i++){C+="0"}M l(C)};n.p.1C=m(){7 a=6.L;7 d=6.d;7 h=6.h;7 r=6.b*0.1;7 b=6.b;7 j=6.11();7 G=a.17(j.1b()).9;7 9=6.9-G;7 x=G;z(7 i=0;i<d.s;i++){7 g=d[i];x+=(9/h)/4;7 y=b-(((b-r)*(g.o)/j));k(6.B){7 1m={x:x,y:l(y),9:(9/h)/2,b:(((b-r)*(g.o)/j))-2,U:g.U,o:g.o};6.1u(1m)}k(6.D==\'1k\'){7 13=a.2q(0,0,0,b);13.1n(0.0,g.2i||\'1s\');13.1n(1.0,g.2r||\'2j\');a.14=13;a.2f(x,l(y),(9/h)/2,(((b-r)*(g.o)/j))-1)}S k(6.D==\'2g\'){7 1a;k(i<d.s-1){1a=d[i+1];7 1f=b-(((b-r)*(1a.o)/j));7 19=(x+((9/h)/2)/2)+(((9/h)/2)+((9/h)/4))+((9/h)/4);a.1P();a.1Q=\'#1S\';a.1d=20;a.2o="1s";a.1c=2;a.1t(x+((9/h)/2)/2,l(y),3,0,2*W.1p);a.1J(x+((9/h)/2)/2,l(y));a.1I(19,l(1f));k(i==(d.s-2)){a.1t(19,l(1f),3,0,2*W.1p)}a.1N()}}x+=((9/h)/2)+((9/h)/4)}k(6.B){6.1R()}};n.p.1q=m(){k(6.F){7 a=6.L;7 9=6.9;7 r=6.b*0.1;7 b=6.b;7 j=6.11();7 1G=((b-r)*(18/6.H*0.2m));z(7 i=0;i<6.H+1;i++){7 y=(1G*i)+r;a.1P();a.1Q=\'#1S\';a.1d=0;a.1c=2;a.16=6.w+\'O N\'||\'2p N\';a.1c=1;a.1J(0,y-1);a.1I(9,y-1);a.1N();a.Z(l(j-(j*((i/6.H*18)/18))),0,y-1)}}};n.p.1O=m(){7 a=6.L;7 d=6.d;7 h=6.h;7 r=6.b*0.1;7 b=6.b;7 j=6.11();7 G=a.17(j.1b()).9;7 9=6.9-G;7 x=G;z(7 i=0;i<d.s;i++){x+=(9/h)/4;7 g=d[i];7 y=b-(((b-r)*(g.o)/j));7 Q=g.Q||10;a.1d=0;a.14=g.23||\'#15\';a.16=Q+\'O N\';7 1i=x+((9/h)/2)/2-Q;7 1h=y;a.Z(g.U,1i,1h-Q);a.Z(g.o,1i,1h-1);x+=((9/h)/2)+((9/h)/4)}};n.p.1R=m(){7 q=12.1H("1M");k(q==E){q=12.2b("1V");q.1K(\'1L\',\'1M\');q.1K(\'A\',"2t:2u;P:1g;"+6.I);12.2v.2k(q)}X=6.V;6.t.2n(\'2l\',m(e){z(7 i=0;i<X.s;i++){7 g=X[i];k((e.1r>g.x&&e.1r<(g.x+g.9))&&(e.1o>g.y-20&&e.1o<(g.y+g.b))){q.A.P=\'1j\';q.A.2h=(e.y+10)+"O";q.A.2s=(e.x)+10+"O";q.1Y=g.U+\'<1Z>\'+g.o;2a}S{q.A.P=\'1g\'}}},24)};1e.n=n})(1e);',62,156,'||||||this|var||width|ctx|height||array||options|obj|objCnt||maxNum|if|parseInt|function|nieeChart|val|prototype|toolDiv|spaceY|length|canvas|sMaxVal|title|titleSize|||for|style|isTooltip|tempNum|type|null|isLine|spaceX|lineCount|toolStyle|tempLen|charAt|context|return|Arial|px|display|textSize|maxVal|else|min|label|tooltipArray|Math|toolArray|max|fillText||getMaxLineNum|document|grd|fillStyle|000|font|measureText|100|nextX|obj2|toString|lineWidth|shadowBlur|window|y2|none|textY|textX|block|rect|false|toolObj|addColorStop|offsetY|PI|createLine|offsetX|black|arc|tooltip|setObjCnt|findMaxVal|Array|minVal|new|findMinVal|round|createObjVal|idx|createChart|txtWidth|rowsY|getElementById|lineTo|moveTo|setAttribute|id|toolTip|stroke|createLabel|beginPath|strokeStyle|toolTipEvent|9684ff|restore|save|div|clearRect|1px|innerHTML|br||border|15px|textColor|true|getContext|setChart|chartCanvas|push|solid|break|createElement|50px||100px|fillRect|line|top|stColor|white|appendChild|mousemove|01|addEventListener|shadowColor|10px|createLinearGradient|edColor|left|position|fixed|body'.split('|'),0,{}))
>>>>>>> 2d660bd9254810ab7a5833b6ce379e4b09f395d6
