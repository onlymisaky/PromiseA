const sleep = (ms = 1) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}


(async () => {

    await sleep(1000);

    console.log('睡了1s，嘛事没有!');

    await sleep(2000);

    console.log('我再睡2s');

})();

console.log('你睡觉我干活，真羡慕！');
