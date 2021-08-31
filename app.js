const fs = require('fs');
const datareader = require('./datareader');

async function main() {
  const data = await datareader.readfile('datafile.dat');

  let content = '';
  
  // highest variance is captured on load for performance
  content += `Highest variance: ${datareader.getHighestVariance()}\n`;
  
  // we'll assume that filtering data to a month would be more
  // dynamically requested and not store it on load
  let matches = 0;
  let sum = 0;
  data.map(item => {
    if (item.year === 2012 && item.month === 7) {
      matches += 1;
      sum += item.volume;
    }
  });
  content += `Average for July-2012: ${sum / matches}\n`;

  // finding the best day(s) for max profit
  const buysell = datareader.getBestProfit();
  content += `Max profit would buy on: ${buysell.buy} and sell on ${buysell.sell}\n`;


  fs.writeFile('./output.txt', content, err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(content);
  })
}

main();