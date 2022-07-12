const elForm = $(".form");
const elInput = $(".header__form-input");
const elNumLength = $(".text-info");
const elSortNewYear = $(".hero__btn");
const elResultList = $(".rusult-list");
const elBookmarkList = $(".bookmark__list");
const elBtnBookmark = $(".btn-bookmark");
const elBtnReadLink = $(".btn-read");
const elBtn = $(".header__btn");
const elNextBtn = $(".next-btn");
const elPrewBtn = $(".prew-btn");
const elTemplate = $("#template").content;
const elTemplateBookMark = $("#template-book-mark").content;
const elItem = $(".result-item");




const elMadalBook = $(".book-info-modal");
const elBtnInfo = $(".more__btn");
const elBookBtn = $(".bookmark-btn");
// const elBookBtn = bookmark-btn


// console.log(elBookBtn);
// const elPage = $(".numbers");

let list = 1;
let search = "search+terms";
let and = "&";
let bookMarkArry = [];
console.log(bookMarkArry);
// let localBookmark = JSON.parse(window.localStorage.getItem("bookmarkArry"));

// LOGIN PAGE REPLACE
const token = window.localStorage.getItem("token");
elBtn.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.replace("index.html");
});


let page = 1;
// RENDER BOOKS

const renderBook = function(www) {
    elBookmarkList.innerHTML = ""
    const bookmarkFragment = document.createDocumentFragment();
    www.forEach((boo)  => {
        const copyTemplateBook = elTemplateBookMark.cloneNode(true);

        $(".book-mark-titel", copyTemplateBook).textContent = boo.volumeInfo.title;
        // $(".book-mark-delet", copyTemplateBook).textContent = boo."w";
        bookmarkFragment.append(copyTemplateBook);

    })
    elBookmarkList.append(bookmarkFragment);
}



const renderBooks = function(arr, htmlElement) {
    elResultList.innerHTML = "";
    const booksFragment = document.createDocumentFragment();
    
    arr.forEach((book) => {
        const copyTemplate = elTemplate.cloneNode(true);
        
        $(".book-img", copyTemplate).src = book.volumeInfo.imageLinks?.thumbnail;
        $(".item__title", copyTemplate,).textContent = book.volumeInfo.title;
        $(".item__spn", copyTemplate).textContent = book.volumeInfo.authors;
        $(".item__year", copyTemplate).textContent = book.volumeInfo.publishedDate;
        $(".btn-read", copyTemplate).href = book.volumeInfo.previewLink;
        $(".bookmark-btn", copyTemplate).dataset.bookId = book.id;
        // $(".text-info", copyTemplate).textContent = book.volumeInfo.pageCount
        // elNumLength.textContent = book.volumeInfo.pageCount;
        
        booksFragment.appendChild(copyTemplate);
    });
    htmlElement.appendChild(booksFragment);
    
}

// API FUNCTION
let change = (list - 1) * 15 + 1;
const getBooks = async function () {
    change = (list - 1) * 15 + 1;
    try {
        const request = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=12&startIndex=${change}${and}`
            );
            const books = await request.json();
            const data2 = books.items;
            renderBooks(data2, elResultList);
            renderBookmark(data2, bookMarkArry);
            renderBook(bookMarkArry)
        } catch {
            // errorApi();
        }   
}
getBooks();


elForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    search = elInput.value;
    elInput.value = null;
    getBooks();
})

elSortNewYear.addEventListener("click", () => {
    and = "&";
    and += "orderBy=newest";
    getBooks();
});


elNextBtn.addEventListener("click", () => {
    list++;
    getBooks();
});

elPrewBtn.addEventListener("click", () => {
    if (list > 1) {
        list--;
    }
    getBooks();
});



const renderBookmark = (data) => {
    elResultList.addEventListener("click", (evt) => {
        if(evt.target.matches(".bookmark-btn")) {
            const bookmarkBtnId = evt.target.dataset.bookId;
            const foundBookmark = data.find(data => bookmarkBtnId === data.id)
            
            if(!bookMarkArry.includes(foundBookmark)){
                bookMarkArry.push(foundBookmark)
                

                // window.localStorage.setItem("bookmarkArry",JSON.stringify(bookMarkArry))
              }
        }
    })
}





// let createBookMarkElement = function(data){
  
//     let bookmarkElement = elTemplateBookMark.cloneNode(true);
    
//     $(".book-mark-titel-text",bookmarkElement).textContent = data.volumeInfo.title;
//     // $(".btn-delete",bookmarkElement).dataset.bookmarkdeletbtn = movie.id;
    
//     return bookmarkElement;
    
//   }


//   let renderMoviesBookmark = (data) =>{
//     let elResultBookmarkList = document.createDocumentFragment();
    
//     data.forEach((data) => {
//       elResultBookmarkList.appendChild(createBookMarkElement(data));
//     })
    
//     elBookmarkList.append(elResultBookmarkList);
    
//   }



