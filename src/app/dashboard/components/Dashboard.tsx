'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { cn } from '@/lib/utils'
import { nestGroupsBy } from '@/utils/groupFunctions'
import React, { useEffect } from 'react'
import LayoutDataTable from './DataTable/LayoutDataTable'
import { IncidentBanner } from './IncidentBanner/IncidentBannerComponent'
import { LocationDropDown } from './LocationDropDown.tsx/LocationDropDown'
import { WidgetBanner } from './WidgetBanner/WidgetBanner'
import { DataProviderContext } from './providers/data-provider'
import LoadingWrapper from './shared/LoadingWrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
type CardProps = React.ComponentProps<typeof Card>

type AccountShape = {
  username: string
  password: string
}

function Dashboard({ className, ...props }: CardProps) {
  const { monitorData, rerender } = React.useContext(DataProviderContext)
  // const [userInput, setUserInput] = React.useState<AccountShape>({
  //   username: '',
  //   password: '',
  // })
  const [selectedLocation, setLocationSelection] = React.useState('')

  const handleDropDownMenuChange = (value: string) => {
    setLocationSelection(value)
  }
  // function handleSubmitParams(value: any) {}

  const setInitialOptionValue: Function = React.useCallback(() => {
    const defaultOption = nestGroupsBy(monitorData, ['obj_location', 'device_descrip'])
    setLocationSelection(Object.keys(defaultOption)[0])
  }, [monitorData])

  const isDataLoading = monitorData.length !== 0

  useEffect(() => {
    setInitialOptionValue()
  }, [setInitialOptionValue])

  return (
    <div className='main-container min-width-80 w-full'>
      <Card className={cn('w-[100%]', className)} {...props}>
        <CardHeader className={'flex flex-row justify-between items-center '}>
          <CardTitle>AlertSite Technical Benchmark 2.0</CardTitle>
          <div className={'flex flex-row gap-5 items-center '}>
            {/* 
            // TODO: Implement this feature
            - Add login feature for more data.
            */}
            {/* <DialogLoginBox
              handleSubmitParams={handleSubmitParams}
              setUserInput={setUserInput}
              userInput={userInput}
            /> */}
            <LoadingWrapper isLoading={isDataLoading} loadingType='spinner'>
              <LocationDropDown
                dataObject={monitorData}
                handleDropDownMenuChange={handleDropDownMenuChange}
                dropDownPosition={selectedLocation}
              />
            </LoadingWrapper>
            {/* 
            // TODO: Implement this feature
            - Add timestamp post to server for more data.
             */}
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <LoadingWrapper isLoading={isDataLoading} loadingType='skeleton'>
            <IncidentBanner dataObject={monitorData} setLocationSelection={setLocationSelection} />
            <WidgetBanner dataObject={monitorData} locationSelection={selectedLocation} />
            <LayoutDataTable
              dataObject={monitorData}
              locationSelection={selectedLocation}
              rerender={rerender}
            />
          </LoadingWrapper>
          <div>
            <Button className='text-center bg-gray-500 '>
              <Link href='https://techbench-react.vercel.app/'>Checkout the Legacy Version 👴</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
