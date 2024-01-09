import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <h1>SustainaBite</h1>

            <Link to="/login" className="link">Login</Link>

        </>
    );
}

export default Home;
