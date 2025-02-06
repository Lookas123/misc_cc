#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <string.h>
#include "xorshift.c"

void calculateSetup(int plotsBase[36], double stn, int setup, double auramult, unsigned int loopcount);
void plotsNice(int plots[36]);
int minMaxDiff(int plots[36], int hole);
//void genHoleOpts(int array[][]);
void calcHoles(int plots[36]);
void trollUser(void);
double randDouble();

int main(void){
    //-1 = empty, otherwise age
    int plotsBase[36]={0};
    //option variables that come from user input
    double stn;
    //0: 6x6, 1: 5x5, 2: poke holes, 3: manual entry
    int setup;
    double auramult;
    unsigned int loopcount;
    printf("\nSeedless to nay multiplier? 0.95: STN, 1: No STN > ");
    scanf("%lf", &stn);
    printf("\nSetup to use? 0: 6x6, 1: 5x5, 2: poke holes, 3: manual age entry 4: text file entry > ");
    scanf("%d", &setup);
    //Initialize plotsBase based on setup
    switch(setup){
        case 0:
            plotsBase[7]=-1;
            plotsBase[10]=-1;
            plotsBase[25]=-1;
            plotsBase[28]=-1;
            break;
        case 1:
            plotsBase[7]=-1;
            plotsBase[9]=-1;
            plotsBase[19]=-1;
            plotsBase[21]=-1;
            break;
        case 2:
            break;
        case 3:
            for(int p = 0; p<36; p++){
                printf("\nRow %d, column %d: ", 1+p/6,1+p%6);
                scanf("%d",plotsBase+p);
            }
            break;
        case 4:
            FILE * file;
            char filename[100];
            printf("\nFile path: ");
            scanf("%s", filename);
            file = fopen(filename, "r");
            for(int p = 0; p<36; p++){
                fscanf(file, "%d", plotsBase+p);
            }
            fclose(file);
            break;
        default:
            trollUser();
            break;
    }
    plotsNice(plotsBase);
    printf("\nSupreme intellect multiplier? 1.055: SI+RB, 1.05: SI, 1.005: RB, 1: No aura > ");
    scanf("%lf", &auramult);
    printf("\nHow many loops to run? > ");
    scanf("%u", &loopcount);
    //Seed random number generator with random number i got from the internet
    sm64_x = time(NULL);
    xs128_s[0]=sm64_nextseed();
    xs128_s[1]=sm64_nextseed();
    xs128_s[2]=sm64_nextseed();
    xs128_s[3]=sm64_nextseed();
    calculateSetup(plotsBase,stn,setup==2,auramult,loopcount);
    return 0;
};

void calculateSetup(int plotsBase[36], double stn, int pokeHoles, double auramult, unsigned int loopcount){
    double jqbaverage=0;
    double tickaverage=0;
    int jqbticks[100]={0};
    //Chance for a jqb in a single spot with wood chips and a given aura mult
    //= chance for any plant / 3
    //3 chances per loop for all plants combined
    //1-3*(auramult-1) chance for 3 loops
    //3*(auramult-1) chance for 4 loops
    //(because randomfloor(3*auramult))
    double jqbpertick = (1- ((1-3*(auramult-1))*pow(0.999,9))-((3*(auramult-1))*pow(0.999,12)) )/3;
    for(unsigned int i = 0; i<loopcount;i++){
        int plots[36];
        memcpy(plots,plotsBase,__SIZEOF_INT__*36);
        int jqb = 0;
        int prevjqb=-1;
        int holes = 0;
        int tickCount = 0;
        for(tickCount=0; (jqb==0 && tickCount<100)||prevjqb<jqb; tickCount++){
            prevjqb=jqb;
            for(int b=0;b<36;b++){
                int c=plots[b];
                if(c >= 0){
                    plots[b]++;
                    plots[b]+=(randDouble() < (1.2 * auramult - 1));
                    if(c>=(int)ceil(80.*stn) && !holes && pokeHoles){calcHoles(plots); holes = 1;}
                }
                else {
                    int canmut=1;
                    int neigh[8] = {b-7,b-6,b-5,b-1,b+1,b+5,b+6,b+7};
                    for(int d=0;d<8;d++){
                        if((neigh[d]<0) || (neigh[d]>36) || (plots[neigh[d]]<(int)ceil(80.*stn)) || (plots[neigh[d]]>=100))  canmut=0;
                    }
                    jqb+=canmut;
                    //if(canmut && a <10){plotsNice(plots);printf("\n%d, %d\n",plots[neigh[0]],(int)ceil(80.*stn));};
                }
            }
        }
        tickaverage+=(double)tickCount/(double)loopcount;
        jqbaverage+=(1-pow(1-jqbpertick,jqb))/loopcount;
        jqbticks[jqb]++;
    }
    printf("\nAverage chance for jqb: %lf, Average ticks per setup: %lf",jqbaverage,tickaverage);
    printf("\nArray of average ticks, from 0 to 99: ");
    for(int i = 0; i<100; i++){
        printf("%d ", jqbticks[i]);
    }
    return;
};

void plotsNice(int plots[36]){
    for(int i = 0; i<36; i++){
        if(! (i%6)) printf("\n");
        printf("%3d ", plots[i]);
    }
    return;
}

int minMaxDiff(int plots[36], int hole){
    int neigh[8] = {hole-7,hole-6,hole-5,hole-1,hole+1,hole+5,hole+6,hole+7};
    int min = 100;
    int max = 0;
    for(int d=0;d<8;d++){
        int age = plots[neigh[d]];
        if(d>3) age--;
        if(age<min)min = age;
        if(age>max)max = age;
    }
    return max - min;
}

void calcHoles(int plots[36]){
    //Goofy ahh array of all the possible holes, generated by js snippet
    int holeOptions[79][4]={{7,9,19,21},{7,9,19,22},{7,9,19,27},{7,9,19,28},{7,9,20,22},{7,9,20,28},{7,9,25,21},{7,9,25,22},{7,9,25,27},{7,9,25,28},{7,9,26,22},{7,9,26,28},{7,10,19,21},{7,10,19,22},{7,10,19,27},{7,10,19,28},{7,10,20,22},{7,10,20,28},{7,10,25,21},{7,10,25,22},{7,10,25,27},{7,10,25,28},{7,10,26,22},{7,10,26,28},{7,15,19,27},{7,15,19,28},{7,15,25,27},{7,15,25,28},{7,15,26,28},{7,16,19,27},{7,16,19,28},{7,16,20,28},{7,16,25,27},{7,16,25,28},{7,16,26,28},{8,10,19,21},{8,10,19,22},{8,10,19,27},{8,10,19,28},{8,10,20,22},{8,10,20,28},{8,10,25,21},{8,10,25,22},{8,10,25,27},{8,10,25,28},{8,10,26,22},{8,10,26,28},{8,16,19,27},{8,16,19,28},{8,16,20,28},{8,16,25,27},{8,16,25,28},{8,16,26,28},{13,9,25,21},{13,9,25,22},{13,9,25,27},{13,9,25,28},{13,9,26,22},{13,9,26,28},{13,10,25,21},{13,10,25,22},{13,10,25,27},{13,10,25,28},{13,10,26,22},{13,10,26,28},{13,15,25,27},{13,15,25,28},{13,15,26,28},{13,16,25,27},{13,16,25,28},{13,16,26,28},{14,10,25,22},{14,10,25,27},{14,10,25,28},{14,10,26,22},{14,10,26,28},{14,16,25,27},{14,16,25,28},{14,16,26,28}};
    int bestSum = INT_MAX;
    int bestHoles=0;
    for(int i = 0; i<79;i++){
       int sum = minMaxDiff(plots,holeOptions[i][0])+minMaxDiff(plots,holeOptions[i][1])+minMaxDiff(plots,holeOptions[i][2])+minMaxDiff(plots,holeOptions[i][3]); 
        if(sum<bestSum){
            bestSum=sum;
            bestHoles = i;
        }
    }
    plots[holeOptions[bestHoles][0]]=-1;
    plots[holeOptions[bestHoles][1]]=-1;
    plots[holeOptions[bestHoles][2]]=-1;
    plots[holeOptions[bestHoles][3]]=-1;
    //console.log(garden, bestSum, bestHoles)
    return;
}

void trollUser(void){
    printf("\nYou idiot, you fool, you absolute buffoon");
    exit(1);
}

double randDouble(){
    return ((xs128_next() >> 11) * 0x1.0p-53);
}