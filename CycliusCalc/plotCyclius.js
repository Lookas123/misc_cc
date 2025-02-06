function getCyclius(time, slot){
    let loopH;
    switch (slot) {
        case 1:
            loopH=3;
            break;
        case 2:
            loopH=12;
            break;
        case 3:
            loopH=24;
            break;
    }
    return -0.15*Math.sin((time/1000/(60*60*loopH))*Math.PI*2);
}

function getCoords(time, buff, leftT, width, height){
    return [
        width * (time-leftT)/(24*3600*1000), 
        height*(0.5 + (0.5/0.15) * buff)
    ]
}

function updateCanvas(){
    const canv = document.getElementById("cyclCanv");
    const ctx = canv.getContext("2d")
    //Cyclius curves
    const leftT = Date.now()-12*3600*1000;
    const step = 60*1000;
    const rightT = Date.now()+12*3600*1000;
    //Time, buff -> width * (time-leftT)/24*3600*1000, height*(0.5 + 0.5/0.15 * buff)
    ctx.lineWidth = 2;
    ctx.setLineDash([])
    for(let slot = 1; slot<=3; slot++){
        ctx.strokeStyle=["blue","red","green"][slot-1];
        ctx.beginPath();
        ctx.moveTo(...getCoords(leftT,getCyclius(leftT,slot),leftT,canv.width,canv.height));
        for(let t = leftT; t<=rightT; t+=step){
            ctx.lineTo(...getCoords(t,getCyclius(t,slot),leftT,canv.width,canv.height))
        }
        ctx.stroke(); 
    }

    //Draw dotted lines every 3 hours and every 5 percent
    ctx.strokeStyle="black";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([canv.width/100]);
    ctx.font="20px sans-serif"
    ctx.beginPath()


    ctx.textAlign = "center";
    ctx.testBaseline="bottom";
    for(let h = -11; h<=11; h++){
        
        //Text
        if(h%3==0)ctx.fillText((h>=0?"+":"")+h+"h",canv.width*(0.5+h/24),canv.height*0.99)
        
        ctx.moveTo(canv.width*(0.5+h/24),0);
        ctx.lineTo(canv.width*(0.5+h/24),canv.height);
        
    }

    ctx.textAlign="left";
    ctx.textBaseline="middle";
    for(let p = -10; p<=10; p+=5){
        ctx.moveTo(0,canv.height*(0.5-p/30));
        ctx.lineTo(canv.width,canv.height*(0.5-p/30));
        //Text
        ctx.fillText((p>=0?"+":"")+p+"%",5,canv.height*(0.5-p/30))
    }
    ctx.stroke();
}

updateCanvas();