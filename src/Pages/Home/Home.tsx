import Ceremony from "./Ceremony"
import Header from "./Header"
import Officiant from "./Officiant"
import Slider from "./Slider"


const Home = () => {
  return (
    <div className=" ">      
        <Header/>
        <Slider/>
        <Officiant/>
        <Ceremony/>
        
    </div>
  )
}

export default Home