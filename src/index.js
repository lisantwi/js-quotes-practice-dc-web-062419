// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener("DOMContentLoaded", function(){
    console.log("Dom is Loaded")
    document.querySelector("#new-quote-form").addEventListener("submit", addQuote)
    fetchQuotes()
} )

function fetchQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotesArr => quotesArr.forEach(renderQuote))
}

function renderQuote(quote){
    //creating dom variables for quotecard
    const quoteList = document.querySelector("#quote-list")
    const quoteLi = document.createElement("li")
    const quoteBlock = document.createElement("blockquote")
    const quoteP = document.createElement("p")
    const quoteFoot = document.createElement("footer")
    const likeButton = document.createElement("button")
    const deleteButton = document.createElement("button")
    const editButton = document.createElement("button")
    const likeSpan = document.createElement("span")

    //add id to li
    quoteLi.id = `quote-${quote.id}`


    //adding eventlisteners to buttons LIKE & DELERW
    deleteButton.addEventListener("click", event => deleteQuote(event, quote))
    likeButton.addEventListener("click", event => addLike(event, quote, likeSpan))
    editButton.addEventListener("click", event => editQuote(event, quote, quoteLi, quoteBlock) )

    //adding necessary classes
    quoteLi.classList.add("quote-card")
    quoteBlock.classList.add("blockquote")
    quoteP.classList.add("mb-0")
    quoteFoot.classList.add("blockquote-footer")
    likeButton.classList.add("btn-success")
    deleteButton.classList.add("btn-danger")
    editButton.classList.add("btn-info")

    //adding text to elements
    quoteP.innerText = quote.quote 
    quoteFoot.innerText = quote.author 
    likeButton.innerText = "Likes:"
    deleteButton.innerText = "Delete"
    likeSpan.innerText = quote.likes.length
    editButton.innerText = "Edit Quote"

    //appending elements
    quoteList.appendChild(quoteLi)
    quoteLi.appendChild(quoteBlock)
    quoteBlock.appendChild(quoteP)
    quoteBlock.appendChild(quoteFoot)
    quoteBlock.appendChild(likeButton)
    quoteBlock.appendChild(deleteButton)
    quoteBlock.appendChild(editButton)
    likeButton.appendChild(likeSpan)
    
}

function addQuote(){
    event.preventDefault()
    let data = {
        "quote": event.target.new_quote.value,
        "author": event.target.author.value,
        "likes": []
    }

    postQuote(data)
}

function postQuote(data){
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify(data)

    }).then(resp => resp.json())
    .then(quote => renderQuote(quote))
}

function deleteQuote(event, quote){
    event.preventDefault()
    let id = quote.id
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE",
    }).then(resp => resp.json())
    .then(()=> {
        document.getElementById(`quote-${id}`).remove()
    })
}

function addLike(event, quote, likeSpan){
    event.preventDefault()
    let currentLikes = parseInt(likeSpan.innerText)
    let data = {
        "quoteId": quote.id
    }
    fetch('http://localhost:3000/likes',{
        method: "POST",
        headers: {
            'Content-Type':'application/json',
            "Accept": "application/json"
        },
        
        body:JSON.stringify(data)
    }).then(resp => resp.json()) 
    .then( (like) => {
        event.target.firstElementChild.innerText = `${currentLikes + 1}`
        currentLikes +=1
    })
}



function editQuote(event, quote, quoteLi){
    const blockQuote = event.target.parentElement
    //creating form
    const quoteLabel = document.createElement("label")
    const authorLabel = document.createElement("label")
    const editForm = document.createElement("form")
    const editQuote = document.createElement("input")
    const editAuthor = document.createElement("input")
    const submitButton = document.createElement("button")


    //setting values
    editQuote.value = blockQuote.querySelector("p").innerText
    editAuthor.value = blockQuote.querySelector("footer").innerText
   
    //adding classes + ids
    editQuote.classList.add("form-control")
    editAuthor.classList.add("form-control")
    editQuote.id = "edit-quote"
    editAuthor.id = "edit-author"
    submitButton.setAttribute('type', 'submit')
    submitButton.classList.add("btn-success")

    
    //add event listener to button
    


    //inner text
    quoteLabel.innerText = "New Quote"
    authorLabel.innerText = "New Author"
    submitButton.innerText = "Submit Changes"

   //appending inputs to form & form to LI
   quoteLi.appendChild(editForm)
   editForm.appendChild(quoteLabel)
   editForm.appendChild(editQuote)
   editForm.appendChild(authorLabel)
   editForm.appendChild(editAuthor)
   editForm.appendChild(submitButton)
   submitButton.addEventListener("click", event => updateQuote(event, quote, blockQuote, editForm))
   

}

function updateQuote(event, quote, blockQuote, editForm){
    event.preventDefault()
    let id = quote.id
    let data = {
        "quote": event.target.parentElement.querySelector("#edit-quote").value,
        "author":event.target.parentElement.querySelector("#edit-author").value
    }

    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "PATCH", 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }).then(resp => resp.json())
    .then(quote => {
        blockQuote.querySelector("p").innerText = event.target.parentElement.querySelector("#edit-quote").value,
        blockQuote.querySelector("footer").innerText = event.target.parentElement.querySelector("#edit-author").value
        editForm.remove()
    })
}