(async () => {
  const _ = require('lodash')
  const fs = require('fs')
  const market = await fs.readFileSync('./market-2020.json', 'utf-8')
  const dict = await fs.readFileSync('./dict.json', 'utf-8')
  const marketFormat = JSON.parse(market)
  const dictFormat = JSON.parse(dict)
  const marketProcess = _.map(marketFormat.DemandSummaries, (i) => {
    i.countryName = dictFormat.countries[i.CountryId]
    i.marketName = dictFormat.marketName[i.Market]
    i.NumberOfCompetitors = _.find(marketFormat.Characteristics, { CountryId: i.CountryId }).NumberOfCompetitors
    return i
  })
  const rebuiltData = {}
  _.forEach(marketProcess, (i) => {
    if (!rebuiltData[i.countryName]) {
      rebuiltData[i.countryName] = {
        countryName: i.countryName,
        countryId: i.CountryId,
        NumberOfCompetitors: i.NumberOfCompetitors,
        PotentialSales: [],
        OwnSales: [],
        customerRatio: 0,
        qualityRatio: 0,
        twoRatio: 0,
        threeRatio: 0,
      }
    }
    rebuiltData[i.countryName].PotentialSales[i.Market - 1] = i.PotentialSales
    rebuiltData[i.countryName].OwnSales[i.Market - 1] = i.OwnSales
  })
  for (const i in rebuiltData) {
    if (rebuiltData.hasOwnProperty(i)) {
      _.assign(rebuiltData[i], {
        customerRatio: _.toNumber(_.toString(rebuiltData[i].OwnSales[2] / rebuiltData[i].PotentialSales[2] * 100).slice(0, 5)),
        qualityRatio: _.toNumber(_.toString(rebuiltData[i].OwnSales[1] / rebuiltData[i].PotentialSales[1] * 100).slice(0, 5)),
        twoRatio: _.toNumber(_.toString((rebuiltData[i].OwnSales[1] + rebuiltData[i].OwnSales[2]) / (rebuiltData[i].PotentialSales[1] + rebuiltData[i].PotentialSales[2]) * 100).slice(0, 5)),
        threeRatio: _.toNumber(_.toString(_.sum(rebuiltData[i].OwnSales) / _.sum(rebuiltData[i].PotentialSales) * 100).slice(0, 5)),
        revenue: _.sum(rebuiltData[i].OwnSales) * 650,
        purchaseFee: _.sum(rebuiltData[i].OwnSales) * 300,
        grossProfit: _.sum(rebuiltData[i].OwnSales) * (650 - 300),
      })
    }
  }
  console.log('rebuiltData', rebuiltData)
  fs.writeFileSync('./market-process-2020.json', JSON.stringify(rebuiltData))
})()
