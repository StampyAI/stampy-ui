/**
 * This is a script to refresh the mock return data for tests.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as toml from 'toml'
import {QUESTION_DETAILS_TABLE, makeCodaRequest} from '../../server-utils/coda-urls'

export const questionIds = ['0']

async function main(): Promise<void> {
  const codaToken = readCodaToken()
  const data = await Promise.all(
    questionIds.map(async (questionId) => {
      const codaUrl = makeCodaRequest({
        table: QUESTION_DETAILS_TABLE,
        queryColumn: 'UI ID',
        queryValue: questionId,
      })
      console.log(`Fetching ${codaUrl}`)
      const responseData = await getData(codaUrl, codaToken)
      return {url: codaUrl, httpMethod: 'GET', responseData: JSON.parse(responseData)}
    })
  )
  const writeData = JSON.stringify(data, null, 2)
  await writeFile(writeData)
}

const getData = async (url: string, codaToken: string) => {
  const options = {
    headers: {
      Authorization: `Bearer ${codaToken}`,
    },
  }
  const response = await fetch(url, options)
  const body = await response.json()
  return JSON.stringify(body)
}

const writeFile = (data: string): Promise<void> => {
  const filename = `cached-coda-responses.json`
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
