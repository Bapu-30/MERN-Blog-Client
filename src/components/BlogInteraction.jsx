import { useContext, useEffect } from "react"
import { BlogContext } from "../pages/BlogPage"
import { Link } from "react-router-dom"
import { UserContext } from '../App'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'

function BlogInteraction() {

  let { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { userName: author_userName } } }, setBlog, isLikedByUser, setLikedByUser, setCommentsWrapper } = useContext(BlogContext)

  let { userAuth: { userName, accessToken } } = useContext(UserContext);

  useEffect(() => {
    if (accessToken) {
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isLiked-by-user", { _id }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(({ data: { result } }) => {
          setLikedByUser(Boolean(result))
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [])

  const handleLike = () => {
    if (accessToken) {
      setLikedByUser(pre => !pre)
      !isLikedByUser ? total_likes++ : total_likes--;
      setBlog({ ...blog, activity: { ...activity, total_likes } })
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        // .then(({ data }) => {
        //   console.log(data);
        // })
        .catch(err => {
          console.log(err);
        })

    } else {
      toast.error("Please Signin to like a blog")
    }
  }

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2 " />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">

          <button
            onClick={ handleLike }
            className={ "w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80") }>
            <i className={ `fi fi-${isLikedByUser ? "sr" : "rr"}-heart mt-2` }></i>
          </button>
          <p className="text-xl text-dark-grey">{ total_likes }</p>



          <button
            onClick={() =>setCommentsWrapper(pre => !pre)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{ total_comments }</p>

        </div>

        <div className="flex gap-6 items-center ">

          {
            userName == author_userName ?
              <Link to={ `/editor/${blog_id}` } className="underline hover:text-purple ">
                Edit
              </Link>
              : ""
          }


          <Link to={ `https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}` }><i
            className="fi fi-brands-twitter text-xl  hover:text-twitter"></i></Link>

        </div>

      </div >
      <hr className="border-grey my-2 " />
    </>
  )
}
export default BlogInteraction