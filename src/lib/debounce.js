// debounce function 接受兩個參數
// 一是：要執行的 function
// 二是：要延遲的豪秒數，這邊預設 500 毫秒
export function debounce(fn, delay = 500) {
  let timer;

  // debounce function 最終會回傳一個 function
  return (...args) => {
    // 每一次 debounce function 被觸發時，會先清除之前的 timer，避免觸發先前的 fn 函式
    // 因此只要在 delay 時間內觸發 debounce function，就會一直清除先前的 timer，避免 fn 一直被執行
    clearTimeout(timer);
    // 清除之後，再重新計時
    // 當 delay 時間到時，執行 fn
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}