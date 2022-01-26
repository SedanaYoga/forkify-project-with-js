import View from './View.js'
import previewView from './previewView.js'

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list')
  _errorMessage = 'No bookmark added yet. Please go to recipe and bookmark it.'
  _message = ''

  addHandlerRender(handler) {
    // adding listener to wait until page is loaded
    window.addEventListener('load', handler)
  }

  _generateMarkup() {
    // console.log(this._data)
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('')
  }
}

export default new BookmarksView()
