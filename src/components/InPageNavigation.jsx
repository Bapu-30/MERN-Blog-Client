import { useEffect, useRef, useState } from "react"

export let activeTabLine;
export let activeTab;

function InPageNavigation({ routes, defaultHidden, children, defaultActiveIndex = 0 }) {

    let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex)

    activeTabLine = useRef();
    activeTab = useRef();

    const changePageState = (btn, index) => {
        let { offsetWidth, offsetLeft } = btn;

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = (offsetLeft + 3) + "px";

        setInPageNavIndex(index)
    }

    useEffect(() => {
        changePageState(activeTab.current, defaultActiveIndex)
    }, [])

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto ">
                {
                    routes.map((route, index) => {
                        return (
                            <button
                                key={ index }
                                ref={ index == defaultActiveIndex ? activeTab : null }
                                className={ "p-4 px-5 capitalize " + (inPageNavIndex == index ? "text-black font-semibold " : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden" : "") }
                                onClick={ (e) => { changePageState(e.target, index) } }
                            >
                                { route }
                            </button>
                        )
                    })
                }
                <hr ref={ activeTabLine } className="absolute bottom-0 duration-300" />
            </div>
            { Array.isArray(children) ? children[inPageNavIndex] : children }
        </>
    )
}
export default InPageNavigation