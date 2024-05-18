import { useParams } from "react-router-dom"
import InPageNavigation from "../components/InPageNavigation"
import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import AnimationWrap from "../common/AnimationWrap"
import BlogPostCard from "../components/BlogPostCard"
import NoData from "../components/NoData"
import LoadMoreDatabtn from "../components/LoadMoreDatabtn"
import axios from 'axios'
import { filterPaginationData } from "../common/FilterPagination"
import UserCard from "../components/UserCard"

function SearchPage() {

    let { query } = useParams();
    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {


                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page: page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { query },
                    create_new_arr

                })

                setBlogs(formatedData)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", {"query" : query})
            .then(({ data: { users } }) => {
                setUsers(users)
                // console.log(users);
            })
    }

    useEffect(() => {
        resetState()
        searchBlogs({ page: 1, create_new_arr: true })
        fetchUsers()
    }, [query])

    const resetState = () => {
        setBlogs(null)
        setUsers(null)

    }

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader /> :
                        users.length ?
                            users.map((user, i) => {
                                return (
                                    <AnimationWrap key={ i } transition={ { duration: 1, delay: i * 0.08 } }>

                                        <UserCard user={user}/>

                                    </AnimationWrap>
                                )
                            })
                            : <NoData message={ "No Users Found" } />
                }
            </>
        )
    }



    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={ [`Search results for "${query}"`, "Accounts matched"] } defaultHidden={ ["Accounts matched"] } >
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
                        <LoadMoreDatabtn state={ blogs } fetchDataFun={ searchBlogs } />
                    </>
                    <UserCardWrapper />
                </InPageNavigation>
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className=" font-semibold mb-8">Accounts Matched <i className="fi fi-bs-user ml-1"></i></h1>
                <UserCardWrapper />
            </div>
        </section>
    )
}
export default SearchPage