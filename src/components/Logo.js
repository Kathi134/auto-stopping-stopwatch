export default function Logo() {
    return(
        <img className="logo" src={`${process.env.PUBLIC_URL}/logo.PNG`} alt="logo"/>
    )
}