import { Link } from "react-router-dom"
import { getDay } from "../common/date"

function MinimalBlogPost({ blog, index }) {

    let { title, blog_id: id, publishedAt, author: { personal_info: { fullName, userName, profile_img } } } = blog

    return (
        <Link to={ `/blog/${id}` } className="flex gap-5 mb-4 pb-4 border-b border-grey">
            <h1 className="blog-index">{ index < 10 ? "0" + (index + 1) : index + 1 }</h1>

            <div>
                <div className="flex gap-2 items-center mb-2">
                    <img src={ profile_img } alt="User profile image" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1 capitalize">{ fullName } @{ userName }</p>
                    <p className="min-w-fit">{ getDay(publishedAt) }</p>
                </div>

                <h1 className="blog-title">{title}</h1>
            </div>

        </Link>
    )
}
export default MinimalBlogPost