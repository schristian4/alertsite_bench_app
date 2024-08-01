import React from 'react'
import { Button } from '@/components/ui/button'
import { SortedLocationNameIds } from '@/lib/constants'
import { useDataStore } from '@/app/redux/useDataStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

interface LocationInfo {
  location_name: string
  location_id: string
}

export function UserLocationDropDown() {
  const { userSelectedLocation, setUserSelectedLocation, setSelectedLocation, loginMonitorData } =
    useDataStore()

  const handleDropDownMenuChange = (value: string) => {
    setUserSelectedLocation(value)
    setSelectedLocation(value)
  }

  const availableLocationIds = removeDuplicateIds(
    loginMonitorData.map((monitor: any) => monitor['obj_location'])
  )

  const availableLocations = SortedLocationNameIds.filter(([locationId]) =>
    availableLocationIds.includes(locationId)
  )

  const getLocationInfo = (selectedLocationId: string): LocationInfo => {
    const selectedLocation = availableLocations.find(([id]) => id === selectedLocationId)
    return selectedLocation
      ? { location_name: selectedLocation[1], location_id: selectedLocation[0] }
      : { location_name: 'No Location Selected', location_id: '-' }
  }

  const { location_name, location_id } = getLocationInfo(userSelectedLocation)

  if (availableLocations.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          {location_name} - {location_id}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-96'>
        <DropdownMenuLabel>Select a Location</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={userSelectedLocation} onValueChange={handleDropDownMenuChange}>
          <ScrollArea className='h-[300px] w-[350px] rounded-md border p-4'>
            {availableLocations.map(([locationID, locationName]) => (
              <DropdownMenuRadioItem key={locationID} value={locationID}>
                {locationName}
              </DropdownMenuRadioItem>
            ))}
          </ScrollArea>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function removeDuplicateIds(arr: string[]): string[] {
  return arr.filter((value, index, self) => self.indexOf(value) === index)
}
