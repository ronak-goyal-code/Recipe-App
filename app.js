const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-closeBtn');

const fetchRecipes = async (meal) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";
    try{
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
        const response = await data.json();
        recipeContainer.innerHTML = "";
        response.meals.forEach((meal) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            button.addEventListener('click',() => {
                openRecipePopup(meal);
            });
            
            recipeContainer.appendChild(recipeDiv);
        });
    }
    catch(error){
        recipeContainer.innerHTML = "<h2>Recipe not found</h2>";
    }
}

const fetchIngredients = (meal) => {
    let ingredientList = "";
    for(let i=1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientList;
}

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instruction:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `
    
    recipeDetailsContent.parentElement.style.display = 'block';
}

recipeCloseBtn.addEventListener('click',()=>{
    recipeDetailsContent.parentElement.style.display = 'none';
});

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const meal = searchBox.value.trim();
    if(!meal){
        recipeContainer.innerHTML = `<h2>Search your favourite meal.`;
        return;
    }
    fetchRecipes(meal);
});