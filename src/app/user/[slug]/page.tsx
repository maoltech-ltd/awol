import ProfileDetails from "@/src/components/Profile/ProfileDetails"
import ProtectedRoute from "@/src/components/ProtectedRoute"


const SecondUSerProfile = ({params}: {params: {username: string}}) => {
    return (
        <ProtectedRoute>
          {({ user }: any) => (
            <div>
              <ProfileDetails user={user}  username={params.username}/>
            </div>
          )}
        </ProtectedRoute>
        
      )
}

export default SecondUSerProfile