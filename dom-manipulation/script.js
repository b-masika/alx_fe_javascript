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
    const selectedCategory = document.getElementById('categoryFilter').value;

    //Filter the array based on the dropdown selection
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory)

    //Handle cases where no qoutes exist for a category
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
        return;
    }

    //Pock a random quote from the FILTERED list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

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
        const newQuote = { text: newQuoteText, category: newQuoteCategory };

        quotes.push(newQuote);
        saveQuotes();
        populateCategories();

        //update the DOM: Clear the input fields after adding
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert("Quote added successfully!");

        //Call Server Sync
        postQuoteToServer(newQuote);
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

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');

    //Wipe the dropdwon clean
    //This removes the dependency on your HTML file being perfect
    categoryFilter.innerHTML = '';

    //Manually create and add the 'All Categories' option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    categoryFilter.appendChild(allOption);

    //Using .map() to extract categories
    const categories = quotes.map(quote => quote.category);

    //Use a Set to get only unique values from the mapped array
    const uniqueCategories = [...new Set(categories)];

    //Populate the dropdwon with the unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;

    //save the user's preference to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    //Refresh the dispalyed quote
    showRandomQuote();
}

//Function to mock posting data to a server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        const result = await response.json();
        console.log('Quote synced with server:', result);
    } catch (error) {
        console.error('Error posting quote:', error);
    }
}

//Fetch data/ quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverData = await response.json();
        return serverData; //Returns the data for other functions to use
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return []; // Return empty array on error
    }
}


//Function to sync and resolve conflicts
async function syncQuotes() {
    try {
        //Call fetch function to get data
        const serverData = await fetchQuotesFromServer();

        //if no data comes back, stop here
        if (!serverData || serverData.length === 0) return;

        //SIMULATION: Pretend server has a conflict
        //Manually create a quote that exists locally but has a different category on server
        const serverQuotes = [
            { text: "Life is what happens when you're busy making other plans.", category: "ServerChangedCategory" }, // Conflict!
            { text: "New server quote example.", category: "Tech" } // New Data}
        ];

        let updatesMade = false;

        //Loop through and check for conflicts
        for (const serverQuote of serverQuotes){
            const localQuoteIndex = quotes.findIndex(q => q.text === serverQuote.text);

            if (localQuoteIndex !== -1) {
                //Quote exists. Check for attribute conflict
                if (quotes[localQuoteIndex].category !== serverQuote.category) {
                    //CONFLICT DETECTED
                    //Ask user for manual resolution
                    const userWantsServerData = confirm(
                        `Conflict: Server has "${serverQuote.category}" for "${serverQuote.text}".\nKeep Server version?` 
                    );

                    if (userWantsServerData) {
                        quotes[localQuoteIndex].category = serverQuote.category;
                        updatesMade = true;
                    } 
                }
            } else {
                //User chose to keep local data
                const exists = quotes.some(q => q.text === serverQuote.text);
                if (!exists) {
                    quotes.push(serverQuote);
                    updatesMade = true;
                }
            }

        } 
        
        if (updatesMade) {
            saveQuotes();
            populateCategories();
            filterQuotes(); // Refresh view
            alert("Quotes synced with server!");
        }
    }catch(error) {
        console.error("Error syncing qutoes:", error);
    }
} 

//Initialize the app
populateCategories();

//Restore the last selected filter from local storage
const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
if (lastSelectedCategory) {
    document.getElementById('categoryFilter').value = lastSelectedCategory;
}

//Show the intitial quote
showRandomQuote();

//Create the notification container on load
const notificationContainer = document.createElement('div')
notificationContainer.id = 'notification-area';
document.body.appendChild(notificationContainer);

function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;

    notificationContainer.appendChild(notif);

    //Remove notification after 3s
    setTimeout(() => {
        notif.remove();
    }, 3000)
}

//Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

//Initial the form (Call the function to display the form inputs)
createAddQuoteForm();

//Periodically fetch quotes from the server (every 10 seconds)
setInterval(syncQuotes, 10000);