import { useContext } from "react"
import AnimationWrap from "../common/AnimationWrap"
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from "../pages/Editor"
import Tag from "./Tag";
import axios from 'axios'
import { UserContext } from "../App";
import { useNavigate, useParams } from 'react-router-dom'

function PublishForm() {

  const characterLimit = 200;
  const tagLimit = 10;

  let {blog_id} = useParams()

  let { setEditorState, blog: { banner, title, tags, description, content, draft }, setBlog, blog } = useContext(EditorContext)

  let { userAuth: { accessToken } } = useContext(UserContext)

  let navigate = useNavigate()



  const handleClose = () => {
    setEditorState("editor")
  }

  const handleDescKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  }

  const handleBlogTitle = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value })
    console.log(tags);

  }

  const handleBlogDesc = (e) => {
    let input = e.target
    setBlog({ ...blog, description: input.value })

  }

  const handleTagKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] })
        }
      } else {
        toast.error(`You can add maximum ${tagLimit} tags`)
      }

      e.target.value = null

    }
  }

  const publishBlog = (e) => {

    if (e.target.className.includes('disable')) {
      return;
    }
    if (!title) {
      return toast.error("Please write the Blog Title before publishing")
    }

    if (!description || description.length > characterLimit) {
      return toast.error(`Please write the description within ${characterLimit} characters before publishing`)
    }

    if (!tags.length) {
      return toast.error("Please enter at least one tag")

    }

    let loadingToast = toast.loading("Publishing");

    e.target.classList.add('disable')

    let blogObject = { title, banner, description, content, tags, draft: false }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObject, id:blog_id}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(() => {
        e.target.classList.remove('disable')
        toast.dismiss(loadingToast);
        toast.success("Published 👍🏼")

        setTimeout(() => {
          navigate("/")
        }, 600)

      })
      .catch(({ response }) => {
        e.target.classList.remove('disable')
        toast.dismiss(loadingToast);
        return toast.error(response.data.error)
      })




  }


  return (
    <AnimationWrap>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[1%] lg:top-[10%]"
          onClick={ handleClose }
        >
          <i className="fi fi-rr-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1 font-bold text-2xl">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={ banner } alt="" />
          </div>

          <h1
            className="font-medium text-4xl mt-2 leading-tight line-clamp-2"
          >
            { title }
          </h1>

          <p className="font-gelasio line-clamp-3 text-xl leading-7 mt-4">
            { description }
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey text-xl font-bold mt-2 mb-2">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={ title }
            className="input-box pl-4"
            onChange={ handleBlogTitle }
          />

          <p className="text-dark-grey text-xl font-bold mt-2 mb-2">Short Description</p>
          <textarea
            maxLength={ characterLimit }
            defaultValue={ description }
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={ handleBlogDesc }
            onKeyDown={ handleDescKeyDown }
          >
          </textarea>
          <p className="mt-1 text-dark-grey text-sm text-right">{ characterLimit - description.length } characters left</p>

          <p className="text-dark-grey text-xl font-bold mt-2 mb-2">Topics (Helps searching and ranking your blog post)</p>

          <div className="input-box relative pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topics"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={ handleTagKeyDown }
            />
            {
              tags.map((tag, index) => {
                return <Tag tag={ tag } key={ index } />
              })
            }

          </div>

          <p className="mt-1 text-dark-grey text-sm text-right">{ tagLimit - tags.length } tags left</p>

          <button
            className="btn-dark px-8 mt-2"
            onClick={ publishBlog }
          >
            Publish
          </button>



        </div>

      </section>
    </AnimationWrap>
  )
}
export default PublishForm