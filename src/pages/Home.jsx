import Founders from '../components/Founders';
import founders from '../info/founders.js';

export default function Home() {
    const founderList = founders.map((founder, index) => {
        return <Founders
            key={index}
            {...founder}
        />
    }
    )

    return (
        <div className='founders'>
            {founderList}
        </div>
    );
}
