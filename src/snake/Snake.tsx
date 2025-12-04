import { useEffect, useState } from "react"

export default function Snake() {

    const [map, setMap] = useState<number[][]>([[]]);
    const size: number = 15;

    useEffect(() => {
        const new_map: number[][] = [];
        
        for (let i = 0; i < size; i++) {
            const line: number[] = [];
            
            for (let j = 0; j < size; j++) {
                line.push(0);
            }
            new_map.push(line);
        }
        setMap(new_map);
    }, [])

    return <div>
        {map.map((line: number[], key_line: number) => {
            return <div key={key_line}>
                {line.map((value: number, key: number) => {
                    return <div key={key}>

                    </div>
                })}
            </div>
        })}
    </div> 

}