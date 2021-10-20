import request from 'superagent';
const URL = 'https://dog-match-be.herokuapp.com/';
//const URL = 'http://localhost:7890/';


function evaluateAuthError(errorMessage, result) {
  if (errorMessage === 'email or password incorrect') {
    result.badCreds = true;
  } else if (errorMessage === 'email and password required') {
    result.noCreds = true;
  } else if (errorMessage === 'email already exists') {
    result.emailTaken = true;
  } else {
    result.error = true;
  }
  return result;
}

export async function signIn(email, password) {
  let result = {
    badCreds: false,
    noCreds: false,
    error: false,
    emailTaken: false,
    token: undefined
  };
  let response = null;
  try {
    response = await request
      .post(`${URL}auth/signin`)
      .send({ email, password });
    result.token = response.body.token;
  } catch (e) {
    const errorMessage = e.response.body.error;
    result = evaluateAuthError(errorMessage, result);
  }
  return result;
}

export async function signUp(email, password) {
  let result = {
    badCreds: false,
    noCreds: false,
    error: false,
    token: undefined
  };
  let response = null;
  try {
    response = await request
      .post(`${URL}auth/signup`)
      .send({ email, password });
    result.token = response.body.token;
  } catch (e) {
    const errorMessage = e.response.body.error;
    result = evaluateAuthError(errorMessage, result);
  }
  return result;
}

/*
// Login
export async function login(email, password) {
  const response = await request
    .post(`${URL}auth/signin`)
    .send({ email, password });
  return response.body;
}

// Sign Up
export async function signUp(email, password) {
  const response = await request
    .post(`${URL}auth/signup`)
    .send({ email, password });
  return response.body;
}

*/

// Get Profile
export async function getProfile(token) {
  const response = await request
    .get(`${URL}api/profile`)
    .set('Authorization', token);
  return response.body;
}

// Update Profile
export async function updateProfile(state, token) {
  const response = await request
    .put(`${URL}api/profile`)
    .send({ profile: state })
    .set('Authorization', token);
  return response.body;
}

export async function getFavorites(token) {
  try {
    const response = await request
      .get(`${URL}api/favorites`)
      .set('Authorization', token);
    return response.body;
  } catch (e) {
    if (e.response.body &&
      e.response.body.error &&
      e.response.body.error === 'fill out profile first') {
      throw new Error('fill out profile first');
    } else {
      console.log(e);
    }
  }
}

export async function getBreedByName(breed, token) {
  try {
    const response = await request
      .get(`${URL}api/breed-details/${breed}`)
      .set('Authorization', token);

    return response;
  } catch (e) {
    if (e.response.body &&
      e.response.body.error &&
      e.response.body.error === 'fill out profile first') {
      throw new Error('fill out profile first');
    } else {
      console.log(e);
    }
  }
}

export async function getRecommendations(token) {
  try {
    const response = await request
      .get(`${URL}api/recommendations`)
      .set('Authorization', token);

    return response.body;
  } catch (e) {
    if (e.response.body &&
      e.response.body.error &&
      e.response.body.error === 'fill out profile first') {
      throw new Error('fill out profile first');
    } else {
      console.log(e);
    }
  }
}

export async function postFavorite(breedName, token) {
  const response = await request
    .post(`${URL}api/favorites`)
    .set('Authorization', token)
    .send({ breed_name: breedName });

  return response;
}

export async function deleteFavorite(breedName, token) {
  const response = await request
    .delete(`${URL}api/favorites/${breedName}`)
    .set('Authorization', token);

  return response;
}