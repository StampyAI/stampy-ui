import {CodaRow} from '~/server-utils/stampy'
import question8486 from '~/mocks/question-data/question-8486.json'

type ChangeFields<T, R> = Omit<T, keyof R> & R
type CodaRowTrimmed = ChangeFields<
  CodaRow,
  {
    values: Omit<
      CodaRow['values'],
      'Tag ID' | 'Internal?' | 'Questions tagged with this' | 'Main question' | 'Tags' // Tags shouldn't need to be ommited as it's in the data
    >
  }
>
export type questionData = [number, {items: CodaRowTrimmed[]}]
export const questions: Array<questionData> = [[8486, question8486]]
