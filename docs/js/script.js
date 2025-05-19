closeNav();
searchMealByName("");

// Opening & closing navigation side bar
$("#navBtn").click(function () {
    if ($("#sideNav").hasClass("active")) {
        closeNav();
    }
    else {
        openNav();
    }
})

function closeNav() {
    $("#navBtn").html(`<i class="fa-solid fa-align-justify fa-2x"></i>`);
    $("#sideNav").removeClass("active");
    $("#sideBar").css({ "transform": "translateX(-250px)" });
    $("#navBtns li").animate({ top: 200 }, 400);
}

function openNav() {
    $("#navBtn").html(`<i class="fa-solid open-close-icon fa-2x fa-x"></i>`);
    $("#sideNav").addClass("active");
    $("#sideBar").css({ "transform": "translateX(0)" });

    for (let i = 0; i < 5; i++) {
        $("#navBtns li").eq(i).animate({ top: 0 }, (i + 4) * 100);
    }
}

// Dynamic content without reloading
$("#searchBtn").click(function () {
    closeNav();
    hideElementsById(...["contactForm"]);
    $("#pageContent").html(``);
    displayElementsById(...["searchForm"]);
    displaySearchForm();
})

$("#categoriesBtn").click(function () {
    closeNav();
    hideElementsById(...["searchForm", "contactForm"]);
    displayElementsById(...["pageContent"]);
    getCategories();
})

$("#areaBtn").click(function () {
    closeNav();
    hideElementsById(...["searchForm", "contactForm"]);
    displayElementsById(...["pageContent"]);
    getAreas();
})

$("#ingredientsBtn").click(function () {
    closeNav();
    hideElementsById(...["searchForm", "contactForm"]);
    displayElementsById(...["pageContent"]);
    getIngredients();
})

$("#contactUsBtn").click(function () {
    closeNav();
    hideElementsById(...["searchForm", "pageContent"]);
    displayElementsById(...["contactForm"]);
    displayContactUsForm();
})

// Search meals
async function searchMealByName(mealName) {
    $(".load-box").fadeIn(0);
    let responseMeals = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    responseMeals = await responseMeals.json();
    console.log(responseMeals.meals)
    if (responseMeals.meals == null) {
        displayMeals([]);
    }
    else {
        displayMeals(responseMeals.meals);
    }
    $(".load-box").fadeOut(200);
}

async function searchMealByFirstLetter(letter) {
    $(".load-box").fadeIn(0);
    console.log(letter)
    if (letter == "") {
        letter = "a";
    }
    let responseMeals = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    responseMeals = await responseMeals.json();
    console.log(responseMeals.meals)
    if (responseMeals.meals == "no data found") {
        displayMeals([]);
    }
    else {
        displayMeals(responseMeals.meals);
    }
    $(".load-box").fadeOut(200);
}

// Get meal details
async function getMealDetails(id) {
    let responseMealDetails = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    responseMealDetails = await responseMealDetails.json();
    console.log(responseMealDetails.meals[0]);
    displayMealDetails(responseMealDetails.meals[0]);
}

// Display meals & details
function displayMealDetails(mealDetails) {
    $(".load-box").fadeIn(0);
    closeNav();
    hideElementsById(...["searchForm", "contactForm"]);

    let mealIngredients = [];
    let i = 1;
    while (i <= 20) {
        let ingredientVar = "strIngredient" + i;
        let ingredientMeasure = "strMeasure" + i;

        i++;
        if (mealDetails[ingredientVar] == "") {
            break;
        }
        else {
            let mealIngredient = mealDetails[ingredientMeasure] + " " + mealDetails[ingredientVar];
            mealIngredients.push(mealIngredient);
        }
    }

    let isTags;
    if (mealDetails.strTags) {
        isTags = true;
    }
    else {
        isTags = false;
    }

    let content = `
        <div class="col-md-4">
            <div class="inner">
                <img src="${mealDetails.strMealThumb}" class="w-100 d-block rounded-2" alt="${mealDetails.strMeal} Meal">
                <h3 class="text-white mt-2">${mealDetails.strMeal}</h3>
            </div>
        </div>
        <div class="col-md-8">
            <div class="inner text-white d-flex flex-column gap-2">
                <h3>Instructions</h3>
                <p class="lh-26px">${mealDetails.strInstructions}</p>
                <h3>Area: ${mealDetails.strArea}</h3>
                <h3>Category: ${mealDetails.strCategory}</h3>
                <h3>Rercipes: </h3>
                <ul class="list-unstyled d-flex flex-wrap" id="mealRecipes">
                    
                </ul>
                <h3>Tags:</h3>
                <ul class="list-unstyled d-flex flex-wrap" id="mealTags">
                    
                </ul>
                <div>
                    <a href="${mealDetails.strSource}" target="_blank" class="btn btn-success">Source</a>
                    <a href="${mealDetails.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
                </div>
            </div>
        </div>
    `;
    $("#pageContent").html(content);

    let ingredients = ``;
    for (let i = 0; i < mealIngredients.length; i++) {
        ingredients += `
            <li class="alert alert-info m-2 p-1">${mealIngredients[i]}</li>
        `
    }

    if (isTags) {
        let mealtags = mealDetails.strTags.split(',');
        let tags = ``;
        for (let i = 0; i < mealtags.length; i++) {
            tags += `
                <li class="alert alert-danger m-2 p-1">${mealtags[i]}</li> 
            `
        }
        $("#mealTags").html(tags);
    }

    $("#mealRecipes").html(ingredients);
    $(".load-box").fadeOut(200);
}

function displayMeals(meals) {
    $(".load-box").fadeIn(0);
    let content = ``;
    for (let i = 0; i < meals.length; i++) {
        content += `
            <div class="col-md-3">
                <div class="inner-cursor position-relative text-white overflow-hidden rounded-2" onclick="getMealDetails(${meals[i].idMeal})">
                    <div class="item">
                        <img src="${meals[i].strMealThumb}" class="w-100 d-block" alt="${meals[i].strMeal} Meal">
                    </div>
                    <div class="layer h-100 w-100 position-absolute">
                        <h5 class="text-black fs-3 fw-medium position-absolute top-50 translate-middle-y ps-3">
                            ${meals[i].strMeal}</h5>
                    </div>
                </div>
            </div>
        `
    }
    $("#pageContent").html(content);
    $(".load-box").fadeOut(200);
}

// Get categories & their meals
async function getCategories() {
    $(".load-box").fadeIn(0);
    let mealCategories = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    mealCategories = await mealCategories.json();
    displayMealCategories(mealCategories.categories.slice(0, 20));
    $(".load-box").fadeOut(200);
}

async function getMealsOfCategory(category) {
    let mealsOfCategory = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    mealsOfCategory = await mealsOfCategory.json();
    displayMeals(mealsOfCategory.meals);
}

// Display categories
function displayMealCategories(categories) {
    $(".load-box").fadeIn(0);
    let content = ``;
    for (let i = 0; i < categories.length; i++) {
        let maxDescription = (categories[i].strCategoryDescription).substring(0, 150);
        maxDescription += "..";
        console.log(categories[i].strCategory);
        content += `
            <div class="col-md-3">
                <div class="inner-cursor position-relative text-white overflow-hidden rounded-2" onclick="getMealsOfCategory('${categories[i].strCategory}')">
                    <div class="item">
                        <img src="${categories[i].strCategoryThumb}" class="w-100 d-block" alt="${categories[i].strCategory} Meal">
                    </div>
                    <div class="layer h-100 w-100 position-absolute p-3 text-center">
                        <h5 class="text-black fs-3 fw-medium">
                            ${categories[i].strCategory}</h5>
                        <p class="text-black">${maxDescription}</p>
                    </div>
                </div>
            </div>
        `
    }
    $("#pageContent").html(content);
    $(".load-box").fadeOut(200);
}

// Get areas and their meals
async function getAreas() {
    let mealAreas = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    mealAreas = await mealAreas.json();
    displayMealAreas(mealAreas.meals.slice(0, 20));
}

async function getMealsOfArea(area) {
    let mealsOfArea = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    mealsOfArea = await mealsOfArea.json();
    displayMeals(mealsOfArea.meals);
}

// Display areas
function displayMealAreas(areas) {
    $(".load-box").fadeIn(0);
    let content = ``;
    for (let i = 0; i < areas.length; i++) {
        content += `
            <div class="col-md-3">
                <div class="inner-cursor text-white text-center overflow-hidden rounded-2" onclick="getMealsOfArea('${areas[i].strArea}')">
                    <div class="item">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h5 class="text-white fs-3 fw-medium mt-2">
                            ${areas[i].strArea}</h5>
                    </div>
                </div>
            </div>
        `
    }
    $("#pageContent").html(content);
    $(".load-box").fadeOut(200);
}

// Get ingredients & their meals
async function getIngredients() {
    let mealIngredients = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    mealIngredients = await mealIngredients.json();
    displayMealIngredients(mealIngredients.meals.slice(0, 20));
}

async function getMealsOfIngredient(ingredient) {
    let mealsOfIngredient = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    mealsOfIngredient = await mealsOfIngredient.json();
    displayMeals(mealsOfIngredient.meals);
}

// Display ingredients
function displayMealIngredients(ingredients) {
    $(".load-box").fadeIn(0);
    let content = ``;
    for (let i = 0; i < ingredients.length; i++) {
        let maxDescription = (ingredients[i].strDescription).substring(0, 100);
        maxDescription += "..";
        content += `
            <div class="col-md-3">
                <div class="inner-cursor text-white text-center overflow-hidden rounded-2" onclick="getMealsOfIngredient('${ingredients[i].strIngredient}')">
                    <div class="item">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h5 class="text-white fs-3 fw-medium mt-2">
                            ${ingredients[i].strIngredient}</h5>
                        <p class="text-white">${maxDescription}</p>
                    </div>
                </div>
            </div>
        `
    }
    $("#pageContent").html(content);
    $(".load-box").fadeOut(200);
}

// Display search form
function displaySearchForm() {
    $("#searchForm").html(`
        <div class="col-md-6">
            <input type="text" class="form-control search" id="searchName" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input type="text" class="form-control search" id="searchLetter" placeholder="Search By First Letter"
                maxlength="1">
        </div>
        `);
    $("#searchName").on("keyup", function (eventInfo) {
        console.log((eventInfo.target.value));
        searchMealByName((eventInfo.target.value));
    })
    $("#searchLetter").on("keyup", function (eventInfo) {
        console.log((eventInfo.target.value));
        searchMealByFirstLetter((eventInfo.target.value));
    })
}

// Display contact form
function displayContactUsForm() {
    $("#contactForm").html(`
            <div class="col-md-6">
                <input type="text" class="form-control contact-input" placeholder="Enter Your Name" aria-label="Enter Your Name"
                    id="userName">
                <div class="alert alert-danger w-100 mt-2 d-none" role="alert">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input type="email" class="form-control contact-input" placeholder="Enter Your Email" id="userEmail"
                    aria-label="Enter Your Email">
                <div class="alert alert-danger w-100 mt-2 d-none" role="alert">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input type="phone" class="form-control contact-input" placeholder="Enter Your Phone" id="userPhone"
                    aria-label="Enter Your Phone">
                <div class="alert alert-danger w-100 mt-2 d-none" role="alert">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input type="number" class="form-control contact-input" placeholder="Enter Your Age" aria-label="Enter Your Age"
                    id="userAge">
                <div class="alert alert-danger w-100 mt-2 d-none" role="alert">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input type="password" class="form-control contact-input" placeholder="Enter Your Password" id="userPassword"
                    aria-label="Enter Your Password">
                <div class="alert alert-danger w-100 mt-2 d-none" role="alert">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input type="password" class="form-control contact-input" placeholder="RePassword" aria-label="RePassword"
                    id="userRePassword">
                <div class="alert alert-danger w-100 mt-2 d-none" role="alert">
                    Enter valid repassword
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-outline-light d-block w-fit m-auto disabled mt-3" id="submitBtn">Submit</button>
                <div class="alert alert-danger w-100 mt-2 d-none" role="alert">
                    User Exist!
                </div>
            </div>
        `);
    validateContactInputs()
}

// Hide elements
function hideElementsById(...elements) {
    for (let i = 0; i < elements.length; i++) {
        $(`#${elements[i]}`).hide();
    }
}

// Display elements
function displayElementsById(...elements) {
    for (let i = 0; i < elements.length; i++) {
        $(`#${elements[i]}`).show();
    }
}
let users = [];
if (localStorage.getItem("users") == null) {
    localStorage.setItem("users", JSON.stringify(users));
}
users = JSON.parse(localStorage.getItem("users"));

// Validate contact form inputs
let myRegex = {
    userName: /^[a-zA-Z ]+$/,
    userEmail: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    userPhone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    userAge: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
    userPassword: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/
}

class User {
    constructor(userName, userEmail, userPhone, userAge, userPassword) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.userAge = userAge;
        this.userPassword = userPassword;
    }
}

function validateContactInputs() {
    $(".contact-input").on("input", function (eventInfo) {
        switchBtnStatus();
        if (eventInfo.target.id == "userRePassword") {
            checkValidRePassword(eventInfo.target.value);
        }
        else {
            if (myRegex[eventInfo.target.id].test(eventInfo.target.value)) {
                eventInfo.target.nextElementSibling.classList.replace("d-block", "d-none");
                console.log("valid");
            }
            else {
                eventInfo.target.nextElementSibling.classList.replace("d-none", "d-block");
                console.log("not valid");
            }
        }
    })

    $("#submitBtn").click(function () {
        $(".load-box").fadeIn(0);
        if (isUniqueUser($("#userEmail").val())) {
            $("#submitBtn").next().removeClass("d-block");
            $("#submitBtn").next().addClass("d-none");
            let newUser = new User($("#userName").val(), $("#userEmail").val(), $("#userPhone").val(), $("#userAge").val(), $("#userPassword").val());
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            clearFormValues();
        }
        else {
            $("#submitBtn").next().removeClass("d-none");
            $("#submitBtn").next().addClass("d-block");
        }
        $(".load-box").fadeOut(200);
    })
}

function checkValidRePassword(value) {
    console.log(value, $("#userPassword").val());
    if (value == $("#userPassword").val()) {
        console.log("valid");
        $("#userRePassword").next().removeClass("d-block");
        $("#userRePassword").next().addClass("d-none");
    }
    else {
        console.log("invalid");
        $("#userRePassword").next().removeClass("d-none");
        $("#userRePassword").next().addClass("d-block");
    }
}

function isUniqueUser(email) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].userEmail == email) {
            return false;
        }
    }
    return email;
}

// Switch submit button
function switchBtnStatus() {
    if (myRegex["userName"].test($("#userName").val()) &&
        myRegex["userEmail"].test($("#userEmail").val()) &&
        myRegex["userPhone"].test($("#userPhone").val()) &&
        myRegex["userAge"].test($("#userAge").val()) &&
        myRegex["userPassword"].test($("#userPassword").val()) &&
        $("#userPassword").val() == $("#userRePassword").val()
    ) {
        $("#submitBtn").removeClass("disabled");
    }
    else {
        $("#submitBtn").addClass("disabled");
    }
}

function clearFormValues() {
    $("#userName").val(null);
    $("#userEmail").val(null);
    $("#userPhone").val(null);
    $("#userAge").val(null);
    $("#userPassword").val(null);
    $("#userRePassword").val(null);
}
