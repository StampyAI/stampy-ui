import styles from './error.module.css'

const errorCodes = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
}
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

const errorName = (error?: ErrorType) => {
  if (!error) return ''
  if (error.statusText) return error.statusText
  if (error.status) return errorCodes[error.status as keyof typeof errorCodes]
  return ''
}

const Error = ({error}: {error?: ErrorType}) => {
  return (
    <div className={styles.errorContainer + ' col-10'}>
      <h1>{errorName(error)}</h1>
      {error?.status && <div>{errors[error.status as keyof typeof errors] || ''}</div>}
    </div>
  )
}
export default Error
