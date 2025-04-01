// app.js - Milk Depot Recipes Application Logic

// *** FIX: Wrap ALL DOM manipulation code in DOMContentLoaded listener ***
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Initializing app...");

    // --- Get Element References ---
    // Do this *inside* the listener to ensure elements exist
    const recipeListScreenEl = document.getElementById('recipeListScreen');
    const recipeDetailScreenEl = document.getElementById('recipeDetailScreen');
    const recipeListEl = document.getElementById('recipeList');
    const homeButton = document.getElementById('homeButton');
    const recipeNameEl = document.getElementById('recipeName');
    const ingredientsListEl = document.getElementById('recipeIngredients');
    const flavoringsListEl = document.getElementById('recipeFlavorings');
    const descriptionEl = document.getElementById('recipeDescription');
    const nutritionTableBodyEl = document.getElementById('nutritionTable')?.querySelector('tbody');
    const flavoringsParagraphEl = document.getElementById('flavoringsIntro'); // Use the specific ID

    // --- Robust Check if all essential elements were found ---
    const essentialElements = { // Use an object for clearer error messages
        recipeListScreenEl, recipeDetailScreenEl, recipeListEl, homeButton,
        recipeNameEl, ingredientsListEl, flavoringsListEl, flavoringsParagraphEl,
        descriptionEl, nutritionTableBodyEl
    };
    let allElementsFound = true;
    for (const [key, el] of Object.entries(essentialElements)) {
        if (!el) {
            console.error(`CRITICAL ERROR: HTML element for '${key}' not found! Check ID in index.html.`);
            allElementsFound = false;
        }
    }

    // Stop initialization if essential elements are missing
    if (!allElementsFound) {
         const listElement = document.getElementById('recipeList'); // Try getting it again for error display
         if(listElement) { listElement.innerHTML = '<li class="loading-placeholder">Error: App structure mismatch.</li>'; }
        return;
    } else {
         console.log("All essential elements successfully found.");
    }


    // --- Event Listeners ---
    // Now safe to add listeners as elements are confirmed to exist
    homeButton.addEventListener('click', showRecipeListScreen);

    // --- Core Functions ---

    /**
     * Clears and populates the recipe list screen.
     */
    function displayRecipeList() {
        recipeListEl.innerHTML = ''; // Clear placeholder

        // Check recipes data availability
        if (typeof recipes === 'undefined' || !Array.isArray(recipes) || recipes.length === 0) {
             recipeListEl.innerHTML = '<li class="loading-placeholder">Error: Recipes data not available.</li>';
             console.error("Recipes array missing or empty!");
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
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) { console.error("Recipe not found for ID:", recipeId); return; }

        recipeNameEl.textContent = recipe.name;

        // Populate Ingredients
        ingredientsListEl.innerHTML = '';
        if (recipe.ingredients && recipe.ingredients.length > 0) { recipe.ingredients.forEach(ing => { const li = document.createElement('li'); li.textContent = ing; ingredientsListEl.appendChild(li); }); }
        else { ingredientsListEl.innerHTML = '<li>Base ingredients not specified.</li>'; }

        // Populate Flavorings
        flavoringsListEl.innerHTML = '';
        if (recipe.flavorings && recipe.flavorings.length > 0) {
             flavoringsListEl.style.display = 'block'; flavoringsParagraphEl.style.display = 'block';
             recipe.flavorings.forEach(flav => { const li = document.createElement('li'); li.textContent = flav; flavoringsListEl.appendChild(li); });
        } else {
            flavoringsListEl.style.display = 'none'; flavoringsParagraphEl.style.display = 'none';
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

    // --- Initial Call ---
    // Call displayRecipeList immediately inside the listener,
    // it's safe because DOM is ready and elements were checked.
    displayRecipeList();
    console.log("App initialized and list displayed successfully.");

}); // End of DOMContentLoaded listener
