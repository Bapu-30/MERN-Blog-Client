import { useContext, useRef } from "react";
import AnimationWrap from "../common/AnimationWrap"
import InputBox from "../components/InputBox"
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../App'


function ChangePassword() {

    let { userAuth: { accessToken } } = useContext(UserContext)

    let changePasswordForm = useRef();

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;


    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if (!currentPassword.length || !newPassword.length) {
            return toast.error("Please fill all the required fields")
        }

        if (!passwordRegex.test(newPassword)) {
            return toast.error("Password must be 8-16 characters long, and contain at least one upper case and special character")
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("PLease Wait...")

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(() => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.success("Password updated successfully.")
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.error(response.data.error)
            })

    }
    return (
        <AnimationWrap>
            <Toaster />
            <form ref={ changePasswordForm }>
                <h1 className="max-md:hidden ">Change Password</h1>
                <div className="py-10 w-full md:max-w-[400px] ">
                    <InputBox name={ "currentPassword" } type={ "password" } className="profile-edit-input" placeholder={ "Current Password" } icon={ "fi-rr-lock" } />

                    <InputBox name={ "newPassword" } type={ "password" } className="profile-edit-input" placeholder={ "New Password" } icon={ "fi-rr-unlock" } />

                    <button className="btn-dark px-10" type="submit" onClick={ handleSubmit }>
                        Change Password
                    </button>
                </div>

            </form>
        </AnimationWrap>
    )
}
export default ChangePassword