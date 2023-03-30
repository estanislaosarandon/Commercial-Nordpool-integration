import nordpool from 'nordpool';
import dayjs from 'dayjs';
import dayjsPluginUtc from 'dayjs/plugin/utc.js';
import dayjsPluginTimezone from 'dayjs/plugin/timezone.js';

dayjs.extend(dayjsPluginUtc); // Used by timezone
dayjs.extend(dayjsPluginTimezone); // Used to convert from one timezone to another

const username = 'estani';
const password = 'test';
const nodeId = '642442e2b231e8e97722605a';
const pricesArray = [];
let token;
const now = new Date();

const formatter = new Intl.NumberFormat('se-SE', {style: 'currency', currency: 'SEK'});
const opts = {
  area: 'SE4',
  currency: 'SEK', // can also be 'DKK', 'EUR', 'NOK'
};

const prices = new nordpool.Prices();

const run = async () => {
  let results;
  try {
    results = await prices.hourly(opts);
  } catch (error) {
    console.error(error);
    return;
  }
  for (let i = 0; i < results.length; i++) {
    const date = results[i].date;
    const price = results[i].value;
    const time = dayjs.tz(date, 'UTC').tz('Europe/Stockholm').format('D.M. H:mm');
    const priceStr = price; 
    pricesArray.push(priceStr);    
  }
  publish(pricesArray[now.getHours()], token);
};

const getToken = async () => {
  try {
    const response = await fetch('https://staging.yggio.net/api/auth/local', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const token = data.token;
    return token;
  } catch (error) {
    console.error('There was a problem with the API request:', error);
  }
};

const publish = async (value, token) => {
  try {
    if (!token) {
      token = await getToken();
    }
    const response = await fetch(`https://staging.yggio.net/api/iotnodes/${nodeId}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'estani_test',
        price: value,
        timestamp: now
      })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There was a problem with the API request:', error);
  }
};    

const runAtNextHour = () => {
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), + 1, 1, 0);
  //const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds + 5, 0);
  console.log('Next hour:', nextHour);
  const delay = nextHour - now;
  console.log('Delay:', delay);
  setTimeout(() => {
    run();
    setInterval(run, 60 * 60 * 1000);
    //setInterval(run, 10 * 1000); // run every hour after the first run
  }, delay);
}

runAtNextHour(); // start the cycle
//run(); // run once
