import { createContext, useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";
import Loader from "../components/Loader";
import axios from 'axios';

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  description: "",
  author: { personal_info: {} }
}

export const EditorContext = createContext({})

function Editor() {

  let { userAuth: { accessToken } } = useContext(UserContext);

  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id, draft: true, mode: "edit" })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false)
      })
      .catch(err => {
        setBlog(null)
        setLoading(false)
      })
  }, [])



  return (
    <EditorContext.Provider value={ { blog, setBlog, editorState, setEditorState, textEditor, setTextEditor } }>
      {

        accessToken === null ? <Navigate to='/signin' /> :
          loading ? <Loader /> :
            editorState == "editor" ? <BlogEditor /> :
              <PublishForm />
      }
    </EditorContext.Provider>
  )
}
export default Editor