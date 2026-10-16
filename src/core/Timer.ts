
export class Timer{

    private initTime: number;

    constructor(){

        this.initTime = Date.now();

    }

    getTime(): number{

        return ( Date.now() - this.initTime ) / 1000;

    }

    resetTimer(): void{

        this.initTime = Date.now();

    }

}