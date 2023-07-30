/**
 * This file contains the URLs for the Coda API.
 * It is a separate file in part so usage doesn't require CF worker env vars.
 */

// Use table ide, rather than names, in case of renames
export const QUESTION_DETAILS_TABLE = 'grid-sync-1059-File' // Answers
export const INITIAL_QUESTIONS_TABLE = 'table-yWog6qRzV4' // Initial questions
export const ON_SITE_TABLE = 'table-aOTSHIz_mN' // On-site answers
export const ALL_ANSWERS_TABLE = 'table-YvPEyAXl8a' // All answers
export const INCOMING_QUESTIONS_TABLE = 'grid-S_6SYj6Tjm' // Incoming questions
export const TAGS_TABLE = 'grid-4uOTjz1Rkz'
export const WRITES_TABLE = 'table-eEhx2YPsBE'
export const GLOSSARY_TABLE = 'grid-_pSzs23jmw'

type CodaRequest = {
  table: string
  queryColumn?: string
  queryValue?: string
  limit?: number
}
export const makeCodaRequest = ({table, queryColumn, queryValue, limit}: CodaRequest): string => {
  let params = `useColumnNames=true&sortBy=natural&valueFormat=rich${
    queryColumn && queryValue ? `&query=${quote(queryColumn)}:${quote(queryValue)}` : ''
  }`
  if (limit) {
    params = `${params}&limit=${limit}`
  }
  return `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows?${params}`
}

export const CODA_DOC_ID = 'fau7sl2hmG'
const buildCodaBaseUrl = ({table, rowId}: {table: string; rowId?: string}) =>
  `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows${
    rowId ? `/${enc(rowId)}` : ''
  }`

const enc = encodeURIComponent
const quote = (x: string) => encodeURIComponent(`"${x.replace(/"/g, '\\"')}"`)
