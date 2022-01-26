import View from './View.js'
import icons from 'url:../../img/icons.svg'

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination')

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline')
      if (!btn) return

      const goToPage = +btn.dataset.goto

      handler(goToPage)
    })
  }

  _generateMarkup() {
    const curPage = this._data.page
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    )
    // Page 1, and there are other page
    if (curPage === 1 && numPages > 1) {
      return this._MarkupBtn('next', curPage)
    }
    // Last Page
    if (curPage === numPages && numPages > 1) {
      return this._MarkupBtn('prev', curPage)
    }
    // Other Page
    if (curPage < numPages) {
      return `
        ${this._MarkupBtn('prev', curPage)}
        ${this._MarkupBtn('next', curPage)}
      `
    }
    // Page 1, and no other page
    return this._MarkupBtn()
  }
  _MarkupBtn(type = '', curPage) {
    return type === 'prev'
      ? `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    `
      : type === 'next'
      ? `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `
      : ''
  }
}

export default new PaginationView()
