const ereignisse = [
    {
        datum: "2026-03-30T10:00:00",
        titel: "Einzug in Jerusalem",
        text: "Jesus reitet auf einem Esel in die heilige Stadt ein. Die Menschen empfangen ihn jubelnd mit Palmzweigen und rufen Hosanna. Dies markiert den Beginn der Karwoche.",
        bibelstelle: "Matthäus 21,1-11"
    },
    {
        datum: "2026-03-31T14:00:00",
        titel: "Tempelreinigung",
        text: "Jesus vertreibt die Händler und Geldwechsler aus dem Tempel. Er kritisiert, dass aus dem Haus des Gebets eine Räuberhöhle gemacht wurde.",
        bibelstelle: "Markus 11,15-19"
    },
    {
        datum: "2026-04-01T16:00:00",
        titel: "Salbung in Betanien",
        text: "Eine Frau salbt Jesus mit kostbarem Öl. Während einige dies als Verschwendung kritisieren, verteidigt Jesus ihre Handlung als Vorbereitung auf sein Begräbnis.",
        bibelstelle: "Johannes 12,1-8"
    },
    {
        datum: "2026-04-02T18:00:00",
        titel: "Das letzte Abendmahl",
        text: "Jesus feiert mit seinen Jüngern das Passahmahl. Er teilt Brot und Wein und kündigt an, dass einer von ihnen ihn verraten wird.",
        bibelstelle: "Lukas 22,7-23"
    },
    {
        datum: "2026-04-02T21:00:00",
        titel: "Gebet in Gethsemane",
        text: "Jesus betet im Garten Gethsemane und ringt mit seinem bevorstehenden Schicksal. Seine Jünger schlafen ein, während er in tiefer Angst zu Gott betet.",
        bibelstelle: "Matthäus 26,36-46"
    },
    {
        datum: "2026-04-02T23:00:00",
        titel: "Gefangennahme",
        text: "Judas verrät Jesus mit einem Kuss. Bewaffnete Männer nehmen Jesus fest, während seine Jünger fliehen. Petrus verleugnet später dreimal, Jesus zu kennen.",
        bibelstelle: "Markus 14,43-52"
    },
    {
        datum: "2026-04-03T06:00:00",
        titel: "Verhör vor Pilatus",
        text: "Jesus wird dem römischen Statthalter Pilatus vorgeführt. Trotz Zweifel an seiner Schuld gibt Pilatus dem Druck der Menge nach und verurteilt Jesus.",
        bibelstelle: "Johannes 18,28-40"
    },
    {
        datum: "2026-04-03T09:00:00",
        titel: "Kreuzigung",
        text: "Jesus wird nach Golgatha geführt und ans Kreuz genagelt. Er hängt zwischen zwei Verbrechern und spricht seine letzten Worte, bevor er stirbt.",
        bibelstelle: "Lukas 23,33-49"
    },
    {
        datum: "2026-04-03T15:00:00",
        titel: "Tod am Kreuz",
        text: "Jesus ruft laut und gibt seinen Geist auf. Der Vorhang im Tempel zerreißt, die Erde bebt. Ein römischer Hauptmann erkennt: Dies war wahrhaftig Gottes Sohn.",
        bibelstelle: "Matthäus 27,45-56"
    },
    {
        datum: "2026-04-03T18:00:00",
        titel: "Grablegung",
        text: "Josef von Arimathäa bittet um den Leichnam Jesu. Er wickelt ihn in Leinentücher und legt ihn in ein neues Felsengrab, das mit einem Stein verschlossen wird.",
        bibelstelle: "Johannes 19,38-42"
    },
    {
        datum: "2026-04-05T06:00:00",
        titel: "Das leere Grab",
        text: "Frauen kommen zum Grab und finden es leer. Ein Engel verkündet ihnen, dass Jesus auferstanden ist. Sie sollen den Jüngern die frohe Botschaft bringen.",
        bibelstelle: "Markus 16,1-8"
    },
    {
        datum: "2026-04-05T10:00:00",
        titel: "Auferstehung",
        text: "Jesus erscheint seinen Jüngern und zeigt ihnen seine Wunden. Er isst mit ihnen und beauftragt sie, in alle Welt zu gehen und das Evangelium zu verkünden.",
        bibelstelle: "Johannes 20,19-29"
    }
];

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

    let scrolledToCurrent = false;

    ereignisse.forEach(event => {
        const status = getStatus(event.datum);

        const eventDiv = document.createElement('div');
        eventDiv.className = `event ${status.type}`;

        eventDiv.innerHTML = `
            <div class="event-time">${formatDate(event.datum)}</div>
            <h2 class="event-title">${event.titel}</h2>
            <p class="event-text">${event.text}</p>
            <div class="event-reference">${event.bibelstelle}</div>
            <span class="event-status status-${status.type}">${status.text}</span>
        `;

        timeline.appendChild(eventDiv);

        if (status.type === 'current' && !scrolledToCurrent) {
            setTimeout(() => eventDiv.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
            scrolledToCurrent = true;
        }
    });
}

renderTimeline();
setInterval(renderTimeline, 60000);
