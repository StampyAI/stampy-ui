/**
 * This is a script to refresh the mock return data for tests.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as toml from 'toml'
import {
  ALL_ANSWERS_TABLE,
  BANNERS_TABLE,
  QUESTION_DETAILS_TABLE,
  TAGS_TABLE,
  makeCodaRequest,
} from '../../server-utils/coda-urls'

async function main(): Promise<void> {
  const codaRequestsToCache: CodaRequestParams[] = [
    {
      table: QUESTION_DETAILS_TABLE,
      queryColumn: 'UI ID',
      queryValue: '0',
    },
    {
      table: ALL_ANSWERS_TABLE,
    },
    {
      table: TAGS_TABLE,
      queryColumn: 'Internal?',
      queryValue: 'false',
    },
    {
      table: BANNERS_TABLE,
    },
  ]

  const cacheResults: CachedCodaQueries = await Promise.all(
    codaRequestsToCache.map(async (codaParams) => {
      const cachedRequests = await getCodaData(codaParams)
      return {codaParams, cachedRequests}
    })
  )
  const writeData = JSON.stringify(cacheResults, null, 2)
  const filename = `cached-coda-responses.json`
  await writeFile(writeData, filename)
}

export type CachedCodaQueries = Array<CachedCodaQuery>
type CachedCodaQuery = {
  codaParams: CodaRequestParams
  cachedRequests: CachedRequest[]
}
type CodaRequestParams = {
  table: string
  queryColumn?: string
  queryValue?: string
}
type CachedRequest = {
  url: string
  httpMethod: string
  responseData: any
}

const getCodaData = async (codaRequestParams: CodaRequestParams) => {
  const codaUrl = makeCodaRequest(codaRequestParams)
  console.log(`Fetching ${codaUrl}`)
  const cachedRequests: CachedRequest[] = []
  await paginatedGet(codaUrl, cachedRequests)
  return cachedRequests
}

const paginatedGet = async (url: string, responses: any[]) => {
  const responseData = await getData(url)
  const data = {url, httpMethod: 'GET', responseData}
  responses.push(data)

  if (responseData.nextPageLink) {
    await paginatedGet(responseData.nextPageLink, responses)
  }
  return
}

const getData = async (url: string) => {
  const codaToken = readCodaToken()
  const options = {
    headers: {
      Authorization: `Bearer ${codaToken}`,
    },
  }
  const response = await fetch(url, options)
  return await response.json()
}

const writeFile = (data: string, filename: string): Promise<void> => {
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
  const tokenFromEnv = process.env.CODA_TOKEN
  if (tokenFromEnv) {
    console.log('found Coda token from environment')
    return tokenFromEnv
  }
  const wranglerToml = fs.readFileSync('wrangler.toml', 'utf8')
  const config = toml.parse(wranglerToml)
  const tokenFromToml: string = config.vars.CODA_TOKEN
  if (tokenFromToml) {
    console.log('found Coda token from wrangler config')
    return tokenFromToml
  }

  throw Error('unable to get a Coda token')

  return tokenFromToml
}

main()
