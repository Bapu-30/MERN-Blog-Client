import { Link, Navigate } from "react-router-dom"
import InputBox from "../components/InputBox"
import googleIcon from '../imgs/google.png'
import Animation from '../common/AnimationWrap'
import { Toaster, toast } from 'react-hot-toast'
import { useContext, useRef } from "react"
import axios from 'axios'
import { storeInSession } from "../common/session"
import { UserContext } from "../App"
import { authWithGoogle } from "../common/firebase"

function UserAuthForm({ type }) {

    let { userAuth: { accessToken }, setUserAuth } = useContext(UserContext);
    console.log(accessToken);

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                // console.log(data);
                storeInSession("user", JSON.stringify(data))
                setUserAuth(data)
            })
            .catch(({ response }) => {
                toast.error(response.data.error)
            })
    }

    const handleGoogleAuth = (e) => {

        e.preventDefault();

        authWithGoogle()
            .then((user) => {
                let serverRoute = "/google-auth"
                let formData = {
                    accessToken: user.accessToken
                }
                userAuthThroughServer(serverRoute, formData)
            })
            .catch(err => {
                toast.error("trouble logging in via Google")
                console.log(err);
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const serverRoute = type == "sign-in" ? "/signin" : "/signup"

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/; // regex for password

        // grabbing the formdata
        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullName, email, password } = formData;

        //client side form validation
        if (fullName) {
            if (fullName.length < 3) {
                return toast.error("Full name must be greater than three characters");
            }
        }
        if (!email.length) {
            return toast.error("email required")
        }

        if (!emailRegex.test(email)) {
            return toast.error("Enter a valid email")
        }

        if (type == "sign-up") {
            if (!passwordRegex.test(password)) {
                return toast.error("Password must be 8-16 characters long, and contain at least one uppercase and special characters")
            }
        }


        userAuthThroughServer(serverRoute, formData)
    }

    return (
        accessToken ? <Navigate to="/" /> :
            <Animation keyVal={ type }>
                <section className="h-cover flex items-center justify-center">
                    <Toaster />
                    <form id="formElement" className="w-[80%] max-w-[400px]">
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-10">
                            { type == "sign-in" ? "Welcome Back" : "Join Us Today" }
                        </h1>

                        { type != "sign-in" ? <InputBox
                            name="fullName"
                            type="text"
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        /> : null
                        }

                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope"
                        />

                        <InputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-lock"
                        />

                        <button
                            className="btn-dark center mt-14"
                            type="submit"
                            onClick={ handleSubmit }
                        >
                            { type.replace("-", " ") }
                        </button>

                        <div className="relative w-full flex gap-2 my-10 opacity-10 uppercase text-black font-bold items-center">
                            <hr className="w-1/2 border-black" />
                            <p>Or</p>
                            <hr className="w-1/2 border-black" />
                        </div>
                        <button
                            className="btn-dark center flex items-center gap-4 justify-center w-[90%]"
                            onClick={ handleGoogleAuth }>
                            <img src={ googleIcon } className="w-5" />
                            Continue With Google
                        </button>
                        {
                            type == "sign-in" ?
                                <p className="mt-6 text-dark-grey m text-xl text-center">
                                    Don't have an account ?
                                    <Link to='/signup' className="underline text-black text-xl ml-1 font-bold">
                                        Sign Up
                                    </Link>
                                </p>
                                :
                                <p className="mt-6 text-dark-grey m text-xl text-center">
                                    Already a member ?
                                    <Link to='/signin' className="underline text-black text-xl ml-1 font-bold">
                                        Sign In
                                    </Link>
                                </p>

                        }
                    </form>

                </section>
            </Animation>
    )
}
export default UserAuthForm