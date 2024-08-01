import { useDataStore } from '@/app/redux/useDataStore'
import { Button } from '@/components/ui/button'

// Error Message Component
// This component is used to display error messages when there is an error in the application
const ErrorMessage = () => {
  const { error, getMonitorData } = useDataStore()

  // Function to rerender the component
  function handleRerender() {
    getMonitorData()
  }

  // Split the error message into error code and error title
  // const [errorCode, errorTitle] = error.message.split(' \n ')

  return (
    <div className='flex flex-col  items-center justify-center mb-16'>
      <div className='flex flex-col flex-start'>
        <p style={{ fontSize: 124, fontWeight: 800, margin: 0, padding: 0 }}>{error.statusCode}</p>
        <p className='text-red-500' style={{ fontSize: 16, margin: 0, padding: 0 }}>
          {/* {errorTitle} */}
          {error.message}
        </p>
        <Button className='text-center mt-2' onClick={handleRerender} variant={'outline'}>
          REFRESH
        </Button>
      </div>
    </div>
  )
}

export default ErrorMessage
