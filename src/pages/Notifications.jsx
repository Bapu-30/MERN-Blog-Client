import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import { UserContext } from "../App";
import { filterPaginationData } from "../common/FilterPagination";
import Loader from "../components/Loader";
import AnimationWrap from "../common/AnimationWrap";
import NoData from "../components/NoData";
import NotificationCard from "../components/NotifiCationCard";
import LoadMoreDatabtn from "../components/LoadMoreDatabtn";

function Notifications() {

    let { userAuth: { accessToken } } = useContext(UserContext)

    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null)

    let filters = ['all', 'like', 'comment', 'reply'];


    const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notifications", { page, filter, deletedDocCount }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(async ({ data: { notifications: data } }) => {

                let formatedData = await filterPaginationData({
                    state: notifications,
                    data, page,
                    countRoute: "/all-notifications-count",
                    data_to_send: { filter },
                    user: accessToken
                })

                setNotifications(formatedData)
                console.log(formatedData);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {

        if (accessToken) {
            fetchNotifications({ page: 1 })
        }

    }, [accessToken, filter])

    const handleSelectedClick = (e) => {
        let button = e.target;

        setFilter(button.innerText.toLowerCase());
        setNotifications(null)

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

            {
                notifications == null ? <Loader /> :
                    <>
                        {
                            notifications.results.length ?
                                notifications.results.map((notification, i) => {
                                    return <AnimationWrap key={ i } transition={ { delay: i * 0.08 } }>
                                        <NotificationCard data={ notification } index={ i } notificationState={ { notifications, setNotifications } } />
                                    </AnimationWrap>
                                })
                                : <NoData message={ "You are all caught up." } />

                        }
                        <LoadMoreDatabtn state={ notifications } fetchDataFun={ fetchNotifications } additionalParams={ { deletedDocCount: notifications.deletedDocCount } } />
                    </>
            }
        </div >
    )
}
export default Notifications