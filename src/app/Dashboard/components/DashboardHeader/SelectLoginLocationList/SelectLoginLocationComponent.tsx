import { ScrollArea } from '../../../../../components/ui/scroll-area'

import { useEffect, useState } from 'react'
import { Button } from '../../../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../../components/ui/dropdown-menu'

import { useDataStore } from '@/app/redux/useDataStore'
import { SelectLoginDevicesButton } from './SelectLoginDevicesButton'

export function SelectLoginLocationComponent() {
  const {
    loginLoading,
    loginStatus,
    isFetchError,
    userDeviceList,
    handleSelectedDeviceList,
    loginErrorStatus,
  } = useDataStore()
  const [selectedDeviceArray, setSelectedDeviceArray] = useState<string[]>([])

  // Update the selectedDevice List on submit button click
  function handleSubmit() {
    handleSelectedDeviceList(selectedDeviceArray)
  }
  // Update checkbox state on checkbox change
  function handleCheckBoxChanges(value: string) {
    if (!selectedDeviceArray.includes(value) && selectedDeviceArray.length < 6) {
      setSelectedDeviceArray([...selectedDeviceArray, value])
    } else {
      setSelectedDeviceArray(selectedDeviceArray.filter((device) => device !== value))
    }
  }
  // Clear selection on clear selection button click
  function handleClearSelection() {
    setSelectedDeviceArray([])
  }

  // Update the button name based on the selectedDeviceList
  const buttonName = () => {
    let output_name = 'Monitors available to be selected'
    if (selectedDeviceArray.length === 0) {
      output_name = 'Monitors Selected 0 of 6'
    } else {
      output_name = `Monitors Selected ${selectedDeviceArray.length} of 6`
    }
    return output_name
  }

  useEffect(() => {
    if (loginStatus === false) {
      console.log('Successfully logged out')
      handleClearSelection()
    }
  }, [loginStatus])
  // Check if the userDeviceList is empty
  const isUserDeviceListEmpty = userDeviceList !== undefined && userDeviceList.length !== 0
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {
          <Button
            variant={loginErrorStatus ? 'destructive' : 'outline'}
            className='w-[200px]'
            disabled={!isUserDeviceListEmpty}
          >
            {isFetchError && !loginErrorStatus && 'Failed to Get Monitors'}
            {loginErrorStatus && !isFetchError && 'Failed to login'}
            {isFetchError || loginErrorStatus
              ? null
              : loginLoading
              ? 'Loading...'
              : isUserDeviceListEmpty
              ? loginLoading
                ? 'Loading...'
                : buttonName()
              : 'Login to select Monitors'}
          </Button>
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select a Location</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '0.25rem',
          }}
        >
          <Button variant='outline' style={{ width: 350 }} onClick={handleClearSelection}>
            <p>Clear Selection</p>
          </Button>
        </div>
        <ScrollArea className='h-[250px] w-[350px] rounded-md border p-2 flex flex-col' style={{}}>
          {userDeviceList.map((device, index) => {
            return (
              <SelectLoginDevicesButton
                key={index}
                device={device}
                handleCheckBoxChanges={handleCheckBoxChanges}
                selectedDeviceArray={selectedDeviceArray}
              />
            )
          })}
        </ScrollArea>
        <SubmitButton
          loginLoading={loginLoading}
          canSubmit={selectedDeviceArray.length !== 0}
          handleSubmit={handleSubmit}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Define the submit button component
const SubmitButton = ({
  loginLoading,
  canSubmit,
  handleSubmit,
}: {
  loginLoading: boolean
  canSubmit: boolean
  handleSubmit: () => void
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0.25rem 0 0 0' }}>
      <Button
        variant='outline'
        style={{ width: 350, background: canSubmit ? 'violet' : 'gray' }}
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        <p>{loginLoading ? 'Loading...' : canSubmit ? 'Submit' : 'Select Monitors'}</p>
      </Button>
    </div>
  )
}
