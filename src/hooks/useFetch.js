import { useState, useEffect } from 'react';

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/movies_screenings.json')
            .then((response) => response.json())
            .then(setData)
            .catch(setError);
    }, ['/movies_screenings.json']);

    return { data, error };
}
