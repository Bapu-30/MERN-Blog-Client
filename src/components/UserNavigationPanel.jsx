import { useContext } from "react"
import AnimationWrap from "../common/AnimationWrap"
import { Link } from "react-router-dom"
import { UserContext } from "../App"
import { removeFromSession } from "../common/session"

function UserNavigationPanel() {
    const  {userAuth : {userName}, setUserAuth} = useContext(UserContext)

    const signout = () =>{
        removeFromSession("user")
        setUserAuth({accessToken : null})
    }
  return (
    <AnimationWrap 
    transition={{duration : 0.2}}
    className="absolute right-0 z-50"
    >
        <div className="bg-white absolute right-0 border border-grey w-60  duration-200">

            <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4 ">
            <i className="fi fi-rr-file-edit mt-1 text-xl"></i>
            <p className='mt-1'>Write</p>
            </Link>

            <Link to={`/user/${userName}`} className="link pl-8 py-4">
                Profile
            </Link>

            <Link to="/dashboard/blogs" className="link pl-8 py-4">
                Dashboard
            </Link>

            <Link to="/settings/edit-profile" className="link pl-8 py-4">
                Settings
            </Link>

            <span className="absolute border-t border-black w-[100%] "></span>

            <button 
            className="text-left p-4 hover:bg-grey w-full pl-8 py-4 "
            onClick={signout}
            >
                <h1 className="font-bold text-xl mg-1 ">Sign Out</h1>
                <p className="text-dark-grey">{userName}</p>
            </button>
        </div>

    </AnimationWrap>
  )
}
export default UserNavigationPanel