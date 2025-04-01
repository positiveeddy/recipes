// app.js - Milk Depot Recipes Application Logic

/**
 * Main initialization function called explicitly from HTML after scripts load.
 * @param {Array} recipesData - The array of recipe objects passed from recipes.js.
 */
function initializeApp(recipesData) { // <<< Accept recipesData as parameter
    console.log("Initializing app with data...");

    // Use the passed-in data, not a global variable
    const recipes = recipesData;

    // Get element references *inside* this function
    const recipeListScreenEl = document.getElementById('recipeListScreen');
    const recipeDetailScreenEl = document.getElementById('recipeDetailScreen');
    const recipeListEl = document.getElementById('recipeList');
    const homeButton = document.getElementById('homeButton');
    const recipeNameEl = document.getElementById('recipeName');
    const ingredientsListEl = document.getElementById('recipeIngredients');
    const flavoringsListEl = document.getElementById('recipeFlavorings');
    const descriptionEl = document.getElementById('recipeDescription');
    const nutritionTableBodyEl = document.getElementById('nutritionTable')?.querySelector('tbody');
    let flavoringsParagraphEl = null; // Defined later if element exists

     // Check if essential elements were found AFTER the DOM should be ready
    if (!recipeListScreenEl || !recipeDetailScreenEl || !recipeListEl || !homeButton || !recipeNameEl || !ingredientsListEl || !flavoringsListEl || !descriptionEl || !nutritionTableBodyEl) {
        console.error("CRITICAL ERROR: One or more essential HTML elements not found! Check IDs in index.html.");
        // Try to display error to user
        const listElement = document.getElementById('recipeList'); // Try getting it again for error display
        if(listElement) { listElement.innerHTML = '<li class="loading-placeholder">Error: App HTML structure mismatch.</li>'; }
        return; // Stop initialization
    }

    // Now safe to get the paragraph element
     flavoringsParagraphEl = flavoringsListEl.previousElementSibling;


    // --- Event Listeners ---
    homeButton.addEventListener('click', showRecipeListScreen);

    // --- Core Functions (Defined inside initializeApp or accessible) ---

    /**
     * Clears and populates the recipe list screen.
     */
    function displayRecipeList() {
        recipeListEl.innerHTML = ''; // Clear placeholder

        // Check if recipes array was passed correctly
        if (typeof recipes === 'undefined' || !Array.isArray(recipes) || recipes.length === 0) {
             recipeListEl.innerHTML = '<li class="loading-placeholder">Error: No recipes loaded.</li>';
             console.error("Recipes array missing or empty within displayRecipeList!");
             return;
        }

        recipes.sort((a, b) => a.name.localeCompare(b.name));

        recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.textContent = recipe.name;
            li.dataset.recipeId = recipe.id;
            li.addEventListener('click', () => showRecipeDetailScreen(recipe.id));
            recipeListEl.appendChild(li);
        });
         console.log("Recipe list displayed.");
    }

    /**
     * Finds a recipe by ID and populates the detail screen.
     * @param {string} recipeId - The unique ID of the recipe.
     */
    function showRecipeDetailScreen(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId); // Use the recipes array available in this scope
        if (!recipe) { console.error("Recipe not found for ID:", recipeId); return; }

        recipeNameEl.textContent = recipe.name;

        // Populate Ingredients
        ingredientsListEl.innerHTML = '';
        if (recipe.ingredients && recipe.ingredients.length > 0) { recipe.ingredients.forEach(ing => { const li = document.createElement('li'); li.textContent = ing; ingredientsListEl.appendChild(li); }); }
        else { ingredientsListEl.innerHTML = '<li>Base ingredients not specified.</li>'; }

        // Populate Flavorings
        flavoringsListEl.innerHTML = '';
        if (recipe.flavorings && recipe.flavorings.length > 0) {
             flavoringsListEl.style.display = 'block'; if(flavoringsParagraphEl) flavoringsParagraphEl.style.display = 'block';
             recipe.flavorings.forEach(flav => { const li = document.createElement('li'); li.textContent = flav; flavoringsListEl.appendChild(li); });
        } else {
            flavoringsListEl.style.display = 'none'; if(flavoringsParagraphEl) flavoringsParagraphEl.style.display = 'none';
        }

        // Populate Description
        descriptionEl.innerHTML = recipe.description ? recipe.description.replace(/\n/g, '<br>') : "No description available.";

        // Populate Nutrition Table
        nutritionTableBodyEl.innerHTML = '';
        if (recipe.nutrition && Object.keys(recipe.nutrition).length > 0) {
            for (const [key, value] of Object.entries(recipe.nutrition)) {
                 const row = nutritionTableBodyEl.insertRow(); const nutrientCell = row.insertCell(); const amountCell = row.insertCell();
                 let nutrientName = key.replace(/_mg|_iu|_g|_mcg/g, '').replace(/_/g, ' '); nutrientName = nutrientName.charAt(0).toUpperCase() + nutrientName.slice(1); nutrientCell.textContent = nutrientName;
                 let unit = ''; if (key === 'calories') unit = ' kcal'; else if (key.endsWith('_g')) unit = ' g'; else if (key.endsWith('_mg')) unit = ' mg'; else if (key.endsWith('_iu')) unit = ' IU'; else if (key.endsWith('_mcg')) unit = ' mcg';
                 amountCell.textContent = (value !== null && value !== undefined) ? value + unit : '-';
            }
        } else {
             const row = nutritionTableBodyEl.insertRow(); const cell = row.insertCell(); cell.colSpan = 2; cell.textContent = "Estimated nutrition data not available."; cell.style.textAlign = "center"; cell.style.fontStyle = "italic"; cell.style.color = "#666";
        }

        // Switch Visible Screens
        recipeListScreenEl.classList.add('hidden'); recipeDetailScreenEl.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    /**
     * Hides the detail screen and shows the recipe list screen.
     */
    function showRecipeListScreen() {
        recipeDetailScreenEl.classList.add('hidden');
        recipeListScreenEl.classList.remove('hidden');
    }

    // --- Initial Call within initializeApp ---
    displayRecipeList(); // Populate the list now that elements and data are ready

} // End of initializeApp function
