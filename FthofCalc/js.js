//Success pool:
//F L, CF, Storm Storm Blab, BS, Drop, Sweet
//Backfire pool
//Clot Ruin, Cuf Ef, Sweet, Blab 


function poolArray(backfire, df){
    const size = backfire?4:6;
    const overrideSpot = backfire?3:4;
    const pools = [];
    for(let i=0; i<(2**size);i++){
        let pool=[];
        let n=i;
        for (let a = 0; a < size;a++){
            n-=(pool[a]=n%2);
            n/=2;
        }
        //if this isn't a possible pool due to pool overriding, don't add it
        if(pool[overrideSpot] === 1 && pool.indexOf(1)<overrideSpot) continue;
        if(pool[0] === 0 && pool[overrideSpot] === 0) continue;
        if(!backfire && pool[1] === df && pool[overrideSpot] === 0) continue;
        pools.push(pool);
    }
    return pools;
}

function expandPool(backfire, pool){
    let expanded = [];
    if(backfire){
        expanded.push(pool[0]);
        expanded.push(pool[0]);

        expanded.push(pool[1]);
        expanded.push(pool[1]);

        expanded.push(pool[2]);

        expanded.push(pool[3]);
    }
    else{
        expanded.push(pool[0]);
        expanded.push(pool[0]);

        expanded.push(pool[1]);

        expanded.push(pool[2]);
        expanded.push(pool[2]);
        expanded.push(pool[2]);

        expanded.push(pool[3]);

        expanded.push(pool[4]);

        expanded.push(pool[5]);
    }
    return expanded;
}

function createRange(min, max){
    return {min:min, max:max};
}

function randChanceWithKnown(rand, range){
    range ??= createRange(0,1);
    const max = Math.min(rand.max, range.max);
    const min = Math.max(rand.min, range.min);
    if(max<min) return 0
    if(range.max === range.min) return (max==min)?1:0;
    return (max-min)/(range.max-range.min);
}

function poolChanceWithKnowns(backfire, pool, knowns){
    let chance = 1;
    const overrideSpot = backfire?3:4;
    knowns??=new Array(4).fill(createRange(0,1));
    if(backfire){
        //override blab
        if(pool[overrideSpot] === 1) return randChanceWithKnown(createRange(0,0.1), knowns[2]);
        else chance *= randChanceWithKnown(createRange(0.1,1), knowns[2]);
        //cuf/ef
        if(pool[1] === 1) chance *= randChanceWithKnown(createRange(0,0.1), knowns[0]);
        else chance *= randChanceWithKnown(createRange(0.1,1), knowns[0]);
        //sweet
        if(pool[2] === 1) chance *= randChanceWithKnown(createRange(0,0.003), knowns[1]);
        else chance *= randChanceWithKnown(createRange(0.003,1), knowns[1]);
    }else{
        //sweet
        if(pool[5] === 1) chance *= randChanceWithKnown(createRange(0,0.0001), knowns[3]);
        else chance *= randChanceWithKnown(createRange(0.0001,1), knowns[3]);
        //override csd
        if(pool[overrideSpot] === 1) return chance*randChanceWithKnown(createRange(0,0.15), knowns[2]);
        else chance *= randChanceWithKnown(createRange(0.15,1), knowns[2]);
        //storm storm blab
        if(pool[2] === 1) chance *= randChanceWithKnown(createRange(0,0.1), knowns[0]);
        else chance *= randChanceWithKnown(createRange(0.1,1), knowns[0]);
        //bs
        if(pool[3] === 1) chance *= randChanceWithKnown(createRange(0,0.25), knowns[1]);
        else chance *= randChanceWithKnown(createRange(0.25,1), knowns[1]);
    }
    return chance
};

function poolToKnowns(backfire, pool){
    const overrideSpot = backfire?3:4;
    let knowns=[];
    if(backfire){
        //override blab
        if(pool[overrideSpot] === 1) return [createRange(0,1),createRange(0,1),createRange(0,0.1)];
        else knowns[2] = createRange(0.1,1);
        //cuf/ef
        if(pool[1] === 1) knowns[0]=createRange(0,0.1);
        else knowns[0] = createRange(0.1,1);
        //sweet
        if(pool[2] === 1) knowns[1]=createRange(0,0.003);
        else knowns[1] = createRange(0.003,1);
    }else{
        //sweet
        if(pool[5] === 1) knowns[3] = createRange(0,0.0001);
        else knowns[3] = createRange(0.0001,1);
        //override csd
        if(pool[overrideSpot] === 1) return [createRange(0,1),createRange(0,1),createRange(0,0.15),knowns[3]];
        else knowns[2] = createRange(0.15,1);
        //storm storm blab
        if(pool[2] === 1) knowns[0]=createRange(0,0.1);
        else knowns[0] = createRange(0.1,1);
        //bs
        if(pool[3] === 1) knowns[1]=createRange(0,0.25);
        else knowns[1] = createRange(0.25,1);
    }
    return knowns;
}

//conditions format: Object with backfire, change, df, bs
function createTable(startCond, endCond, preRange, postRange){
    startCond.pickIndex = startCond.backfire?3:4;
    endCond.pickIndex = endCond.backfire?3:4;
    const ssize = startCond.backfire?6:9;
    const esize = endCond.backfire?6:9;
    const sPools=poolArray(startCond.backfire, startCond.df);
    const ePools=poolArray(endCond.backfire, endCond.df);
    const resultTable=[];
    const iniChances=new Array(ssize).fill(0);
    for(let i = 0; i<ssize; i++){
        resultTable.push(new Array(esize).fill(0));
    }
    for(let pool of sPools){
        let pchance = 0;
        if(!startCond.bs && !startCond.backfire){
            pchance = poolChanceWithKnowns(startCond.backfire, pool, [undefined, createRange(1,1)]);
        }else{
            pchance = poolChanceWithKnowns(startCond.backfire, pool);
        }
        let knowns = poolToKnowns(startCond.backfire, pool);
        const expanded = expandPool(startCond.backfire, pool);
        let poolNum = 0;
        let poolCount = expanded.reduce((a,c)=>{return a+c});
        let echance = pchance/poolCount;
        for(let eff in expanded){
            if(expanded[eff] === 0) continue;
            knowns[startCond.pickIndex] = createRange(poolNum/poolCount, (poolNum+1)/poolCount);
            poolNum++;
            iniChances[eff]+=echance;
            for(let pool2 of ePools){
                let trimmedKnowns = knowns.slice(0);
                //console.log(trimmedKnowns)
                if(!startCond.bs && !startCond.backfire) trimmedKnowns.splice(1,1);
                if(endCond.change && !startCond.change) trimmedKnowns.shift();
                if(!endCond.change && startCond.change) trimmedKnowns.unshift(preRange);
                if(!endCond.bs && !endCond.backfire) trimmedKnowns.splice(1,0,createRange(1,1))
                trimmedKnowns.push(postRange);
                trimmedKnowns.push(createRange(0,1));
                let p2chance = poolChanceWithKnowns(endCond.backfire, pool2, trimmedKnowns);
                //console.log(p2chance);
                let expanded2 = expandPool(endCond.backfire, pool2);
                let pool2Num = 0;
                let pool2Count = expanded2.reduce((a,c)=>{return a+c});
                for(let eff2 in expanded2){
                    if(expanded2[eff2] === 0) continue;
                    let e2chance = randChanceWithKnown(createRange(pool2Num/pool2Count, (pool2Num+1)/pool2Count), trimmedKnowns[endCond.pickIndex])*p2chance*echance;
                    resultTable[eff][eff2] += e2chance;
                    if(e2chance<0){console.error(createRange(pool2Num/pool2Count, (pool2Num+1)/pool2Count), trimmedKnowns[endCond.pickIndex])};
                    pool2Num++;
                }
            }
        }
    }
    for(let i = 0; i<ssize; i++){
        for(let a = 0; a<esize; a++){
            resultTable[i][a]/=iniChances[i];
        }
    }
    let tableStr = "<table border=\"1px\">";
    //Create top row
    const gcEffs=["Frenzy", "Lucky", "Cf", "Storm1", "Storm2", "Blab", "Bs", "Drop", "Sweet"];
    const wcEffs=["Clot", "Ruin", "Cuf", "Ef", "Sweet", "Blab"];
    tableStr+="<tr>";
    tableStr+="<th>eff2</th>";
    if(startCond.backfire){
        for(let eff of wcEffs)tableStr+="<th>"+eff+"</th>";
    }else{
        for(let eff in gcEffs){
            if((eff==6 && !startCond.bs) || (eff==2 && startCond.df)) continue;
            tableStr+="<th>"+gcEffs[eff]+"</th>";
        }
    }
    for(let i = 0; i<esize; i++){
        tableStr+="<tr>";
        if(endCond.backfire)tableStr+="<td>"+wcEffs[i]+"</td>";
        else tableStr+="<td>"+gcEffs[i]+"</td>";
        for(let a = 0; a<ssize;a++){
            if(!startCond.backfire && ((a==6 && !startCond.bs) || (a==2 && startCond.df))) continue;
            tableStr+="<td>"+resultTable[a][i].toFixed(7)+"</td>";
        }
        tableStr+="</tr>";
    }
    document.getElementById("output").innerHTML=tableStr;
    console.log(iniChances);
    return resultTable;
}

//made by 671
function generateTable() {
    const startCond = {
        backfire: document.getElementById('startBackfire').checked,
        change: document.getElementById('startChange').checked,
        df: document.getElementById('startDF').checked,
        bs: document.getElementById('startBS').checked
    };

    const endCond = {
        backfire: document.getElementById('endBackfire').checked,
        change: document.getElementById('endChange').checked,
        df: document.getElementById('endDF').checked,
        bs: document.getElementById('endBS').checked
    };
    
    const preRangeMin = document.getElementById('preRangeMin').valueAsNumber;
    const preRangeMax = document.getElementById('preRangeMax').valueAsNumber;
    const postRangeMin = document.getElementById('postRangeMin').valueAsNumber;
    const postRangeMax = document.getElementById('postRangeMax').valueAsNumber;

    const preRange = createRange(preRangeMin, preRangeMax);
    const postRange = createRange(postRangeMin, postRangeMax);
    createTable(startCond, endCond, preRange, postRange);
}