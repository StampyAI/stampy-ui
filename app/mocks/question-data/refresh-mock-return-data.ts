/**
 * This is a script to refresh the mock return data for tests.
 */

import * as fs from 'fs'
import * as https from 'https'
import * as path from 'path'
import {URL} from 'url'
import {questions} from './question-list'

async function main(): Promise<void> {
  await Promise.all(
    questions.map(async (question) => {
      const questionId = question[0]
      const data = await getData(questionId)
      await writeFile(questionId, data)
    })
  )
}

const getData = async (questionId: number) => {
  const token = 'GET FROM ENV'
  const options = {
    hostname: 'coda.io',
    port: 443,
    path: `/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22UI%20ID%22:%22${questionId}%22`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return await httpGet(options)
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

const writeFile = async (questionId: number, data: string) => {
  const filename = `question-${questionId}.json`
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
