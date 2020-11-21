const getButton = document.getElementById("getButton");
const postButton = document.getElementById("postButton");

getButton.addEventListener("click", (event) => {
  fetch("http://127.0.0.1:8080/feed/posts", {
    method: "GET"
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((resultJson) => {
      console.log(resultJson);
    })
    .catch((err) => {
      console.log(err);
    });
});

postButton.addEventListener('click', (event) => {
  fetch('http://127.0.0.1:8080/feed/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'The title',
      content: 'This is the content!'
    })
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((resultJson) => {
      console.log(resultJson);
    })
    .catch((err) => {
      console.log(err);
    });
});
