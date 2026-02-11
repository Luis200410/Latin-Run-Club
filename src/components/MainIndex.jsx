import { Link } from "react-router-dom"

export default function MainIndex(){
    return (
        <section className="main">
            <div className="title">
                <h1 className="above">LATIN RUN</h1>
                <h1 className="under">CLUB</h1>
            </div>
            <div className="links">
                <Link to="/join" className="join">JOIN US</Link>
                <Link to="/about" className="about">ABOUT</Link>
                <Link to="/donate" className="donate">DONATE</Link>
            </div>
        </section>
    )
}