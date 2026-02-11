export default function EventsPreview(props){
    console.log(props)
    return (
        <div className='eventCard'>
            <p className='eventDate'>{props.date}</p>
            <h1 className='eventName'>{props.runName}</h1>
            <div className="eventData">
                <p className="eventDistance">{props.distance}</p>
                <p className="eventLevel">{props.level}</p>
            </div>
            <a href={props.meetingPoint} target="_blank" className="eventLocation">Meeting Point</a>
        </div>
    )
}