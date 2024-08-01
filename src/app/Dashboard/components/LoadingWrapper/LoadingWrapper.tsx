import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingWrapper({
  children,
  isLoading,
  loadingType,
  loadingProgress,
  monitorDataExists,
}: {
  children: React.ReactNode
  isLoading: boolean
  loadingType: 'spinner' | 'skeleton'
  loadingProgress: number
  monitorDataExists?: boolean
}) {
  const LoaderContent = () => {
    // Check if the monitorDataExists is true
    // If it is true, render the children
    // Otherwise, render the loading content
    return (
      <>
        {loadingType === 'spinner' ? (
          <LoadSpinner />
        ) : (
          <div>
            {monitorDataExists && <div style={{ marginTop: '2rem' }}>{children}</div>}
            <FadeInFadeOutProgressLabel />
            <Progress value={loadingProgress} />
          </div>
        )}
      </>
    )
  }

  return <>{isLoading === true ? <LoaderContent /> : <>{children}</>}</>
}

export function LoadingUserWrapper({
  children,
  isLoading,
  loadingType,
  loadingProgress,
  monitorDataExists,
}: {
  children: React.ReactNode
  isLoading: boolean
  loadingType: 'spinner' | 'skeleton'
  loadingProgress: number
  monitorDataExists?: boolean
}) {
  const LoaderContent = () => {
    // Check if the monitorDataExists is true
    // If it is true, render the children
    // Otherwise, render the loading content
    return (
      <>
        {loadingType === 'spinner' ? (
          <LoadSpinner />
        ) : (
          <div>
            <FadeInFadeOutProgressLabel />
            <Progress value={loadingProgress} />
            {/* {monitorDataExists && <div style={{ marginTop: '2rem' }}>{children}</div>} */}
          </div>
        )}
      </>
    )
  }

  return <>{isLoading === true ? <LoaderContent /> : <>{children}</>}</>
}

// FadeInFadeOutProgressLabel Component
// This component is used to display a progress label with a fade-in and fade-out animation
const FadeInFadeOutProgressLabel = () => {
  return (
    <div className='items-center justify-center'>
      <div
        className='text-center text-1xl font-bold mb-4'
        style={{
          animation: 'fadeInOut 3s infinite',
        }}
      >
        Loading Data ...
      </div>
    </div>
  )
}
// LoadSpinner Component
// This component is used to display a loading spinner
const LoadSpinner = () => {
  return (
    <svg
      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  )
}
// LoadSkeleton Component
// This component is used to display a skeleton loading animation
const LoadSkeleton = ({ progress }: { progress: number }) => {
  return (
    <div>
      <div style={{ borderRadius: '2em' }}>
        <div style={{ width: '100%', backgroundColor: '#ccc' }}>
          <div style={{ width: `${progress}%`, backgroundColor: 'blue', height: '20px' }} />
        </div>
        {/* Render your monitor data here */}
      </div>
      <Skeleton className='w-[300px] h-[20px] rounded-full mb-3' />
      <Skeleton className='w-[400px] h-[20px] rounded-full mb-3' />
      <Skeleton className='w-[200px] h-[20px] rounded-full mb-3' />
    </div>
  )
}
