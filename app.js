// app.js - Milk Depot Recipes Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // Get references to major screen elements
    const recipeListScreenEl = document.getElementById('recipeListScreen');
    const recipeDetailScreenEl = document.getElementById('recipeDetailScreen');

    // Get references to interactive/dynamic elements
    const recipeListEl = document.getElementById('recipeList');
    const homeButton = document.getElementById('homeButton');
    const recipeNameEl = document.getElementById('recipeName');
    const ingredientsListEl = document.getElementById('recipeIngredients');
    const flavoringsListEl = document.getElementById('recipeFlavorings');
    const descriptionEl = document.getElementById('recipeDescription');
    const nutritionTableBodyEl = document.getElementById('nutritionTable').querySelector('tbody');
    // Get reference to the paragraph preceding the flavorings list to hide/show it too
    const flavoringsParagraphEl = flavoringsListEl.previousElementSibling;


    // --- Initialization ---
    displayRecipeList(); // Populate the list when the page loads

    // --- Event Listeners ---
    homeButton.addEventListener('click', showRecipeListScreen);

    // --- Functions ---

    /**
     * Clears and populates the recipe list screen from the global 'recipes' array.
     */
    function displayRecipeList() {
        recipeListEl.innerHTML = ''; // Clear placeholder or previous list

        // Check if recipes array exists and has recipes
        if (typeof recipes === 'undefined' || recipes.length === 0) {
             recipeListEl.innerHTML = '<li class="loading-placeholder">No recipes found. Check recipes.js</li>';
             console.error("Recipes array is missing or empty!");
             return;
        }

        // Sort recipes alphabetically by name for easier browsing
        recipes.sort((a, b) => a.name.localeCompare(b.name));

        recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.textContent = recipe.name;
            // Use dataset to store the unique ID for easy retrieval on click
            li.dataset.recipeId = recipe.id;
            li.addEventListener('click', () => showRecipeDetailScreen(recipe.id)); // Add click handler
            recipeListEl.appendChild(li);
        });
    }

    /**
     * Finds a recipe by ID and populates the detail screen with its data.
     * @param {string} recipeId - The unique ID of the recipe to display.
     */
    function showRecipeDetailScreen(recipeId) {
        // Find the specific recipe object from the global 'recipes' array
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) {
            console.error("Recipe not found for ID:", recipeId);
            return; // Exit if recipe isn't found
        }

        // Populate Header
        recipeNameEl.textContent = recipe.name;

        // Populate Ingredients (Step 1)
        ingredientsListEl.innerHTML = ''; // Clear previous ingredients
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ing => {
                const li = document.createElement('li');
                li.textContent = ing;
                ingredientsListEl.appendChild(li);
            });
        } else {
            ingredientsListEl.innerHTML = '<li>Base ingredients not specified.</li>'; // Placeholder
        }


        // Populate Flavorings (Step 2)
        flavoringsListEl.innerHTML = ''; // Clear previous flavorings
        // Check if flavorings exist and the array is not empty
        if (recipe.flavorings && recipe.flavorings.length > 0) {
             flavoringsListEl.style.display = 'block'; // Show the <ul>
             flavoringsParagraphEl.style.display = 'block'; // Show the <p> tag before it
             recipe.flavorings.forEach(flav => {
                const li = document.createElement('li');
                li.textContent = flav;
                flavoringsListEl.appendChild(li);
            });
        } else {
            // Hide the list and the preceding paragraph if no flavorings
            flavoringsListEl.style.display = 'none';
            flavoringsParagraphEl.style.display = 'none';
        }

        // Populate Description
        // Use innerHTML to render line breaks (\n -> <br>) correctly
        descriptionEl.innerHTML = recipe.description ? recipe.description.replace(/\n/g, '<br>') : "No description available.";

        // Populate Nutrition Table
        nutritionTableBodyEl.innerHTML = ''; // Clear previous rows
        if (recipe.nutrition && Object.keys(recipe.nutrition).length > 0) {
            // Iterate through each nutrient in the recipe's nutrition object
            for (const [key, value] of Object.entries(recipe.nutrition)) {
                 const row = nutritionTableBodyEl.insertRow();
                 const nutrientCell = row.insertCell();
                 const amountCell = row.insertCell();

                 // Format nutrient names nicely (e.g., "saturated_fat_g" -> "Saturated fat")
                 let nutrientName = key.replace(/_mg|_iu|_g|_mcg/g, '').replace(/_/g, ' '); // Remove units, replace underscore
                 nutrientName = nutrientName.charAt(0).toUpperCase() + nutrientName.slice(1);
                 nutrientCell.textContent = nutrientName;

                 // Determine and append units based on common key naming patterns
                 let unit = '';
                 if (key === 'calories') unit = ' kcal';
                 else if (key.endsWith('_g')) unit = ' g'; // Assumes keys end with _g for grams
                 else if (key.endsWith('_mg')) unit = ' mg';// Assumes keys end with _mg for milligrams
                 else if (key.endsWith('_iu')) unit = ' IU'; // Assumes keys end with _iu for International Units
                 else if (key.endsWith('_mcg')) unit = ' mcg';// Assumes keys end with _mcg for micrograms

                 // Display value and unit, or '-' if value is missing/null
                 amountCell.textContent = (value !== null && value !== undefined) ? value + unit : '-';
            }
        } else {
             // Display a message if no nutrition data exists for this recipe
             const row = nutritionTableBodyEl.insertRow();
             const cell = row.insertCell();
             cell.colSpan = 2; // Make the cell span both columns
             cell.textContent = "Estimated nutrition data not available.";
             cell.style.textAlign = "center";
             cell.style.fontStyle = "italic";
             cell.style.color = "#666";
        }

        // Switch Visible Screens
        recipeListScreenEl.classList.add('hidden');    // Hide the list screen
        recipeDetailScreenEl.classList.remove('hidden'); // Show the detail screen
        window.scrollTo(0, 0); // Scroll to the top of the page to see the recipe details
    }

    /**
     * Hides the detail screen and shows the recipe list screen.
     */
    function showRecipeListScreen() {
        recipeDetailScreenEl.classList.add('hidden'); // Hide details
        recipeListScreenEl.classList.remove('hidden'); // Show list
    }

}); // End of DOMContentLoaded listener