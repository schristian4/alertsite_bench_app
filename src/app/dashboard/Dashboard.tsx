'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { cn } from '@/lib/utils'
import React from 'react'
import LayoutDataTable from './components/DataTable/LayoutDataTable'
import { IncidentBanner } from './components/IncidentBanner/IncidentBannerComponent'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ErrorMessage from './components/ErrorMessage/ErrorMessage'
import { LocationDropDown } from './components/LocationDropDown/LocationDropDown'
import { WidgetBanner } from './components/WidgetBanner/WidgetBanner'
import { DataProviderContext } from './components/providers/data-provider'
import LoadingWrapper from './components/shared/LoadingWrapper'
type CardProps = React.ComponentProps<typeof Card>

type AccountShape = {
  username: string
  password: string
}

function Dashboard({ className, ...props }: CardProps) {
  const { monitorData, rerender, progress, errorStatus, errorMessage } = React.useContext(DataProviderContext)

  const [selectedLocation, setLocationSelection] = React.useState('20')

  const handleDropDownMenuChange = (value: string) => {
    setLocationSelection(value)
  }

  const isDataLoading = monitorData.length !== 0

  return (
    <div className='main-container '>
      <Card className={cn('w-[100%]', className)} {...props}>
        <CardHeader className={'flex flex-row justify-between items-center flex-wrap'}>
          <CardTitle className={'card-title'}>AlertSite Technical Benchmark 2.0</CardTitle>
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
            {!errorStatus ? (
              <LoadingWrapper isLoading={isDataLoading} loadingType='spinner' progress={progress}>
                <LocationDropDown
                  handleDropDownMenuChange={handleDropDownMenuChange}
                  dropDownPosition={selectedLocation}
                />
              </LoadingWrapper>
            ) : null}
            {/*
            // TODO: Implement this feature
              - Add timestamp post to server for more data.
              */}
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent className='grid gap-4'>
          {!errorStatus ? (
            <LoadingWrapper isLoading={isDataLoading} loadingType='skeleton' progress={progress}>
              <IncidentBanner dataObject={monitorData} setLocationSelection={setLocationSelection} />
              <WidgetBanner dataObject={monitorData} locationSelection={selectedLocation} />
              <LayoutDataTable
                dataObject={monitorData}
                locationSelection={selectedLocation}
                rerender={rerender}
              />
            </LoadingWrapper>
          ) : (
            <ErrorMessage />
          )}

          <div>
            <Button className='text-center bg-gray-500 w-[270px] '>
              <Link href='https://techbench-react.vercel.app/'>Checkout the Legacy Version 👴</Link>
            </Button>
          </div>
          <div className='flex flex-col flex-wrap justify-center items-center'>
            <p className='text-xs pl-3 font-light text-gray-500'>
              Crafted with care by&nbsp;
              <a
                className='text-blue-300 font-semibold underline'
                href='https://spencer-christian.vercel.app'
              >
                Spencer Christian
              </a>
              &nbsp;🛠️✨
            </p>
            <p className='text-xs pl-3 font-light text-gray-500'>Version: 1.23.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
