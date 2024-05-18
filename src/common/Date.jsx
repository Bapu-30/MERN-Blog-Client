const months = ["January", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Satday"];

export const getDay = (timeStamp) => {
    let date = new Date(timeStamp)
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
}

export const getFullDay = (timeStamp) =>{
    let date = new Date(timeStamp);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
