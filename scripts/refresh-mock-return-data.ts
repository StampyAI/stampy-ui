/**
 * This is a script to refresh the mock return data for tests.
 * This script only needs to make CODA REQUESTS because THIS IS THE DATA THAT IS MOCKED!
 */

import * as fs from 'fs'
import * as https from 'https'
import * as path from 'path'
import {URL} from 'url'

async function main(): Promise<void> {
  const data = await getData()
  await writeFile(data)
}

const httpGet = (options: string | https.RequestOptions | URL): Promise<string> =>
  new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''

      console.log(`StatusCode: ${res.statusCode}`)

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve(data)
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })

const getData = async () => {
  const token = 'GET FROM ENV'
  const options = {
    hostname: 'coda.io',
    port: 443,
    path: '/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22UI%20ID%22:%228486%22',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return await httpGet(options)
}

const writeFile = async (data: string) => {
  const filename = 'myfile.json'
  const filePath = path.join(__dirname, filename)
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('An error occurred:', err)
      return
    }
    console.log('File has been written successfully.')
  })
}

main()
