import styles from './error.module.css'

const errors = {
  404: (
    <>
      Sorry, this page was not found. Please go to the{' '}
      <a href="https://discord.com/invite/Bt8PaRTDQC">Discord server</a> and report where you found
      this link.
    </>
  ),
  500: 'Sorry, something bad happened. Please retry',
  emptyArticle: 'Sorry, it looks like this article could not be fetched',
}

type ErrorType = {
  statusText?: string
  status?: string | number
}

const Error = ({error}: {error?: ErrorType}) => {
  return (
    <div className={styles.errorContainer + ' col-10'}>
      <h1>{error?.statusText}</h1>
      {error?.status && <div>{errors[error.status as keyof typeof errors] || ''}</div>}
    </div>
  )
}
export default Error
