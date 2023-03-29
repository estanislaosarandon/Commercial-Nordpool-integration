import nordpool from 'nordpool';
import dayjs from 'dayjs';
import dayjsPluginUtc from 'dayjs/plugin/utc.js';
import dayjsPluginTimezone from 'dayjs/plugin/timezone.js';
dayjs.extend(dayjsPluginUtc) // Used by timezone
dayjs.extend(dayjsPluginTimezone) // Used to convert from one timezone to another

const formatter = new Intl.NumberFormat('se-SE', {style: 'currency', currency: 'SEK'})
const opts = {
  area: 'SE4', // See http://www.nordpoolspot.com/maps/
  currency: 'SEK' // can also be 'DKK', 'EUR', 'NOK'
}

const prices = new nordpool.Prices();

const run = async () => {
  let results
  try {
    results = await prices.hourly(opts)
  } catch (error) {
    console.error(error)
    return
  }
  for (let i = 0; i < results.length; i++) {
    const date = results[i].date
    const price = results[i].value
    const time = dayjs.tz(date, 'UTC').tz('Europe/Stockholm').format('D.M. H:mm')
    console.log(time + '\t' + formatter.format(price) + '/MWh')
  }
}
run()

// IoTNode
// {
//   "name": "estani_test",
//   "description": "test node",
//   "nodeType": "string",
//   "rabbitRouting": {
//       "value": "publisher"
//   },
//   "_id": "642442e2b231e8e97722605a",
//   "synchronizedAt": "2023-03-29T13:53:38.257Z"
// }
