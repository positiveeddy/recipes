// app.js - Milk Depot Recipes Application Logic
// *** REMOVED DOMContentLoaded wrapper ***
// *** ADDED check for 'recipes' variable availability ***

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
const flavoringsParagraphEl = flavoringsListEl.previousElementSibling; // Get the <p> before flavorings

/**
 * Main initialization function called after scripts load.
 */
function initializeApp() {
    console.log("Initializing app..."); // Log start
    if (typeof recipes === 'undefined' || !Array.isArray(recipes)) {
        console.error("Recipes data not found or not an array!");
        // Display error to user
        const listElement = document.getElementById('recipeList');
        if(listElement) {
            listElement.innerHTML = '<li class="loading-placeholder">Error: Could not load recipes.</li>';
        }
        return; // Stop initialization
    }

    // --- Initialization ---
    displayRecipeList(); // Populate the list now that we know 'recipes' exists

    // --- Event Listeners ---
    homeButton.addEventListener('click', showRecipeListScreen);
}


// --- Functions --- (displayRecipeList, showRecipeDetailScreen, showRecipeListScreen remain the same as previous correct version)

/**
 * Clears and populates the recipe list screen from the global 'recipes' array.
 */
function displayRecipeList() {
    recipeListEl.innerHTML = ''; // Clear placeholder or previous list

    // Sort recipes alphabetically by name
    recipes.sort((a, b) => a.name.localeCompare(b.name));

    if (recipes.length === 0) {
         recipeListEl.innerHTML = '<li class="loading-placeholder">No recipes available.</li>';
         return;
    }

    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.textContent = recipe.name;
        li.dataset.recipeId = recipe.id; // Store the unique ID
        li.addEventListener('click', () => showRecipeDetailScreen(recipe.id));
        recipeListEl.appendChild(li);
    });
}

/**
 * Finds a recipe by ID and populates the detail screen.
 * @param {string} recipeId - The unique ID of the recipe to display.
 */
function showRecipeDetailScreen(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
        console.error("Recipe not found for ID:", recipeId);
        return;
    }

    // Populate Header
    recipeNameEl.textContent = recipe.name;

    // Populate Ingredients (Step 1)
    ingredientsListEl.innerHTML = '';
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ing => {
            const li = document.createElement('li'); li.textContent = ing; ingredientsListEl.appendChild(li);
        });
    } else { ingredientsListEl.innerHTML = '<li>Base ingredients not specified.</li>'; }

    // Populate Flavorings (Step 2)
    flavoringsListEl.innerHTML = '';
    if (recipe.flavorings && recipe.flavorings.length > 0) {
         flavoringsListEl.style.display = 'block'; if(flavoringsParagraphEl) flavoringsParagraphEl.style.display = 'block';
         recipe.flavorings.forEach(flav => {
            const li = document.createElement('li'); li.textContent = flav; flavoringsListEl.appendChild(li);
         });
    } else {
        flavoringsListEl.style.display = 'none'; if(flavoringsParagraphEl) flavoringsParagraphEl.style.display = 'none';
    }

    // Populate Description
    descriptionEl.innerHTML = recipe.description ? recipe.description.replace(/\n/g, '<br>') : "No description available.";

    // Populate Nutrition Table
    nutritionTableBodyEl.innerHTML = '';
    if (recipe.nutrition && Object.keys(recipe.nutrition).length > 0) {
        for (const [key, value] of Object.entries(recipe.nutrition)) {
             const row = nutritionTableBodyEl.insertRow();
             const nutrientCell = row.insertCell(); const amountCell = row.insertCell();
             let nutrientName = key.replace(/_mg|_iu|_g|_mcg/g, '').replace(/_/g, ' ');
             nutrientName = nutrientName.charAt(0).toUpperCase() + nutrientName.slice(1);
             nutrientCell.textContent = nutrientName;
             let unit = '';
             if (key === 'calories') unit = ' kcal'; else if (key.endsWith('_g')) unit = ' g'; else if (key.endsWith('_mg')) unit = ' mg'; else if (key.endsWith('_iu')) unit = ' IU'; else if (key.endsWith('_mcg')) unit = ' mcg';
             amountCell.textContent = (value !== null && value !== undefined) ? value + unit : '-';
        }
    } else {
         const row = nutritionTableBodyEl.insertRow(); const cell = row.insertCell(); cell.colSpan = 2;
         cell.textContent = "Estimated nutrition data not available."; cell.style.textAlign = "center"; cell.style.fontStyle = "italic"; cell.style.color = "#666";
    }

    // Switch Visible Screens
    recipeListScreenEl.classList.add('hidden');
    recipeDetailScreenEl.classList.remove('hidden');
    window.scrollTo(0, 0);
}

/**
 * Hides the detail screen and shows the recipe list screen.
 */
function showRecipeListScreen() {
    recipeDetailScreenEl.classList.add('hidden');
    recipeListScreenEl.classList.remove('hidden');
}

// Note: No DOMContentLoaded wrapper, initializeApp will be called explicitly from HTML
