const express = require('express')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev })
const handle = app.getRequestHandler()
const axios = require('axios')

var siteMap;

axios.get('http://reprep.umb.feux.digital/Umbraco/Api/Content/GetSiteMap')
  .then(response => {
    siteMap = response.data;
  })
  .catch(error => {
  });

app.prepare()
  .then(() => {
    const server = express()
    siteMap.map(item => (

      server.get(item.url, (req, res) => {
        app.render(req, res, item.jsFile, req.query)
      })
    ))

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3001, (err) => {
      if (err) throw err
      console.log("ready on http://localhost:3001");
    })
  })
