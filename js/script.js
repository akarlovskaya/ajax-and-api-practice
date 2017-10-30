
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!

    // Add images
    var $street = $('#street').val();
    console.log($street);
    var $city = $('#city').val();
    // console.log($city);
    var address = $street + ", " + $city;
    // console.log(address);
    $('#image_gallery').append( "<img src='http://maps.googleapis.com/maps/api/streetview?size=400x200&location=" + address +"'>" );

    // Add NY Times articles
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "8aeba150761f44418c591e68cccb8997",
      'q': $city
    });
    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(result) {
      // console.log(result);
      // console.log(typeof result);
      // console.log(result.response);
      console.log(result.response.docs);
      console.log(typeof result.response.docs);
      // console.log(result.response.docs.length);
      // console.log(result.response.docs["0"].headline);

      if ( result.response.docs.length ) {
        var items = [];
        // loop through all articles in object and create li elements
        $.each(result.response.docs, function(index, value){
          var header = value.headline.main;
          var url = value.web_url;
          var text = value.snippet;
          items.push( "<li><a href='" + url + "' target='_blank'>" + header + "</a><p>" + text + "</p></li>" );
          // add this list in html
          $('#nytimes-articles').html(items);
        });
        // show only first three
        $('li').eq(2).nextAll().hide().addClass('toggleable');
        // add More button
        $('#nytimes-articles').append('<button class="more">More...</button>');
      } else {
        $('#nytimes-articles').html("No articles found");
      }

      $('.more').on('click', function(){
      if( $(this).hasClass('less') ){
        $(this).text('More...').removeClass('less');
      }else{
        $(this).text('Less...').addClass('less');
      }
      $(this).siblings('li.toggleable').slideToggle();

    });




    }).fail(function(err) {
      throw err;
    });


    return false;
};

$('#form-container').submit(loadData);
