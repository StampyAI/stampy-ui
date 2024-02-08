interface PageHeaderTextProps {
  children: React.ReactNode
}
export const PageHeaderText = ({children}: PageHeaderTextProps) => {
  return <div className={'container-page-title padding-bottom-80'}>{children}</div>
}
