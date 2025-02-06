import {Fraction} from 'bigint-fraction'
const bifur = new Fraction(3,20); //0.10 no sucralosis, 0.15 yes sucralosis
const meat = new Fraction(3,10); //0.1*gpoc stage
const caram = new Fraction(1,50)
const golden = new Fraction(3,1000)
let chances=[golden,caram,bifur,meat,golden,caram,bifur,meat,golden,caram,bifur,meat]
let output=[];
for(let i = 0; i<= 12; i++)output.push(new Fraction());
let loops=2; //10% chance to add a loop with reality bending, +1 pool with dragon's curve
for(let i=0; i<=(2**(loops*4))-1;i++){
    let pool=[];
    let n=i;
    for (let a = 0; a < loops * 4;a++){
        n-=(pool[a]=n%2);
        n/=2;
    }
    let chanceforpool=new Fraction(1);   
    let poolcount=1;
    for (let a = 0; a < loops * 4;a++){
        let chance = chances[a];
        let achance = new Fraction(1)
        achance.subtract(chance.clone())
        chanceforpool.multiply(pool[a]?chance:achance)
        poolcount+=pool[a];
    }
    //console.log(chanceforpool, poolcount, pool)
    for (let a = 0; a < loops * 4;a++){
        if(pool[a]){
            let c = chanceforpool.clone()
            c.divide(poolcount)
            output[a].add(c)
        }
    }
}
for(let a = -5+loops*4; a>-1; a--){
output[a].add(output[a+4])
output[a+4]=undefined;
}
let normal = new Fraction(1);
for (let i = 0; i < 4; i++) {
normal.subtract(output[i]);
}
normal.reduce();for(let i = 0; i<4; i++){output[i].reduce()}
function log(frac){return frac.numerator+"/"+frac.denominator}
console.log(log(normal)+"\n"+log(output[3])+"\n"+log(output[2])+"\n"+log(output[1])+"\n"+log(output[0]));