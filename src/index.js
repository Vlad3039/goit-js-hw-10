import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { refs } from './refs';
import Notiflix from 'notiflix';
async function breedsList() {
  try {
    refs.loaderRef.style.display = 'block';
    const breeds = await fetchBreeds();
    let options = '';
    breeds.forEach(breed => {
      options += `<option value="${breed.id}">${breed.name}</option>`;
    });
    refs.breedSelectRef.innerHTML = options;
    refs.breedSelectRef.addEventListener('change', searchCat);
  } catch (err) {
    refs.errorRef.style.display = 'block';
    console.error(err);
    Notiflix.Notify.failure(
      'OOOPS! An error occurred while loading cat breeds'
    );
  } finally {
    refs.loaderRef.style.display = 'none';
  }
}
async function searchCat() {
  try {
    refs.loaderRef.style.display = 'block';
    refs.errorRef.style.display = 'none';
    const selectedBreedId = refs.breedSelectRef.value;
    if (!selectedBreedId) {
      refs.catInfoRef.innerHTML = '';
      return;
    }
    const catData = await fetchCatByBreed(selectedBreedId);
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
    </div>`;
      refs.catInfoRef.innerHTML = catInfoTemplate;
    } else {
      refs.catInfoRef.innerHTML = '';
      Notiflix.Notify.warning('WARNING! There is no data on this breed of cat');
    }
  } catch (err) {
    refs.errorRef.style.display = 'block';
    console.error(err);
    Notiflix.Notify.failure(
      'SORRY! An error occurred while searching for a cat'
    );
  } finally {
    refs.loaderRef.style.display = 'none';
  }
}
breedsList();
