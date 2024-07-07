// Michał Górecki

const weatherAPIKey = "59c6b97dd86606fb68bad31db596f0ab";
const weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API Key}&units=metric`;
const weatherAPIURL5Day = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&units=metric`;
let savedData;
const weatherItems = document.querySelectorAll(".weather-item");

const galleryImages = [
    {
        src: "./assets/gallery/image1.jpg",
        alt: "Thumbnail Image 1"
    },
    {
        src: "./assets/gallery/image2.jpg",
        alt: "Thumbnail Image 2"
    },
    {
        src: "./assets/gallery/image3.jpg",
        alt: "Thumbnail Image 3"
    }
];

const weatherImages = [
    {
        src: "./assets/weather/cloudy.jpeg",
        alt: "Clouds"
    },
    {
        src: "./assets/weather/rainy.jpeg",
        alt: "Rain"
    },
    {
        src: "./assets/weather/snowy.jpeg",
        alt: "Snow"
    },
    {
        src: "./assets/weather/sunny.jpeg",
        alt: "Clear"
    },
    {
        src: "./assets/weather/thunder.jpeg",
        alt: "Thunderstorm"
    },
];

const products = [
    {
      title: "AstroFiction",
      author: "John Doe",
      price: 49.9,
      image: "./assets/products/img6.png"
    },
    {
      title: "Space Odissey",
      author: "Marie Anne",
      price: 35,
      image: "./assets/products/img1.png"
    },
    {
      title: "Doomed City",
      author: "Jason Cobert",
      price: 0,
      image: "./assets/products/img2.png"
    },
    {
      title: "Black Dog",
      author: "John Doe",
      price: 85.35,
      image: "./assets/products/img3.png"
    },
    {
      title: "My Little Robot",
      author: "Pedro Paulo",
      price: 0,
      image: "./assets/products/img5.png"
    },
    {
      title: "Garden Girl",
      author: "Ankit Patel",
      price: 45,
      image: "./assets/products/img4.png"
    }
];

// Menu section
function menuHandler() {
    document.querySelector("button#open-nav-menu").addEventListener("click", function() {
        document.querySelector("header nav .wrapper").classList.add("nav-open");
    });
    
    document.querySelector("button#close-nav-menu").addEventListener("click", function() {
        document.querySelector("header nav .wrapper").classList.remove("nav-open");
    });
}

//Temperature Section
function celciusToFahrenheit(celcius) {
    return celcius * 9/5 + 32;
}

//Greetings section
function greetingHandler() {
    
    let greetingText;
    let currentHour = new Date().getHours();
    if (currentHour < 12) {
        greetingText = "Good Morning!";
    } else if (currentHour < 18) {
        greetingText = "Good Afternoon!";
    } else if (currentHour < 24) {
        greetingText = "Good Evening!";
    }  else {
        greetingText = "Welcome!";
    }

    document.querySelector("#greeting").innerHTML = greetingText;
}

// GeoLocation Section
function weatherHandlerForGrettings() {
    
    navigator.geolocation.getCurrentPosition( position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let url = weatherAPIURL
            .replace("{lat}", latitude)
            .replace("{lon}", longitude)
            .replace("{API Key}", weatherAPIKey);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weatherCondition = data.weather[0].description;
                const userLocation = data.name;
                const temperature = data.main.temp;

                //try {
                    //let weatherText = "It is " + weatherCondition + " and " + temperature + " degrees in " + userLocation + " today.";
                    let celciusText = `The weather is ${weatherCondition} in ${userLocation} and ${temperature.toFixed(2)}°C degrees outside.`;
                    let fahrText = `The weather is ${weatherCondition} in ${userLocation} and ${celciusToFahrenheit(temperature).toFixed(2)}°F degrees outside.`;

                    document.querySelector("p#weather").innerHTML = celciusText;

                    // Temperature switch
                    document.querySelector(".weather-group").addEventListener("click", function(e) {
                    if(e.target.id == "celsius") {
                        document.querySelector("p#weather").innerHTML = celciusText;
                        insertWheatherData(savedData)
                    } else if(e.target.id == "fahr") {
                        document.querySelector("p#weather").innerHTML = fahrText;
                        insertWheatherData(savedData, false)
                    }

                    //console.log(e.target.id); //--> this will log the event object to the console. this is useful for debugging. I can check the target property to see what element was clicked.
                    });
                 //} catch (error) {
                //     console.error("Error fetching weather data", error);
                //     document.querySelector("p#weather").innerHTML = "Error fetching weather data";
                // }
                // --> this is the same as the try catch block above.
            }).catch(error => {document.querySelector("p#weather").innerHTML = "Error fetching weather data"});
    });
};

//ClockHandler
function clockHandler() {
    setInterval(function() {
        document.querySelector("span[data-time=hours]").textContent = new Date().getHours().toString().padStart(2,"0");
        document.querySelector("span[data-time=minutes]").textContent = new Date().getMinutes().toString().padStart(2,"0");
        document.querySelector("span[data-time=seconds]").textContent = new Date().getSeconds().toString().padStart(2,"0"); //--> this will pad the number with 0 if it is less than 10.
    }, 1000); //--> this will run the function every 1 second.
}

function insertWheatherData(data, isCelcius = true ) {
    let index = 0;

    data.list.forEach(element => {
        if (element.dt_txt.includes("15:00:00") && index < weatherItems.length) {
            console.log(element.weather[0].main);
            const weatherData = element.dt_txt.slice(0,10);
            const weatherTemperature = element.main.temp;
            const weatherCondition = element.weather[0].main;

            let weatherImage = weatherImages.find(image => image.alt === weatherCondition);
            if (!weatherImage) {
                weatherImage = weatherImages.find(image => image.alt === "Clear");
            }
         
            const weatherItem = weatherItems[index];
            weatherItem.querySelector("img").src = weatherImage.src;
            weatherItem.querySelector("img").alt = weatherImage.src;
            weatherItem.querySelector(".weather-title").textContent = weatherData;
            weatherItem.querySelector(".weather-name").textContent = weatherCondition;
            weatherItem.querySelector(".weather-temperature").textContent = isCelcius ? weatherTemperature.toFixed(2) + "°C" : celciusToFahrenheit(weatherTemperature).toFixed(2) + "°F";
            index++;
        };
    })
}

// Weather Section
function weatherHandler() {
    
    navigator.geolocation.getCurrentPosition( position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let url = weatherAPIURL5Day
            .replace("{lat}", latitude)
            .replace("{lon}", longitude)
            .replace("{API key}", weatherAPIKey);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                savedData = data;
                insertWheatherData(savedData);
         });
    });
};

// GallerySection
function galleryHandler() {
    let mainImage = document.querySelector("#gallery > img");
    let thumbnails = document.querySelector("#gallery .thumbnails");
    
    mainImage.src = galleryImages[0].src;
    mainImage.alt = galleryImages[0].alt;

    // --> this bellow is foeach loop and element is the current element in the array.
    galleryImages.forEach(element => {
        let thumb = document.createElement("img");
        thumb.src = element.src;
        thumb.alt = element.alt;
        thumb.dataset.arrayIndex = galleryImages.indexOf(element);
        // --> instead of using if else statement we can use ternary operator.
        thumb.dataset.selected = thumb.dataset.arrayIndex === 0 ? true : false;
        
        thumb.addEventListener("click", function(e) {
            let selectedIndex = e.target.dataset.arrayIndex;
            let selectedImage = galleryImages[selectedIndex];
            mainImage.src = selectedImage.src;
            mainImage.alt = selectedImage.alt;

            thumbnails.querySelectorAll("img").forEach(function(img) {
                img.dataset.selected = false;
            });

            e.target.dataset.selected = true;
        });
        thumbnails.appendChild(thumb);
    });
}

// Product Section
function populateProducts(productsList) {
    let productsSection = document.querySelector(".products-area");
    productsSection.textContent = ""; //--> this will clear the products section before populating it with the new products.

    // Run a loop through the products and create ("product-item") divs with the image and details of the product.
    productsList.forEach(element => {

        //Create the HTML elements for the individual product
        let productElm = document.createElement("div");
        productElm.classList.add("product-item");

        //Create the product image
        let productImage = document.createElement("img");
        productImage.src = element.image;
        productImage.alt = "Image for " + element.title;

        //Create the product details section
        let productDetails = document.createElement("div");
        productDetails.classList.add("product-details");

        //Create the product title, author, price elements
        let productTitle = document.createElement("h3");
        productTitle.classList.add("product-title");
        productTitle.textContent = element.title;
        let productAuthor = document.createElement("p");
        productAuthor.classList.add("product-author");
        productAuthor.textContent = element.author;
        let priceTitle = document.createElement("p");
        priceTitle.classList.add("price-title");
        priceTitle.textContent = "Price";
        let productPrice = document.createElement("p");
        productPrice.classList.add("product-price");
        productPrice.textContent = element.price === 0 ? "Free" : "$" + element.price.toFixed(2);

        //Append the product details
        productDetails.append(productTitle);
        productDetails.append(productAuthor);
        productDetails.append(priceTitle);
        productDetails.append(productPrice);

        //Add all child HTML elements of the product
        productElm.append(productImage);
        productElm.append(productDetails);

        //Add complete individual product to the products section
        productsSection.append(productElm);
    });
}

function productHandler() {
    let freeProducts = products.filter(product => product.price === 0 || !product.price);
    let paidProducts = products.filter(product => product.price > 0);

    populateProducts(products);

    document.querySelector(".products-filter label[for=all] span.product-amount").textContent = products.length;
    document.querySelector(".products-filter label[for=free] span.product-amount").textContent = freeProducts.length;
    document.querySelector(".products-filter label[for=paid] span.product-amount").textContent = paidProducts.length;

    let productsFilter = document.querySelector(".products-filter");
    productsFilter.addEventListener("click", function(e) {
        if(e.target.id === "all") {
            populateProducts(products);
        } else if(e.target.id === "free") {
            populateProducts(freeProducts);
        } else if(e.target.id === "paid") {
            populateProducts(paidProducts);
        }
    });
}

// Footer Section
function footerHandler() {
    document.querySelector("footer").textContent = `© ${new Date().getFullYear()} - Michal Gorecki`;
}

// Study section
/* // setTimeout(function() {
//     document.querySelector("span[data-time=hours]").textContent = new Date().getHours();
//     document.querySelector("span[data-time=minutes]").textContent = new Date().getMinutes();
//     document.querySelector("span[data-time=seconds]").textContent = new Date().getSeconds();
// }, 1000); //--> this will run the function after 1 second.

new Date().getHours(); //--> this will return the current hour of the day.
new Date().getMinutes(); //--> this will return the current minute of the hour.
new Date().getSeconds(); //--> this will return the current second of the minute.

// function testAlert(message) {
//     alert(message);
// }

//testAlert("Hello World!");
//testAlert("Test2");
//testAlert(2+3);
//testAlert(4);

//console.log("Hello World!");

// document.getElementById("greeting").innerHTML = "Hello World!";

// document.getElementsByClassName("product-item")

// document.getElementsByTagName("p")

//document.querySelector("p#weather").style.backgroundColor = 'red' //--> this will change the background color of the p tag with the id of weather to red. remember to not use - in the css property name. use camelCase instead.

//document.querySelector("p#weather").classList.toggle("redbg"); //--> this will toggle the class of redbg to the p tag with the id of weather. if the class is already there, it will remove it. if it is not there, it will add it.


//w3schools.com/js --> this is a good resource for learning javascript.
var customer = "Sara"//--> this declaration is global. it is not recommended to use this. it is better to use let or const instead.
const customer2 = "Sara"//--> this declaration is not overwritable.
let customer3 = "Sara"//--> this declaration is block scoped. it is recommended to use this.
typeof customer3; //--> this will return the type of the variable.
let array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];//--> this is an array.

student = {firstName: "John", lastName: "Doe", age: 25, eyeColor: "blue"};//--> this is an object.
student.firstName;//--> this will return John.
student.id = 123;//--> this will add an id property to the student object.

// --> to create block comment click option+shift+A
for (img in galleryImages) {
    console.log(galleryImages[img].src);
} */

//Page load event
menuHandler();
greetingHandler();
weatherHandlerForGrettings();
clockHandler();
galleryHandler();
productHandler();
footerHandler();
weatherHandler();