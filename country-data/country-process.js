(async () => {
  const _ = require('lodash')
  const fs = require('fs')
  const org = await fs.readFileSync('./all.json', 'utf-8')
  const dict = await fs.readFileSync('../dict.json', 'utf-8')
  const orgFormat = JSON.parse(org)
  const dictFormat = JSON.parse(dict)
  const processData = _.map(orgFormat.countries, (i) => {
    _.assign(i, {
      countryName: dictFormat.countries[i.CountryId],
      totalPotential: i.Characteristics[1].PotentialSales + i.Characteristics[2].PotentialSales,
      costPerPotentialSales: _.toNumber(_.toString((i.RequiredFTEForHeadQuarters * i.Remuneration + i.AdditionalStaffInCountry * 3300 + i.PenetrationMarketingCosts + i.CostsBeingActive) / (i.Characteristics[1].PotentialSales + i.Characteristics[2].PotentialSales)).slice(0, 5))
    })
    return i
  })
  console.log('processData', processData[0])
  fs.writeFileSync('./all-process.json', JSON.stringify(processData))
})()
