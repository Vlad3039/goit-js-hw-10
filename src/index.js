import axios from 'axios';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { refs } from './refs';
import { API_KEY } from './config';
import SlimSelect from 'slim-select';
axios.defaults.headers.common['x-api-key'] = API_KEY;
let breedSelect;
async function populateBreedsSelect() {
  try {
    refs.loaderRef.style.display = 'block';
    const breeds = await fetchBreeds();
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      refs.breedSelectRef.appendChild(option);
    });
    // Ініціалізуємо SlimSelect
    breedSelect = new SlimSelect({
      select: refs.breedSelectRef, // Вказуємо селект, який бажаємо стилізувати
      placeholder: 'Select a breed',
      searchPlaceholder: 'Search...',
    });
  } catch (err) {
    refs.errorRef.style.display = 'block';
    console.error(err);
    Notiflix.Notify.failure('An error occurred while loading cat breeds');
  } finally {
    refs.loaderRef.style.display = 'none';
  }
}
async function searchCat() {
  const selectedBreedId = breedSelect.selected(); // Отримуємо вибрані значення за допомогою SlimSelect
  try {
    refs.loaderRef.style.display = 'block';
    refs.errorRef.style.display = 'none';
    if (selectedBreedId.length === 0) {
      refs.catInfoRef.innerHTML = '';
      return;
    }
    const catData = await fetchCatByBreed(selectedBreedId[0].value);
    if (catData) {
      const catInfoTemplate = `
    <div style="display: flex; align-items: center;">
      <img src="${catData.url}" alt="Cat of breed ${catData.breeds[0].name}" class="cat-image">
      <div class="cat-info-container">
        <h2>Cat Information</h2>
        <p>Name: ${catData.breeds[0].name}</p>
        <p>Description: ${catData.breeds[0].description}</p>
        <p>Temperament: ${catData.breeds[0].temperament}</p>
      </div>
    </div>
  `;
      refs.catInfoRef.innerHTML = catInfoTemplate;
    } else {
      refs.catInfoRef.innerHTML = '';
      Notiflix.Notify.warning(
        'SORRY, but there is no data on this breed of cats in the database'
      );
    }
  } catch (err) {
    refs.errorRef.style.display = 'block';
    console.error(err);
    Notiflix.Notify.failure(
      'WARNING! An error occurred while searching for a cat'
    );
  } finally {
    refs.loaderRef.style.display = 'none';
  }
}
populateBreedsSelect();
refs.breedSelectRef.addEventListener('change', searchCat);
