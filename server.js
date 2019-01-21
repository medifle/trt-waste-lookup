const express = require('express')
const app = express()
const path = require('path')
const request = require('request') //npm module for easy http requests

const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public' //root directory for our static pages

// Middleware
app.use(express.json()) //get body payload for post method in express
app.use(express.static(path.join(__dirname, ROOT_DIR))) //provide static server

let data
// let cache = new Map() TODO:

request(
  `https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000`,
  {json: true},
  function(error, response, body) {
    if (error) console.log(error, body)
    if (!error && response.statusCode == 200) {
      data = body
    }
  }
)

const testPotentialKeywords = (target, keywords) => {
  let str1 = keywords.replace(/[\(\)]/g, '') // remove parentheses
  let str2 = keywords.replace(/[\(\)\s]/g, '') // remove parentheses and whitespace
  let targetCondensed = target.replace(/ /g, '')
  return (
    str1.includes(target) ||
    str2.includes(target) ||
    str1.includes(targetCondensed) ||
    str2.includes(targetCondensed)
  )
}

const lookupWaste = (req, res) => {
  let {waste} = req.body
  let resData = []
  if (data) {
    data.forEach(item => {
      if (testPotentialKeywords(waste, item.keywords)) {
        resData.push(item)
      }
    })
    res.send({resData})
  }
}

// Routes
app.post('/waste', function(req, res) {
  console.log('req_body', req.body)
  lookupWaste(req, res)
})

// Error handler
app.use(function(req, res) {
  res.sendFile(__dirname + '/public/404.html')
})

// Start server
app.listen(PORT, err => {
  if (err) console.log(err)
  console.log(`http://localhost:3000/`)
})
