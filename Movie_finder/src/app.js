import maxresdefault from './images/maxresdefault.jpg';

// dialog_info
const dialog = document.getElementById('movie_info');
const movie_img = document.getElementById('movie_infoImg');
const movie_title = document.getElementById('movie_title');
const movie_type = document.getElementById('movie_type');
const movie_year = document.getElementById('movie_year');
const movie_rating = document.getElementById('movie_rating');
const movie_saveBtn = document.getElementById('save_btn');
const close_btn = document.getElementById('close_btn');

// linkbar button
const favorites_button = document.getElementById('favorites_btn'); // adds movie to favorites
const about_btn = '';
const contact_btn = '';
const favorites_count = document.getElementById('favorites_count');

// filter buttons
const category_list = document.querySelectorAll('#filter_list li'); // nodelist

// searchbar input
const user_input = document.getElementById('searchbar_input'); // search movie/series
const search_button = document.getElementById('searchbar_btn'); // click search button or press Enter

// cards section
const main_title = document.getElementById('main_titleH1'); // main title for body
const cards_section = document.getElementById('card_section'); // movie cards section

// favorites array
let favorites = JSON.parse(localStorage.getItem("favorites_moviefinder")) || []; // favorites array (saved movies)
let savedFavorite;

// scrollreveal
var slideUp = {
    distance: '150%',
    origin: 'bottom',
    opacity: null
};

// functions
async function fetchApi(query) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=edb57393`);
        const data = await response.json();

        return data;
    } catch (e) {
        flash({type: e.type, msg: e.msg});
    }
}

async function renderApi(currentArray, user_pref) {
    let movies;

    if(currentArray === favorites){
        movies = favorites
        updateMainTitle('Favorite movies')
    } else {
        updateMainTitle(`Discover ${user_pref === 'all' ? 'All' : user_pref}`);

        const user_inputValue = user_input.value.toLowerCase().trim();
        const data = await fetchApi(user_inputValue || 'marvel');

        if (!data.Search) {
            cards_section.innerHTML = ''
            updateMainTitle('No results');
            flash({type: 'Search input', msg: 'No results'})
            return;
        }

        movies = filterByType(data, user_pref);
    }
    renderMovies(movies);
}

function filterByType(data, user_pref) {
    const userPreference = user_pref.toLowerCase();
    const filterMovie = data.Search.filter((movie) => movie.Type === userPreference || userPreference === 'all');
    return filterMovie
}

function renderMovies(movies) {
    cards_section.innerHTML = '';
    movies.forEach(createMovieCard);
}

function createMovieCard(movie) {
    const {Poster, Title, Type, Year, imdbID} = movie;
    const create_card = document.createElement('div');
    create_card.classList.add('card');
    create_card.innerHTML = 
    `
    <div id="card">
    <img src="${Poster || maxresdefault}" onerror="this.onerror=null; this.src='${maxresdefault}'" id="movie_img">
    </div>
    `;

    create_card.addEventListener('click', () => {
        document.body.style.overflow = "hidden";
        dialog.showModal();
        savedFavorite = movie;
        dialogInfo(movie);
    })
    // append card too DOM
    cards_section.appendChild(create_card);
    ScrollReveal().reveal(create_card, slideUp);
}


function addTofavorites(movie) {
    const movieExists = favorites.find((item) => item.Title === movie.Title);
    const movieIndex = favorites.findIndex((item) => item.imdbID === movie.imdbID);

    if(!movieExists) {   
        favorites.push(movie);
    }  else {
        favorites.splice(movieIndex, 1);
    }

    updateBtnText(movie);
    updateMainTitle(!movieExists ? 'Saving to favorites' : 'Removing from favorites');
    renderApi('', 'all');
    localStorage.setItem('favorites_moviefinder', JSON.stringify(favorites));
}

// flash card
function flash(error) {
    //* make a better flash card function
    console.error(error);
}

// ui functions
function updateMainTitle(str) {
    main_title.textContent = `${str}`;
}

function updateFavoriteCount() {
    const favoritesSaved = favorites.length
    if(favoritesSaved){
        favorites_count.textContent = favoritesSaved
        favorites_count.style.display = 'flex'
    } else {
        favorites_count.style.display = 'none'
    }
    
}

function inputUI(input) {
    if(input === 'dbclick') {
        user_input.value = '';
        renderApi('', 'all');
    }

    if(input != '') {
        user_input.classList.remove('empty');
        user_input.placeholder = 'Search for movies...';
        renderApi('', 'all');
    } else {
        user_input.placeholder = 'No search typed in';
        user_input.classList.add('empty');
    }
}

function updateBtnText(movie) {
    const savedFavoriteExists = favorites.some((movies) => movies.Title === movie.Title);
    movie_saveBtn.textContent = !savedFavoriteExists ? 'Save' : 'Remove';
}

function dialogInfo(movie) {
    const {Poster, Title, Type, Year, imdbIDm, Rating} = movie;
    movie_img.src = Poster;
    movie_title.textContent = Title;
    movie_type.textContent = `Type: ${Type}`;
    movie_year.textContent = `Year: ${Year}`;
    movie_rating.textContent  = `Rating: ${Rating || 'No rating as of now'}`;

    updateBtnText(movie);
}

// nodelist
category_list.forEach((li) => {
    li.addEventListener('click', () => {
        const type = li.textContent;
        renderApi('', type);
    })
})

// eventlisteners
user_input.addEventListener('dblclick', () => {
    inputUI('dbclick');
})
user_input.addEventListener('keydown', (e) => {
    if(e.key === "Enter") {
        inputUI(user_input.value.trim());
    }
})
search_button.addEventListener('click', () => {
    inputUI(user_input.value.trim());
})

favorites_button.addEventListener('click', () => {
    renderApi(favorites,'all');
})

movie_saveBtn.addEventListener('click', () => {
    addTofavorites(savedFavorite);
    updateFavoriteCount();
    document.body.style.overflow = "";
})

close_btn.addEventListener('click', () => {
    document.body.style.overflow = "";
    dialog.close();
})

updateFavoriteCount();
renderApi('', 'all');