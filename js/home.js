// FORM ELEMENTS
const elForm = $(".form");
const elInput = $(".header__form-input");

// LISTS
const elResultList = $(".rusult-list");
const elBookmarkList = $(".bookmark__list");
const elItem = $(".result-item");
const elNumLength = $(".text-info");
const elError = $(".bnnma");

// BUTTONS
const elSortNewYear = $(".hero__btn");
const elBtn = $(".header__btn");
const elBtnBookmark = $(".btn-bookmark");
const elBtnReadLink = $(".btn-read");
const elNextBtn = $(".next-btn");
const elPrewBtn = $(".prew-btn");
const elMadalBook = $(".book-info-modal");
const elBtnInfo = $(".more__btn");
const elBookBtn = $(".bookmark-btn");

// TEMPLATE
const elTemplate = $("#template").content;

// GLOBAL
let list = 1;
let search = "search+terms";
let and = "&";

// LOCALSTORAGE ARRAY
let localBookmark2 = JSON.parse(window.localStorage.getItem("bookmarks"));
let bookMarkArry = localBookmark2 || [];

// LOGIN PAGE 
const token = window.localStorage.getItem("token");
elBtn.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.replace("index.html");
});


let page = 1;
// FUNCTION
const renderBooks = function(arr, htmlElement) {
    elResultList.innerHTML = "";
    const booksFragment = document.createDocumentFragment();
    
    arr.forEach((book) => {
        const copyTemplate = elTemplate.cloneNode(true);
        
        //TEMPLATE CALL ELEMENTS
        $(".book-img", copyTemplate).src = book.volumeInfo.imageLinks?.thumbnail;
        $(".item__title", copyTemplate,).textContent = book.volumeInfo.title;
        $(".item__spn", copyTemplate).textContent = book.volumeInfo.authors;
        $(".item__year", copyTemplate).textContent = book.volumeInfo.publishedDate;
        $(".btn-read", copyTemplate).href = book.volumeInfo.previewLink;
        $(".bookmark-btn", copyTemplate).dataset.bookmarkBtnId = book.id;
     
        // ELEMENTS APPEND
        booksFragment.appendChild(copyTemplate);
    });
    htmlElement.appendChild(booksFragment);


    let renderBookmark = function(array, htmlElement) {
        array.forEach(bookmark => {

            // CREATE ELEMENT
            let newItem = document.createElement("li");
            let newDivWrapper = document.createElement("div");
            let newDivInnerLeft = document.createElement("div");
            let newDivInner = document.createElement("div");
            let newPi = document.createElement("p");
            let newPiAuthors = document.createElement("p");
            let newBtnDelete = document.createElement("button");
            let newBtnRead = document.createElement("button");
            let newImgRead = document.createElement("img");
            let newImgDelete = document.createElement("img");
            let newImglink = document.createElement("a");
            // newImglink.href = bookmark.volumeInfo.previewLink
            
            // SETATTRIBUTE
            newDivWrapper.setAttribute("class", "d-flex  justify-content-between");
            newDivInner.setAttribute("class", "d-flex  justify-content-between");
            newItem.setAttribute("class", "bookmark-list__item");
            newBtnDelete.setAttribute("class", "delete-bookmark-btn border-0 bg-transparent ");
            newBtnRead.setAttribute("class", "border-0 bg-transparent");
            newPi.setAttribute("class", "bookmark-text m-0 p-0");
            newImgRead.setAttribute("class", "bookmark-read-img");
            newImgDelete.setAttribute("class", "bookmark-delete-img");
            newPiAuthors.setAttribute("class", "bookmark-authors m-0 p-0")
            newImgRead.src = `./img/read-img.svg`
            newImgDelete.src = `./img/delete-img.svg`
            newPi.textContent = bookmark.volumeInfo.title;
            newPiAuthors.textContent = bookmark.volumeInfo.authors;
            newBtnDelete.dataset.deleteBookmarks = bookmark?.id; 
            newImgDelete.dataset.deleteBookmarks = bookmark?.id; 

            // APPEND ELEMENT
            newBtnRead.append(newImgRead);
            newDivInner.append(newBtnRead,newBtnDelete);
            newDivInnerLeft.append(newPi,newPiAuthors)
            newDivWrapper.append(newDivInnerLeft,newDivInner);
            newItem.append(newDivWrapper);
            newBtnDelete.append(newImgDelete)
            htmlElement.append(newItem);
            
        });
    }

    // BOOKMARK 
    elResultList.addEventListener("click", function(evt){
        if(evt.target.matches(".bookmark-btn")){
            let bookmarkBtnId = evt.target.dataset.bookmarkBtnId
            let foundBookmark = arr.find(boks => boks.id === bookmarkBtnId)
            if(!bookMarkArry.includes(foundBookmark)){
                bookMarkArry.push(foundBookmark);
                window.localStorage.setItem("bookmarks", JSON.stringify(bookMarkArry))
            };
            elBookmarkList.innerHTML = null;
            renderBookmark(bookMarkArry, elBookmarkList);
        };
    });

    // BOOKMARK DELETE
    elBookmarkList.addEventListener("click", function(evt) {
        const deleteBtn = evt.target.dataset.deleteBookmarks;
        const foundTodoIndex = bookMarkArry.findIndex((todo) => todo.id === deleteBtn)
        if(evt.target.matches(".bookmark-delete-img")) {
            bookMarkArry.splice(foundTodoIndex, 1)
            elBookmarkList.innerHTML = "";
            window.localStorage.setItem("bookmarks", JSON.stringify(bookMarkArry))
            if(bookMarkArry.length === 0) {
                window.localStorage.removeItem("bookmarks")
            }
            renderBookmark(bookMarkArry, elBookmarkList)
        }
       
    })
    renderBookmark(bookMarkArry, elBookmarkList)
}

// FULL DATA
let change = (list - 1) * 15 + 1;
const getBooks = async function () {
    change = (list - 1) * 15 + 1;
    try {
        const request = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=12&startIndex=${change}${and}`
            );
            const books = await request.json();
            elNumLength.textContent = books.totalItems;
            const data = books.items;
            renderBooks(data, elResultList);
          
        } catch {
            errorRender()
        }   
}
getBooks();

// ERROR FUNCTION
function errorRender() {
    let error = `APIDAN MALUMOT KELMADI?`;
    elResultList.insertAdjacentHTML("beforeend", error);
    elError.classList.add("visually-hidden");
}


// SEARCH FORM
elForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    search = elInput.value;
    elInput.value = null;
    getBooks();
})

// NEW YEAR SORT
elSortNewYear.addEventListener("click", () => {
    and = "&";
    and += "orderBy=newest";
    getBooks();
});

// NEXT PAGE
elNextBtn.addEventListener("click", () => {
    list++;
    getBooks();
});

// PREW PAGE
elPrewBtn.addEventListener("click", () => {
    if (list > 1) {
        list--;
    }
    getBooks();
});

