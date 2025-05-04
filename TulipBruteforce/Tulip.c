#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <string.h>

void plotsNice(int plots[36]);

int main(void){
    double bestEff = 0;
    int bestPlots[36]={0};
    long long printSpot = 0;
    double tulipEff[9] = {1,1.25,1.5625,1.953125,2.44140625,3.0517578125,3.81469726563,4.76837158203,5.96046447754};
    long long cap = 1LL<<36;
    for (long long i = 0; i < cap; i++)
    {
        long long n = i;
        int plots[36]={0};
        int buffs[36]={0};
        double eff = 0;
        for(int p = 0; p<36; p++){
            plots[p] = n%2;
            n/=2;
            #define APPLYBUFF(n) buffs[n]+=(n>-1&&n<36)
            if(plots[p]){
                if(p%6!=0){
                    APPLYBUFF(p-7);
                    APPLYBUFF(p-1);
                    APPLYBUFF(p+5);
                }
                if(p%6!=5){
                    APPLYBUFF(p-5);
                    APPLYBUFF(p+1);
                    APPLYBUFF(p+7);
                }
                APPLYBUFF(p-6);
                APPLYBUFF(p+6);
            }
        }
        for(int p = 0; p<36; p++){
            if(!plots[p]){eff+=tulipEff[buffs[p]];}
        }
        if(eff>bestEff){
            bestEff=eff;
            memcpy(bestPlots,plots,sizeof(bestPlots));
        }
        if(i == printSpot){
            printf("\n%lli", i);
            printSpot+=10000000;
        }
    }
    
    plotsNice(bestPlots);
    printf("\n%lf", bestEff);
    return 0;
};

void plotsNice(int plots[36]){
    for(int i = 0; i<36; i++){
        if(! (i%6)) printf("\n");
        printf("%3d ", plots[i]);
    }
    return;
}