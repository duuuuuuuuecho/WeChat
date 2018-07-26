//手指按下的坐标
var startx = 0;
var starty = 0;


//移动坐标

var movex = 0;
var movey = 0;

//坐标差值
var X = 0;
var Y = 0;

//蛇头的对象
var snakeHead = {
  x:0,
  y:0,
  w:20,
  h:20,
  color:'#00ff00'
}
//身体对象

var snakeBodys = [];

//食物对象
var foods = [];


//手指方向
var direction = null;
//蛇移动方向
var snakeDirection = "right";

var speed = 20;
//手机窗口宽高
var windowWidth = 0;
var windowHeight = 0;

//判断值 用于确定是否删除
var collideBol = true;

//页面
Page({
  canvasStart:function(e){

    startx = e.touches[0].x;
    starty = e.touches[0].y;
  },
  canvasMove:function(e){
    
    movex = e.touches[0].x;
    movey = e.touches[0].y;

    X = movex - startx;
    Y = movey - starty;
    
   
    if(Math.abs(X) > Math.abs(Y) && X > 0){
        direction = "right";
      //console.log("right");
    }else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      direction = "left";
      //console.log("left");
    }else if (Math.abs(X) < Math.abs(Y) && Y > 0) {
      direction = "bottom";
      //console.log("bottom");
    }else if (Math.abs(X) < Math.abs(Y) && Y < 0) {
      direction = "top";
      //console.log("top");
    }
  },
  canvasEnd:function(e){
    //终止
    switch (direction){
          case "left":
            if(snakeDirection != "right"){
              snakeDirection  = direction;
            }
            
            break;
          case "right":
            if(snakeDirection != "left"){
              snakeDirection  = direction;
            }
            break;
          case "top":
            if(snakeDirection != "bottom"){
              snakeDirection  = direction;
            }
            break;
          case "bottom":
            if(snakeDirection != "top"){
              snakeDirection  = direction;
            }
            break;
      }
  },

  onReady:function(e){
  //获取画布上下文
    var context = wx.createContext();
    var frameNUM = 0;  //帧数

    function draw(obj){
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x,obj.y,obj.w,obj.h);
      context.closePath();
      context.fill();
    }


    function initGame(){
        snakeHead.x= 0;
        snakeHead.y = 0;
        snakeBodys.splice(0,snakeBodys.length);//清空数组 
        snakeDirection = "right";
        context = wx.createContext();
        foods.splice(0,foods.length);
        for (var i = 0; i<30; i++) {       
            var food = new Food();
            foods.push(food);
        }


    }

    function beginGame(){
      initGame();
      function draw(obj){
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x,obj.y,obj.w,obj.h);
      context.closePath();
      context.fill();
      }

      animate();

    }

    //加速函数
    function addspeed(){
      
        if(snakeBodys.length > 10 && snakeBodys.length <= 20){
          speed = 15;
        }
        if(snakeBodys.length > 20){
          speed = 10;
        }

    }
 


    //碰撞函数
    function collide(obj1,obj2){
        var l1 = obj1.x;
        var r1 = l1+obj1.w;
        var t1 = obj1.y;
        var b1 = t1+obj1.h;
        
        var l2 = obj2.x;
        var r2 = l2+obj2.w;
        var t2 = obj2.y;
        var b2 = t2+obj2.h;

        if (r1>l2&&l1<r2&&b1>t2&&t1<b2){
          return true;
        }else{
          return false;
        }
    }

    function animate(){
          frameNUM ++;
          addspeed();
          if(frameNUM % speed == 0){
            //添加身体对象
              snakeBodys.push({
                x:snakeHead.x,
                y:snakeHead.y,
                w:20,
                h:20,
                color:'#FF0000'
              });

              if (snakeBodys.length > 6){

                  if(collideBol){
                      snakeBodys.shift(); //删除数组第一位
                  }else{
                    collideBol = true;
                  }      
              }

              switch(snakeDirection){
              case "left":
                snakeHead.x -= snakeHead.w;
                break;
              case "right":
                snakeHead.x += snakeHead.w;
                break;
              case "top":
                snakeHead.y -= snakeHead.h;
                break;
              case "bottom":
                snakeHead.y += snakeHead.h;
                break;
              }
              
          }
    
      

      //绘制蛇头
       draw(snakeHead);
      //绘制蛇身
       for(var i = 0; i < snakeBodys.length ; i++){
          var snakeBody = snakeBodys[i];
          draw(snakeBody);
       }



       //绘制食物
       for (var i = 0; i < foods.length ; i++){
            var foodobj = foods[i];
            draw(foodobj);
            if(collide(snakeHead,foodobj)){
                console.log("撞上了");

                collideBol = false;
                
                
                foodobj.reset();
            }
       }

       if(snakeHead.x>windowWidth || snakeHead.x<0 || snakeHead.y>windowHeight || snakeHead.y<0){
            wx.showModal({
              title:"蛇身总长:"+snakeBodys.length+"  速度:"+speed,
              content: '游戏失败, 重新开始',
              success:function(res){
                console.log(res)
                if(res.confirm){
                 beginGame();
                }
                else{
                  initGame();
                  wx.navigateBack({
                    delta:1
                  })

                }
              }
            })
              return;
       }


        wx.drawCanvas({
              canvasId: "firstCanvas",
              actions: context.getActions()
            });

        requestAnimationFrame(animate);
    }
    
    function rand(min,max){
      //随机函数
      return parseInt(Math.random()*(max-min))+min;
    }



    //构造食物对象
    function Food(){
        this.x = rand(0,windowWidth);

        this.y = rand(0,windowHeight);
        var cx = rand(10,20);
        this.w = cx;
        this.h = cx;

        this.color = "rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";

        this.reset = function(){
          this.x = rand(0,windowWidth);
          this.y = rand(0,windowHeight);
          var cx = rand(10,20);
          this.w = cx;
          this.h = cx;
          this.color = "rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
        }
    }

    wx.getSystemInfo({
      success:function(res){
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;

        for(var i = 0 ; i <30; i++){
            var foodObj = new Food();
            foods.push(foodObj);
        }
        
         animate();  
        }
    })

   }  

  })