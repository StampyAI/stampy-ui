import {useCallback} from 'react'
import type {TOCItem} from '~/routes/questions.toc'
import './group.css'

export const GridBox = ({title, subtitle, icon, pageid}: TOCItem) => {
  const onGroupContainerClick = useCallback(() => {
    // Add your code here
  }, [pageid])

  return (
    <div key={pageid + title} className={'grid-container-group'} onClick={onGroupContainerClick}>
      <div className={'cardBg'}>
        <div className={'grid-rectangle'} />
      </div>
      <div className={'grid-title'}>{title}</div>
      <div className={'grid-description'}>{subtitle}</div>
      <img className={'grid-icon'} alt="" src={icon} />
    </div>
  )
}
