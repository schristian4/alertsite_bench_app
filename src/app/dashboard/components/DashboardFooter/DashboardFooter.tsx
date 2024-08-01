import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import Link from 'next/link'

const DashboardFooter = () => {
  return (
    <CardContent className='grid gap-4'>
      <div>
        <Button className='text-center bg-gray-500 w-[270px] '>
          <Link href='https://techbench-react.vercel.app/'>Checkout the Legacy Version 👴</Link>
        </Button>
      </div>
      <div className='flex flex-col flex-wrap justify-center items-center'>
        <p className='text-xs pl-3 font-light text-gray-500'>
          Crafted with care by&nbsp;
          <a className='text-blue-300 font-semibold underline' href='https://spencer-christian.vercel.app'>
            Spencer Christian
          </a>
          &nbsp;🛠️✨
        </p>
        <p className='text-xs pl-3 font-light text-gray-500'>Version: 1.23.1</p>
      </div>
    </CardContent>
  )
}

export default DashboardFooter
