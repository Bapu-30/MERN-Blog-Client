import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/Editor";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import SideNav from "./components/SideNav";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import Notifications from "./pages/Notifications";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({})

    useEffect(() => {
        let userInSession = lookInSession("user")
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ accessToken: null })
    }, [])

    return (
        <UserContext.Provider value={ { userAuth, setUserAuth } }>
            <Routes>
                <Route path="/editor" element={ <Editor /> } />
                <Route path="/editor/:blog_id" element={ <Editor /> } />
                <Route path="/" element={ <Navbar /> }>
                    <Route index element={ <Homepage /> } />

                    <Route path="dashboard" element={ <SideNav /> }>
                        <Route path="notifications" element={ <Notifications /> } />
                    </Route>

                    <Route path="settings" element={ <SideNav /> }>
                        <Route path="edit-profile" element={ <EditProfile /> } />
                        <Route path="change-password" element={ <ChangePassword /> } />
                    </Route>
                    <Route path="signin" element={ <UserAuthForm type={ "sign-in" } /> } />
                    <Route path="signup" element={ <UserAuthForm type={ "sign-up" } /> } />
                    <Route path="search/:query" element={ <SearchPage /> } />
                    <Route path="user/:id" element={ <ProfilePage /> } />
                    <Route path="blog/:blog_id" element={ <BlogPage /> } />
                    <Route path="*" element={ <PageNotFound /> } />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;