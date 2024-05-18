import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { BlogContext } from "../pages/BlogPage";

function CommentField({ action, index = undefined, replyingTo = undefined, setReplying }) {

    const [comment, setComment] = useState("");
    let { userAuth: { accessToken, userName, fullName, profile_img } } = useContext(UserContext)

    let { blog, blog: { _id, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments }, author: { _id: blog_author } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext)

    const handleComment = () => {
        if (!accessToken) {
            return toast.error("You need to Sign in for this")
        }
        if (!comment.length) {
            return toast.error("Write something in the comment section")
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", { _id, blog_author, comment, replying_to: replyingTo }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(({ data }) => {


                setComment("");

                data.commented_by = { personal_info: { userName, profile_img, fullName } }

                let newCommentArray;

                if (replyingTo) {
                    commentsArr[index].children.push(data._id);
                    data.childrenLevel = commentsArr[index].childrenLevel + 1;
                    data.parentIndex = index;
                    
                    commentsArr[index].isReplyLoaded = true;

                    commentsArr.splice(index + 1, 0, data);

                    newCommentArray = commentsArr;

                    setReplying(false)

                } else {
                    data.childrenLevel = 0;

                    newCommentArray = [data, ...commentsArr];
                }



                let parentCommentIncrementVal = replyingTo ? 0 : 1;

                setBlog({
                    ...blog,
                    comments: { ...comments, results: newCommentArray },
                    activity: {
                        ...activity, total_comments:
                            total_comments + 1, total_parent_comments:
                            total_parent_comments +
                            parentCommentIncrementVal
                    }
                })

                setTotalParentCommentsLoaded(pre => pre + parentCommentIncrementVal)



            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <Toaster />
            <textarea
                value={ comment }
                onChange={ (e) => setComment(e.target.value) }
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
            ></textarea>

            <button
                onClick={ handleComment }
                className="btn-dark mt-5 px-8">
                { action }
            </button>
        </>
    )
}
export default CommentField