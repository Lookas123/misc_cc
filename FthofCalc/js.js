//Success pool:
//F L, CF, Storm Storm Blab, BS, Drop, Sweet
//Backfire pool
//Clot Ruin, Cuf Ef, Sweet, Blab 

//Generate a list of possible pools with the given conditions
function poolArray(backfire, df){
    const size = backfire?4:6;
    const overrideSpot = backfire?3:4;
    //Array of possible pools
    const pools = [];
    //Loop through every possible pool of given size
    for(let i=0; i<(2**size);i++){
        let pool=[];
        let n=i;
        //Convert number to pool
        for (let a = 0; a < size;a++){
            n-=(pool[a]=n%2);
            n/=2;
        }
        //Check for contradictions
        if(pool[overrideSpot] === 1 && pool.indexOf(1)<overrideSpot) continue;
        if(pool[0] === 0 && pool[overrideSpot] === 0) continue;
        if(!backfire && pool[1] === Number(df) && pool[overrideSpot] === 0) continue;
        pools.push(pool);
    }
    return pools;
}

//Convert a condensed pool (each element is one batch of effects) to an expanded pool (each element is one effect)
function expandPool(backfire, pool){
    let expanded = [];
    if(backfire){
        //guaranteed: clot/ruin
        expanded.push(pool[0]);
        expanded.push(pool[0]);

        //call 1: cuf/ef
        expanded.push(pool[1]);
        expanded.push(pool[1]);

        //call 2: sweet
        expanded.push(pool[2]);

        //call 3: blab
        expanded.push(pool[3]);
    }
    else{
        //guaranteed: frenzy/lucky
        expanded.push(pool[0]);
        expanded.push(pool[0]);

        //conditional: cf
        expanded.push(pool[1]);

        //call 1: storm storm blab
        expanded.push(pool[2]);
        expanded.push(pool[2]);
        expanded.push(pool[2]);

        //call 2: bs
        expanded.push(pool[3]);

        //call 3: storm drop
        expanded.push(pool[4]);

        //call 4: sweet
        expanded.push(pool[5]);
    }
    return expanded;
}

function createRange(min, max){
    return {min:min, max:max};
}

//what is the chance for a random value in a known range to be in another range
function randChanceWithKnown(rand, known){
    known ??= createRange(0,1);
    const max = Math.min(rand.max, known.max);
    const min = Math.max(rand.min, known.min);
    if(max<min) return 0;
    //if the known is a single point, is it within the range?
    if(known.max === known.min) return (max==min)?1:0;
    return (max-min)/(known.max-known.min);
}

//Calculate chance for a pool based on a known set of ranges (or without one)
function poolChanceWithKnowns(backfire, pool, knowns){
    let chance = 1;
    knowns??=new Array(4).fill(createRange(0,1));
    if(backfire){
        //override blab
        if(pool[3] === 1) return randChanceWithKnown(createRange(0,0.1), knowns[2]);
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
        if(pool[4] === 1) return chance*randChanceWithKnown(createRange(0,0.15), knowns[2]);
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

//Convert a pool into a set of known ranges
function poolToKnowns(backfire, pool){
    let knowns=[];
    if(backfire){
        //override blab
        if(pool[3] === 1) return [createRange(0,1),createRange(0,1),createRange(0,0.1)];
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
        if(pool[4] === 1) return [createRange(0,1),createRange(0,1),createRange(0,0.15),knowns[3]];
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
//Calls createTable based on input elements
const startBackfire = document.getElementById('startBackfire');
const startChange = document.getElementById('startChange');
const startDF = document.getElementById('startDF');
const startBS = document.getElementById('startBS');
const endBackfire = document.getElementById('endBackfire');
const endChange = document.getElementById('endChange');
const endDF = document.getElementById('endDF');
const endBS = document.getElementById('endBS');
const preRangeMin = document.getElementById('preRangeMin');
const preRangeMax = document.getElementById('preRangeMax');
const postRangeMin = document.getElementById('postRangeMin');
const postRangeMax = document.getElementById('postRangeMax');
function generateTable() {
    const startCond = {
        backfire: startBackfire.checked,
        change: startChange.checked,
        df: startDF.checked,
        bs: startBS.checked
    };

    const endCond = {
        backfire: endBackfire.checked,
        change: endChange.checked,
        df: endDF.checked,
        bs: endBS.checked
    };
    
    const preRangeMinV = preRangeMin.valueAsNumber;
    const preRangeMaxV = preRangeMax.valueAsNumber;
    const postRangeMinV = postRangeMin.valueAsNumber;
    const postRangeMaxV = postRangeMax.valueAsNumber;

    const preRange = createRange(preRangeMinV, preRangeMaxV);
    const postRange = createRange(postRangeMinV, postRangeMaxV);
    createTable(startCond, endCond, preRange, postRange);
}