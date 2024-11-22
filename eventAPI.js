const apiUrl = 'http://localhost:3000/events';

const getEvents = async () => {
    const response = await fetch(apiUrl);
    return response.json();
};

const getEvent = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    return response.json();
};

const addEvent = async (event) => {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });
    return response.json();
};

const updateEvent = async (id, event) => {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });
    return response.json();
};
const patchEvent = async (id, event) => {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });
    return response.json();
};

const deleteEvent = async (id) => {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
};