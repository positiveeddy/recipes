// app.js - Milk Depot Recipes Application Logic

// This script assumes it's loaded with 'defer', so the DOM is ready.
// It also assumes 'recipes.js' loaded first, defining the 'recipes' array globally.

// Get references to major screen elements ONCE
const recipeListScreenEl = document.getElementById('recipeListScreen');
const recipeDetailScreenEl = document.getElementById('recipeDetailScreen');
const recipeListEl = document.getElementById('recipeList');
const homeButton = document.getElementById('homeButton');
const recipeNameEl = document.getElementById('recipeName');
const ingredientsListEl = document.getElementById('recipeIngredients');
const flavoringsListEl = document.getElementById('recipeFlavorings');
const descriptionEl = document.getElementById('recipeDescription');
const nutritionTableBodyEl = document.getElementById('nutritionTable')?.querySelector('tbody');
// Get the paragraph before flavorings - assign ID 'flavoringsIntro' in HTML for reliability
const flavoringsParagraphEl = document.getElementById('flavoringsIntro');


/**
 * Checks if all essential DOM elements are loaded.
 * Logs an error and returns false if any are missing.
 */
function checkElementsExist() {
    const elements = {
        recipeListScreenEl, recipeDetailScreenEl, recipeListEl, homeButton,
        recipeNameEl, ingredientsListEl, flavoringsListEl, descriptionEl,
        nutritionTableBodyEl, flavoringsParagraphEl // Check this one too
    };
    for (const [key, el] of Object.entries(elements)) {
        if (!el) {
            console.error(`CRITICAL ERROR: HTML element with ID corresponding to '${key}' not found! Check index.html.`);
            // Display error to user on the list page
             const listElement = document.getElementById('recipeList'); // Try getting it again
             if(listElement) { listElement.innerHTML = '<li class="loading-placeholder">Error: App HTML structure mismatch. Cannot load recipes.</li>'; }
            return false; // Indicate failure
        }
    }
    return true; // All essential elements found
}


/**
 * Clears and populates the recipe list screen from the global 'recipes' array.
 */
function displayRecipeList() {
    if (!recipeListEl) return; // Guard against element not found
    recipeListEl.innerHTML = ''; // Clear placeholder or previous list

    // Check if recipes array exists and has recipes
    if (typeof recipes === 'undefined' || !Array.isArray(recipes) || recipes.length === 0) {
         recipeListEl.innerHTML = '<li class="loading-placeholder">Error: Recipes data not loaded.</li>';
         console.error("Recipes array is missing, not an array, or empty!");
         return;
    }

    // Sort recipes alphabetically by name
    recipes.sort((a, b) => a.name.localeCompare(b.name));

    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.textContent = recipe.name;
        li.dataset.recipeId = recipe.id; // Store the unique ID
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
    // Ensure elements are valid before proceeding (though checkElementsExist should catch this)
    if (!recipeNameEl || !ingredientsListEl || !flavoringsListEl || !descriptionEl || !nutritionTableBodyEl || !recipeListScreenEl || !recipeDetailScreenEl || !flavoringsParagraphEl) {
         console.error("Cannot show details - one or more required elements are missing.");
         return;
    }

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
    if(!recipeDetailScreenEl || !recipeListScreenEl) return; // Safety check
    recipeDetailScreenEl.classList.add('hidden');
    recipeListScreenEl.classList.remove('hidden');
}

// --- Initialization Code ---
// This runs after the DOM is parsed and recipes.js is loaded, thanks to 'defer'
console.log("app.js executing...");

// Check if all needed elements exist before adding listeners or showing data
if (checkElementsExist()) {
    // Add event listener for the home button
    homeButton.addEventListener('click', showRecipeListScreen);
    // Initial population of the recipe list
    displayRecipeList();
    console.log("App initialized successfully.");
} else {
    console.error("App initialization failed due to missing HTML elements.");
    // The error message should already be displayed by checkElementsExist
}
// End of app.js script
