import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'
import AnimationWrap from '../common/AnimationWrap';
import Loader from '../components/Loader';
import { UserContext } from '../App';
import AboutUser from '../components/AboutUser';
import { filterPaginationData } from '../common/FilterPagination';
import InPageNavigation from '../components/InPageNavigation';
import BlogPostCard from '../components/BlogPostCard';
import NoData from '../components/NoData';
import LoadMoreDatabtn from '../components/LoadMoreDatabtn';
import PageNotFound from './PageNotFound';


// empty dataset for user details
export const profileData = {
    personal_info: {
        fullName: "",
        userName: "",
        bio: "",
        profile_img: "",
    },
    social_links: {},

    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    joinedAt: "",


}


function ProfilePage() {

    let { id: profileId } = useParams()

    let [profile, setProfile] = useState(profileData);
    let [loading, setLoading] = useState(true);
    let [blogs, setBlogs] = useState(null);
    let [profileLoaded, setProfileLoaded] = useState("");

    let { personal_info: { fullName, userName: profile_userName, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile

    let { userAuth: { userName } } = useContext(UserContext)

    const fetchuserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { userName: profileId })
            .then(({ data: user }) => {
                if (user != null) {
                    setProfile(user);
                }
                setProfileLoaded(profileId)
                getBlogs({ user_id: user._id })
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
            })
    }


    const getBlogs = ({ page = 1, user_id }) => {

        user_id = user_id == undefined ? blogs.user_id : user_id;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { author: user_id, page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { author: user_id }
                })

                formatedData.user_id = user_id;
                // console.log(formatedData);
                setBlogs(formatedData)
            })

    }

    const resetState = () => {
        setProfile(profileData);
        setProfileLoaded("")
        setLoading(true);
    }

    useEffect(() => {
        if (profileId != profileLoaded) {
            setBlogs(null)
        }

        if (blogs == null) {
            resetState()
            fetchuserProfile()
        }

    }, [profileId, blogs])


    return (
        <AnimationWrap>
            {
                loading ? <Loader /> :
                    profile_userName.length ?
                        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>

                            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">

                                <img src={ profile_img } alt="Profile image" className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32' />

                                <h1 className='text-2xl font-medium'>@{ profile_userName }</h1>

                                <p className='text-xl capitalize h-6'>{ fullName }</p>
                                <p>{ total_posts.toLocaleString() } Blogs - { total_reads.toLocaleString() } Reads</p>

                                <div className="flex gap-4 mt-2 ">

                                    {
                                        profileId == userName ?
                                            <Link
                                                to="/settings/edit-profile"
                                                className='btn-light rounded-md'>
                                                Edit Profile
                                            </Link> :
                                            ""
                                    }

                                </div>

                                <AboutUser className="max-md:hidden" bio={ bio } social_inks={ social_links } joinedAt={ joinedAt } />

                            </div>

                            <div className='max-md:mt-12 w-full '>
                                <InPageNavigation
                                    routes={ ["Blogs Published", "About"] }
                                    defaultHidden={ ["About"] }
                                >
                                    <>
                                        {
                                            blogs == null ? <Loader /> :

                                                (
                                                    blogs.results.length ?
                                                        blogs.results.map((blog, index) => {
                                                            return (
                                                                <AnimationWrap
                                                                    key={ index }
                                                                    transition={ { duration: 1, delay: index * 0.1 } }
                                                                >
                                                                    <BlogPostCard content={ blog } author={ blog.author.personal_info } />
                                                                </AnimationWrap>
                                                            )
                                                        })
                                                        :
                                                        <NoData message={ "No Blogs Found" } />
                                                )
                                        }

                                        <LoadMoreDatabtn state={ blogs } fetchDataFun={ getBlogs } />

                                    </>

                                    <>
                                        <AboutUser bio={ bio } social_inks={ social_links } joinedAt={ joinedAt } />
                                    </>

                                </InPageNavigation>
                            </div>

                        </section>
                        : <PageNotFound />
            }
        </AnimationWrap>

    )
}
export default ProfilePage