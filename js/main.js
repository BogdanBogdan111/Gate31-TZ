document.addEventListener('DOMContentLoaded', () =>{

    const filter = document.querySelector('#search'),
        form = document.querySelector('form')


    const getResources = async (url) => {
        const res = await fetch (url)
        if (!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${status}`)
        }
        return await res.json()
    }

    getResources('https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7')
        .then(data => {
            /* Рендеринг постов */
            data.forEach((post) => {
                const element = document.createElement('div')
                element.classList.add('post')
                element.innerHTML = `<h3>${post.title}</h3>
                                     <p>${post.body}</p>
                                     <input type ="checkbox"/>`
                document.querySelector('.posts').append(element)
            })

            const posts = document.querySelectorAll('.post')

            /* Событие чекбокса */
            posts.forEach((post) => {
                post.querySelector('input').addEventListener('change', function(e){
                    if(e.target.checked === true){
                        post.classList.add('active')
                    }else{
                        post.classList.remove('active')
                    }
                })
            })

            /* Фильтрация постов */
            const showHidePosts = (word) => {
                for (let post of posts) {
                    let item = post.querySelector('h3').innerHTML.toLowerCase();
                    if (item.indexOf(word) === -1) { post.style.display = 'none'; }
                    else { post.style.display = 'block'; }
                }

            }

            /* Скрыть/Показать посты соответствующие URL */
            if(window.location.search !== ''){
                const params = new URLSearchParams(window.location.search);
                const search = params.get('search')
                showHidePosts(search)
                filter.value = search
            }

            /* Форма фильтрации */
            form.addEventListener('submit', (e) => {
                e.preventDefault()

                const search = filter.value.toLowerCase();
                showHidePosts(search)

                if (search !== ''){
                    try {
                        const originUrl = deleteUrlParam("search")
                        history.pushState({}, '', `${originUrl}?search=${search}`);
                    } catch(e) {
                        console.log(e)
                    }
                }
                else{
                    history.pushState(null, null, window.location.origin);
                }
            })

            /* Удалить get-параметр из URL */
            const deleteUrlParam = (param) =>{
                const url = new URL(document.location)
                const searchParams = url.searchParams
                searchParams.delete(param)
                return url.toString()
            }
        })
})