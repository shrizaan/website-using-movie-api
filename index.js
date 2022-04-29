// ajax js menggunakan jQuery
// $('.search-button').on('click', function() {
//   $.ajax({
//     url: "http://www.omdbapi.com/?apikey=47ec8035&s=" + $('.input-keyword').val(),
//     success: (results) => {
//       const movies = results.Search;
//       let cards = "";
//       movies.forEach((movie) => {
//         cards += showCards(movie);
//       });
//       $(".movie-container").html(cards);

//       $(".modal-detail-btn").on("click", function () {
//         $.ajax({
//           url:
//             "http://www.omdbapi.com/?apikey=47ec8035&i=" + $(this).data("imdbid"),
//           success: (m) => {
//             const movieDetail = showMovieDetail(m);
//             $(".modal-body").html(movieDetail);
//           },
//           error: (e) => {
//             console.log(e.responseText);
//           },
//         });
//       });
//     },
//     error: (e) => {
//       console.log("error cuok");
//       console.log(e.responseText);
//     },
//   });
// })

// ajax js menggunakan fetch
// const searchButton = document.querySelector(".search-button");
// searchButton.addEventListener("click", function () {
//   const inputKeyword = document.querySelector(".input-keyword");
//   fetch("http://www.omdbapi.com/?apikey=47ec8035&s=" + inputKeyword.value)
//     .then((response) => response.json())
//     .then((response) => {
//       const movies = response.Search;
//       console.log(movies);
//       let cards = "";
//       movies.forEach((movie) => (cards += showCards(movie)));
//       document.querySelector(".movie-container").innerHTML = cards;

//       const modalDetailBtn = document.querySelectorAll(".modal-detail-btn");
//       modalDetailBtn.forEach((btn) =>
//         btn.addEventListener("click", function () {
//           console.log();
//           fetch(
//             "http://www.omdbapi.com/?apikey=47ec8035&i=" + this.dataset.imdbid
//           ).then(response => response.json())
//           .then(response => {
//             const movieDetail = showMovieDetail(response);
//             document.querySelector('.modal-body').innerHTML = movieDetail;
//           })
//         })
//       );
//     });

//   // const apiResult = getMovies('http://www.omdbapi.com/?apikey=47ec8035&s=' + inputKeyword.value);
//   // apiResult.then(response => console.log(response))
// });

// ajax js menggunakan fetch tetapi di refactor dengan menggunakan async await
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (error) {
    errorToast(error)
  }

  // const modalDetailBtn = document.querySelectorAll(".modal-detail-btn");
  // modalDetailBtn.forEach((btn) =>
  //   btn.addEventListener("click", async function () {
  //     const movieDetailApi = await getMoviesDetail(this.dataset.imdbid);
  //     const movieDetail = showMovieDetail(movieDetailApi);
  //     document.querySelector(".modal-body").innerHTML = movieDetail;
  //   })
  // );
});

// event binding awal

// document.addEventListener("click", async function (e) {
//   if (e.target.classList.contains("modal-detail-btn")) {
//     const imdbid = e.target.dataset.imdbid;
//     const movieDetailApi = await getMoviesDetail(imdbid);
//     const movieDetail = showMovieDetail(movieDetailApi);
//     document.querySelector(".modal-body").innerHTML = movieDetail;
//   }
// });

// menambahkan event handler tipe click untuk elemen baru, yaitu elemen yang memiliki class '.modal-detail-btn' dan menampilkan detail film sesuai nilai dari data atribute imdb yang bersangkutan
addGlobalEventListener("click", ".modal-detail-btn", async function (e) {
  try {
    const imdbid = e.target.dataset.imdbid;
    const movieDetailApi = await getMoviesDetail(imdbid);
    const movieDetail = showMovieDetail(movieDetailApi);
    document.querySelector(".modal-body").innerHTML = movieDetail;
  } catch (error) {
    console.log(error);
  }
});

// function ini digunakan untuk menambahkan event handler dengan berbagai tipe event sesuai yang kita inginkan, untuk elemen yang akan datang.
// caranya tinggal panggil function ini, setelah membuat elemen baru di javascript
// tentukan tipe eventnya, selector elemennya, dan callback functionnya
function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e);
  });
}

// event binding akhir

function getMovies(inputKeyword) {
  return fetch("http://www.omdbapi.com/?apikey=47ec8035&s=" + inputKeyword)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((movie) => (cards += showCards(movie)));
  document.querySelector(".movie-container").innerHTML = cards;
}

function getMoviesDetail(imdbid) {
  return (
    fetch("http://www.omdbapi.com/?apikey=47ec8035&i=" + imdbid)
      // .then((response) => console.log(response))
      // .then((response) => console.log(response.json()))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Detail movie tidak ditemukan");
        }
        return response.json();
      })
  );
}

function errorToast(error) {
  var myToastEl = document.getElementById("myToast");
  var myToast = new bootstrap.Toast(myToastEl);
  myToast.show();
  myToastEl.addEventListener("shown.bs.toast", function () {
    document.querySelector(".toast-body").innerHTML = error;
  });
  console.log(error);
}

function showCards(movie) {
  return `<div class="col-md-4 my-2">
            <div class="card">
              <img src="${movie.Poster}" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                <a href="#" class="btn btn-primary modal-detail-btn" data-imdbid="${movie.imdbID}" data-bs-toggle="modal"
                data-bs-target="#movieDetailModal">Show Details</a>
              </div>
            </div>
          </div>`;
}

function showMovieDetail(m) {
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-md-3">
                <img src="${m.Poster}" alt="" class="img-fluid">
              </div>
              <div class="col-md">
                <ul class="list-group">
                  <li class="list-group-item">
                    <h3>${m.Title} (${m.Year})</h3>
                  </li>
                  <li class="list-group-item">
                    <strong>Director: </strong> ${m.Director}
                  </li>
                  <li class="list-group-item">
                    <strong>Actors: </strong> ${m.Actors}
                  </li>
                  <li class="list-group-item">
                    <strong>Writer: </strong> ${m.Writer}
                  </li>
                  <li class="list-group-item">
                    <strong>Plot: </strong> <br>
                    ${m.Plot}
                  </li>
                </ul>
              </div>
            </div>
          </div>`;
}

/*
Promise adalah object yang mereprentasikan keberhasilan / kegagalan sebuah event yang asynchronous di masa yang akan datang

1. janji ( terpenuhi / ingkar )
2. states ( fulfilled / rejected / pending )
3. callback, digunakan untuk menjalankan keadaan atau states ( resolve / reject / finally (waktu tunggu selesai, baik terpenuhi maupun tidak))
4. Terdapat aksi untuk melakukan ketika janji terpenuhi atau tidak terpenuhi ( then akan menjalankan resolve / catch akan menjalankan reject )
*/
