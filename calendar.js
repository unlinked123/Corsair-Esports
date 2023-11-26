document.addEventListener("DOMContentLoaded", function () {
    const calendarBody = document.getElementById("calendar-body");
    const daysOfWeekRow = document.getElementById("daysOfWeekRow");
    const prevWeekArrow = document.getElementById("prev-week");
    const nextWeekArrow = document.getElementById("next-week");
    const eventDetailsSection = document.getElementById("event-details");
    const calendarSection = document.getElementById("calendar");

    let startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the Sunday of the current week

    // Fetch events from JSON and render the calendar
    fetchAndRenderCalendar();

    async function fetchAndRenderCalendar() {
        const events = await fetchEventsFromJson();
        renderCalendar(events);
    }

    async function fetchEventsFromJson() {
        const timestamp = new Date().getTime();
        const url = `./events.json?_=${timestamp}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Fetched events:', data);
            return data;
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    function renderCalendar(events) {
        // Clear existing calendar
        calendarBody.innerHTML = "";
        daysOfWeekRow.innerHTML = "";

        // Days of the week
        for (let j = 0; j < 7; j++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + j);

            const dayElement = document.createElement("th");
            dayElement.textContent = `${day.toLocaleDateString('en-US', { weekday: 'short' })} ${day.getDate()}`;
            daysOfWeekRow.appendChild(dayElement);
        }

        // Calendar content
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + j);

            const event = getEvent(day, events);

            const cellElement = document.createElement("td");
            cellElement.textContent = event ? event.eventName : "";
            cellElement.addEventListener("click", () => showEventDetails(event));
            cellElement.style.cursor = "pointer"; // Set cursor to pointer on hover
            row.appendChild(cellElement);
        }

        calendarBody.appendChild(row);
    }

    function getEvent(date, events) {
        const dateString = date.toISOString().split('T')[0];
        return events.find(event => event.date === dateString) || null;
    }

    function showEventDetails(event) {
        if (event) {
            const eventDetailsHTML = `
                <h2>${event.eventName}</h2>
                <p>Date: ${event.date}</p>
                <p>Description: ${event.eventDetails || "No description available"}</p>
            `;

            eventDetailsSection.innerHTML = eventDetailsHTML;
            eventDetailsSection.style.display = "block"; // Show the event details section
        }
    }

    // Add event listeners for arrows
    prevWeekArrow.addEventListener("click", showPreviousWeek);
    nextWeekArrow.addEventListener("click", showNextWeek);

    function showPreviousWeek() {
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        fetchAndRenderCalendar();
    }

    function showNextWeek() {
        startOfWeek.setDate(startOfWeek.getDate() + 7);
        fetchAndRenderCalendar();
    }
});
