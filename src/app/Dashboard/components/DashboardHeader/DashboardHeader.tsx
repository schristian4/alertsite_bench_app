import { useDataStore } from '@/app/redux/useDataStore'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Button } from '@/components/ui/button'
import { DialogLoginBox } from '../DashboardLogin/DialogLoginBox'
import LoadingWrapper from '../LoadingWrapper/LoadingWrapper'
import ErrorWrapper from './ErrorWrapper/ErrorWrapper'
import { SelectLoginLocationComponent } from './SelectLoginLocationList/SelectLoginLocationComponent'
import { Trash2 } from 'lucide-react'

// Dashboard Header Component
// This component is used to display the dashboard header
export const DashboardHeader = () => {
  const { loadingProgress, isLoading, error, clearCache, cacheStatus } = useDataStore()

  return (
    <CardHeader className={'flex flex-row justify-between items-center flex-wrap'}>
      <CardTitle className={'card-title'}>AlertSite Technical Benchmark 2.0</CardTitle>
      <div className={'flex flex-row gap-5 items-center '}>
        <ErrorWrapper errorStatus={error.hasError}>
          <LoadingWrapper isLoading={isLoading} loadingType='spinner' loadingProgress={loadingProgress}>
            <SelectLoginLocationComponent />
            <DialogLoginBox />
          </LoadingWrapper>
        </ErrorWrapper>
        {cacheStatus.isFromCache && (
          <Button
            variant='outline'
            size='sm'
            onClick={clearCache}
            className='flex items-center gap-2'
            title='Clear cached data'
          >
            <Trash2 className='h-4 w-4' />
            Clear Cache
          </Button>
        )}
        <ModeToggle />
      </div>
    </CardHeader>
  )
}
