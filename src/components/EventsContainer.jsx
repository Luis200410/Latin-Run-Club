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
            <h1>SCHEDULE<span className='blue'>.</span></h1>
            <p>CITY ADVENTURES / 2026</p>
            <div>
                {eventsPrev}
            </div>
            
        </section>
        
    )
}