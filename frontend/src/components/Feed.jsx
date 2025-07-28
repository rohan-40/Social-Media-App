import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className="flex-1 m-4 sm:m-6 md:m-8 flex flex-col items-center md:pl-[20%] pl-2 pr-2">
  <Posts />
</div>
  )
}

export default Feed