//Load quotes from local storage on initiation
let quotes = [];

if (localStorage.getItem('quotes')) {
    quotes = JSON.parse(localStorage.getItem('quotes'));
} else {
    //Default quotes if local storage is empty
    quotes = [
        {text: "The only way to do great work is to love what you do.", category: "Inspiration"},
        {text: "Life is what happens when you're busy making other plans.", category: "Life"},
        {text: "The future belongs to those who believe in the beauty of their dreams", category: "Dream"}
    ];
}


// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    //Store the last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));

    //Clear previous content
    quoteDisplay.innerHTML = '';

    // Create elements for the quote text and category
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${randomQuote.text}"`;

    const quoteCategory = document.createElement('p');
    quoteCategory.style.fontStyle = "italic"; //Optional styling
    quoteCategory.textContent = `Category: ${randomQuote.category}`;

    // Append elements to the dispay div
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
};

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const inputQuote = document.createElement('input');
    inputQuote.id = 'newQuoteText';
    inputQuote.type = 'text';
    inputQuote.placeholder = 'Enter a new quote';

    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote; //Function defined in next step

    // Append inputs and button the the container
    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);

    //Append the container to the body
    document.body.appendChild(formContainer);
}

//Function to add a new quote to the array
function addQuote() {
    //Get values from input fields
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    //Validate inputs
    if (newQuoteText && newQuoteCategory) {
        //Add the new quote object to the quotes array
        quotes.push({text: newQuoteText, category: newQuoteCategory });

        //Save to local storage
        localStorage.setItem('quotes', JSON.stringify(quotes));

        //update the DOM: Clear the input fields after adding
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const exportFileDefaultName = 'quotes.json';

    let linkElement = document.createElement('a')
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes(); //Update local storage
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

//Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

//Initial the form (Call the function to display the form inputs)
createAddQuoteForm();