javascript:(()=>{
    const maxBackfire=0.4665;
    const minBackfire=0.03;
    const maxCasts=100;
    function fthofcalc(spells, change){
        Math.seedrandom(Game.seed+'/'+spells);
        const backfire = Math.random();
        Math.random();Math.random();
        if(change){Math.random()}
        if(backfire<1-maxBackfire){
            var choices=[];
            choices.push('frenzy','multiply cookies', 'click frenzy');
            if (Math.random()<0.1) choices.push('cookie storm','cookie storm','blab');
            if (Math.random()<0.25) choices.push('building special');
            if (Math.random()<0.15) choices=['cookie storm drop'];
            if (Math.random()<0.0001) choices.push('free sugar lump');
            if(choose(choices)=="free sugar lump") return true;
        }
        if(backfire>1-minBackfire){
            var choices=[];
			choices.push('clot','ruin cookies');
			if (Math.random()<0.1) choices.push('cursed finger','blood frenzy');
			if (Math.random()<0.003) choices.push('free sugar lump');
			if (Math.random()<0.1) choices=['blab'];
            if(choose(choices)=="free sugar lump") return true;
        }
    
    }
    function a(){
        let allTime = Game.Objects["Wizard tower"].minigame.spellsCastTotal;
        for(let i = allTime; i<allTime+maxCasts; i++){
            if(fthofcalc(i,false)||fthofcalc(i, true)){alert("Sweet found at "+i+" spells cast"); console.log(i);}
        }
    };
    eval('Game.Reset='+Game.Reset.toString().replace("Game.cookiesMultByType={};","Game.cookiesMultByType={};a();"))
})()