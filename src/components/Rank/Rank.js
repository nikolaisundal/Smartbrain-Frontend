import React from 'react';


const Rank = ({name, entries }) => {
    return (
       <div>
            <div className='black f3'>
                    {`Greetings ${name}, your current rank is `}
            </div>
            <div className='black f1 pa2'>
                    {entries}
            </div>
       </div>
    );
}

export default Rank;
