let valuesN = 20;
let valuesDiff = 5;
//Resting values
let buyCenter = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180];
let sellCenter = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180];
let profit = []
//Add value tracking to stock market tick
eval("Game.Objects.Bank.minigame.tick="+Game.Objects.Bank.minigame.tick.toString().replace("{","{M=Game.Objects.Bank.minigame").replace("me.dur--;","for(let a in profit[me.id]){for(let b in profit[me.id][a]){if((me.val<(buyCenter[me.id]-(valuesN*-0.5+Number(a))*valuesDiff))&&profit[me.id][a][b][0]==0){profit[me.id][a][b][0]=1;profit[me.id][a][b][1]-=me.val;}else if((me.val>(sellCenter[me.id]+(valuesN*-0.5+Number(b))*valuesDiff))&&profit[me.id][a][b][0]==1){profit[me.id][a][b][0]=0;profit[me.id][a][b][1]+=me.val;}}}"));
/*
Profit is a 4d array
1: which stock is this
2: Buy options
3: Sell options
4: profit, and if we've bought the stock
*/




// for(let a in profit[me.id]){
//  for(let b in profit[me.id][a]){
//      if((me.val<(buyCenter[me.id]-(valuesN*-0.5+Number(a))*valuesDiff))&&profit[me.id][a][b][0]==0){profit[me.id][a][b][0]=1;profit[me.id][a][b][1]-=me.val;}
//      else if((me.val>(sellCenter[me.id]+(valuesN*-0.5+Number(b))*valuesDiff))&&profit[me.id][a][b][0]==1){profit[me.id][a][b][0]=0;profit[me.id][a][b][1]+=me.val;}
//  }
// }

//Loop 3 times, finding the optimal value and making the new adjustment be between the values
for(let l = 0; l<3; l++){
    //Populate profit with 0's
    let a = [0,0]
    let b = []
    function d(arr) {
        return structuredClone(arr)
    }
    for(let i = 0; i<valuesN; i++) {b.push(d(a))}
    let c = []
    for(let i = 0; i<valuesN; i++) {c.push(d(b))}
    profit = []
    for(let i = 0; i<18; i++) {profit.push(d(c))}
    
    //Do ticks
    for(let i = 0; i<100000; i++) {Game.Objects.Bank.minigame.tick()}

    console.log(profit);
    console.log(buyCenter);
    //Find the maximum profit for each stock
    for(let i in profit){
        let max = 0;
        let ga = 0;
        let gb = 0;
        for(let a in profit[i]){
            for(let b in profit[i][a]){
                if(profit[i][a][b][1]>max){max = profit[i][a][b][1]; ga = a; gb = b;}
            }
        }
        //Set the new buy and cell centers to be the optimal value for this stock
        buyCenter[i]=(buyCenter[i]-(valuesN*-0.5+Number(ga))*valuesDiff);
        sellCenter[i]=(sellCenter[i]+(valuesN*-0.5+Number(gb))*valuesDiff);
        console.log('stock ' + i + ': ' + buyCenter[i] + '--' + sellCenter[i] + " for "+max+" profit");
    }
    console.log("loop" + l);
        console.log(buyCenter, sellCenter)
        valuesDiff/=valuesN;
}
/*
stock 0: 5--55 for 11823.07761103699 profit
stock 1: 5--65 for 11811.36441295391 profit
stock 2: 5--65 for 12090.221816985844 profit
stock 3: 5--75 for 12415.404623556298 profit
stock 4: 10--95 for 13323.955063359179 profit
stock 5: 15--100 for 13500.697499534273 profit
stock 6: 25--115 for 12922.706434448572 profit
stock 7: 35--115 for 12807.340980527591 profit
stock 8: 45--130 for 14029.12430037036 profit
stock 9: 55--130 for 12659.172014771255 profit
stock 10: 65--135 for 12195.136402839664 profit
stock 11: 75--135 for 11483.778807467494 profit
stock 12: 85--140 for 11835.160225464913 profit
stock 13: 95--145 for 10126.93506231295 profit
stock 14: 105--155 for 9656.65696519039 profit
stock 15: 115--155 for 9217.564167062801 profit
stock 16: 125--170 for 8774.372948268736 profit
stock 17: 135--180 for 8153.379724528141 profit


stock 0: 4.25--54 for 11874.329929354284 profit
stock 1: 4.75--63.25 for 12718.065772228056 profit
stock 2: 4.5--65.25 for 12761.468559677403 profit
stock 3: 5.75--77.25 for 13927.446721468792 profit
stock 4: 10.75--95.25 for 14498.795282536998 profit
stock 5: 13--101.75 for 13715.383147137602 profit
stock 6: 23.25--114 for 12228.601081327008 profit
stock 7: 35.5--115.25 for 13406.973482259902 profit
stock 8: 46--127.75 for 12262.593868485097 profit
stock 9: 53--128.25 for 12721.556247348977 profit
stock 10: 65.5--132.75 for 13016.315478684284 profit
stock 11: 72.75--133.75 for 12035.529468717403 profit
stock 12: 83.25--141 for 11134.725448119754 profit
stock 13: 94.5--142.75 for 10795.6925927153 profit
stock 14: 102.75--152.75 for 10343.813668943167 profit
stock 15: 112.75--157.25 for 9800.139429019937 profit
stock 16: 122.75--168 for 8769.961918667066 profit
stock 17: 132.75--179.5 for 8332.524797149534 profit


stock 0: 4.2875--53.95 for 11257.257620463932 profit
stock 1: 4.675--63.1375 for 12552.994608227567 profit
stock 2: 4.475--65.3125 for 12541.542244395696 profit
stock 3: 5.6375--77.3 for 14537.061136231514 profit
stock 4: 10.65--95.3625 for 13355.537327889393 profit
stock 5: 12.9125--101.8625 for 13028.872531309187 profit
stock 6: 23.1375--114.1 for 14211.046142079786 profit
stock 7: 35.3875--115.3625 for 14191.433121828284 profit
stock 8: 45.9--127.8625 for 12335.46517188505 profit
stock 9: 52.925--128.35 for 12877.753483863478 profit
stock 10: 65.4625--132.85 for 12404.444415165151 profit
stock 11: 72.6625--133.7625 for 11855.015706695236 profit
stock 12: 83.1375--140.9625 for 11631.36757998806 profit
stock 13: 94.3875--142.85 for 11484.554022132057 profit
stock 14: 102.6375--152.8625 for 9321.94793681067 profit
stock 15: 112.6375--157.3625 for 9584.168892144786 profit
stock 16: 122.85--167.9375 for 8872.15971323951 profit
stock 17: 132.65--179.6125 for 8776.885994457709 profit
*/