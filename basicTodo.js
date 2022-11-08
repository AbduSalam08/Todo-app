// grabbing inputs value and elements
let postText = document.querySelector('#post-text')
let searchQuery = document.querySelector('#search-input')
let editPostBtn = document.querySelector('.edit-post')
let addPostBtn = document.querySelector('.add-post')
let postSection = document.querySelector('.post-section')
let dltAllBtn = document.querySelector('.dlt-all')

// add post btn click event
let postData = []
addPostBtn.addEventListener('click', () => {
  let trimmedValue = postText.value.replace(/^\s+/, '').replace(/\s+$/, '')
  if (trimmedValue == '') {
    addPostBtn.classList.add('disabled')
  } else {
    postData.push({ postText: postText.value, checked: false })
    DisplayPost(postData)
    postText.value = ''
    addPostBtn.classList.remove('disabled')
    localStorage.setItem('postData', JSON.stringify(postData))
  }
})

// Form Vaidation
postText.addEventListener('keyup', () => {
  let trimmedValue = postText.value.replace(/^\s+/, '').replace(/\s+$/, '')
  if (trimmedValue == '') {
    addPostBtn.classList.add('disabled')
  } else {
    addPostBtn.classList.remove('disabled')
  }
})

// Display Post
const DisplayPost = (postData) => {
  let postCard = ''

  postSection.innerHTML = ''

  postData.map((post, index) => {
    postCard += `
          <div
          class="post-card text-center d-flex align-items-center justify-content-center flex-column m-2 p-3 rounded border"
          id=${index}
        >

        <input type="checkbox" class="form-control form-check-input check m-0 p-0" onclick="checkBox(this)">
        
          <div class="post-content mb-3">
            <span class="lead post-title fw-bold">
              ${post.postText}
            </span>
          </div>

          <div class="post-btns">
            <button class="btn btn-primary me-4"  onclick="editPost(this)">
              Edit
              <i class="fas fa-edit ms-2"></i>
            </button>
            <button class="btn btn-danger" onclick="deletePost(this)">
              Delete
              <i class="fas fa-trash ms-2"></i>
            </button>
          </div>
        </div>
        `
  })

  postSection.innerHTML += postCard
}

// Edit Post
const editPost = (e) => {
  editPostBtn.classList.remove('hidden')

  addPostBtn.classList.add('hidden')

  postText.value = postData[e.parentElement.parentElement.id].postText

  // console.log(postData[e.parentElement.parentElement.id])

  editPostBtn.addEventListener('click', () => {
    postData[e.parentElement.parentElement.id].postText = postText.value

    console.log(
      (postData[e.parentElement.parentElement.id].postText = postText.value),
    )

    postText.value = ''

    localStorage.setItem('postData', JSON.stringify(postData))

    DisplayPost(postData)

    editPostBtn.classList.add('hidden')

    addPostBtn.classList.remove('hidden')

    window.location.reload()
  })
}

// Delete Post
const deletePost = (e) => {
  let confirmDelete = confirm(
    `Are you sure want to delete ${e.parentElement.previousElementSibling.children[0].innerText} ?`,
  )

  if (confirmDelete) {
    postData.splice(e.parentElement.parentElement.id, 1)
    localStorage.setItem('postData', JSON.stringify(postData))
    DisplayPost(postData)
    // console.log(postData)
    window.location.reload()
  }
}

// search Filter
searchQuery.addEventListener('keyup', (e) => {
  let searchQueryInput = e.target.value
  searchTerm(searchQueryInput, postData)
  // DisplayPost(filter)
})

function searchTerm(searchText, postData) {
  let filteredArr = []

  postData.forEach((post) => {
    let searchInput = searchText.toLowerCase()
    let postTitle = post.postText.toLowerCase()
    if (postTitle.includes(searchInput)) {
      filteredArr.push(post)
      DisplayPost(filteredArr)
    } else {
      let noPostMsg = `<span class="h4 text-muted mt-5"> "${searchText}" not found !</span>`
      postSection.innerHTML = noPostMsg
    }
  })
  // console.log(filteredArr)
  return filteredArr
}

// delete checked items
let checkedItems = []

function checkBox(e) {
  if (e.checked == true) {
    checkedItems.push((postData[e.parentElement.id].checked = true))

    e.parentElement.classList.add('alert-primary', 'border-primary')

    localStorage.setItem('postData', JSON.stringify(postData))

    if (checkedItems.length >= 2) {
      dltAllBtn.classList.remove('disabled')
    }

    // console.log(postData)
    // console.log(checkedItems)
  } else {
    // alert('unclicked')
    checkedItems.pop((postData[e.parentElement.id].checked = false))

    e.parentElement.classList.remove('alert-primary', 'border-primary')

    localStorage.setItem('postData', JSON.stringify(postData))

    if (checkedItems.length < 2) {
      dltAllBtn.classList.add('disabled')
    }

    // console.log(postData)
    // console.log(checkedItems)
  }
}

dltAllBtn.addEventListener('click', (e) => {
  // console.log(e.target.parentElement.parentElement.nextElementSibling.children[0].id)
  let confirmGroupDelete = confirm(
    'Are you sure want to delete selected posts ?',
  )

  if (confirmGroupDelete) {
    for (let index = 0; index < postData.length; index++) {
      for (
        let checkedIndex = 0;
        checkedIndex < checkedItems.length;
        checkedIndex++
      ) {
        if (postData[index].checked == checkedItems[checkedIndex]) {
          postData.splice(index, 1) || checkedItems['']
          localStorage.setItem('postData', JSON.stringify(postData))
          DisplayPost(postData)
          window.location.reload()
        }
        if (postData.length == 0) {
          checkedItems.length == 0
        }
      }
    }
  } else {
    window.location.reload()
  }
})

// fetching all datas from localStorage in window onload with IIFE(Immediately Invoking Fucntion Expression) funtion
;(() => {
  postData = JSON.parse(localStorage.getItem('postData')) || []
  DisplayPost(postData)

  // showing no datas found msg when no datas in localStorage
  if (postData.length == 0) {
    let noPostMsg = `<span class="h4 text-muted mt-5"> <i class="fa-solid fa-hourglass-empty me-3"></i> You don't have any posts</span>`
    postSection.innerHTML = noPostMsg
  }
})()
