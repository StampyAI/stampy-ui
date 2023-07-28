/**
 * This is a script to refresh the mock return data for tests.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as toml from 'toml'

export const questionIds = ['8486']

async function main(): Promise<void> {
  const codaToken = readCodaToken()
  await Promise.all(
    questionIds.map(async (questionId) => {
      const data = await getData(questionId, codaToken)
      await writeFile(questionId, data)
    })
  )
}

const getData = async (questionId: string, codaToken: string) => {
  const options = {
    headers: {
      Authorization: `Bearer ${codaToken}`,
    },
  }
  const url = `https://coda.io/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22UI%20ID%22:%22${questionId}%22`
  const response = await fetch(url, options)
  const body = await response.json()
  return JSON.stringify(body)
}

const writeFile = (questionId: string, data: string): Promise<void> => {
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
