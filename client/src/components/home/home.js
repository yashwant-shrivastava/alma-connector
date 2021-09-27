import Particles from "../particles/particle";
import Navbar from "../navbar";
import {Component, Fragment} from "react";


class Home extends Component {
    render() {
        return (
            <Fragment style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}>
                <Particles/>
                <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}>
                    <Navbar/>
                    <h1> hello </h1>
                </div>
            </Fragment>
        )
    }
}

export default Home;