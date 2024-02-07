import './box.css'

interface ContentBoxProps {
  /**
   * Is this the primary ContentBox of the page?
   */
  primary?: boolean
}
export const ContentBox = ({primary}: ContentBoxProps) => {
  return (
    <div className={['main-container', primary ? 'primary' : ''].join(' ')}>
      <div className={['content-box-description', primary ? 'primary' : ''].join(' ')}>
        <p>New to AI Safety?</p>
        <span className="content-box-quick-read">Something about reading and quick</span>
        <div className={'content-box-button'}>
          <button>Start here</button>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9fb1280ae243173a29a11e362f292791a4f28e657912dedfdf8e488119ac6fac?apiKey=f1073757e44b4ccd8d59791af6c41a77&"
            className="img-2"
            alt="Start Image"
          />
        </div>
      </div>
    </div>
  )
}
