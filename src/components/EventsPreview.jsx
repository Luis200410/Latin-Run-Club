export default function EventsPreview(props){

// const card = document.getElementById('event-card')

//     card.addEventListener('mouseover', function(){
//         if (props.city === 'New York'){
//             card.style.backgroundColor = 'rgb(0, 151, 178);'
//         }
        
        
//     })

    console.log(props)
    return (
        <div className='eventCard' id="event-card">
            <p className='eventDate'>{props.date}</p>
            <h1 className='eventName'>{props.runName}</h1>
            <div className="eventData">
                <p className="eventDistance">{props.distance}</p>
                <p className="eventLevel">{props.level}</p>
                <a href={props.meetingPoint} className="eventLocation" target="_blank">Meeting Point</a>
            </div>
            <button className="eventJoin">JOIN RUN</button>
        </div>
    )
}