import { Triangle } from 'react-loader-spinner';

export function TriangleLoader() {
    return(
        <div>
            <Triangle 
                color="var(--secondary-dark)" 
                height={130} 
                width={130}/>
        </div>
    )
}