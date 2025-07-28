import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  TrendingUp,
  Bookmark,
} from 'lucide-react';
import { setSelectedUser } from '@/redux/authSlice';

const Profile = () => {
  const { id } = useParams();
  useGetUserProfile(id);

  const profile = useSelector((store) => store.auth.userProfile);
  const loggedInUser = useSelector((store) => store.auth.user);
  const isCurrentUser = loggedInUser?._id === profile?._id;
  const [activeTab, setActiveTab] = useState('posts');
  const [zoomImage, setZoomImage] = useState(null);
  const isFollowing = profile?.followers?.includes(loggedInUser?._id) || false;
  const dispatch = useDispatch();

  const handleFollow = () => console.log("Follow user", profile._id);
  const handleUnfollow = () => console.log("Unfollow user", profile._id);
  const handleMessage = () => console.log("Message user", profile._id);

  if (!profile) return <div className="text-center py-20">Loading...</div>;

  const renderPostGrid = (posts) =>
    posts.map((post) => (
      <div
        key={post._id}
        className="relative group cursor-pointer overflow-hidden"
        onClick={() => setZoomImage(post.image)}
      >
        <img
          src={post.image}
          alt={`Post by ${profile.username}`}
          className="w-full aspect-square object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white text-sm">
          <div className="flex items-center gap-1 font-semibold">
            <Heart className="w-5 h-5" />
            {post.likes?.length || 0}
          </div>
          <div className="flex items-center gap-1 font-semibold">
            <MessageCircle className="w-5 h-5" />
            {post.comments?.length || 0}
          </div>
        </div>
      </div>
    ));

  return (
    <div className="max-w-5xl mx-auto px-4 my-10">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-12 gap-6 mb-10">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="w-32 h-32 border shadow-sm">
            <AvatarImage
              src={profile.profilePicture || '/default-avatar.png'}
              alt={profile.username}
              className="object-cover"
            />
            <AvatarFallback className="text-xl uppercase">
              {profile.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
            <h2 className="text-xl font-light">{profile.username}</h2>
            {isCurrentUser ? (
              <div className="flex gap-2 flex-wrap">
                <Link to='/profile/edit' ><Button variant="outline" className='cursor-pointer'>Edit Profile</Button></Link>
                <Button variant="outline" onClick={() => setActiveTab('archive')}>Archived</Button>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {isFollowing ? (
                  <Button variant="outline" onClick={handleUnfollow}>Unfollow</Button>
                ) : (
                  <Button onClick={handleFollow}>Follow</Button>
                )}
                <Link to='/chat' onClick={()=> dispatch(setSelectedUser(profile))}> <Button variant="outline" className="cursor-pointer" onClick={handleMessage}>Message</Button></Link>
              </div>
            )}
          </div>

          <div className="flex gap-6 text-sm mb-2 flex-wrap">
            <div><strong>{profile.posts?.length || 0}</strong> posts</div>
            <div><strong>{profile.followers?.length || 0}</strong> followers</div>
            <div><strong>{profile.following?.length || 0}</strong> following</div>
          </div>

          {profile.bio && <p className="text-sm mt-1">{profile.bio}</p>}
        </div>
      </div>

      {/* Tab selectors */}
      <div className="border-t border-gray-300 flex flex-wrap justify-center text-xs font-semibold uppercase tracking-widest">
        <div
          className={`py-3 px-4 cursor-pointer flex items-center gap-1 ${activeTab === 'posts' ? 'border-t border-black text-black' : 'text-gray-500'}`}
          onClick={() => setActiveTab('posts')}
        >
          <PlusSquare className="w-4 h-4" />
          Posts
        </div>
        {isCurrentUser && (
          <>
            <div
              className={`py-3 px-4 cursor-pointer flex items-center gap-1 ${activeTab === 'saved' ? 'border-t border-black text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </div>
            <div
              className={`py-3 px-4 cursor-pointer flex items-center gap-1 ${activeTab === 'archive' ? 'border-t border-black text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('archive')}
            >
              <TrendingUp className="w-4 h-4" />
              Archive
            </div>
          </>
        )}
        <div
          className={`py-3 px-4 cursor-pointer flex items-center gap-1 ${activeTab === 'tagged' ? 'border-t border-black text-black' : 'text-gray-500'}`}
          onClick={() => setActiveTab('tagged')}
        >
          <Home className="w-4 h-4" />
          Tagged
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-3 mt-4 min-h-[300px]">
        {(activeTab === 'posts' && profile.posts?.length > 0) && renderPostGrid(profile.posts)}
        {(activeTab === 'saved' && profile.bookmarks?.length > 0) && renderPostGrid(profile.bookmarks)}
        {(activeTab === 'archive' && profile.archived?.length > 0) && renderPostGrid(profile.archived)}

        {(activeTab === 'tagged') && (
          <div className="col-span-full text-center text-gray-500 py-10">No tagged posts yet</div>
        )}

        {((activeTab === 'posts' && profile.posts?.length === 0) ||
          (activeTab === 'saved' && profile.bookmarks?.length === 0) ||
          (activeTab === 'archive' && profile.archived?.length === 0)) && (
          <div className="col-span-full text-center text-gray-500 py-10">No {activeTab} posts yet</div>
        )}
      </div>

      {/* Zoom Image Dialog */}
      {zoomImage && (
        <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={zoomImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] rounded-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Profile;
