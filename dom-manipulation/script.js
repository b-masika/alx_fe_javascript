// Array containing quote objects
let quotes = [
    {text: "The only way to do great work is to love what you do.", category: "Inspiration"},
    {text: "Life is what happens when you're busy making other plans.", category: "Life"},
    {text: "The future belongs to those who believe in the beauty of their dreams", category: "Dream"}
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

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

        //update the DOM: Clear the input fields after adding
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}


//Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

//Initial the form (Call the function to display the form inputs)
createAddQuoteForm();