import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingWrapper({
  children,
  isLoading,
  loadingType,
  progress,
}: {
  children: React.ReactNode
  isLoading: boolean
  loadingType: 'spinner' | 'skeleton'
  progress: number
}) {
  const LoaderObject =
    loadingType === 'spinner' ? (
      <LoadSpinner />
    ) : (
      <div>
        <FadeInFadeOutProgressLabel />
        <Progress value={progress} />
      </div>
    )

  // <LoadSkeleton progress={progress} />
  return <>{isLoading === false ? LoaderObject : <>{children}</>}</>
}

const FadeInFadeOutProgressLabel = () => {
  return (
    <div className='items-center justify-center'>
      <div
        className='text-center text-1xl font-bold mb-4'
        style={{
          animation: 'fadeInOut 3s infinite',
        }}
      >
        Loading Data<span> </span>...<span> </span> it can take 10-15 seconds to load data.
      </div>

      {/* You can also inject global styles using styled-jsx */}
      <style jsx global>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
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
