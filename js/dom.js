const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function makeBook(title /* string */, author /* string */, year /* number */, isComplete /* boolean */) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis: " + author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: " + year;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action")

    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textTitle, textAuthor, textYear, buttonContainer);

    if (isComplete) {
        buttonContainer.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        buttonContainer.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    return container;
}

function createUndoButton() {
    return createButton("green", "Belum selesai di Baca", function (event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("red", "Hapus buku", function (event) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                removeBookFromCompleted(event.target.parentElement.parentElement);
              Swal.fire(
                'Deleted!',
                'Your book has been deleted.',
                'success'
              )
            }
          })
    });
}

function createCheckButton() {
    return createButton("green", "Selesai dibaca", function (event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass /* string */, buttonText /* string */, eventListener /* Event */) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = buttonText;
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const book = makeBook(bookTitle, bookAuthor, bookYear, bookIsComplete);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, bookIsComplete);
    
    if(bookIsComplete === false){
        book[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);

        uncompletedBookList.append(book);
        updateDataToStorage();
    } else {
        book[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);

        completedBookList.append(book);
        updateDataToStorage();
    }
    
}

function addBookToCompleted(shelfElement /* HTMLELement */) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const shelfTitle = shelfElement.querySelector("h3").innerText;
    const shelfAuthor = shelfElement.querySelectorAll("p")[0].innerText;
    const shelfYear = shelfElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(shelfTitle, shelfAuthor, shelfYear, true);
    

    const book = findBook(shelfElement[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    shelfElement.remove();

    updateDataToStorage();
}

function removeBookFromCompleted(shelfElement /* HTMLELement */) {

    const bookPosition = findBookIndex(shelfElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    shelfElement.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(shelfElement /* HTMLELement */) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const shelfTitle = shelfElement.querySelector("h3").innerText;
    const shelfAuthor = shelfElement.querySelectorAll("p")[0].innerText;
    const shelfYear = shelfElement.querySelectorAll("p")[1].innerText;
    
    const newBook = makeBook(shelfTitle, shelfAuthor, shelfYear, false);

    const book = findBook(shelfElement[BOOK_ITEMID]);
    book.isComplete = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    shelfElement.remove();
    
    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isComplete){
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}