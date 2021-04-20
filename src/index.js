let addToy = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");

addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
});

function fetchToys() {
  fetch('http://localhost:3000/toys').then(resp => resp.json()).then(function(json) {
    json.forEach(function(toyObj) {
      addNewCard(toyObj)
    })
  })
}

function addNewCard(obj) {
  let toysDiv = document.getElementById('toy-collection')
  let toyCard = document.createElement('div')
  toyCard.className = 'card'
  let h2 = document.createElement('h2')
  h2.innerHTML = obj.name
  let img = document.createElement('img')
  img.src = obj.image
  let p = document.createElement('p')
  p.innerHTML = `${obj.likes} likes`
  let likeButton = document.createElement('button')
  likeButton.className = 'like-btn'
  likeButton.innerHTML = 'Like'
  likeButton.id = obj.id
  toyCard.append(h2, img, p, likeButton)
  toysDiv.appendChild(toyCard)
  likeButton.addEventListener('click', (e) => {
    likeEvents(e)
  })
}

function newToyObj(name, image) {
  let configObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      "image": image,
      "likes": 0
    })
  }

  fetch('http://localhost:3000/toys', configObj).then(resp => resp.json()).then(function(json){
    addNewCard(json)
  }).catch(function(error) {
    console.log(error.message)
  })

}

document.querySelector('.container').addEventListener('submit', function(e) {
  e.preventDefault()
  let name = document.querySelector("input[name='name']")
  let image = document.querySelector("input[name='image']")
  newToyObj(name.value, image.value)
})

function likeEvents(e) {
  e.preventDefault()
  let plusLike = parseInt(e.target.previousElementSibling.innerText) + 1
  let patchObj = {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    body: JSON.stringify({
      'likes': plusLike
    })
  }
  fetch(`http://localhost:3000/toys/${e.target.id}`, patchObj).then(resp => resp.json()).then(function(json) {
    e.target.previousElementSibling.innerText = `${plusLike} likes`
  })
}

fetchToys()
