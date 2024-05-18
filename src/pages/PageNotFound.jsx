import { Link } from 'react-router-dom'
import noPage from '../imgs/404-Error.png'
import fullLogo from '../imgs/full-logo.png'
function PageNotFound() {
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-10 text-center">

            <img src={ noPage } alt="Error 404" className='select-none  w-96 aspect-square object-cover rounded' />
            <h1 className='text-4xl font-gelasio '>Page Not Found</h1>

            <p className='text-dark-grey text-2xl -mt-8'>The page you are looking for does not exist. Head back to the <Link to={ "/" } className='text-black underline text-2xl'>Home Page</Link>. </p>

            <div className="mt-auto">
                <img src={ fullLogo } alt="Logo" className='h-8 object-contain block mx-auto select-none'/>
                <p className='mt-5 text-dark-grey'>Read millions of stories around the world ❤️</p>

            </div>



        </section>
    )
}
export default PageNotFound