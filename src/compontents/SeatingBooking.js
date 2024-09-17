import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import './styles/Movie.css';

const AppToaster = Toaster.create({
    position: "top"
});

function SeatingBooking() {
    const [seatings, setSeatings] = useState([]); // Initialize with an empty array
    const [newScreeningId, setNewScreeningId] = useState('');
    const [newSeatNumber, setNewSeatNumber] = useState('');
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newBookingTime, setNewBookingTime] = useState('');

    useEffect(() => {
        fetch('/movies_screenings.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.SeatingBookings) {
                    setSeatings(data.SeatingBookings);
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
                console.error('Error fetching seating data:', error);
                AppToaster.show({
                    message: "Error fetching seating data",
                    intent: 'danger',
                    timeout: 3000
                });
            });
    }, []);

    function addSeatingBooking() {
        const screeningId = newScreeningId.trim();
        const seatNumber = newSeatNumber.trim();
        const customerName = newCustomerName.trim();
        const bookingTime = newBookingTime.trim();

        if (screeningId && seatNumber && customerName && bookingTime) {
            const newSeating = {
                seating_id: seatings.length + 1,
                screening_id: screeningId,
                seat_number: seatNumber,
                customer_name: customerName,
                booking_time: bookingTime
            };

            setSeatings([...seatings, newSeating]);

            AppToaster.show({
                message: "Seating Booking Added Successfully",
                intent: 'success',
                timeout: 3000
            });

            setNewScreeningId('');
            setNewSeatNumber('');
            setNewCustomerName('');
            setNewBookingTime('');
        }
    }

    function updateSeatingBooking(id) {
        const seatingToUpdate = seatings.find((seating) => seating.seating_id === id);

        fetch(`/movies_screenings.json/${id}`, 
            {
                method: "PUT",
                body: JSON.stringify(seatingToUpdate),
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
            setSeatings(seatings.map(seating =>
                seating.seating_id === id ? { ...seatingToUpdate } : seating
            ));

            AppToaster.show({
                message: "Seating Booking Updated Successfully",
                intent: 'success',
                timeout: 3000
            });
        })
        .catch((error) => {
            console.error('Error updating seating data:', error);
            AppToaster.show({
                message: "Error Updating Seating Booking",
                intent: 'danger',
                timeout: 3000
            });
        });
    }

    function deleteSeatingBooking(id) {
        setSeatings(seatings.filter(seating => seating.seating_id !== id));
        AppToaster.show({
            message: "Seating Booking Deleted Successfully",
            intent: 'success',
            timeout: 3000
        });
    }

    return (
        <div className="SeatingBooking">
            <table className="bp4-html-table modifier">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Screening ID</th>
                        <th>Seat Number</th>
                        <th>Customer Name</th>
                        <th>Booking Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {seatings.map(seating => (
                        <tr key={seating.seating_id}>
                            <td>{seating.seating_id}</td>
                            <td>
                                <EditableText
                                    onChange={value => setSeatings(seatings.map(s => s.seating_id === seating.seating_id ? { ...s, screening_id: value } : s))}
                                    value={seating.screening_id}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => setSeatings(seatings.map(s => s.seating_id === seating.seating_id ? { ...s, seat_number: value } : s))}
                                    value={seating.seat_number}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => setSeatings(seatings.map(s => s.seating_id === seating.seating_id ? { ...s, customer_name: value } : s))}
                                    value={seating.customer_name}
                                />
                            </td>
                            <td>
                                <EditableText
                                    onChange={value => setSeatings(seatings.map(s => s.seating_id === seating.seating_id ? { ...s, booking_time: value } : s))}
                                    value={seating.booking_time}
                                />
                            </td>
                            <td>
                                <Button intent="primary" onClick={() => updateSeatingBooking(seating.seating_id)}>
                                    Update
                                </Button>
                                &nbsp;
                                &nbsp;
                                <Button intent="danger" onClick={() => deleteSeatingBooking(seating.seating_id)} style={{ marginLeft: '10px' }}>
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
                                value={newScreeningId}
                                onChange={(e) => setNewScreeningId(e.target.value)}
                                placeholder="Enter Screening ID"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newSeatNumber}
                                onChange={(e) => setNewSeatNumber(e.target.value)}
                                placeholder="Enter Seat Number"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newCustomerName}
                                onChange={(e) => setNewCustomerName(e.target.value)}
                                placeholder="Enter Customer Name"
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newBookingTime}
                                onChange={(e) => setNewBookingTime(e.target.value)}
                                placeholder="Enter Booking Time"
                            />
                        </td>
                        <td> &nbsp;&nbsp;&nbsp;
                            <Button intent="success" onClick={addSeatingBooking}>
                                Add Booking
                            </Button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default SeatingBooking;
