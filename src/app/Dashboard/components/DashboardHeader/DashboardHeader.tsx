import { useDataStore } from '@/app/redux/useDataStore'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { DialogLoginBox } from '../DashboardLogin/DialogLoginBox'
import LoadingWrapper from '../LoadingWrapper/LoadingWrapper'
import ErrorWrapper from './ErrorWrapper/ErrorWrapper'
import { SelectLoginLocationComponent } from './SelectLoginLocationList/SelectLoginLocationComponent'

// Dashboard Header Component
// This component is used to display the dashboard header
export const DashboardHeader = () => {
  const { loadingProgress, isLoading, error } = useDataStore()

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
        <ModeToggle />
      </div>
    </CardHeader>
  )
}
