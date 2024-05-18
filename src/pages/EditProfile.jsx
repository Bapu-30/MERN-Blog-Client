import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../App";
import axios from 'axios';
import { profileData } from './ProfilePage'
import AnimationWrap from "../common/AnimationWrap";
import Loader from "../components/Loader";
import { Toaster, toast } from 'react-hot-toast'
import InputBox from "../components/InputBox";
import { uploadImage } from "../common/aws";
import { storeInSession } from "../common/session";

function EditProfile() {

    let { userAuth, userAuth: { accessToken }, setUserAuth } = useContext(UserContext);

    let bioLimit = 150;

    let profileImgElement = useRef();
    let editProfileForm = useRef();

    const [profile, setProfile] = useState(profileData)
    const [loading, setLoading] = useState(true);
    const [charactersLeft, setCharactersLeft] = useState(bioLimit);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null)



    let { personal_info: { fullName, userName: profile_userName, profile_img, email, bio }, social_links } = profile;

    useEffect(() => {
        if (accessToken) {
            // console.log("useEffect executed...");
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { userName: userAuth.userName })
                .then(({ data }) => {
                    setProfile(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [accessToken])

    const handleCharChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length)
    }

    const handleImagePreview = (e) => {
        let img = e.target.files[0];
        profileImgElement.current.src = URL.createObjectURL(img);
        setUpdatedProfileImg(img);
    }

    const handleIMgUpload = (e) => {
        e.preventDefault();
        if (updatedProfileImg) {
            let loadingToast = toast.loading("Uploading");
            e.target.setAttribute("disabled", true);

            uploadImage(updatedProfileImg)
                .then(url => {
                    if (url) {
                        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url: url }, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })
                            .then(({ data }) => {
                                let newUserAuth = { ...userAuth, profile_img: data.profile_img }

                                storeInSession("user", JSON.stringify(newUserAuth))
                                setUserAuth(newUserAuth);

                                setUpdatedProfileImg(null);

                                toast.dismiss(loading);
                                e.target.removeAttribute("disabled");
                                toast.success("Uploaded...👍🏾")

                            })
                            .catch(({ response }) => {
                                toast.dismiss(loading);
                                e.target.removeAttribute("disabled");
                                toast.error(response.data.error)
                            })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let form = new FormData(editProfileForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { userName, bio, youtube, facebook, twitter, github, instagram, website } = formData;

        if (userName.length < 3) {
            return toast.error("Username must be at least 3 characters.")
        }
        if (bio.length > bioLimit) {
            return toast.error(`Bio cannot be more than ${bioLimit}`)
        }

        let loadingToast = toast.loading("Updating...");
        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", { userName, bio, social_links: { youtube, facebook, twitter, github, instagram, website } }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(({ data }) => {
                if (userAuth.userName != data.userName) {
                    let newUserAuth = { ...userAuth, userName: data.userName };
                    storeInSession("user", JSON.stringify(newUserAuth));
                    setUserAuth(newUserAuth);


                }


                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.success("Profile details Updated...👍🏾")
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response.data.error)
            })

    }

    return (
        <AnimationWrap>
            {
                loading ? <Loader /> :
                    <form action="" ref={ editProfileForm }>
                        <Toaster />
                        <h1 className="max-md:hidden">Edit Profile</h1>
                        <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">

                            <div className="max-lg:center mb-5 ">
                                <label htmlFor="uploadImg" id="profileImgLabel"
                                    className="relative block w-36 h-36 md:w-48 md:h-48 bg-grey rounded-full overflow-hidden border-2 border-grey">

                                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/40 opacity-0 hover:opacity-100 ">
                                        <i className="fi fi-sr-camera-retro"></i>
                                    </div>
                                    <img src={ profile_img } ref={ profileImgElement } />


                                </label>
                                <input type="file" id="uploadImg" accept=".jpeg, .png, .jpg" hidden onChange={ handleImagePreview } />

                                <button className="btn-dark mt-5 max-lg:center lg:w-full" onClick={ handleIMgUpload }>
                                    <i className="fi fi-rr-cloud-upload-alt mt-2"></i> Upload
                                </button>
                            </div>

                            <div className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                    <div>
                                        <InputBox name="fullNme" type="text" value={ fullName } placeholder={ "Full Name" } disable={ true } icon={ "fi-rr-user" } />
                                    </div>

                                    <div>
                                        <InputBox name="email" type="email" value={ email } placeholder={ "Email Id" } disable={ true } icon={ "fi-rr-envelope" } />
                                    </div>

                                </div>

                                <InputBox type={ "text" } name="userName" value={ profile_userName } placeholder={ "User Name" } icon={ "fi-rr-at" } />

                                <p className="text-dark-grey -mt-3">User name will be used to search user and will be visible to all.</p>

                                <textarea name="bio" maxLength={ bioLimit } defaultValue={ bio } className="input-box lg:h-40 h-64 resize-none leading-7 mt-5 pl-5" placeholder="Bio" onChange={ handleCharChange }>
                                </textarea>

                                <p className="mt-1 text-dark-grey">{ charactersLeft } Characters Left</p>

                                <p className="my-6 text-dark-grey">Add your social handles</p>

                                <div className="md:grid md:grid-cols-2 gap-x-6">

                                    {
                                        Object.keys(social_links).map((key, i) => {
                                            let link = social_links[key];


                                            return <InputBox key={ i } name={ key } type={ "text" } value={ link } placeholder={ "https://" } icon={ "fi " + (key != 'website' ? "fi-brands-" + key : "fi-rr-globe") } />
                                        })
                                    }
                                </div>

                                <button className="btn-dark w-auto px-10" type="submit" onClick={ handleSubmit }>Save</button>

                            </div>
                        </div>
                    </form>
            }
        </AnimationWrap>
    )
}


export default EditProfile