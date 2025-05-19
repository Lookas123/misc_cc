let holeOpts = []

function isneigh(a,b){
  let adiff = Math.abs(a-b);
  return [0,1,5,6,7].indexOf(adiff)>-1
}

//Precalculate all the possible sets of holes
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

//Difference between minimum and maximum of all the neighbors of a spot
function minmaxdiff(g, p){
  const neighs = [g[p-7],g[p-6],g[p-5],g[p-1],g[p+1],g[p+5],g[p+6],g[p+7]]
  return Math.max(...neighs)-Math.min(...neighs)
}

//Calculate the optimal holes
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

//Display all holes in a nice string
function plotsNice(a){
    let str = "";
    for(let b = 0; b<6; b++){
        for(let c = 0; c<6; c++) {str+=a[b*6+c]+" ".repeat(4-a[b*6+c].toString().length)}
        str+="\n";
    }
    return str;
}

function dothething(){
  let garden = document.getElementById("input").value.split(/\s+/g);
  document.getElementById("output").innerHTML=plotsNice(calcHoles(garden)); 
}