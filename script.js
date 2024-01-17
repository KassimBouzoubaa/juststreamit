// URL de base de l'API
const API_URL = "http://localhost:8000/api/v1/titles/";

// Paramètres de requête pour différents genres et listes de films
const params = {
    meilleurFilms: [
        { page: 1, sort_by: '-imdb_score' },
        { page: 2, sort_by: '-imdb_score' }
    ],
    action: [
        { genre_contains: 'Action', page: 1, sort_by: '-imdb_score' },
        { genre_contains: 'Action', page: 2, sort_by: '-imdb_score' }
    ],
    adventure: [
        { genre_contains: 'Adventure', page: 1, sort_by: '-imdb_score' },
        { genre_contains: 'Adventure', page: 2, sort_by: '-imdb_score' }
    ],
    animation: [
        { genre_contains: 'Animation', page: 1, sort_by: '-imdb_score' },
        { genre_contains: 'Animation', page: 2, sort_by: '-imdb_score' }
    ]
}

// Sélection des éléments HTML
const meilleurFilmHtml = document.getElementById("meilleur-film");
const listeMieuxNoteHtml = document.getElementById("film-mieux-note");
const action = document.getElementById("action");
const adventure = document.getElementById("adventure");
const animation = document.getElementById("animation");
const dialogue = document.getElementById("modal")

// Fonction asynchrone pour effectuer une requête HTTP GET avec des paramètres de requête
async function fetchData(params) {
    try {
        const response = await fetch(API_URL + "?" + new URLSearchParams(params));

        if (!response.ok) {
            throw new Error("Erreur de réseau : " + response.status);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        throw error;
    }
}

// Fonction asynchrone pour afficher le meilleur film
async function afficherMeilleurFilm() {
    try {
        const filmsMieuxNote = await fetchData(params.meilleurFilms[0]);
        const meilleurFilm = filmsMieuxNote[0];

        // Construction de la structure HTML pour afficher le meilleur film
        const div = `
            <div class="info-film">
                <h2>${meilleurFilm.title}</h2>
                <button>Play</button>
            </div>
            <img src=${meilleurFilm.image_url} alt="Image ${meilleurFilm.title}" />
        `;

        meilleurFilmHtml.innerHTML = div;
    } catch (error) {
        console.error("Erreur lors de l'affichage du meilleur film :", error);
    }
}

// Fonction asynchrone pour afficher une liste de films
async function afficherListeFilms(elementHtml, critere1, critere2) {
    try {
        // Récupération des listes de films
        const listeFilms1 = await fetchData(critere1);
        const listeFilms2 = await fetchData(critere2);

        // Concaténation des deux listes et récupération des 8 premiers éléments
        let listeFilms = [...listeFilms1, ...listeFilms2].slice(0, 8);

        // Si la liste est pour les films mieux notés, retirer le premier élément
        if (elementHtml == listeMieuxNoteHtml) {
            listeFilms.shift();
        }

        // Effacer le contenu actuel de l'élément HTML
        elementHtml.innerHTML = '';

        // Afficher les images des films dans l'élément HTML
        for (let i = 0; i < listeFilms.length; i++) {
            elementHtml.innerHTML += `
                <img src=${listeFilms[i].image_url} alt="Image ${listeFilms[i].title}" id=${listeFilms[i].id} onclick="getFilmById(${listeFilms[i].id})">
            `;
        }
    } catch (error) {
        console.error(`Erreur lors de l'affichage des films:`, error);
    }
}

// Fonction asynchrone pour récupérer et afficher les détails d'un film par ID
async function getFilmById(id) {
    try {
        // Récupération des détails du film par ID
        const film = await fetch(API_URL + id);

        // Vérification du statut de la réponse
        if (!film.ok) {
            throw new Error("Erreur de réseau : " + film.status);
        }

        // Récupération des données JSON du film
        const data = await film.json();

        // Effacement du contenu actuel du dialogue
        dialogue.innerHTML = '';

        // Construction de la structure HTML pour afficher les détails du film
        let genres = data.genres.join(', ');
        let listeActeurs = data.actors.join(', ');
        dialogue.innerHTML += `
            <img src=${data.image_url} alt="Image ${data.title}">
            <p> Titre : ${data.title} </br>
                Genres : ${genres} </br>
                Date de sortie : ${data.date_published} </br>
                Rated : ${data.rated} </br>
                Score Imdb : ${data.imdb_score} </br>
                Réalisateur : ${data.directors[0]} </br>
                Liste des acteurs : ${listeActeurs} </br>
                Durée : ${data.duration} </br>
                Pays d'origine : ${data.countries[0]} </br>
                Résultat au Box Office : ${data.worldwide_gross_income || "Non communiqué"} </br>
                Résumé : ${data.description}
            </p>
            <button onclick="dialogue.close()">Fermer</button>
        `;

        // Affichage du dialogue modal
        dialogue.showModal();
    } catch (error) {
        console.error(`Erreur lors de l'affichage des films:`, error);
    }
}

// Chargement initial des données
(async () => {
    await afficherMeilleurFilm();
    await afficherListeFilms(listeMieuxNoteHtml, params.meilleurFilms[0], params.meilleurFilms[1]);
    await afficherListeFilms(action, params.action[0], params.action[1]);
    await afficherListeFilms(adventure, params.adventure[0], params.adventure[1]);
    await afficherListeFilms(animation, params.animation[0], params.animation[1]);
})();

/* MIEUX NOTE */

// Sélection des boutons de navigation pour la section "Mieux Note"
const prevButtonMieuxNote = document.getElementById("prev-mieux-note");
const nextButtonMieuxNote = document.getElementById("next-mieux-note");

// Ajout d'écouteurs d'événements pour les boutons de navigation "Mieux Note"
prevButtonMieuxNote.addEventListener("click", () => {
    listeMieuxNoteHtml.scrollLeft -= 100; 
});

nextButtonMieuxNote.addEventListener("click", () => {
    listeMieuxNoteHtml.scrollLeft += 100; 
});

/* ACTION */

// Sélection des boutons de navigation pour la section "Action"
const prevButtonAction = document.getElementById("prev-action");
const nextButtonAction = document.getElementById("next-action");

// Ajout d'écouteurs d'événements pour les boutons de navigation "Action"
prevButtonAction.addEventListener("click", () => {
    action.scrollLeft -= 100; 
});

nextButtonAction.addEventListener("click", () => {
    action.scrollLeft += 100; 
});

/* ADVENTURE */

// Sélection des boutons de navigation pour la section "Adventure"
const prevButtonAdventure = document.getElementById("prev-adventure");
const nextButtonAdventure = document.getElementById("next-adventure");

// Ajout d'écouteurs d'événements pour les boutons de navigation "Adventure"
prevButtonAdventure.addEventListener("click", () => {
    adventure.scrollLeft -= 100; 
});

nextButtonAdventure.addEventListener("click", () => {
    adventure.scrollLeft += 100; 
});

/* ANIMATION */

// Sélection des boutons de navigation pour la section "Animation"
const prevButtonAnimation = document.getElementById("prev-animation");
const nextButtonAnimation = document.getElementById("next-animation");

// Ajout d'écouteurs d'événements pour les boutons de navigation "Animation"
prevButtonAnimation.addEventListener("click", () => {
    animation.scrollLeft -= 100; 
});

nextButtonAnimation.addEventListener("click", () => {
    animation.scrollLeft += 100; 
});
