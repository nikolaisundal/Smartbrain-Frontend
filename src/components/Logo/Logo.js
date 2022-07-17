import React from 'react';
import Tilt from 'react-parallax-tilt' 
import brain from './brain.png' 
import './Logo.css'



//min versjon av react er for ny for react tilt virker det som.
//Bruker derfor react-parallax-tilt isteden.

//

const Logo = () => {
    return (<div>
        <Tilt className='pointer Tilt br2 shadow-2 ma4 mt0'>
            <div>
                <img alt='logo' src={brain}></img>
                
            </div>
        </Tilt>  
        <div className='light-red tl pa1 ml3'><p>rub my brain,</p> <p>feelz good</p></div>
    </div>
    
    );
}

export default Logo;

//1.02

//ma4 mt0
/* 
<Tilt className='Tilt br2 shadow-2'>
            <div>
                <img alt='logo' src={brain}></img>
            </div>
        </Tilt>  */