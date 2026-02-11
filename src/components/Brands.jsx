export default function Brands(props){
    return (
        <section className="brands">
            <div>
                <img src={props.url} alt={props.brandName} />
                <h1>{props.brandName}</h1>
            </div>
        </section>
    )
}