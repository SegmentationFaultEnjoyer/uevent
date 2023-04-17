import { MutatingDots } from 'react-loader-spinner';

export function DotsLoader() {
    return(
        <div>
            <MutatingDots 
                color="var(--secondary-dark)" 
                secondaryColor="var(--secondary-main)"
                height={100} 
                width={100}/>
        </div>
    )
}