import { useContext, useEffect, useState } from 'react'
import logo from '../imgs/logo.png'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import UserNavigationPanel from './UserNavigationPanel'
import axios from 'axios';

function Navbar() {

  const { userAuth, userAuth: { accessToken, profile_img, new_notifiction_available }, setUserAuth } = useContext(UserContext)

  const [searchVisible, setSearchVisible] = useState(false)
  const [userNavPanel, setUserNavPanel] = useState(false)
  let navigate = useNavigate()

  useEffect(() => {
    if (accessToken) {
      axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data })
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [accessToken])

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`)
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false)
    }, 300)
  }


  return (
    <>
      <nav className="navbar z-50">

        <Link to="/" className='w-10'>
          <img src={ logo } alt="Logo" className='w-full' />
        </Link>



        <div className={ "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchVisible ? "show" : "hide") }>

          <input type="text"
            placeholder='Search'
            className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
            onKeyDown={ handleSearch }
          />
          <i className="fi fi-rr-search absolute right-[10%] md:left-5 top-1/2 -translate-y-1/2 md:pointer-events-none text-xl text-dark-grey"></i>

        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto ">
          <button className='md:hidden bg-grey w-12 h-12 rounded-full flex justify-center items-center hover:bg-black/20'
            onClick={ () => setSearchVisible((pre) => !pre) }>
            <i className="fi fi-rr-search text-xl mt-1"></i>
          </button>

          <Link to='/editor' className='hidden md:flex gap-2 link md:text-center'>
            <i className="fi fi-rr-file-edit mt-1"></i>
            <p className='mt-1'>Write</p>
          </Link>
          {
            accessToken ?
              <>
                <Link to="/dashboard/notification">
                  <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/20'>
                    <i className="fi fi-rr-bell text-xl block mt-1"></i>
                    { new_notifiction_available ? <span className='bg-red w-3 h-3 rounded-full absolute top-2 right-3 z-10'></span> : "" }
                  </button>
                </Link>

                <div
                  className="relative"
                  onClick={ () => setUserNavPanel(pre => !pre) }
                  onBlur={ handleBlur }
                >
                  <button
                    className="w-12 h-12 mt-1 rounded-full"
                  >
                    <img src={ profile_img }
                      className="w-full h-full object-cover rounded-full" />
                  </button>
                  { userNavPanel ? <UserNavigationPanel /> : null }
                </div>
              </>

              :
              <>
                <Link to="/signin" className='btn-dark py-2  md:block'>
                  Sign In
                </Link>
                <Link to="/signup" className='btn-dark py-2 hidden md:block'>
                  Sign Up
                </Link>
              </>
          }
        </div>
      </nav>
      <Outlet />
    </>

  )
}
export default Navbar