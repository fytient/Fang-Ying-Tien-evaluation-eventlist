document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    const addEventBtn = document.getElementById('addEventBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const eventList = document.getElementById('eventList');

    addEventBtn.addEventListener('click', () => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" id="newEventName" placeholder="Event Name" required></td>
            <td><input type="date" id="newEventStart" required></td>
            <td><input type="date" id="newEventEnd" required></td>
            <td>
                
                <button id="saveNewEventBtn" class="saveEditBtn">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>
                </button>
                <button id="cancelNewEventBtn" class="cancelEditBtn">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                </button>
            </td>
        `;
        eventList.appendChild(newRow);

        document.getElementById('saveNewEventBtn').addEventListener('click', async () => {
            const eventName = document.getElementById('newEventName').value;
            const startDate = document.getElementById('newEventStart').value;
            const endDate = document.getElementById('newEventEnd').value;
            if (!eventName || !startDate || !endDate) {
                alert('Input Not Valid!');
                return;
            }

            const newEvent = { eventName, startDate, endDate };
            await addEvent(newEvent);
            loadEvents();
        });

        document.getElementById('cancelNewEventBtn').addEventListener('click', () => {
            eventList.removeChild(newRow);
        });
    });

    eventList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('deleteBtn')) {
            const id = e.target.dataset.id;
            await deleteEvent(id);
            loadEvents();
        } else if (e.target.classList.contains('editBtn')) {
            const id = e.target.dataset.id;
            const event = await getEvent(id);
            const row = e.target.closest('tr');
            row.innerHTML = `
                <td><input type="text" value="${event.eventName}" id="editEventName${id}" required></td>
                <td><input type="date" value="${event.startDate}" id="editEventStart${id}" required></td>
                <td><input type="date" value="${event.endDate}" id="editEventEnd${id}" required></td>
                <td>
                    <button class="saveEditBtn" data-id="${id}">
                        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>
                    </button>
                    <button class="cancelEditBtn" data-id="${id}">
                        <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                    </button>
                </td>
            `;

            document.querySelector(`.saveEditBtn[data-id="${id}"]`).addEventListener('click', async () => {
                const updatedEvent = {
                    eventName: document.getElementById(`editEventName${id}`).value,
                    startDate: document.getElementById(`editEventStart${id}`).value,
                    endDate: document.getElementById(`editEventEnd${id}`).value
                };
                await updateEvent(id, updatedEvent);
                loadEvents();
            });

            document.querySelector(`.cancelEditBtn[data-id="${id}"]`).addEventListener('click', () => {
                loadEvents();
            });
        }
    });

    const loadEvents = async () => {
        const events = await getEvents();
        eventList.innerHTML = '';
        events.forEach(event => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${event.eventName}</td>
                <td>${event.startDate}</td>
                <td>${event.endDate}</td>
                <td>
                    <button class="editBtn" data-id="${event.id}">
                        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                    </button>
                    <button class="deleteBtn" data-id="${event.id}">
                        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                    </button>
                </td>
            `;
            eventList.appendChild(tr);
        });
    };

    const clearForm = () => {
        document.getElementById('eventName').value = '';
        document.getElementById('eventStart').value = '';
        document.getElementById('eventEnd').value = '';
    };

    loadEvents();
});
