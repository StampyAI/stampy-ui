/**
 * This is a script to refresh the mock return data for tests.
 */

import * as fs from 'fs'
import * as https from 'https'
import * as path from 'path'
import * as toml from 'toml'
import {URL} from 'url'

export const questionIds = [8486]

async function main(): Promise<void> {
  const codaToken = readCodaToken()
  await Promise.all(
    questionIds.map(async (questionId) => {
      const data = await getData(questionId, codaToken)
      await writeFile(questionId, data)
    })
  )
}

const getData = async (questionId: number, codaToken: string) => {
  const options = {
    hostname: 'coda.io',
    port: 443,
    path: `/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22UI%20ID%22:%22${questionId}%22`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${codaToken}`,
    },
  }

  return await httpGet(options)
}

const httpGet = (options: string | https.RequestOptions | URL): Promise<string> =>
  new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''

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

const writeFile = (questionId: number, data: string): Promise<void> => {
  const filename = `question-${questionId}.json`
  const filePath = path.join(__dirname, filename)

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('An error occurred:', err)
        reject(err)
      } else {
        console.log('File has been written successfully.')
        resolve()
      }
    })
  })
}

const readCodaToken = (): string => {
  const wranglerToml = fs.readFileSync('wrangler.toml', 'utf8')
  const config = toml.parse(wranglerToml)
  const codaToken: string = config.vars.CODA_TOKEN
  return codaToken
}

main()
