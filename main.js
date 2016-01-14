$(function () {
  // Variables Globales
  var $tvShowContainer = $('#app-body').find('.tv-shows')
// Animaciones
  $tvShowContainer.on('click', 'button.like', function(ev){
    var $this = $(this)
    // $this.animate({
    //   'fontSize': '3em'
    // }, 'fast')
  // $this.closest('.tv-show').addClass('liked')
  $this.closest('.tv-show').toggleClass('liked')
  })
  // Optimizamos con renderShows
  function renderShows (shows) {
    $tvShowContainer.find('.loader').remove()
    shows.forEach(function (show) {
      var article = template
      .replace(':name:', show.name)
      .replace(':img:', show.image.medium)
      .replace(':summary:', show.summary)
      .replace(':img alt:', show.name + ' Image')

      var $article = $(article)
      $article.hide()
      $tvShowContainer.append($article.fadeIn(3500))
    })
  }

  // Submit search form
  $('#app-body')
  .find('form')
  .submit(function (event) {
    event.preventDefault()
    var busqueda = $(this)
      .find('input[type="text"]')
      .val()
    $tvShowContainer.find('.tv-show').remove()
    var $loader = $('<div class="loader">')
    $loader.appendTo($tvShowContainer)
    $.ajax({
      url: 'http://api.tvmaze.com/search/shows',
      data: { q: busqueda },
      success: function (res, status, xhr) {
        $loader.remove()
        var shows = res.map(function (el) {
          return el.show
        })
        renderShows(shows)
      }
    })
  })

  // Request
  var template = '<article class="tv-show">' +
            '<div class="left img-container">' +
              '<img src=":img:" alt=":img alt:">' +
            '</div>' +
            '<div class="right info">' +
              '<h1>:name:</h1>' +
              '<p>:summary:</p>' +
              '<button class="like">♥</button>'
            '</div>' +
          '</article>'
  if (!localStorage.shows) {
    $.ajax('http://api.tvmaze.com/shows')
      .then(function (shows) {
        $tvShowContainer.find('.loader').remove()
        localStorage.shows = JSON.stringify(shows)
        renderShows(shows)
      })
  } else {
    renderShows(JSON.parse(localStorage.shows))
  }
})
