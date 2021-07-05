function getToday() {
    const d = new Date();
    const year = d.getFullYear();
    let month = d.getMonth() + 01;
    if (month < 10) month = '0' + month;
    let date = d.getDate();
    if (date < 10) date = '0' + date;
    return (year + "-" + month + "-" + date);
}



const form = document.forms[0]
const contentType = form.querySelector('select[name="contentType"]')
const country = form.querySelector('select[name = "country"]');
const category = form.querySelector('select[name = "category"]');
const contentKey = form.querySelector('input[name="contentKey"]');
const dates = form.querySelectorAll('input[type=date]');
const today = getToday();


dates.forEach((date) => {
    date.max = today;
});
dates[0].addEventListener('change', (e) => {
    console.log(dates[0].value);
    if (dates[0].value !== '') {
        console.log('here');
        dates[1].removeAttribute('disabled')
        dates[1].min = dates[0].value;
    }
});



contentType.addEventListener('change', (e) => {
    console.log(contentKey);
    if (e.target.value === 'top-headlines') {
        country.removeAttribute('disabled');
        category.removeAttribute('disabled');
        contentKey.removeAttribute('required')
    } else {
        country.setAttribute('disabled', true);
        category.setAttribute('disabled', true);
        contentKey.setAttribute('required', true)
    }
})