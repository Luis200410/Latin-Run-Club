import { createRoot } from 'react-dom/client'
import Header from './src/components/Header'
import Founders from './src/components/Founders'
import founders from './src/info/founders.js'
import Footer from './src/components/Footer'
import './src/style/Header.css'
import './src/style/footer.css'

const founder = founders.map((founder, index) =>  {
    return <Founders 
                key={index}
                {...founder}
            />
        }
)

const root = createRoot(document.getElementById('root'))

root.render(
    <>
        <Header />
        <div className='founders'> {founder}</div>
        <Footer />
    </>
)
