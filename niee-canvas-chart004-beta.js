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
 *  type : 'rect||line||arc', //차트 타입 선택
 * 	width : 600,  //넓이 없을경우 canvas의 width를 셋팅
 * 	height : 500, //높이 없을경우 canvas의 height를 셋팅
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
	var toolDiv = null ;
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
			this.isLine = false;
			this.title = '';
			this.maxNum  =  0;
			this.titleSize  =  10;
			this.isTooltip  =  false;
			this.tooltipArray  =  null;
			this.tooltip  =  function(obj){
				this.tooltipArray.push(obj);
			};
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
		this.isLine = options ? options.isLine || this.isLine : this.isLine;
		this.title = options ? options.title || this.title : this.title;
		this.titleSize = options ? options.titleSize || this.titleSize : this.titleSize;
		this.maxNum = options ? options.maxNum || this.maxNum : this.maxNum;
		this.lineCount = options ? options.lineCount || 10 : 10;
		this.isTooltip = options ? options.isTooltip || this.isTooltip : this.isTooltip;
		this.tooltipArray = new Array();
		this.toolStyle = options ? options.toolStyle || this.toolStyle : this.toolStyle;
		
		this.createChart();
		if(this.type == 'arc'){
			this.createArc();
		}else{
			this.createLine();
			this.createObjVal();
			this.createLabel();
		}
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
		if(width > c.width){
			c.width = width;
		}
		if(height > c.height){
			c.height = height;
		}
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

	nieeChart.prototype.createArc = function(){
		var c = this.canvas;
		var ctx = this.context;
		var centerX = parseInt(c.width/2);
		var centerY = parseInt(c.height/2);
		var r = centerX < centerY ? parseInt(centerX/2) : parseInt(centerY/2);
		var array = this.array;
		var startPI = 0;
		for(var i = 0 ; i < array.length ; i ++){
			var nowObj = array[i];
			var endPI = this.getArcVal(nowObj.val);
			ctx.beginPath();
			ctx.arc(centerX, centerY, r, startPI*Math.PI , (startPI+endPI)*Math.PI); //중앙x,중앙y,반지름,시작점,마지막점
			ctx.lineTo(centerX, centerY);
			ctx.closePath();
			ctx.fillStyle = nowObj.stColor;
			ctx.fill();
			startPI = startPI+endPI;
		}
		this.toolTipEvent();
	};
	
	nieeChart.prototype.getArcVal = function(val){
		var thisPer = parseInt(val);
		var totalVal = this.getArcTotVal();
		
		return (thisPer/totalVal)*2; 
	};

	nieeChart.prototype.getArcTotVal = function(){
		var array = this.array;
		var totalVal = 0;
		for(var i = 0 ; i < array.length ; i ++){
			var obj = array[i];
			totalVal += parseInt(obj.val);
		}
		return totalVal;
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
			ctx.font = textSize +'px Arial';
			var textX = x +((width/objCnt)/2)/2-textSize;
			var textY = y;
			ctx.fillText(obj.label, textX,textY - textSize);
			ctx.fillText(obj.val, textX, textY - 1);
			x+=((width/objCnt)/2)+((width/objCnt)/4);
		}
	};

	nieeChart.prototype.toolTipEvent = function(){
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