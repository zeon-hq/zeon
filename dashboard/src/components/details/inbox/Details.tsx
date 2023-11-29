import React from 'react'
import { UserCircle } from 'tabler-icons-react'
import DetailHeader from './component/DetailHeader'
import DetailsInfo from './component/DetailsInfo'

type Props = {}

const Details = (props: Props) => {
  return (
    <div>
      <DetailHeader text="Details" Icon={UserCircle}/>
      <DetailsInfo/>
    </div>
  )
}

export default Details