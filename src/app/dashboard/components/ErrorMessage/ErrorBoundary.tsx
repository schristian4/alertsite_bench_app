import React from 'react'
import ErrorMessage from './ErrorMessage'

// Error Boundary Component
// This component is used to handle errors in the application
const ErrorBoundary = ({ errorStatus, children }: { errorStatus: boolean; children: React.ReactNode }) => {
  return <>{errorStatus ? <ErrorMessage /> : children}</>
}

export default ErrorBoundary
