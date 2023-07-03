/**
 * This is a script to refresh the mock return data for tests.
 * This script only needs to make CODA REQUESTS because THIS IS THE DATA THAT IS MOCKED!
 */

import * as fs from 'fs'
import * as https from 'https'

async function main(): Promise<void> {
  const foo = await fetchQuestionDetails()
  console.log(foo)
  makeRequest()
}

const makeRequest = () => {
  const token = '7b71af6a-3ac7-41cd-ad58-db38dabc024e'
  const options = {
    hostname: 'coda.io',
    port: 443,
    path: '/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22Name%22:%22%60%60%602400%60%60%60%22',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const req = https.request(options, (res) => {
    let data = ''

    console.log(`StatusCode: ${res.statusCode}`)

    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', () => {
      console.log(JSON.parse(data))
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.end()
}

async function fetchQuestionDetails() {
  console.log('works')
  // const questionDetail = await loadQuestionDetail('NEVER_RELOAD', '2400')
  // console.log(questionDetail.timestamp)
}

// const data = 'Hello, world!' // The content you want to write to the file
// const filePath = 'path/to/file.txt' // The path to the file you want to write

// fs.writeFile(filePath, data, (err) => {
//   if (err) {
//     console.error('An error occurred:', err)
//     return
//   }
//   console.log('File has been written successfully.')
// })

main()
