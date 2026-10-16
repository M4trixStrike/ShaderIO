
export class Timer{

    private initTime: number;

    constructor(){

        this.initTime = performance.now();

    }

    getTime(): number{

        return ( performance.now() - this.initTime ) / 1000;

    }

    resetTimer(): void{

        this.initTime = performance.now();

    }

}