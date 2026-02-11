import EventsPreview from '../components/EventsPreview'
// props
import events from '../info/events.js'

const eventsPrev = events.map((event, index) => {
    return <EventsPreview
            key={index}
            {...event}
        />
})


export default function EventsContainer(){
    return (
        <section className="events">
            <h1>SCHEDULE<span>.</span></h1>
            <div>
                {eventsPrev}
            </div>
            
        </section>
        
    )
}