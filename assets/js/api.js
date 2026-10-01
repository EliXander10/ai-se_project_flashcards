const baseUrl = 'https://se-flashcards-api.en.tripleten-services.com/v1';

const headers = {
  'Content-Type': 'application/json',
  Authorization: '01a0ac7b-8e7d-73ef-a8a0-efa5e3a76ad7',
};

/** Parses a successful response or rejects with its HTTP status.
 * @param {Response} res - The fetch response to process.
 * @returns {Promise<unknown>} The parsed response body.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status}`);
  }
}

/** Retrieves all decks from the API.
 * @returns {Promise<unknown>} The response containing the decks.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/** Deletes a deck by its identifier.
 * @param {string} deckId - The identifier of the deck to delete.
 * @returns {Promise<Response>} The API response.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: 'DELETE',
    headers,
  });
}

/** Creates a deck through the API.
 * @param {string} name - The deck name.
 * @param {string} color - The deck's hexadecimal color.
 * @param {Array<object>} cards - The cards to include in the deck.
 * @returns {Promise<Response>} The API response.
 */
function addDeck(name, color, cards) {
  const newDeck = { name, color, cards };
  return fetch(`${baseUrl}/decks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newDeck),
  });
}

export { getDecks, deleteDeck, addDeck };
