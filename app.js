// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCOdWYYrzeK5zF_FZHtfVeuRvg_xBAV9aI",
    authDomain: "v-s-journal.firebaseapp.com",
    databaseURL: "https://v-s-journal-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "v-s-journal",
    storageBucket: "v-s-journal.appspot.com",
    messagingSenderId: "549384469541",
    appId: "1:549384469541:web:6c422ee7abc4e06f8e53cc",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Font style buttons
const boldBtn = document.getElementById("bold-btn");
const italicBtn = document.getElementById("italic-btn");

// Blog text area
const blogText = document.getElementById("blog-text");

// Post button
const postBtn = document.getElementById("post-btn");

// Blog posts feed
const blogPosts = document.getElementById("blog-posts");

// View post div
const viewPostDiv = document.getElementById("view-post");

// Function to display individual blog post
function displayPost(post) {
    viewPostDiv.innerHTML = `
        <div class="post">
            <p>${post.content}</p>
            <button id="back-btn">Back</button>
        </div>
    `;

    const backBtn = document.getElementById("back-btn");
    backBtn.addEventListener("click", () => {
        viewPostDiv.innerHTML = ""; // Clear the view
    });
}

// Handle bold button click
boldBtn.addEventListener("click", () => {
    const selectionStart = blogText.selectionStart;
    const selectionEnd = blogText.selectionEnd;
    const textBefore = blogText.value.substring(0, selectionStart);
    const selectedText = blogText.value.substring(selectionStart, selectionEnd);
    const textAfter = blogText.value.substring(selectionEnd);

    blogText.value = `${textBefore} **${selectedText}** ${textAfter}`;
    blogText.focus();
});

// Handle italic button click
italicBtn.addEventListener("click", () => {
    const selectionStart = blogText.selectionStart;
    const selectionEnd = blogText.selectionEnd;
    const textBefore = blogText.value.substring(0, selectionStart);
    const selectedText = blogText.value.substring(selectionStart, selectionEnd);
    const textAfter = blogText.value.substring(selectionEnd);

    blogText.value = `${textBefore} *${selectedText}* ${textAfter}`;
    blogText.focus();
});

// Handle post button click
postBtn.addEventListener("click", () => {
    const content = blogText.value.trim();

    if (content !== "") {
        db.collection("blogs").add({
            content: content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        blogText.value = "";
    }
});

// Real-time updates
db.collection("blogs").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    blogPosts.innerHTML = ""; // Clear existing posts
    snapshot.forEach(doc => {
        const post = doc.data();
        const postDiv = document.createElement("div");
        postDiv.className = "post";
        postDiv.innerHTML = `<p>${post.content}</p>`;
        postDiv.addEventListener("click", () => {
            displayPost(post); // Display individual post when clicked
        });
        blogPosts.appendChild(postDiv);
    });
});
