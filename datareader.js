const fs = require('fs')
const readline = require('readline');

const months = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12
};

var data = [];
var highestVariance = null;
var buyLow = null;
var sellHigh = null;

function parseLine(line) {
    let result = {};
    let match = line.split(/\t/g);
    result.date = match[0];
    let date = match[0].split(/-/g);
    result.year = ~~date[0] + 2000;
    result.month = months[date[1]];
    result.monthname = date[1];
    result.day = date[2];
    result.open = ~~match[1];
    result.high = ~~match[2];
    if (!sellHigh || (
        result.low >= sellHigh.low &&
        result.year >= sellHigh.year &&
        result.month >= sellHigh.month &&
        result.day >= sellHigh.day)
    ) {
        sellHigh = result;
    }
    result.low = ~~match[3];
    if (!buyLow || (
        result.low <= buyLow.low &&
        result.year <= buyLow.year &&
        result.month <= buyLow.month &&
        result.day <= buyLow.day)
    ) {
        buyLow = result;
    }
    result.close = ~~match[4];
    result.variance = result.high - result.low;
    if (!highestVariance || result.variance > highestVariance) {
        highestVariance = result;
    }
    result.volume = match[5];
    data.push(result);
}

function formatDate(item) {
    return `${item.year}-${item.monthname}-${item.day}`;
}

exports.getHighestVariance = () => {
    return formatDate(highestVariance);
}

exports.getBestProfit = () => {
    return {
        buy: formatDate(buyLow),
        sell: formatDate(sellHigh)
    };
}

exports.readfile = async (filename) => {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let linesCount = 0;
  for await (const line of rl) {
    if (linesCount > 0)
        parseLine(line)
    linesCount += 1;
  }
  return data;
}
