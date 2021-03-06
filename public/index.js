let articles = [];
const loadingAni = `<div class="loading">
	<span class="loader"></span>
	<span class="loader"></span>
	<span class="loader"></span>
	<span class="loader"></span>
</div>`
let pageNo = 1;
let first = true;

const scrWidth = screen.width;

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
const harmBurgBtn = document.querySelector('.harm-burger')
const formContainer = document.querySelector('#form-container');
const newsContainer = document.querySelector('#news-container');
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


// event listener for harm burger menu
harmBurgBtn.addEventListener('click', () => {
    formController();
})
const formController = () => {
    const line1 = document.querySelector('.line-1');
    const line2 = document.querySelector('.line-2');
    const line3 = document.querySelector('.line-3');
    formContainer.classList.toggle('show-form');
    line1.classList.toggle('rotate-right');
    line3.classList.toggle('rotate-left');
    line2.classList.toggle('hide-line');
}



// control starting and ending dates from some bad inputs
dates[0].addEventListener('change', (e) => {
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
        contentKeyGetter.removeAttribute('required');
        contentKeyGetter.setAttribute('placeholder', ' Optional...');
    } else {
        countryGetter.setAttribute('disabled', true);
        categoryGetter.setAttribute('disabled', true);
        contentKeyGetter.setAttribute('required', true)
    }
});


//control submit event and make api request
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (scrWidth <= 700)
        formController();
    first = false;
    fetchData();

})
// fetch and load data
// posting input data and get array of article as a response
const fetchData = async () => {
    let q = contentKeyGetter.value
    if (first) {
        q = 'India';
    }
    newsContainer.innerHTML = loadingAni;
    let contentType = contentTypeGetter.value
    let from = dates[0].value;
    let to = dates[1].value;
    let category = categoryGetter.value;
    let country = countryGetter.value;
    let language = "language=" + languageGetter.value + "&";
    let page = "page=" + pageNo;


    if (q !== '') {
        q = "q=" + q.replaceAll(' ', '') + "&";
    }
    if (from !== '') {
        from = "from=" + from + "&";
    }
    if (to !== '') {
        to = "to=" + to + "&";
    }

    if (country) {
        country = "country=" + countryGetter.value + "&"
    }
    else {
        country = '';
    }
    if (category) {
        category = "category=" + categoryGetter.value + "&"
    } else {
        category = '';
    }
    const formData = { contentType, q, from, to, country, category, language, page }
    console.log(JSON.stringify(formData));

    let responseData = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    responseData = await responseData.json();
    if (responseData.status == 'ok') {
        articles = responseData.articles;
        // render all the articles after fetching data from backend
        renderElements(articles);
    }
    else {
        renderElements(responseData);
    }
    console.log(responseData);

}

const renderElements = (articles) => {
    window.scroll(0, 0);
    if (articles.status !== 'error') {
        if (articles.length !== 0) {
            newsContainer.innerHTML = '';
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('flex-100');
            if (pageNo > 1) {
                const prvBtn = document.createElement('p');
                prvBtn.classList.add('prv-btn');
                prvBtn.classList.add('action-btn');
                prvBtn.innerText = 'Previous';
                btnContainer.appendChild(prvBtn);
            }
            const nxtBtn = document.createElement('p');
            nxtBtn.classList.add('nxt-btn');
            nxtBtn.classList.add('action-btn');
            nxtBtn.innerText = 'Next';
            btnContainer.appendChild(nxtBtn);

            console.log(articles);
            articles.forEach((data, index) => {
                const imageurl = data.urlToImage;
                const url = data.url;
                const title = data.title;
                const description = data.description;
                const article = document.createElement('article');
                article.classList.add('news');
                const content = `<img src=${imageurl} alt="">
        <h1>${title}</h1>
        <p>${description}</p>
        <a class="read-more" id=${index} href=${url} target="_blank">Read more</a>`
                article.innerHTML = content;
                newsContainer.appendChild(article)
            });

            // a node can't be inserted at two places directly
            newsContainer.appendChild(btnContainer.cloneNode(true));
            nxtListener()

        } else {
            newsContainer.innerHTML = `<h1>Oops there is no great match...<br/>Try someother country or keyword<br/>key word should not contain spaces</h1>`;
        }

    } else {
        newsContainer.innerHTML = `<h1>${articles.message}</h1>`;
    }


}
const nxtListener = () => {
    const nxtBtns = document.querySelectorAll('.action-btn');
    nxtBtns.forEach(nxtBtn => {
        nxtBtn.addEventListener('click', (e) => {
            const action = e.target.innerText;
            if (action === 'Next')
                pageNo = pageNo + 1;
            else
                pageNo = pageNo - 1;
            fetchData();

        })
    })
}
fetchData()
// const addEventListenerToReadMore = () => {
//     const readMoreBtns = document.querySelectorAll('.read-more');
//     readMoreBtns.forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const readMoreBtn = e.target;
//             const articleElement = readMoreBtn.parentElement;
//             const contentElement = document.querySelector('.content')
//             if (readMoreBtn.innerText == 'Read more') {
//                 if (previousArticle !== '') {
//                     previousArticle.classList.remove('full-article');
//                     readMoreBtn.innerText = 'Read more';
//                 }
//                 articleElement.classList.add('full-article');
//                 const id = readMoreBtn.id;
//                 const article = articles[id];
//                 console.log(article.content);
//                 contentElement.innerText = article.content;
//                 readMoreBtn.innerText = 'close';
//                 previousArticle = articleElement;
//             } else {
//                 articleElement.classList.remove('full-article');
//                 readMoreBtn.innerText = 'Read more';
//             }

//         });
//     });
// }

