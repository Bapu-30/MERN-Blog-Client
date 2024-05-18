import { useEffect, useState } from "react"
import AnimationWrap from "../common/AnimationWrap"
import InPageNavigation from "../components/InPageNavigation"
import axios from 'axios'
import Loader from "../components/Loader";
import BlogPostCard from "../components/BlogPostCard";
import MinimalBlogPost from "../components/MinimalBlogPost";
import { activeTab } from "../components/InPageNavigation";
import NoData from "../components/NoData";
import { filterPaginationData } from "../common/FilterPagination";
import LoadMoreDatabtn from "../components/LoadMoreDatabtn";

function Homepage() {

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let [pageState, setPageState] = useState("home");

    let categories = ["tech", "entertainment", "health", "food", "gaming", "aI", "bollywood", "business", "film making"]

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        setBlogs(null)

        if (pageState == category) {
            setPageState("home");
            return;
        }

        setPageState(category)


    }

    const fetchLatestBlogs = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
            .then(async ({ data }) => {


                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page: page,
                    countRoute: "/all-latest-blogs-count"

                })

                setBlogs(formatedData)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data: { blogs } }) => {
                setTrendingBlogs(blogs)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchBlogsbyCategories = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page })
            .then(async ({ data }) => {

                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page: page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { tag: pageState }

                })
                setBlogs(formatedData)
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {

        activeTab.current.click();

        if (pageState == "home") {
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogsbyCategories({ page: 1 })
        }
        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
    }, [pageState])

    return (
        <AnimationWrap>
            <section className="h-cover flex justify-center gap-10 ">
                {/* Latest blogs div */ }
                <div className="w-full ">
                    <InPageNavigation
                        routes={ [pageState, "Trending"] }
                        defaultHidden={ ["Trending"] }
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

                            <LoadMoreDatabtn state={ blogs } fetchDataFun={ pageState == "home" ? fetchLatestBlogs : fetchBlogsbyCategories } />

                        </>

                        <>
                            {
                                trendingBlogs == null ? <Loader /> :

                                    (
                                        trendingBlogs.length ?
                                            trendingBlogs.map((blog, index) => {
                                                return (
                                                    <AnimationWrap
                                                        key={ index }
                                                        transition={ { duration: 1, delay: index * 0.1 } }
                                                    >
                                                        <MinimalBlogPost blog={ blog } index={ index } />
                                                    </AnimationWrap>
                                                )
                                            })
                                            :
                                            <NoData message={ "No Blogs Found" } />
                                    )
                            }
                        </>

                    </InPageNavigation>
                </div>

                {/* Filters and trending blogs div */ }
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="text-xl font-semibold mb-8">Stories from all interests</h1>

                            <div className="flex gap-3 flex-wrap ">
                                {
                                    categories.map((category, index) => {
                                        return (
                                            <button
                                                className={ "tag " + (pageState == category ? "bg-black text-white" : "") }
                                                key={ index }
                                                onClick={ loadBlogByCategory }
                                            >
                                                { category }
                                            </button>)
                                    })
                                }
                            </div>
                        </div>



                        <div className="">
                            <h1 className="text-xl mb-8 font-semibold">Trending <i className="fi fi-br-arrow-trend-up  ml-1 mt-1"></i></h1>

                            {
                                trendingBlogs == null ? <Loader /> :

                                    (
                                        trendingBlogs.length ?
                                            trendingBlogs.map((blog, index) => {
                                                return (
                                                    <AnimationWrap
                                                        key={ index }
                                                        transition={ { duration: 1, delay: index * 0.1 } }
                                                    >
                                                        <MinimalBlogPost blog={ blog } index={ index } />
                                                    </AnimationWrap>
                                                )
                                            })
                                            :
                                            <NoData message={ "No Blogs Found" } />
                                    )
                            }

                        </div>
                    </div>

                </div>
            </section>
        </AnimationWrap>
    )
}
export default Homepage