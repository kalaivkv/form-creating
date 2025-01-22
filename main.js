let posts = [];
        const postsPerPage = 5;
        let currentPage = 1;

        document.getElementById('newPostBtn').addEventListener('click', function () {
            start();
            const modal = new bootstrap.Modal(document.getElementById('newpost'));
            modal.show();
            document.getElementById('savePostBtn').onclick = saveNewPost;
        });

        function start() {
            document.getElementById('id').value = '';
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('savePostBtn').innerText = "Post";
            document.getElementById('newpostLabel').innerText = 'Create New Post';
        }

        function saveNewPost() {
            const id = document.getElementById('id').value;
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            if (id && name && phone) {
                const newPost = { id, name, phone, enabled: true };
                posts.push(newPost);
                displayPost();
                start();
                const modal = bootstrap.Modal.getInstance(document.getElementById('newpost'));
                modal.hide();
            } 
            else {
                alert("Please fill all details.");
            }
        }

        function displayPost() {
            const entries = document.getElementById('entries');
            entries.innerHTML = '';
            const titleRow = document.createElement('div');
            titleRow.className = 'titles post';
            titleRow.innerHTML =
                "<div>ID</div>" +
                "<div>Name</div>" +
                "<div>Phone No</div>" +
                "<div>Enabled</div>" +
                "<div>Actions</div>";
            entries.appendChild(titleRow);
            const filteredPost = filterPostBySearch(posts);
            const paginatedPost = paginate(filteredPost);
            paginatedPost.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML =
                    "<div>" + post.id + "</div>" +
                    "<div>" + post.name + "</div>" +
                    "<div>" + post.phone + "</div>" +
                    "<div>" +
                    "<span onclick='toggleEnabled(\"" + post.id + "\")'>" +
                    (post.enabled ? '<i class=\"bi bi-toggle-on\" style=\"color: green; font-size: 1.5rem;\"></i>' : '<i class=\"bi bi-toggle2-off\" style=\"font-size: 1.5rem;\"></i>') +
                    "</span>" +
                    "</div>" +
                    "<div>" +
                    "<button class='edit' onclick='editPost(\"" + post.id + "\")' style='background-color: blue; color: white;'><i class='bi bi-pencil-square'></i></button>" +
                    "<button class='delete' onclick='confirmDelete(\"" + post.id + "\")' style='background-color: red; color: white;'><i class='bi bi-trash'></i></button>" +
                    "</div>";
                entries.appendChild(postDiv);
            });
            updatePagination(filteredPost.length);
        }

        function toggleEnabled(id) {
            const post = posts.find(p => p.id === id);
            if (post) {
                post.enabled = !post.enabled;
                displayPost();
            }
        }

        function filter() {
            currentPage = 1;
            displayPost();
        }

        function filterPostBySearch(posts) {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            return posts.filter(post =>
                post.name.toLowerCase().includes(searchTerm) ||
                post.id.toLowerCase().includes(searchTerm) ||
                post.phone.toLowerCase().includes(searchTerm)
            );
        }

        function paginate(filteredPost) {
            const startIndex = (currentPage - 1) * postsPerPage;
            return filteredPost.slice(startIndex, startIndex + postsPerPage);
        }

        function updatePagination(totalFiltered) {
            const paginationControls = document.getElementById('paginationControls');
            paginationControls.innerHTML = '';
            const totalPages = Math.ceil(totalFiltered / postsPerPage);
            paginationControls.innerHTML +=
                '<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '">' +
                '<a class="page-link" href="#" aria-label="Previous" onclick="changePage(' + (currentPage - 1) + ')">' +
                '&laquo;' +
                '</a>' +
                '</li>';
            for (let i = 1; i <= totalPages; i++) {
                const pageItem = document.createElement('li');
                pageItem.className = 'page-item ' + (currentPage === i ? 'active' : '');
                pageItem.innerHTML = '<a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a>';
                paginationControls.appendChild(pageItem);
            }
            paginationControls.innerHTML +=
                '<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '">' +
                '<a class="page-link" href="#" aria-label="Next" onclick="changePage(' + (currentPage + 1) + ')">' +
                '&raquo;' +
                '</a>' +
                '</li>';
        }

        function changePage(page) {
            if (page > 0 && page <= Math.ceil(posts.length / postsPerPage)) {
                currentPage = page;
                displayPost();
            }
        }

        function editPost(id) {
            const post = posts.find(p => p.id === id);
            if (post) {
                start();
                document.getElementById('newpostLabel').innerText = 'Edit Post';
                document.getElementById('id').value = post.id;
                document.getElementById('name').value = post.name;
                document.getElementById('phone').value = post.phone;
                document.getElementById('savePostBtn').innerText = "Edit Post";
                const editpost = new bootstrap.Modal(document.getElementById('newpost'));
                editpost.show();
                document.getElementById('savePostBtn').onclick = function () {
                    updatePost(post);
                };
            }
        }


        function deletePost(id) {
            posts = posts.filter(post => post.id !== id);
            displayPost();
        }

        function confirmDelete(id) {
            if (confirm("Are you sure you want to delete this post?")) {
                deletePost(id);
            }
        }

        function updatePost(postToUpdate) {
            const updatedName = document.getElementById('name').value;
            const updatedPhone = document.getElementById('phone').value;
            if (updatedName && updatedPhone) {
                postToUpdate.name = updatedName;
                postToUpdate.phone = updatedPhone;
                displayPost();
                start();
                const editpost = bootstrap.Modal.getInstance(document.getElementById('newpost'));
                editpost.hide();
            }
             else {
                alert("Please fill all details.");
            }
        }

        function isNumber(event) {
            return /\d/.test(event.key);
        }

        function isAlphabet(event) {
            return /^[a-zA-Z.\s]*$/.test(event.key);
        }

        function isPhoneNumber(event) {
            return /\d/.test(event.key);
        }