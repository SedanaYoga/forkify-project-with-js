// CONTROLLER COMPRISED OF APPLICATION LOGIC / ROUTE / UI HANDLING
import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// const recipeContainer = document.querySelector('.recipe')

///////////////////////////////////////

if (module.hot) {
  module.hot.accept()
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)
    // console.log(id)

    if (!id) return

    recipeView.renderSpinner()

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks)

    // 2) Loading API
    // load recipe function is an async function so use await as prefix
    // and its not returning anything so we done have to store it at a variable
    await model.loadRecipe(id)

    // 3) Rendering recipe
    // render method is doing the data catching from the state (model)
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery()
    if (!query) return
    resultsView.renderSpinner()

    // Load search results
    await model.loadSearchResults(query)

    // Render results
    // console.log(model.state.search.results)
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    // Render pagination
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  // Render search result
  resultsView.render(model.getSearchResultsPage(goToPage))

  // Render pagination
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update recipe from model (state)
  model.updateServings(newServings)

  // Rerender recipe page/view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
  console.log(model.state.recipe)

  // Update the bookmark icon
  recipeView.update(model.state.recipe)

  // Render bookmark
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  // Render bookmarks as the first steps
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // Add spinner when uploading
    addRecipeView.renderSpinner()

    // Upload logic
    await model.uploadRecipe(newRecipe)

    // Render recipe
    console.log(model.state.recipe)
    recipeView.render(model.state.recipe)

    // Success Message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    addRecipeView.renderError(err.message)
  }
}

// we dont want controller have DOM component like `addEventListener`
// so we should pass only the action `controleRecipes` to the View section through recipeView object
// PUBLISHER-SUBSCRIBER PATTERN TAKE PART HERE
// Controller as subscriber, and View as publisher
// have to wait for publisher trigger the event like clicks
//
//
// init function introduced below
// as soon as the program loads, init function will connect to addHandlerRender in recipeView object
// so it will be rendered from the beginning
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()
