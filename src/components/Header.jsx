export default function Header(){
    return (
        <header>
            <div>
                <a href="../index.html"><img src="/src/images/logo.png" alt="Latin Run Club Logo" className="logo" /></a>
            </div>
            <div>
                <ul className="list">
                    <li><a href="#">About</a></li>
                    <li><a href="#">Events</a></li>
                    <li><a href="#">Gallery</a></li>
                    <li><a href="#">Join</a></li>
                </ul>
            </div>
            <div>
            <button className="log"><i></i>Sing In</button>
            </div>

        </header>
    )
}