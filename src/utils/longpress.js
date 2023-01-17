export function addLongtabListener(target, callback) {
  let timer = 0; // 初始化timer

  target.ontouchstart = () => {
    timer = 0; // 重置timer
    timer = setTimeout(() => {
      callback();
      timer = 0;
    }, 480); // 超时器能成功执行，说明是长按
  };

  target.ontouchmove = () => {
    clearTimeout(timer); // 如果来到这里，说明是滑动
    timer = 0;
  };

  target.ontouchend = () => {
    // 到这里如果timer有值，说明此触摸时间不足380ms，是点击
    if (timer) {
      clearTimeout(timer);
    }
  };
}
