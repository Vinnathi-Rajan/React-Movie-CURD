import './styles/Movie.css';
import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';

const AppToaster = Toaster.create({
    position: "top"
});

function Movie() {
    const [movies, setMovies] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newGenre, setNewGenre] = useState('');
    const [newDirector, setNewDirector] = useState('');

    useEffect(() => {
        fetch('/movies_screenings.json')
            .then((response) => response.json())
            .then((data) => setMovies(data.Movie))
            .catch((error) => console.error('Error fetching movie data:', error));
    }, []);

    function addMovie() {
        const title = newTitle.trim();
        const genre = newGenre.trim();
        const director = newDirector.trim();

        if (title && genre && director) {
            const newMovie = {
                movie_id: movies.length + 1,
                title,
                genre,
                director,
                duration: 120, // Placeholder value
                release_date: '2024-01-01', // Placeholder value
                rating: 8.0 // Placeholder value
            };

            setMovies([...movies, newMovie]);

            AppToaster.show({
                message: "Movie Added Successfully",
                intent: 'success',
                timeout: 3000
            });

            setNewTitle('');
            setNewGenre('');
            setNewDirector('');
        }
    }

    function onChangeHandler(id, key, value) {
        setMovies((movies) =>
            movies.map(movie =>
                movie.movie_id === id ? { ...movie, [key]: value } : movie
            )
        );
    }

    function updateMovie(id) {
        const film = movies.find((film) => film.movie_id === id);

        fetch(`/movies_screenings/${id}`, // Endpoint should be correct
            {
                method: "PUT",
                body: JSON.stringify(film),
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
            // Optionally update state if necessary
            setMovies(movies.map(movie =>
                movie.movie_id === id ? { ...film } : movie
            ));

            AppToaster.show({
                message: "Movie Updated Successfully",
                intent: 'success',
                timeout: 3000
            });
        })
        .catch((error) => {
            console.error('Error updating movie data:', error);
            AppToaster.show({
                message: "Error Updating Movie",
                intent: 'danger',
                timeout: 3000
            });
        });
    }

    function deleteMovie(id) {
        setMovies(movies.filter(movie => movie.movie_id !== id));
        AppToaster.show({
            message: "Movie Deleted Successfully",
            intent: 'success',
            timeout: 3000
        });
    }

    return (
        <div className="Movie">
            <table className="bp4-html-table modifier">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Director</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(movie => (
                        <tr key={movie.movie_id}>
                            <td>{movie.movie_id}</td>
                            <td>
                                <EditableText
                                    onChange={value => onChangeHandler(movie.movie_id, 'title', value)}
                                    value={movie.title}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => onChangeHandler(movie.movie_id, 'genre', value)}
                                    value={movie.genre}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => onChangeHandler(movie.movie_id, 'director', value)}
                                    value={movie.director}
                                />
                            </td>
                            <td>
                                <Button intent="primary" onClick={() => updateMovie(movie.movie_id)}>
                                    Update
                                </Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button intent="danger" onClick={() => deleteMovie(movie.movie_id)}>
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
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Enter the Title"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newGenre}
                                onChange={(e) => setNewGenre(e.target.value)}
                                placeholder="Enter the Genre"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newDirector}
                                onChange={(e) => setNewDirector(e.target.value)}
                                placeholder="Enter the Director"
                            />
                        </td>
                        <td> &nbsp;&nbsp;&nbsp;
                            <Button intent="success" onClick={addMovie}>
                                Add Movie
                            </Button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default Movie;
