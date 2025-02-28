
function postComment() {
    const input = document.getElementById("commentInput");
    const commentText = input.value.trim();
    if (commentText === "") return;

    fetch('/save_comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: commentText })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            input.value = ""; // 入力欄をリセット
        })
        .catch(error => console.error('Error:', error));
}
