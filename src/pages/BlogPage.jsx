import { Link, useParams } from 'react-router-dom';
import axios from 'axios'
import { createContext, useEffect, useState } from 'react';
import AnimationWrap from '../common/AnimationWrap';
import Loader from '../components/Loader';
import { getDay } from '../common/Date';
import BlogInteraction from '../components/BlogInteraction';
import BlogPostCard from '../components/BlogPostCard';
import BlogContent from '../components/BlogContent';
import CommentsContainer, { fetchComments } from '../components/CommentsContainer';


// empty blog structure
export const blogStructure = {
    title: "",
    content: [],
    description: "",
    banner: "",
    author: { personal_info: {} },
    publishedAt: ""
}

export const BlogContext = createContext({})

function BlogPage() {

    let { blog_id } = useParams();

    const [blog, setBlog] = useState(blogStructure);
    const [loading, setLoading] = useState(true);
    const [similarBlogs, setSimilarBlogs] = useState(null)
    const [isLikedByUser, setLikedByUser] = useState(false)
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);


    let { title, content, banner, description, author: { personal_info: { fullName,
        userName: author_userName, profile_img } }, publishedAt } = blog;

    const fetchBlog =  () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
            .then(async ({ data: { blog } }) => {

                blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFun: setTotalParentCommentsLoaded })

                setBlog(blog)
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: blog.tags[0], limit: 6, exclude_blog: blog_id })
                    .then(({ data }) => {
                        setSimilarBlogs(data.blogs)
                    })

                setLoading(false)
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
            })
    }

    const resetStates = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);
    }

    useEffect(() => {
        resetStates()
        fetchBlog();
    }, [blog_id])




    return (
        <AnimationWrap>
            {
                loading ? <Loader /> :

                    <BlogContext.Provider value={ { blog, setBlog, isLikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded } }>

                        <CommentsContainer />

                        <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                            <img src={ banner } alt="Blog banner" className='aspect-video' />

                            <div className="mt-12 ">
                                <h2>{ title }</h2>

                                <div className='flex max-sm:flex-col justify-between my-8 '>
                                    <div className='flex gap-5 items-start '>
                                        <img src={ profile_img } alt="User profile picture" className='w-12 h-12 rounded-full' />
                                        <p className='capitalize'>
                                            { fullName }
                                            <br />
                                            @
                                            <Link to={ `/user/${author_userName}` } className='underline'>
                                                { author_userName }
                                            </Link>
                                        </p>
                                    </div>
                                    <p className='text-dark-grey opacity-75 max-sm:mt-6'>Published On : { getDay(publishedAt) }</p>
                                </div>
                            </div>
                            <BlogInteraction />
                            <div className="my-12 font-gelasio blog-page-content ">
                                {
                                    content[0].blocks.map((block, i) => {
                                        return <div key={ i } className='my-4 md:my-8'>
                                            <BlogContent block={ block } />
                                        </div>
                                    })
                                }
                                content
                            </div>
                            <BlogInteraction />
                            {
                                similarBlogs != null && similarBlogs.length ?
                                    <>
                                        <h1 className='text-2xl mt-14 mb-10 font-medium'>similar blogs</h1>
                                        { similarBlogs.map((blog, i) => {
                                            let { author: { personal_info } } = blog;
                                            return <AnimationWrap key={ i } transition={ { duration: 1, delay: i * 0.08 } }>

                                                <BlogPostCard content={ blog } author={ personal_info } />

                                            </AnimationWrap>
                                        }) }
                                    </>
                                    : " "
                            }


                        </div>
                    </BlogContext.Provider>

            }
        </AnimationWrap>
    )
}
export default BlogPage