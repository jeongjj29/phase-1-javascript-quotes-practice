const quoteListUl = document.getElementById("quote-list");

let sortById = true;

function displayQuote(quote) {
  const quoteLi = document.createElement("li");
  quoteLi.className = "quote-card";

  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";

  const contentP = document.createElement("p");
  contentP.className = "mb-0";
  contentP.textContent = quote.quote;

  const quoteFooter = document.createElement("footer");
  quoteFooter.className = "blockquote-footer";
  quoteFooter.textContent = quote.author;

  const br = document.createElement("br");

  const likeButton = document.createElement("button");
  likeButton.className = "btn-success";
  likeButton.textContent = "Likes: ";

  const likesSpan = document.createElement("span");
  likesSpan.textContent = quote.likes.length;

  likeButton.addEventListener("click", () => {
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteId: quote.id,
        createdAt: Math.floor(Date.now() / 1000),
      }),
    })
      .then((res) => res.json())
      .then((like) => {
        quote.likes.push(like);
        likesSpan.textContent = quote.likes.length;
      });
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn-danger";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: "DELETE",
    });
    quoteLi.remove();
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    const editDiv = document.createElement("div");
    editDiv.id = "edit-form";

    const editForm = document.createElement("form");

    const quoteLabel = document.createElement("label");
    quoteLabel.setAttribute("for", "editQuote");
    quoteLabel.textContent = "Quote: ";

    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.id = "editQuote";
    quoteInput.name = "editQuote";
    quoteInput.className = "form-control";
    quoteInput.value = quote.quote;

    const authorLabel = document.createElement("label");
    authorLabel.setAttribute("for", "editAuthor");
    authorLabel.textContent = "Author: ";

    const authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.id = "editAuthor";
    authorInput.name = "editAuthor";
    authorInput.className = "form-control";
    authorInput.value = quote.author;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    submitButton.className = "btn btn-primary";

    const br1 = document.createElement("br");
    const br2 = document.createElement("br");
    const br3 = document.createElement("br");
    const br4 = document.createElement("br");

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: editForm.editQuote.value,
          author: editForm.editAuthor.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          contentP.textContent = data.quote;
          quoteFooter.textContent = data.author;
          editDiv.remove();
        });
    });

    editForm.append(
      quoteLabel,
      br1,
      quoteInput,
      br2,
      authorLabel,
      br3,
      authorInput,
      br4
    );
    editForm.append(submitButton);
    editDiv.append(editForm);
    blockquote.append(editDiv);
  });

  quoteListUl.append(quoteLi);
  quoteLi.append(blockquote);
  blockquote.append(
    contentP,
    quoteFooter,
    br,
    likeButton,
    deleteButton,
    editButton
  );
  likeButton.append(likesSpan);
}

const displayQuotes = () => {
  quoteListUl.innerHTML = "";

  fetch("http://localhost:3000/quotes?_embed=likes")
    .then((res) => res.json())
    .then((quotes) => {
      if (sortById) {
        quotes.forEach((q) => displayQuote(q));
      } else {
        const sortedQuotes = quotes.sort((a, b) =>
          a.author.localeCompare(b.author)
        );
        console.log(sortedQuotes);
        sortedQuotes.forEach((q) => displayQuote(q));
      }
    });
};

const newQuoteForm = document.querySelector("#new-quote-form");
newQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newQuote = {
    quote: e.target.quote.value,
    author: e.target.author.value,
  };

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newQuote),
  })
    .then((res) => res.json())
    .then((createdQuote) => {
      createdQuote.likes = [];
      displayQuote(createdQuote);
    });
});

const sortButton = document.createElement("button");
sortButton.textContent = "Sorted by ID";
document.body.insertBefore(sortButton, document.querySelector("div"));

sortButton.addEventListener("click", () => {
  sortById = !sortById;
  sortButton.textContent = sortById ? "Sorted by ID" : "Sorted by Author";
  displayQuotes();
});

displayQuotes();
