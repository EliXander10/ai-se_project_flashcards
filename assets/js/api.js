const baseUrl = 'https://se-flashcards-api.en.tripleten-services.com/v1';

const headers = {
  'Content-Type': 'application/json',
  Authorization: '01a0ac7b-8e7d-73ef-a8a0-efa5e3a76ad7',
};

function processResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status}`);
  }
}

function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: 'DELETE',
    headers,
  });
}

function addDeck(name, color, cards) {
  const newDeck = { name, color, cards };
  return fetch(`${baseUrl}/decks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newDeck),
  });
}

export { getDecks, deleteDeck, addDeck };
