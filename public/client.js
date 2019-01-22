;(function() {
  const form = document.getElementById('form')
  const wasteInput = document.getElementById('wasteInput')
  const result = document.getElementById('result')
  const favourites = document.getElementById('favourites')
  let dataFetched = Object.create(null)
  let dataFromLocal = Object.create(null)

  const parseHTML = raw => {
    var doc = new DOMParser().parseFromString(raw, 'text/html')
    return doc.documentElement.textContent
  }

  const renderWaste = (data, container) => {
    container.innerHTML = '' // clear old result before rendering
    let wasteArr = data.resData
    // create DOM for each item in the waste array
    wasteArr.forEach((element, index) => {
      let item = document.createElement('div')
      item.className = 'item'
      if (container.id !== 'favourites') {
        item.setAttribute('data-id', index)
      } else {
        item.setAttribute('data-favid', index)
      }

      let star = document.createElement('div')
      star.className = 'item-star'
      let favArray = getFavArray()
      let isDuplicate = favArray.some(ele => {
        return JSON.stringify(ele) === JSON.stringify(element)
      })
      if (isDuplicate) {
        // the clicked element data is already stored in localStorage
        star.classList.add('fav')
      } else {
        star.classList.remove('fav')
      }
      star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 19.481 19.481" enable-background="new 0 0 19.481 19.481" width="512px" height="512px"><g><path d="m10.201,.758l2.478,5.865 6.344,.545c0.44,0.038 0.619,0.587 0.285,0.876l-4.812,4.169 1.442,6.202c0.1,0.431-0.367,0.77-0.745,0.541l-5.452-3.288-5.452,3.288c-0.379,0.228-0.845-0.111-0.745-0.541l1.442-6.202-4.813-4.17c-0.334-0.289-0.156-0.838 0.285-0.876l6.344-.545 2.478-5.864c0.172-0.408 0.749-0.408 0.921,0z"/></g></svg>`
      star.addEventListener('click', favHandler)

      let title = document.createElement('div')
      title.className = 'item-title'
      title.textContent = element.title

      let desc = document.createElement('div')
      desc.className = 'item-desc'
      desc.innerHTML = parseHTML(element.body)

      item.appendChild(star)
      item.appendChild(title)
      item.appendChild(desc)
      container.appendChild(item)
    })
  }

  const getWasteHandler = e => {
    let waste = wasteInput.value.trim()
    if (waste) {
      let url = `/waste`
      let headers = new Headers()
      headers.append('Content-Type', 'application/json; charset=utf-8')
      let option = {
        method: 'post',
        headers,
        body: JSON.stringify({waste})
      }
      fetch(url, option)
        .then(res => {
          let contentType = res.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            return res.json()
          }
          throw new TypeError("Oops, we haven't got JSON!")
        })
        .then(data => {
          dataFetched = data
          renderWaste(data, result)
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      wasteInput.value = ''
    }

    e.preventDefault()
    e.stopPropagation()
  }

  const typeHandler = e => {
    if (e.target.value === '') {
      result.innerHTML = ''
    }
  }

  const getFavArray = () => {
    let favStore = localStorage.getItem('favs')
    if (favStore) {
      return JSON.parse(favStore)
    }
    return []
  }

  const favHandler = e => {
    let isNewFav = false
    let favClassName = 'fav'
    if (e.currentTarget.classList.contains(favClassName)) {
      e.currentTarget.classList.remove(favClassName)
    } else {
      isNewFav = true
      e.currentTarget.classList.add(favClassName)
    }

    let favArray = getFavArray()
    let clickedItemData
    let id = e.currentTarget.parentNode.dataset.id
    let favid = e.currentTarget.parentNode.dataset.favid
    if (id) {
      clickedItemData = dataFetched.resData[id]
    } else if (favid) {
      clickedItemData = dataFromLocal.resData[favid]
    }
    if (isNewFav) {
      let isDuplicate = favArray.some(element => {
        return JSON.stringify(element) === JSON.stringify(clickedItemData)
      })
      if (!isDuplicate) {
        favArray.push(clickedItemData)
      }
    } else {
      favArray = favArray.filter(element => {
        return JSON.stringify(element) !== JSON.stringify(clickedItemData)
      })
    }
    localStorage.setItem('favs', JSON.stringify(favArray))
    // console.log(JSON.parse(localStorage.favs)) //test
    dataFromLocal.resData = getFavArray()
    renderWaste(dataFromLocal, favourites)
    if (Object.keys(dataFetched).length) {
      renderWaste(dataFetched, result)
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', getWasteHandler)
    wasteInput.addEventListener('input', typeHandler)

    let favArray = getFavArray()
    dataFromLocal.resData = favArray
    renderWaste(dataFromLocal, favourites)
  })
})()
