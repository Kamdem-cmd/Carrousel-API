const imageCarte = document.getElementById('iframe');
const infoCarte = document.getElementById('nomCarte');
const prevButton = document.getElementById('btn_precedent');
const nextButton = document.getElementById('btn_suivant');
let deckId = null;
let cartes = []; 
let currentIndex = 0;
const numbreCarte = 15;
const delais = 3000;
let autoSlideInterval;

async function getNewDeckAndDrawCards() {
    try {
        const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const deckData = await deckResponse.json();
        deckId = deckData.deck_id;

        const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numbreCarte}`);
        const drawData = await drawResponse.json();
        cartes = drawData.cards;

        if (cartes.length > 0) {
            showCard(currentIndex);
            startAutoSlide();
        } else {
            imageCarte.src = '';
            infoCarte.textContent = 'Erreur lors du chargement des cartes.';
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des cartes:', error);
        imageCarte.src = '';
        infoCarte.textContent = 'Erreur de connexion à l\'API.';
    }
}

function showCard(index) {
    if (index >= 0 && index < cartes.length) {
        const card = cartes[index];
        // Note importante: Un iframe affichera l'URL de l'image comme une page.
        // Pour afficher l'image elle-même, il faudrait une balise <img>.
        imageCarte.src = card.image;
        imageCarte.alt = `${card.suit} - ${card.value}`;
        infoCarte.textContent = `${card.suit} - ${card.value}`;

        if (index > 0) {
            prevButton.classList.remove('hidden');
        } else {
            prevButton.classList.add('hidden');
        }

        if (index < cartes.length - 1) {
            nextButton.textContent = 'Suivant >';
        } else {
            nextButton.textContent = 'Terminé';
            stopAutoSlide();
        }
        prevButton.style.backgroundColor = "";
        prevButton.style.color = "";
        nextButton.style.backgroundColor = "";
        nextButton.style.color = "";
    }
}

function nextCard() {
    currentIndex++;
    if (currentIndex < cartes.length) {
        showCard(currentIndex);
    } else {
        currentIndex = cartes.length - 1;
        nextButton.textContent = 'Terminé';
        nextButton.style.backgroundColor = "red";
        nextButton.style.color = "white";
        stopAutoSlide();
    }
}

function prevCard() {
    currentIndex--;
    if (currentIndex >= 0) {
        showCard(currentIndex);
        nextButton.textContent = 'Suivant >';
        startAutoSlide();
    } else {
        currentIndex = 0;
        prevButton.classList.add('hidden');
        prevButton.style.backgroundColor = "red";
        prevButton.style.color = "white";
        stopAutoSlide();
    }
}

function startAutoSlide() {
    stopAutoSlide();
    if (currentIndex < cartes.length - 1) {
        autoSlideInterval = setInterval(nextCard, delais);
    }
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

nextButton.addEventListener('click', () => {
    stopAutoSlide();
    nextCard();
});

prevButton.addEventListener('click', () => {
    stopAutoSlide();
    prevCard();
});

getNewDeckAndDrawCards();