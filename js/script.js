
function loadData() {
    // var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytElem = $('#nytimes-articles');
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // 1. Load streetview as images
    var $street = $('#street').val();
    var $city = $('#city').val();
    var address = $street + ", " + $city;
    $('#image_gallery').append( "<img src='http://maps.googleapis.com/maps/api/streetview?size=400x200&location=" + address +"'>" );

    // 2. Add NY Times articles
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "8aeba150761f44418c591e68cccb8997",
      'q': $city
    });
    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(result) {

      if ( result.response.docs.length ) {
        var items = [];
        // loop through all articles in object and create li elements
        $.each(result.response.docs, function(index, value){
          var header = value.headline.main;
          var url = value.web_url;
          var text = value.snippet;
          items.push( "<li><a href='" + url + "' target='_blank'>" + header + "</a><p>" + text + "</p></li>" );
          // add this list in html
          $nytElem.html(items);
        });
        // show only first three
        $('.article-list li').eq(2).nextAll().hide().addClass('toggleable');
        // add More button
        $nytElem.append('<button class="more">More...</button>');
      } else {
        $nytElem.html("No articles found");
      }

      // click on More...
        $('.more').on('click', function(){
        if( $(this).hasClass('less') ){
          $(this).text('More...').removeClass('less');
        }else{
          $(this).text('Less...').addClass('less');
        }
        $(this).siblings('.article-list li.toggleable').slideToggle();
      });

    }).fail(function(err) {
      $nytElem.html('New York Times Articles Could Not Be loaded');
    });

    // 3. Add Wiki Articles
    var cityNoSpace = $city.replace(/\s/g,'');
    var searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityNoSpace + "&format=json&callback=WikiCallback";
    $.ajax({
      type: "GET",
      url: searchUrl,
      dataType: "jsonp"
    })
    .done(function(data){
      if ( data.length ) {
        var titles = [];
        $.each(data[1], function(index, value){
          titles.push( '<li><a href="' + data[3][index] + '" target="_blank">'+ data[1][index]+'</a></li>' );
        });
        $wikiElem.html(titles);
      } else {
        $wikiElem.html('No relevant articles found');
      }
    })
    .fail(function(){
      $wikiElem.html('Wikipedia Articles Could Not Be loaded');
    });

    return false;
};

$('#form-container').submit(loadData);
