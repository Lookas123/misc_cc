function plotsNice(a){
    let str = "";
    for(let b = 0; b<6; b++){
        for(let c = 0; c<6; c++) {str+=a[b*6+c]+" ".repeat(4-a[b*6+c].toString().length)}
        str+="\n";
    }
    return str;
}
const plotsBase=
[0  ,0  ,0  ,0  ,0  ,0  ,
 0  ,"" ,0  ,0  ,"" ,0  ,
 0  ,0  ,0  ,0  ,0  ,0  ,
 0  ,0  ,0  ,0  ,0  ,0  ,
 0  ,"" ,0  ,0  ,"" ,0  ,
 0  ,0  ,0  ,0  ,0  ,0  ]
const stn = 0.95;
const loops = 10000;
const pokeHoles = false

let holeOpts = []
if(pokeHoles){
  plotsBase = Array(36).fill(0);
  function isneigh(a,b){
    let adiff = Math.abs(a-b);
    return [0,1,5,6,7].indexOf(adiff)>-1
  }
  const spot1 = [7,8,13,14]
  const spot2 = [9,10,15,16]
  const spot3 = [19,20,25,26]
  const spot4 = [21,22,27,28]
  for(let a of spot1){
   for(let b of spot2){
      for(let c of spot3){
        for(let d of spot4){
          if(!isneigh(a,b)&&!isneigh(a,c)&&!isneigh(a,d)&&!isneigh(b,c)&&!isneigh(b,d)&&!isneigh(c,d)) holeOpts.push([a,b,c,d])
        }
      }
    }
  }
  function minmaxdiff(g, p){
     const neighs = [g[p-7],g[p-6],g[p-5],g[p-1],g[p+1],g[p+5],g[p+6],g[p+7]]
     return Math.max(...neighs)-Math.min(...neighs)
  }
  function calcHoles(garden){
     let bestSum = Infinity;
     let bestHoles = [];
     for(let holes of holeOpts){
       let sum = 0;
       for(let hole of holes){
         sum += minmaxdiff(garden, hole);
       }
       if(sum<bestSum){
         bestSum=sum;
         bestHoles = holes;
       }
     }
     for(let i of bestHoles) garden[i]="";
     //console.log(garden, bestSum, bestHoles)
     return garden;
  }
}


let jqbaverage=0;
let tickaverage=0;
let jqbticks=Array(100).fill(0);
for(let i = 0; i<loops;i++){
    let plots = JSON.parse(JSON.stringify(plotsBase))
    let jqb = 0;
    let prevjqb=-1;
    let jqb2 = 0;
    let holes = false;
    for(let a=0; a<80||prevjqb<jqb; a++){
        prevjqb=jqb;
        for(let b in plots){
            c=plots[b];
            if(typeof c == "number"){
                plots[b]+=1
                if(c>-1) plots[b]+=(Math.random()<0.2)
		            if(c>=80*stn && !holes && pokeHoles){plots = calcHoles(plots); holes = true}
            }
            else if (typeof c =="string"){
                let canmut=true;
                let e = Number(b)
                let neigh = [e-7,e-6,e-5,e-1,e+1,e+5,e+6,e+7];
                for(let d of neigh){
                    if(plots[d]<80*stn||plots[d]>=100)canmut=false;
                }
                if(canmut){jqb++; /*console.log(plotsNice(plots), neigh);for(let d of neigh){console.log(plots[d])}*/}
            }
        }
        //console.log(plotsNice(plots), jqb)
    }
    tickaverage+=jqb/loops;
    jqbaverage+=(1-(1-(1-0.999**9)/3)**jqb)/loops
        jqbticks[jqb]++
}
console.log(jqbaverage, tickaverage, jqbticks)