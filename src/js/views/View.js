import icons from 'url:../../img/icons.svg'

export default class View {
  _data

  /**
   * Render the received Object to the DOM
   *
   * @param {Object | Object[]} data - The data to be rendered (e.g. recipe)
   * @param {boolean} [render] - If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} Markup string is returned if render = false
   * @this {Object} View instance
   * @author Sedana Yoga
   * @todo Finish Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError()

    this._data = data
    const markup = this._generateMarkup()

    if (!render) return markup

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {
    this._data = data
    const newMarkup = this._generateMarkup()

    // Create DOM NodeList from newMarkup string
    const newDOM = document.createRange().createContextualFragment(newMarkup)

    // create array of node elements so we can iterate
    const newElements = Array.from(newDOM.querySelectorAll('*'))

    // create array from the original state which is not changed yet (selecting parentElement)
    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    // Update Text and Attribute of current node element
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        // Option mark as not all element has firstChild
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // Updating stage
        curEl.textContent = newEl.textContent
      }

      // Updates changed ATTRIBUTE (dataset.updateTo)
      if (!newEl.isEqualNode(curEl))
        // Loop over attributes to set with the new one
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        )
    })
  }

  _clear() {
    this._parentElement.innerHTML = ''
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}
