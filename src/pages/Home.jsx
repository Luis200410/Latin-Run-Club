import MainIndex from "../components/MainIndex";
import Excuse from "../components/Excuse";
import EventsContainer from "../components/EventsContainer";
import BrandContainer from "../components/BrandContainer";
import Gallery from "./Gallery";
import '../style/main-index.css';
import '../style/excuse.css';
import '../style/brands.css';

export default function Home() {
    return (
        <>
            <Gallery />
            <MainIndex />
            <Excuse />
            <EventsContainer />
            <BrandContainer />
        </>
    )
}
