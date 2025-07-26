'use client'
import React from 'react'
import { User } from '../interfaces/user.interface'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const ProfileComponent: React.FC<User> = ({ user }) => {
  const router = useRouter()
  const API = process.env.NEXT_PUBLIC_API_URL
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)


  const loggedOut = async () => {
    try {
      await axios.get(`${API}/loggedOut`, { withCredentials: true });
      router.push('/api/login')


    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`);
      }


    }
  }
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    
    if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
    alert(
      `❌ File size too large. Got ${(file.size / (1024 * 1024)).toFixed(2)} MB. Maximum is 10 MB.`
    );
    return;
  }
    setPreviewImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('profile', file);
    try {
      const response = await axios.post(`${API}/updateUserInfo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Avatar updated successfully:', response.data);
      // Optionally, you can update the user state or refetch user data here
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  }
  return (
    <div className="absolute right-4 top-14 z-50">
      <div className="w-60 rounded-b-md bg-gray-800 text-white shadow-xl p-4">
        <div className="flex flex-col items-center space-y-3">

          <h1 className="text-xl font-semibold">Profile</h1>
   <div className="relative w-12 h-12">
  {/* Clickable Profile Image (label wraps input) */}
  <label className="cursor-pointer w-full h-full block">
    
    <Image
      src={previewImage || user?.avatar || "/default-avatar.png"}
      alt={`${user?.username}'s profile`}
      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
      width={48}
      height={48}
    />
    
    {/* Hidden File Input */}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleAvatarUpload} 
    />
  </label>
</div>


          <span className="text-base font-medium">{user?.username}</span>

          <span
            title={user?.email}
            className="text-xs text-gray-300 max-w-[150px] truncate"
          >
            {user?.email}
          </span>

          <button
            onClick={loggedOut}
            className="w-full bg-red-500 cursor-pointer hover:bg-red-400 text-white py-1 rounded text-sm transition duration-150"
          >
            Logout
          </button>

          {/* <button disabled className="w-full bg-blue-500 cursor-pointer hover:bg-blue-400 text-white py-1 rounded text-sm transition duration-150">
        Settings
      </button>

      <button className="w-full bg-green-500 cursor-pointer hover:bg-green-400 text-white py-1 rounded text-sm transition duration-150">
        Profile
      </button> */}
        </div>
      </div>
    </div>

  )
}

export default ProfileComponent
