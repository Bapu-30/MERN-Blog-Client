import { Link } from "react-router-dom";
import { getDay } from "../common/Date";
import { useState } from "react";
import NotificationCommentField from "./NotificationCommentField";

function NotifiCationCard({ data, index, notificationState }) {

    let [isReplying, setReplying] = useState(false)

    let { type, comment, replied_on_comment, createdAt, user, user: { personal_info: { fullName, profile_img, userName } }, blog: { _id, blog_id, title }, _id: notification_id } = data;

    const handleReplyClick = () => {
        setReplying(pre => !pre)
    }

    return (
        <div className="p-6 border-b border-grey border-l-black ">
            <div className="flex gap-5 mb-3">
                <img src={ profile_img } className="w-14 h-14 flex-none rounded-full" />
                <div className="w-full">
                    <h1 className="text-xl text-dark-grey">
                        <span className="lg:inline-block hidden capitalize">{ fullName }</span>
                        <Link to={ `/user/${userName}` } className="font-semibold mx-1 underline">@{ userName }</Link>
                        <span className="font-normal">
                            {
                                type == 'like' ? "Liked your post" :
                                    type == 'comment' ? "Commented on" : "Replied on"
                            }
                        </span>
                    </h1>

                    {
                        type == 'reply' ?
                            <div className="p-2 mt-4 rounded-md bg-grey">
                                <p>{ replied_on_comment.comment }</p>
                            </div>
                            :
                            <Link className="text-dark-grey font-medium hover:underline line-clamp-2" to={ `/blog/${blog_id}` }>{ `"${title}"` }</Link>
                    }
                </div>
            </div>

            {
                type != 'like' ?
                    <p className="ml-[4.8rem] font-gelasio px-2 py-2 text-xl my-5 border-l-2 border-black rounded-r-md  bg-dark-grey/30 "> { comment.comment }</p> : ""
            }

            <div className="ml-14 pl-5  text-dark-grey flex gap-8">

                <p>{ getDay(createdAt) }</p>

                {
                    type != 'like' ?
                        <>
                            <button className="underline hover:text-black" onClick={ handleReplyClick }>Reply</button>
                            <button className="underline hover:text-black">Delete</button>
                        </> : ""
                }

            </div>

            {
                isReplying ?
                    <div className="mt-8">
                        <NotificationCommentField _id={ _id } blog_author={ user } index={ index } replyingTo={ comment._id } setReplying={ setReplying } notification_id={ notification_id } notificationData={ notificationState } />
                    </div> : ""

            }

        </div>
    )
}
export default NotifiCationCard