import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// DeviceButton Component
// This component is used to display a device button
export const SelectLoginDevicesButton = ({
  device,
  handleCheckBoxChanges,
  selectedDeviceArray,
}: DeviceButtonProps) => {
  // Function to handle the button click
  function handleButtonClick() {
    handleCheckBoxChanges(device.id)
  }
  return (
    <Button
      key={device.id}
      variant='outline'
      style={{
        width: 325,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: '0.35rem',
      }}
      onClick={handleButtonClick} // Attach the button click handler
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input
          type='checkbox'
          value={device.id}
          id={device.id}
          checked={selectedDeviceArray.includes(device.id)}
          style={{ marginRight: '0.5rem', borderRadius: '0.25rem', height: '1.2rem', width: '1.2rem' }}
          readOnly
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
          {device.name}
        </p>
      </div>
    </Button>
  )
}

type HandleCheckBoxChangesType = (value: string) => void

interface DeviceButtonProps {
  device: {
    id: string
    name: string
  }
  handleCheckBoxChanges: HandleCheckBoxChangesType
  selectedDeviceArray: string[]
}
