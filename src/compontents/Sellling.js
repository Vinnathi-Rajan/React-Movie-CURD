import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import './styles/Movie.css';

const AppToaster = Toaster.create({
    position: "top"
});

function Selling() {
    const [sales, setSales] = useState([]);
    const [newMovieId, setNewMovieId] = useState('');
    const [newCustomerId, setNewCustomerId] = useState('');
    const [newTicketPrice, setNewTicketPrice] = useState('');
    const [newSaleDate, setNewSaleDate] = useState('');

    useEffect(() => {
        fetch('/movies_screenings.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.Sales && Array.isArray(data.Sales)) {
                    setSales(data.Sales);
                } else {
                    console.error('Unexpected data format:', data);
                    AppToaster.show({
                        message: "Unexpected data format",
                        intent: 'danger',
                        timeout: 3000
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching sales data:', error);
                AppToaster.show({
                    message: "Error fetching sales data",
                    intent: 'danger',
                    timeout: 3000
                });
            });
    }, []);

    function addSale() {
        const movieId = newMovieId.trim();
        const customerId = newCustomerId.trim();
        const ticketPrice = newTicketPrice.trim();
        const saleDate = newSaleDate.trim();

        if (movieId && customerId && ticketPrice && saleDate) {
            const newSale = {
                sale_id: sales.length ? Math.max(...sales.map(s => s.sale_id)) + 1 : 1, // Generate unique ID
                movie_id: movieId,
                customer_id: customerId,
                ticket_price: ticketPrice,
                sale_date: saleDate
            };

            setSales([...sales, newSale]);

            AppToaster.show({
                message: "Sale Added Successfully",
                intent: 'success',
                timeout: 3000
            });

            setNewMovieId('');
            setNewCustomerId('');
            setNewTicketPrice('');
            setNewSaleDate('');
        } else {
            AppToaster.show({
                message: "Please fill out all fields",
                intent: 'warning',
                timeout: 3000
            });
        }
    }

    function updateSale(id) {
        const saleToUpdate = sales.find((sale) => sale.sale_id === id);

        if (saleToUpdate) {
            fetch(`/movies_screenings.json/${id}`, // Ensure this endpoint is correct
                {
                    method: "PUT",
                    body: JSON.stringify(saleToUpdate),
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
            .then(() => {
                setSales(sales.map(sale =>
                    sale.sale_id === id ? { ...saleToUpdate } : sale
                ));

                AppToaster.show({
                    message: "Sale Updated Successfully",
                    intent: 'success',
                    timeout: 3000
                });
            })
            .catch((error) => {
                console.error('Error updating sale data:', error);
                AppToaster.show({
                    message: "Error Updating Sale",
                    intent: 'danger',
                    timeout: 3000
                });
            });
        }
    }

    function deleteSale(id) {
        setSales(sales.filter(sale => sale.sale_id !== id));
        AppToaster.show({
            message: "Sale Deleted Successfully",
            intent: 'success',
            timeout: 3000
        });
    }

    return (
        <div className="Selling">
            <table className="bp4-html-table modifier">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Movie ID</th>
                        <th>Customer ID</th>
                        <th>Ticket Price</th>
                        <th>Sale Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map(sale => (
                            <tr key={sale.sale_id}>
                                <td>{sale.sale_id}</td>
                                <td>
                                    <EditableText
                                        onChange={value => setSales(sales.map(s => s.sale_id === sale.sale_id ? { ...s, movie_id: value } : s))}
                                        value={sale.movie_id}
                                    />
                                </td>
                                <td>
                                    <EditableText
                                        onChange={value => setSales(sales.map(s => s.sale_id === sale.sale_id ? { ...s, customer_id: value } : s))}
                                        value={sale.customer_id}
                                    />
                                </td>
                                <td>
                                    <EditableText
                                        onChange={value => setSales(sales.map(s => s.sale_id === sale.sale_id ? { ...s, ticket_price: value } : s))}
                                        value={sale.ticket_price}
                                    />
                                </td>
                                <td>
                                    <EditableText
                                        onChange={value => setSales(sales.map(s => s.sale_id === sale.sale_id ? { ...s, sale_date: value } : s))}
                                        value={sale.sale_date}
                                    />
                                </td>
                                <td>
                                    <Button intent="primary" onClick={() => updateSale(sale.sale_id)}>
                                        Update
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button intent="danger" onClick={() => deleteSale(sale.sale_id)} style={{ marginLeft: '10px' }}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No sales data available</td>
                        </tr>
                    )}
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
                                value={newCustomerId}
                                onChange={(e) => setNewCustomerId(e.target.value)}
                                placeholder="Enter Customer ID"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newTicketPrice}
                                onChange={(e) => setNewTicketPrice(e.target.value)}
                                placeholder="Enter Ticket Price"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newSaleDate}
                                onChange={(e) => setNewSaleDate(e.target.value)}
                                placeholder="Enter Sale Date"
                            />
                        </td>
                        <td>
                            <Button intent="success" onClick={addSale}>
                                Add Sale
                            </Button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default Selling;
