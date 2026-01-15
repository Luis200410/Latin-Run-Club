import { createRoot } from 'react-dom/client'
import Header from './src/assets/components/Header'
import Founders from './src/assets/components/Founders'

const root = createRoot(document.getElementById('root'))

// function Main(){

// }

root.render(
    <>
        <Header />
        <Founders />
    </>
)
