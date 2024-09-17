import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import './styles/Movie.css';

const AppToaster = Toaster.create({
    position: "top"
});

function Screening() {
    const [screenings, setScreenings] = useState([]);
    const [newMovieId, setNewMovieId] = useState('');
    const [newScreenId, setNewScreenId] = useState('');
    const [newType, setNewType] = useState('');
    const [newTime, setNewTime] = useState('');

    useEffect(() => {
        fetch('/movies_screenings.json')
            .then((response) => response.json())
            .then((data) => setScreenings(data.Screening))
            .catch((error) => console.error('Error fetching screening data:', error));
    }, []);

    function addScreening() {
        const movieId = newMovieId.trim();
        const screenId = newScreenId.trim();
        const type = newType.trim();
        const time = newTime.trim();

        if (movieId && screenId && type && time) {
            const newScreening = {
                screening_id: screenings.length + 1, // Just for now
                movie_id: movieId,
                screen_id: screenId,
                screening_type: type,
                screening_time: time
            };

            setScreenings([...screenings, newScreening]);

            AppToaster.show({
                message: "Screening Added Successfully",
                intent: 'success',
                timeout: 3000
            });

            setNewMovieId('');
            setNewScreenId('');
            setNewType('');
            setNewTime('');
        }
    }

    function updateScreening(id) {
        const screeningToUpdate = screenings.find((screening) => screening.screening_id === id);

        fetch(`/movies_screenings/${id}`, // Endpoint should be correct
            {
                method: "PUT",
                body: JSON.stringify(screeningToUpdate),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        )
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setScreenings(screenings.map(screening =>
                screening.screening_id === id ? { ...screeningToUpdate } : screening
            ));

            AppToaster.show({
                message: "Screening Updated Successfully",
                intent: 'success',
                timeout: 3000
            });
        })
        .catch((error) => {
            console.error('Error updating screening data:', error);
            AppToaster.show({
                message: "Error Updating Screening",
                intent: 'danger',
                timeout: 3000
            });
        });
    }

    function deleteScreening(id) {
        setScreenings(screenings.filter(screening => screening.screening_id !== id));
        AppToaster.show({
            message: "Screening Deleted Successfully",
            intent: 'success',
            timeout: 3000
        });
    }

    return (
        <div className="Screening">
            <table className="bp4-html-table modifier">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Movie ID</th>
                        <th>Screen ID</th>
                        <th>Type</th>
                        <th>Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {screenings.map(screening => (
                        <tr key={screening.screening_id}>
                            <td>{screening.screening_id}</td>
                            <td>
                                <EditableText
                                    onChange={value => setScreenings(screenings.map(s => s.screening_id === screening.screening_id ? { ...s, movie_id: value } : s))}
                                    value={screening.movie_id}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => setScreenings(screenings.map(s => s.screening_id === screening.screening_id ? { ...s, screen_id: value } : s))}
                                    value={screening.screen_id}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => setScreenings(screenings.map(s => s.screening_id === screening.screening_id ? { ...s, screening_type: value } : s))}
                                    value={screening.screening_type}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => setScreenings(screenings.map(s => s.screening_id === screening.screening_id ? { ...s, screening_time: value } : s))}
                                    value={screening.screening_time}
                                />
                            </td>
                            <td>
                                <Button intent="primary" onClick={() => updateScreening(screening.screening_id)}>
                                    Update
                                </Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button intent="danger" onClick={() => deleteScreening(screening.screening_id)} style={{ marginLeft: '10px' }}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td>
                            <InputGroup
                                value={newMovieId}
                                onChange={(e) => setNewMovieId(e.target.value)}
                                placeholder="Enter Movie ID"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newScreenId}
                                onChange={(e) => setNewScreenId(e.target.value)}
                                placeholder="Enter Screen ID"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                                placeholder="Enter Type"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                placeholder="Enter Time"
                            />
                        </td>
                        <td>
                        &nbsp;&nbsp;&nbsp;
                        
                            <Button intent="success" onClick={addScreening}>
                                Add Screening
                            </Button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default Screening;
