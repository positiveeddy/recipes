// app.js - Milk Depot Recipes Application Logic

// *** FIX: Wrap ALL DOM manipulation code in DOMContentLoaded listener ***
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed"); // Log when DOM is ready

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
    const nutritionTableBodyEl = document.getElementById('nutritionTable')?.querySelector('tbody');
    // Get the paragraph before flavorings using its new ID
    const flavoringsParagraphEl = document.getElementById('flavoringsIntro'); // <<< Use ID here


    // Check if all essential elements were found NOW that DOM is ready
    if (!recipeListScreenEl || !recipeDetailScreenEl || !recipeListEl || !homeButton || !recipeNameEl || !ingredientsListEl || !flavoringsListEl || !descriptionEl || !nutritionTableBodyEl || !flavoringsParagraphEl) {
        console.error("CRITICAL ERROR: One or more essential HTML elements not found AFTER DOMContentLoaded! Check IDs in index.html.");
        if(recipeListEl) { recipeListEl.innerHTML = '<li class="loading-placeholder">Error: App elements missing.</li>'; }
        return; // Stop initialization
    } else {
         console.log("All essential elements found.");
    }


    // --- Event Listeners ---
    homeButton.addEventListener('click', showRecipeListScreen); // Add listener now elements exist

    // --- Core Functions --- (Defined inside DOMContentLoaded or globally accessible)

    /**
     * Clears and populates the recipe list screen from the global 'recipes' array.
     */
    function displayRecipeList() {
        if (!recipeListEl) return; // Guard
        recipeListEl.innerHTML = ''; // Clear placeholder

        if (typeof recipes === 'undefined' || !Array.isArray(recipes) || recipes.length === 0) {
             recipeListEl.innerHTML = '<li class="loading-placeholder">Error: Recipes data not available.</li>';
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
             flavoringsListEl.style.display = 'block'; flavoringsParagraphEl.style.display = 'block'; // Use the variable found earlier
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
    // Call displayRecipeList only AFTER DOM is loaded and elements are guaranteed to exist
    displayRecipeList();
    console.log("App initialized and list displayed.");

}); // End of DOMContentLoaded listener
