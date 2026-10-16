export class Timer {
    initTime;
    constructor() {
        this.initTime = performance.now();
    }
    getTime() {
        return (performance.now() - this.initTime) / 1000;
    }
    resetTimer() {
        this.initTime = performance.now();
    }
}
