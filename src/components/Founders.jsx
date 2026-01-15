export default function Founders(props){
    console.log(props)
    return(
    <>
        <div className="founder">
            <div>
                <h1>{props.name}</h1>                
            </div>
            <div>
                <img src={props.image.src} alt={props.image.alt} />
            </div>
        </div> 
    </>   
    )
}