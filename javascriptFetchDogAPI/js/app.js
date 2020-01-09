const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url){
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(err => console.log('Looks like there was a problem', err))
}

Promise.all([
    fetchData('https://dog.ceo/api/breeds/list'),
    fetchData('https://dog.ceo/api/breeds/image/random')
])
.then(data =>{
    const breedList = data[0].message;
    const randomImg = data[1].message;

    generateOptions(breedList);
    generateImage(randomImg)
})

    //get one at a time instead of all at once
    //fetchData('https://dog.ceo/api/breeds/list')
    //.then(data => generateOptions(data.message))

    //fetchData('https://dog.ceo/api/breeds/image/random')
    //.then(data => generateImage(data.message))
// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus(response){
    if(response.ok){
    return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function generateOptions(data){
    const options = data.map(item => `
    <option value='${item}'>${item}</option>
    `).join('');
    select.innerHTML = options;
}

function generateImage(data){
    const html = `
    <img src='${data}'>
    <p>Click to view images of ${select.value}</p>
    `;
    card.innerHTML = html;
}
function fetchBreedImg(){
     const breed = select.value; 
     const img = card.querySelector('img');
     const p = card.querySelector('p');

     fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(data =>{
            img.src=data.message;
            img.alt = breed;
            p.textContent = `click to view more ${breed}s`
        } )
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
select.addEventListener('change', fetchBreedImg);
card.addEventListener('click', fetchBreedImg );
form.addEventListener('submit', postData);

// ------------------------------------------
//  POST DATA
// ------------------------------------------

function postData(e){
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const config = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, comment})
    };

    fetch('https://jsonplaceholder.typicode.com/comments',config)
    .then(checkStatus)
    .then(res => res.json())
    .then(data => console.log(data))
}