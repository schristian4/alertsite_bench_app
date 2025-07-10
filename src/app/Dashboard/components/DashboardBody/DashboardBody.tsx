'use client'
import { useDataStore } from '@/app/redux/useDataStore'
import { CardContent } from '@/components/ui/card'
import LoadingWrapper from '../LoadingWrapper/LoadingWrapper'
import DashboardDataTable from './components/DataTable/DashboardDataTable'
import { IncidentBanner } from './components/IncidentBanner/IncidentBanner'
import DashboardUserDataTable from './components/UserDataTable/DashboardUserDataTable'
import { WidgetBanner } from './components/WidgetBanner/WidgetBanner'
import { DataLoadingNotification } from './components/DataLoadingNotification/DataLoadingNotification'
import ErrorBoundary from '../ErrorMessage/ErrorBoundary'

const DashboardBody = () => {
  const { loadingProgress, isLoading, error, monitorData } = useDataStore()

  return (
    <CardContent className='grid gap-4'>
      <ErrorBoundary errorStatus={error.hasError}>
        <LoadingWrapper
          isLoading={isLoading}
          loadingType='skeleton'
          loadingProgress={loadingProgress}
          monitorDataExists={monitorData && monitorData.length > 0}
        >
          <DataLoadingNotification />
          <IncidentBanner />
          <WidgetBanner />
          <DashboardUserDataTable />
          <DashboardDataTable />
        </LoadingWrapper>
      </ErrorBoundary>
    </CardContent>
  )
}

export default DashboardBody
