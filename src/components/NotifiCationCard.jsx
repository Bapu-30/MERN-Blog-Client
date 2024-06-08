import { Link } from "react-router-dom";
import { getDay } from "../common/Date";
import { useContext, useState } from "react";
import NotificationCommentField from "./NotificationCommentField";
import { UserContext } from "../App";
import axios from "axios";

function NotificationCard({ data, index, notificationState }) {

    let [isReplying, setReplying] = useState(false)

    let { type, seen, reply, comment, replied_on_comment, createdAt, user, user: { personal_info: { fullName, profile_img, userName } }, blog: { _id, blog_id, title }, _id: notification_id } = data;

    let { userAuth: { userName: author_userName, profile_img: author_profile_img, accessToken } } = useContext(UserContext);

    let { notifications, notifications: { results, totalDocs }, setNotifications } = notificationState;

    const handleReplyClick = () => {
        setReplying(pre => !pre)
    }

    // console.log(data);

    const handleDelete = (comment_id, type, target) => {

        target.setAttribute("disabled", true)

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id: comment_id }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(() => {
                if (type == 'comment') {
                    results.splice(index, 1)
                } else {
                    delete results[index].reply;
                }

                target.removeAttribute("disabled");
                setNotifications({ ...notifications, results, totalDocs: totalDocs - 1, deletedDocCount: notifications.deletedDocCount + 1 })
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className={ "p-6 border-b border-grey border-l-black " + (!seen ? "border-l-2" : "") }>
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
                            {
                                !reply ?
                                    <button className="underline hover:text-black" onClick={ handleReplyClick }>Reply</button>
                                    : ""
                            }
                            <button className="underline hover:text-black" onClick={ (e) => handleDelete(reply._id, "comment", e.target) }>Delete</button>
                        </> : ""
                }

            </div>

            {
                isReplying ?
                    <div className="mt-8">
                        <NotificationCommentField _id={ _id } blog_author={ user } index={ index } replyingTo={ comment._id } setReplying={ setReplying } notification_id={ notification_id } notificationData={ notificationState } />
                    </div> : ""

            }

            {
                reply ?
                    <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
                        <div className="flex gap-3 mb-3">
                            <img src={ author_profile_img } alt="author profile image" className="w-8 h-8 rounded-full" />

                            <div>
                                <h1 className="font-medium text-xl text-dark-grey">
                                    <Link to={ `/user/${author_userName}` } className="mx-1 underline text-black">@{ author_userName }</Link>

                                    <span className="font-normal">Replied to</span>

                                    <Link to={ `/user/${userName}` } className="mx-1 underline text-black">@{ userName }</Link>
                                </h1>
                            </div>
                        </div>
                        <p className="font-gelasio ml-14 text-xl my-2">{ reply.comment }</p>

                        <button className="underline hover:text-black ml-14 mt-2" onClick={ (e) => handleDelete(comment._id, "reply", e.target) }>Delete</button>
                    </div>
                    : ""
            }

        </div>
    )
}
export default NotificationCard