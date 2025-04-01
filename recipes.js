// Milk Depot Recipe Data
// NUTRITION IS ESTIMATED BASED ON WHOLE INGREDIENTS - SEE DISCLAIMER

const recipes = [
    // --- ALMOND ---
    {
        id: "almond001",
        name: "Classic Creamy Almond",
        ingredients: ["1 cup Raw Almonds (soaking optional)"],
        flavorings: ["1 tbsp Maple Syrup", "1/2 tsp Vanilla Extract", "Pinch Pink Himalayan Salt"],
        description: "The timeless favorite! This classic almond milk is smooth, subtly sweet, and incredibly versatile. Soaking the almonds beforehand can yield an even creamier result, but it's great either way.\n\nPerfect for pouring over cereal, blending into smoothies, adding to your morning coffee, or using in baking recipes. It's a fantastic dairy-free staple for any household.",
        nutrition: { calories: 65, fat: 5, saturated_fat: 05 cups) fresh water and place the milk maker top onto the pitcher.</li>
                        <li>Press the 'Start' button. Go grab a glass!</li>
                        <li>In about a minute, your fresh, filtered milk is ready! Pour, enjoy immediately, or chill for later.</li>
                    </ol>
                </div>

                 <div class="recipe-section">
                    <h3>Why You'll Love It</h3>
                    <p id="recipeDescription"></p>
                </div>


                <div class="recipe-section">
                    <h3>Nutrition Estimate* (Per 1 cup / 240ml Serving)</h3>
                    <table id="nutritionTable">
                        <thead>
                            <tr>
                                <th>Nutrient</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Nutrition data loaded by JavaScript -->
                        </tbody>
                    </table>
                    <p class="disclaimer">
                        *<strong>Disclaimer:</strong> Nutrition information is an estimate based on the raw ingredients listed for Step 1 & 2 before blending and dilution. Actual values in the final milk will vary based on specific ingredients, appliance efficiency, and potential settling. This table is for informational purposes only.
                    </p>
                </div>

            </div>
        </main>

         <footer id="appFooter">
            <p>&copy; Milk Depot - Make Milk Magic!</p>
        </footer>

    </div>

    <script src="recipes.js"></script> {/* Contains the recipe data */}
    <script src="app.js"></script>     {/* Contains the app's logic */}
</body>
</html>