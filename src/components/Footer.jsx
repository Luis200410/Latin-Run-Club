export default function Footer(){
    return (
        <footer>
            <div className="section-1">
                <div className="column-1">
                    <h1><strong>Latin</strong><span> Run Club</span></h1>
                    <p>Redefining urban movement through heritage, endurance, and the collective spirit of the modern athlete.</p>
                </div>
                <div className="links">
                    <div>
                        <h4>Club</h4>
                        <ul>
                            <a href="#"><li>About</li></a>
                            <a href="#"><li>Gallery</li></a>
                            <a href="#"><li>Story</li></a>
                        </ul>
                    </div>
                    <div>
                        <h4>Community</h4>
                        <ul>
                            <a href="#"><li>Events</li></a>
                            <a href="#"><li>Messaging</li></a>
                            <a href="#"><li>Members</li></a>
                        </ul>
                    </div>
                    <div>
                        <h4>Support</h4>
                        <ul>
                            <a href="#"><li>Donate</li></a>
                            <a href="#"><li>Shops</li></a>
                            <a href="#"><li>Contact</li></a>
                        </ul>
                    </div>
                    <div>
                        <h4>Stay Connected</h4>
                        <form className="form">
                            <input type="email"></input>
                            <button>Suscribe</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="section-2">
                <p>&copy; 2026 Latin Run Club</p>
                <ul>
                    <a href="#"><li>Privacy</li></a>
                    <a href="#"><li>Terms</li></a>
                    <a href="#"><li>Cookies</li></a>
                </ul>
                <div className="colors">
                    <div className="colors"></div>
                    <div className="colors"></div>
                    <div className="colors"></div>
                    <div className="colors"></div>
                    <div className="colors"></div>
                </div>
                <ul className="logo-links">
                    <a href="#"><i></i></a>
                    <a href="#"><i></i></a>
                    <a href="#"><i></i></a>
                </ul>
            </div>
        </footer>
    )
}