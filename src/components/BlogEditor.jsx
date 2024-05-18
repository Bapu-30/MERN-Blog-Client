import { Link, useParams } from "react-router-dom"
import logo from '../imgs/logo.png'
import AnimationWrap from "../common/AnimationWrap"
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from "../common/aws"
import { useContext, useEffect, useRef } from "react"
import { Toaster, toast } from "react-hot-toast"
import { EditorContext } from "../pages/Editor"
import EditorJS from '@editorjs/editorjs'
import { tools } from "./Tools"
import axios from "axios"
import { UserContext } from "../App"
import { useNavigate } from "react-router-dom"

function BlogEditor() {

    let { blog, blog: { title, banner, content, tags, description, author }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext)

    let { userAuth: { accessToken } } = useContext(UserContext);

    let { blog_id } = useParams()

    let navigate = useNavigate()

    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holder: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: "Write your article here"
            }))
        }

    }, [])


    const handleBannerUpload = (e) => {
        let img = e.target.files[0];

        if (img) {
            let loadingToast = toast.loading("Uploading...")
            uploadImage(img)
                .then((url) => {
                    if (url) {
                        toast.dismiss(loadingToast)
                        toast.success("Uploaded ✅")
                        setBlog({ ...blog, banner: url })
                    }
                })
                .catch(err => {
                    toast.dismiss(loadingToast)
                    return toast.error(err.messege)
                })
        }
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;

        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px"

        setBlog({ ...blog, title: input.value })

    }

    const handlePublishEvent = () => {
        if (!banner) {
            return toast.error("Upload a blog banner to publish")
        }
        if (!title) {
            return toast.error("Please provide a title")
        }
        if (textEditor.isReady) {
            textEditor.save()
                .then(data => {
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data })
                        setEditorState("publish")
                    }
                    else {
                        return toast.error("Please write the blog content to publish")
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const handleSaveDraft = (e) => {
        if (e.target.className.includes('disable')) {
            return;
        }
        if (!title) {
            return toast.error("Please write the Blog Title before Saving as a draft")
        }


        let loadingToast = toast.loading("Saving Draft...");

        e.target.classList.add('disable')

        if (textEditor.isReady) {
            textEditor.save()
                .then(content => {

                    let blogObject = { title, banner, description, content, tags, draft: true }

                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObject, id: blog_id }, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                        .then(() => {
                            e.target.classList.remove('disable')
                            toast.dismiss(loadingToast);
                            toast.success("Saved as Draft 👍🏼")

                            setTimeout(() => {
                                navigate("/")
                            }, 600)

                        })
                        .catch(({ response }) => {
                            e.target.classList.remove('disable')
                            toast.dismiss(loadingToast);
                            return toast.error(response.data.error)
                        })
                })
        }


    }
    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={ logo } alt="" />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    { title ? title : "New Blog" }
                </p>
                <div className="flex gap-4 ml-auto">
                    <button
                        className="btn-dark py-2"
                        onClick={ handlePublishEvent }
                    >
                        Publish
                    </button>

                    <button
                        className="btn-dark py-2"
                        onClick={ handleSaveDraft }
                    >
                        Save Draft
                    </button>
                </div>
            </nav>
            <Toaster />
            <AnimationWrap>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
                            <label htmlFor="uploadBanner">
                                <img
                                    src={ banner }
                                    className="z-20"
                                    onError={ (e) => e.target.src = defaultBanner }
                                />
                                <input
                                    type="file"
                                    id="uploadBanner"
                                    accept=".png, .jpg, .jpeg, image/webp"
                                    hidden
                                    onChange={ handleBannerUpload }

                                />
                            </label>
                        </div>
                        <textarea
                            defaultValue={ title }
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={ handleTitleKeyDown }
                            onChange={ handleTitleChange }
                        >
                        </textarea>
                        <hr className="w-full opacity-10 my-5 " />
                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimationWrap>
        </>

    )
}
export default BlogEditor