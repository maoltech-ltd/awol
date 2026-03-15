"use client";
import ProfileDetails from "@/src/components/Profile/ProfileDetails";
import ProtectedRoute from "@/src/components/ProtectedRoute";

const UserProfile = () => {
  return (
    <ProtectedRoute>
      {({ user }: any) => (
        <div>
          <ProfileDetails user={user} />
        </div>
      )}
    </ProtectedRoute>
    
  )
}

export default UserProfile;