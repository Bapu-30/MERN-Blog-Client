import { useState } from "react"

function Notifications() {

    const [filter, setFilter] = useState('all');

    let filters = ['all', 'like', 'comment', 'reply'];

    const handleSelectedClick = (e) => {
        let button = e.target;

        setFilter(button.innerText.toLowerCase());

    }



    return (

        <div>
            <h1 className="max-md:hidden">Notifications</h1>

            <div className="my-8 flex gap-6">
                {
                    filters.map((filterName, i) => {
                        return <button onClick={ handleSelectedClick } key={ i } className={ "py-2 " + (filter == filterName ? "btn-dark" : "btn-light") }>{ filterName }</button>
                    })

                }
            </div>
        </div >
    )
}
export default Notifications