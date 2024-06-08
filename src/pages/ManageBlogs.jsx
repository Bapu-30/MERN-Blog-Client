import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import { UserContext } from "../App";
import { filterPaginationData } from "../common/FilterPagination";
import { Toaster, toast } from 'react-hot-toast'

function ManageBlogs() {
    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState("");

    let { userAuth: { accessToken } } = useContext(UserContext)

    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", { page, draft, query, deletedDocCount }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(async ({ data }) => {

                let formatedData = await filterPaginationData({
                    state: draft ? drafts : blogs,
                    data: data.blogs,
                    page: page,
                    user: accessToken,
                    countRoute: "/user-written-blogs-count",
                    data_to_send: { draft, query }

                })
                console.log(formatedData);

                if (draft) {
                    setDrafts(formatedData)
                } else {
                    setBlogs(formatedData)
                }


            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        if (accessToken) {
            if (blogs == null) {
                getBlogs({ page: 1, draft: false })
            }

            if (drafts == null) {
                getBlogs({ page: 1, draft: true })
            }
        }
    }, [accessToken, blogs, drafts, query])

    return (
        <>
            <h1 className="max-md:hidden ">Manage Blogs</h1>
            <Toaster />
            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input type="search" placeholder="Search Blogs" className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey" />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>
        </>
    )
}
export default ManageBlogs