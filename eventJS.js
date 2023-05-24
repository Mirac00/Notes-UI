const saveEventButton = document.querySelector('#btnSave-E');
const addEventButton = document.querySelector('#btnAdd-E');
const deleteEventButton = document.querySelector('#btnDelete-E');
const eventTitleInput = document.querySelector('#title-E');
const eventDescriptionInput = document.querySelector('#description-E');
const eventStartDateInput = document.querySelector('#dateStart');
const eventEndDateInput = document.querySelector('#dateEnd');
const eventsContainer = document.querySelector('#events__container');

let selectedEventId = null;

// Funkcja czyszcząca formularz
function clearEventForm() {
  eventTitleInput.value = '';
  eventDescriptionInput.value = '';
  eventStartDateInput.value = '';
  eventEndDateInput.value = '';
  deleteEventButton.classList.add('hidden');
  saveEventButton.classList.add('hidden');
  selectedEventId = null;
}

// Funkcja wyświetlająca wybrane wydarzenie w formularzu
function displayEventInForm(event) {
  eventTitleInput.value = event.title;
  eventDescriptionInput.value = event.description;
  eventStartDateInput.value = event.startDate;
  eventEndDateInput.value = event.endDate;
  deleteEventButton.classList.remove('hidden');
  saveEventButton.classList.remove('hidden');
  selectedEventId = event.id;
}

// Funkcja pobierająca wydarzenie po jego identyfikatorze
function getEventById(id) {
  fetch(`https://localhost:7202/api/event111s/${id}`)
    .then(response => response.json())
    .then(data => displayEventInForm(data))
    .catch(error => console.log(error));
}

// Funkcja pobierająca wszystkie wydarzenia
function getAllEvents() {
  fetch('https://localhost:7202/api/event111s')
    .then(response => response.json())
    .then(data => displayEvents(data))
    .catch(error => console.log(error));
}

// Funkcja renderująca wydarzenia w kontenerze
function displayEvents(events) {
  let allEvents = '';

  events.forEach(event => {
    const eventElement = `
      <div class="event" data-id="${event.id}">
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Start Date:</strong> ${event.startDate}</p>
        <p><strong>End Date:</strong> ${event.endDate}</p>
      </div>
    `;
    allEvents += eventElement;
  });

  eventsContainer.innerHTML = allEvents;

  // Dodaj nasłuchiwacze zdarzeń do wszystkich wydarzeń
  document.querySelectorAll('.event').forEach(event => {
    event.addEventListener('click', function () {
      const eventId = event.dataset.id;
      getEventById(eventId);
    });
  });
}

// Dodaj nasłuchiwacz zdarzeń dla przycisku "Dodaj wydarzenie"
addEventButton.addEventListener('click', function () {
  const title = eventTitleInput.value;
  const description = eventDescriptionInput.value;
  const startDate = eventStartDateInput.value;
  const endDate = eventEndDateInput.value;

  if (selectedEventId) {
    updateEvent(selectedEventId, title, description, startDate, endDate);
  } else {
    addEvent(title, description, startDate, endDate);
  }
});

// Funkcja dodająca nowe wydarzenie
function addEvent(title, description, startDate, endDate) {
  const body = {
    title: title,
    description: description,
    startDate: startDate,
    endDate: endDate,
    isVisable: true
  };

  fetch('https://localhost:7202/api/event111s', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      clearEventForm();
      getAllEvents();
    })
    .catch(error => console.log(error));
}

// Funkcja aktualizująca istniejące wydarzenie
function updateEvent(id, title, description, startDate, endDate) {
  const body = {
    title: title,
    description: description,
    startDate: startDate,
    endDate: endDate,
    isVisable: true
  };

  fetch(`https://localhost:7202/api/event111s/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      clearEventForm();
      getAllEvents();
    })
    .catch(error => console.log(error));
}

// Funkcja usuwająca wydarzenie
function deleteEvent(id) {
  fetch(`https://localhost:7202/api/event111s/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      clearEventForm();
      getAllEvents();
    })
    .catch(error => console.log(error));
}

// Dodaj nasłuchiwacz zdarzeń dla przycisku "Usuń wydarzenie"
deleteEventButton.addEventListener('click', function () {
  if (selectedEventId) {
    deleteEvent(selectedEventId);
  }
});

// Inicjalizacja - pobranie wszystkich wydarzeń
getAllEvents();
