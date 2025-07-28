import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store => store.post || [])
 
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex flex-col gap-6">
    {posts?.length > 0 ? (
      posts.map((post) => <Post key={post._id} post={post} />)
    ) : (
      <div className="text-center text-gray-500 text-sm py-10">
        No posts available.
      </div>
    )}
  </div>
</div>
  )
}

export default Posts