import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

export default function useOnScreen() {
 const [isEmbeddable, setIsEmbeddable] = useState(false);
 let { channelId } = useParams();
 useEffect(() => {
    if (channelId) {
        setIsEmbeddable(true)
    }
 }, [channelId]);

 return isEmbeddable;
}