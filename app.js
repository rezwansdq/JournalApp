document.addEventListener("DOMContentLoaded", function() {

    // Checklist Elements
    const checklist = document.getElementById("checklist");
    const newItemInput = document.getElementById("newItemInput");
    const addItemButton = document.getElementById("addItemButton");

    // Function to load the universal checklist
    function loadUniversalChecklist() {
        const savedUniversalChecklist = JSON.parse(localStorage.getItem("universal-checklist"));
        
        // If no universal checklist exists, initialize an empty array
        if (!savedUniversalChecklist) {
            localStorage.setItem("universal-checklist", JSON.stringify([]));
            return [];
        }

        return savedUniversalChecklist;
    }

    // Function to save the universal checklist
    function saveUniversalChecklist(items) {
        localStorage.setItem("universal-checklist", JSON.stringify(items));
    }

    // Function to load checklist item checked statuses for the selected date
    function loadCheckedStatus(date) {
        const savedCheckedStatus = JSON.parse(localStorage.getItem(`${date}-checked`)) || {};
        return savedCheckedStatus;  // return checked status or empty object if none exists
    }

    // Function to save checklist item checked statuses for the selected date
    function saveCheckedStatus(date, checkedStatus) {
        localStorage.setItem(`${date}-checked`, JSON.stringify(checkedStatus));
    }

    // Function to display the checklist
    function displayChecklist(date) {
        const universalChecklist = loadUniversalChecklist();
        const checkedStatus = loadCheckedStatus(date);
        checklist.innerHTML = "";  // Clear current checklist

        universalChecklist.forEach(function(item) {
            addChecklistItem(item, checkedStatus[item]);
        });
    }

    // Function to add a new checklist item (with optional checked status)
    function addChecklistItem(name, checked = false) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !!checked;  // Make sure it's either true or false

        // Update the checked status for the current date when checkbox is toggled
        checkbox.addEventListener("change", function() {
            const selectedDate = document.getElementById("journalDate").value;
            const checkedStatus = loadCheckedStatus(selectedDate);
            checkedStatus[name] = checkbox.checked;
            saveCheckedStatus(selectedDate, checkedStatus);
        });

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(name));
        checklist.appendChild(li);
    }

    // Add new item to the universal checklist
    addItemButton.addEventListener("click", function() {
        const newItemText = newItemInput.value.trim();

        if (newItemText !== "") {
            const universalChecklist = loadUniversalChecklist();
            universalChecklist.push(newItemText);  // Add to the universal list
            saveUniversalChecklist(universalChecklist);  // Save the updated universal list

            addChecklistItem(newItemText);  // Add the item to the displayed checklist
            newItemInput.value = "";  // Clear the input field
        }
    });

    // Load journal and checklist when a date is selected
    const dateInput = document.getElementById("journalDate");
    dateInput.addEventListener("change", function() {
        const selectedDate = dateInput.value;
        loadJournalEntry(selectedDate);  // Load the journal entry
        displayChecklist(selectedDate);  // Display the checklist for the selected date
        displayRatings(selectedDate);
    });

    // Load initial data for the current day (if date is pre-selected)
    if (dateInput.value) {
        displayChecklist(dateInput.value);
        displayRatings(dateInput.value);
    }
    
    // Function to load the journal entry for the selected date
    function loadJournalEntry(date) {
        const savedEntry = localStorage.getItem(date);
        if (savedEntry) {
            document.getElementById("journalEntry").value = savedEntry;
        } else {
            document.getElementById("journalEntry").value = ""; // Clear if no entry
        }
    }

        // Rating Category Elements
    const ratingList = document.getElementById("ratingList");
    const newRatingCategory = document.getElementById("newRatingCategory");
    const addRatingCategoryButton = document.getElementById("addRatingCategoryButton");

    // Function to load the universal rating categories
    function loadUniversalRatingCategories() {
        const savedCategories = JSON.parse(localStorage.getItem("universal-rating-categories"));
        
        // If no categories exist, initialize an empty array
        if (!savedCategories) {
            localStorage.setItem("universal-rating-categories", JSON.stringify([]));
            return [];
        }

        return savedCategories;
    }

    // Function to save the universal rating categories
    function saveUniversalRatingCategories(categories) {
        localStorage.setItem("universal-rating-categories", JSON.stringify(categories));
    }

    // Function to load the ratings for the selected date
    function loadRatingsForDate(date) {
        const savedRatings = JSON.parse(localStorage.getItem(`${date}-ratings`)) || {};
        return savedRatings;
    }

    // Function to save ratings for the selected date
    function saveRatingsForDate(date, ratings) {
        localStorage.setItem(`${date}-ratings`, JSON.stringify(ratings));
    }

    // Function to display rating sliders for each category
    function displayRatings(date) {
        const categories = loadUniversalRatingCategories();
        const ratings = loadRatingsForDate(date);
        ratingList.innerHTML = ""; // Clear the current list

        categories.forEach(function(category) {
            addRatingCategory(category, ratings[category] !== undefined ? ratings[category] : 5); // Default to 5 if not saved
        });
    }

    // Function to add a rating category (with optional rating value)
    function addRatingCategory(name, rating = 5) {
        const li = document.createElement("li");

        const label = document.createElement("label");
        label.textContent = `${name}:`;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "10";
        slider.value = rating;
        slider.step = "1";

        const valueDisplay = document.createElement("span");
        valueDisplay.textContent = rating;

        // Update the value display and save the rating when the slider changes
        slider.addEventListener("input", function() {
            valueDisplay.textContent = slider.value;
            const selectedDate = document.getElementById("journalDate").value;
            const ratings = loadRatingsForDate(selectedDate);
            ratings[name] = slider.value;
            saveRatingsForDate(selectedDate, ratings);  // Save ratings for the selected date
        });

        li.appendChild(label);
        li.appendChild(slider);
        li.appendChild(valueDisplay);
        ratingList.appendChild(li);
    }

    // Event listener to add a new rating category
    addRatingCategoryButton.addEventListener("click", function() {
        const newCategoryText = newRatingCategory.value.trim();

        if (newCategoryText !== "") {
            const categories = loadUniversalRatingCategories();
            categories.push(newCategoryText);  // Add the new category to the list
            saveUniversalRatingCategories(categories);  // Save the updated categories list

            addRatingCategory(newCategoryText);  // Add the new category to the displayed list
            newRatingCategory.value = "";  // Clear the input field
        }
    });
});
