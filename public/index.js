// function to get in specified format to us in date input
function getToday() {
    const d = new Date();
    const year = d.getFullYear();
    let month = d.getMonth() + 01;
    if (month < 10) month = '0' + month;
    let date = d.getDate();
    if (date < 10) date = '0' + date;
    return (year + "-" + month + "-" + date);
}


// selcting elements from DOM
const form = document.forms[0];
const contentTypeGetter = form.querySelector('select[name="contentType"]');
const contentKeyGetter = form.querySelector('input[name="contentKey"]');
const categoryGetter = form.querySelector('select[name = "category"]');
const countryGetter = form.querySelector('select[name = "country"]');
const dates = form.querySelectorAll('input[type=date]');
const languageGetter = form.querySelector('#language')


const today = getToday();



// protect the selection of dates from future
dates.forEach((date) => {
    date.max = today;
});



// EVENT LISTENERS

// control starting and ending dates from some bad inputs
dates[0].addEventListener('change', (e) => {
    console.log(dates[0].value);
    if (dates[0].value !== '') {
        dates[1].removeAttribute('disabled');
        dates[1].min = dates[0].value;
    } else {
        dates[1].setAttribute('disabled', true);
    }
});

// change some form fields based on user input
contentTypeGetter.addEventListener('change', (e) => {
    if (e.target.value === 'top-headlines') {
        countryGetter.removeAttribute('disabled');
        categoryGetter.removeAttribute('disabled');
        contentKeyGetter.removeAttribute('required')
    } else {
        countryGetter.setAttribute('disabled', true);
        categoryGetter.setAttribute('disabled', true);
        contentKeyGetter.setAttribute('required', true)
    }
});


//control submit event and make api request
form.addEventListener('submit', (e) => {
    const newsContainer = document.querySelector('#news-container h1');
    newsContainer.textContent = 'lodding...'
    e.preventDefault();
    let contentType = contentTypeGetter.value
    let q = contentKeyGetter.value
    let from = dates[0].value;
    let to = dates[1].value;
    let category = "";
    let country = "";
    let language = "language=" + languageGetter.value;


    if (q !== '') {
        q = "q=" + q + "&";
    }
    if (from !== '') {
        from = "from=" + from + "&";
    }
    if (to !== '') {
        to = "to=" + to + "&";
    }

    if (country) {
        country = "category=" + countryGetter.value + "&"
    }
    if (category) {
        category = "category=" + categoryGetter.value + "&"
    }
    const formData = { contentType, q, from, to, country, category, language }
    console.log(JSON.stringify(formData));


    // posting input data and get array of article as a response
    const fetchData = async () => {
        const responseData = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        responseData = await responseData.json();
        console.log(responseData.articles);
    }
    fetchData()

})

