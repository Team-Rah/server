module.exports = {
  addTimeFromNow: (min) => {
    let timer = new Date(); //gives me the current date
    let getCurrentTime = timer.getTime();
    let addedTime = getCurrentTime + (min * 60000);
    let newTimer = new Date(addedTime);
    return newTimer.getTime();
  }
};
