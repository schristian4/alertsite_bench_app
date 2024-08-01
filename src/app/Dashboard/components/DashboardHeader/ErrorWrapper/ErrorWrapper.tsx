import React from 'react'

const ErrorWrapper = ({ errorStatus, children }: { errorStatus: boolean; children: React.ReactNode }) => {
  // Return null if errorStatus is false
  return <React.Fragment>{!errorStatus ? children : null}</React.Fragment>
}

export default ErrorWrapper
