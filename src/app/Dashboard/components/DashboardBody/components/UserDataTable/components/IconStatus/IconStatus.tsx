import React from 'react'

interface IconStatusProps {
  statusScore: number
}

enum StatusThreshold {
  Good = 95,
  Warning = 75,
}

const IconStatus: React.FC<IconStatusProps> = ({ statusScore }) => {
  const baseClassName = 'iconStatus justify-center align-middle relative'

  if (statusScore >= StatusThreshold.Good) {
    return <i className={`${baseClassName} icon-check`} aria-label='Status: Good'></i>
  } else if (statusScore >= StatusThreshold.Warning) {
    return <i className={`${baseClassName} icon-warning`} aria-label='Status: Warning'></i>
  } else if (statusScore >= 0) {
    return <i className={`${baseClassName} icon-danger`} aria-label='Status: Danger'></i>
  } else {
    return null
  }
}

export default IconStatus
