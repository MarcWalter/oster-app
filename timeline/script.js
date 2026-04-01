let ereignisse = [];

fetch('../content/ereignisse.json')
    .then(res => res.json())
    .then(data => {
        ereignisse = data;
        renderTimeline();
    });

function getStatus(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;

    if (diff < -3600000) return { type: 'past', text: 'Bereits geschehen' };
    if (diff < 3600000) return { type: 'current', text: 'Jetzt' };

    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return { type: 'future', text: `In ${days} Tag${days > 1 ? 'en' : ''}` };
    return { type: 'future', text: `In ${hours} Stunde${hours > 1 ? 'n' : ''}` };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const day = days[date.getDay()];
    const time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    return `${day}, ${date.getDate()}.${date.getMonth() + 1}. um ${time} Uhr`;
}

function renderTimeline() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    ereignisse.forEach((event, index) => {
        const status = getStatus(event.zeitpunkt);

        const eventDiv = document.createElement('div');
        eventDiv.className = `event ${status.type}`;
        if (status.type === 'current') eventDiv.classList.add('expanded');
        if (status.type === 'past') eventDiv.classList.add('collapsed');

        const textToShow = eventDiv.classList.contains('expanded') ? event.text_lang : event.text_kurz;

        eventDiv.innerHTML = `
            <div class="event-time">${event.emoji} ${formatDate(event.zeitpunkt)}</div>
            <h2 class="event-title">${event.titel}</h2>
            <p class="event-text">${textToShow}</p>
            <div class="event-reference">${event.bibelstelle}</div>
            <span class="event-status status-${status.type}">${status.text}</span>
        `;

        eventDiv.addEventListener('click', () => {
            const wasExpanded = eventDiv.classList.contains('expanded');

            document.querySelectorAll('.event').forEach(e => {
                e.classList.remove('expanded');
                e.classList.add('collapsed');
            });

            if (!wasExpanded) {
                eventDiv.classList.remove('collapsed');
                eventDiv.classList.add('expanded');
                const newText = event.text_lang;
                eventDiv.querySelector('.event-text').textContent = newText;
            } else {
                const newText = event.text_kurz;
                eventDiv.querySelector('.event-text').textContent = newText;
            }
        });

        timeline.appendChild(eventDiv);
    });
}

setInterval(renderTimeline, 60000);
