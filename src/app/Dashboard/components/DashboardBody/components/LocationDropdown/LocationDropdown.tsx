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

export function LocationDropDown() {
  const { selectedLocation, setSelectedLocation } = useDataStore()

  const handleDropDownMenuChange = (value: string) => {
    setSelectedLocation(value)
  }

  const getLocationInfo = (selectedLocationId: string): LocationInfo => {
    const selectedLocation = SortedLocationNameIds.find(([id]) => id === selectedLocationId)
    return selectedLocation
      ? { location_name: selectedLocation[1], location_id: selectedLocation[0] }
      : { location_name: 'No Location Selected', location_id: '-' }
  }

  const { location_name, location_id } = getLocationInfo(selectedLocation)

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
        <DropdownMenuRadioGroup value={selectedLocation} onValueChange={handleDropDownMenuChange}>
          <ScrollArea className='h-[300px] w-[350px] rounded-md border p-4'>
            {SortedLocationNameIds.map(([locationID, locationName]) => (
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
