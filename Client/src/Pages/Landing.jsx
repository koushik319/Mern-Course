
import Wrapper from '../assets/wrappers/LandingPage';
import main from '../assets/images/main.svg';
import { Link } from "react-router-dom";
import {Logo} from '../components'
const Landing=()=>{
    return(
        <Wrapper>
           <nav>
            <Logo/>
           </nav>
           <div className="container page">

            <div className="info">
                <h1>Placement <span>Portal</span> </h1>

                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Debitis doloribus, odio voluptatibus quos harum quisquam placeat consequatur
                     veniam reiciendis magni commodi quae soluta ducimus quis? Vero repudiandae
                      amet voluptas pariatur?
                
                </p>

                <Link to ='/register' className="btn register-link">Register</Link>
                <Link to ='/login' className="btn">Login / Demo User</Link>
            </div>
            <img src={main} alt="job hunt" className="img main-img"/>
        </div>

        </Wrapper>
    )
}


export default Landing;