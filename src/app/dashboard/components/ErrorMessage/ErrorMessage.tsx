import { Button } from '@/components/ui/button'
import React from 'react'
import { DataProviderContext } from '../providers/data-provider'

const ErrorMessage = () => {
  const { errorMessage, rerender } = React.useContext(DataProviderContext)

  function handleRerender() {
    rerender()
  }

  const [errorCode, errorTitle] = errorMessage.split(' \n ')
  return (
    <div className='flex flex-col  items-center justify-center mb-16'>
      <div className='flex flex-col flex-start'>
        <p style={{ fontSize: 124, fontWeight: 800, margin: 0, padding: 0 }}>{errorCode}</p>
        <p className='text-red-500' style={{ fontSize: 28, margin: 0, padding: 0 }}>
          {errorTitle}
        </p>
        <Button className='text-center mt-2' onClick={handleRerender} variant={'outline'}>
          REFRESH
        </Button>
      </div>
    </div>
  )
}

export default ErrorMessage
