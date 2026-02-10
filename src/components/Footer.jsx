export default function Footer(){
    return (
        <footer>
            <div className="section-1">
                <div className="s1c1">
                    <div className="c1-top">
                        <h1>START</h1>
                        <h1 className="red">RUNNING.</h1>
                        <p>Follow us on Social Media And join Our WhatsApp Group for real-time updates, Drop Your Email below to get Run Announcements.</p>
                    </div>
                    <div className="s1c2">
                        <form className="email">
                            <input id="email" type="email" placeholder="Email Address" required />
                            <button type="submit">SUBSCRIBE</button>
                        </form>
                    </div>
                </div>
                <div className="s2c2">
                    <div className="colors">
                        <div className="city-1"></div>
                        <div className="city-2"></div>
                        <div className="city-3"></div>
                        <div className="city-4"></div>
                        <div className="city-5"></div>
                    </div>
                    <div className="social-container">
                        <ul className="social">
                            <li><a><i className="fa-brands fa-whatsapp"></i></a></li>
                            <li><a><i className="fa-brands fa-instagram"></i></a></li>
                            <li><a><i className="fa-brands fa-strava"></i></a></li>
                        </ul>
                    </div>
                    <div className="bottom">
                        <p>LATIN RUN CLUB</p>
                        <small>BASED IN THE CITY, COMMUNITY DRIVEN. OPEN TO ALL. </small>                       
                        <small>&copy; 2026 LATIN RUN CLUB. PACE IN JUST A NUMBER.</small>
                    </div>
                </div>
            </div>
            <div className="section-2">
                <div>
                    <ul className="inside-links">
                        <li><a>ABOUT US</a></li>
                        <li><a>EVENTS</a></li>
                        <li><a>DONATE</a></li>
                        <li><a>TERMS</a></li>
                    </ul>
                </div>
                <div className="translate">
                    <p>ENGLISH</p>
                    <p><i className="fa-solid fa-globe"></i></p>
                </div>
            </div>
        </footer>
        
    )
}