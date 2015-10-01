$(document).ready(function(){
  $('.heroInput').on('keypress', function(event) {
    if(event.which == 13){
      event.preventDefault();
      $('.heroInput').attr({'placeholder': 'Type in the name of a Marvel superhero'});

      // create the various components for the ajax url (keys, input value, timestamp, hash)
      end_pt = "https://gateway.marvel.com/" 
      pubKey = "e687d607d622b25c31d6ae38f2f42597";
      var name = event.target.value;
      my_ts = gon.my_ts;
      my_hash = gon.my_hash;
      // gets character by name (from input)
      var url = "https://gateway.marvel.com/v1/public/characters?name=" + name + "&ts=" + my_ts + "&apikey=" + pubKey + "&hash=" + my_hash

      // ajax call to marvel using the above url
      $.ajax({
        url: url,
        type: "get",
        dataType: "json"
      }).done(function(response){
        var limit = 50;
        //if doesn't exist, then try again
        if (response.data.results.length!==0){
          var heroId = response.data.results[0].id;
          // gets list of events as filtered through a character's id
          var eventsUrl = "https://gateway.marvel.com/v1/public/characters/" + heroId + "/events?orderBy=-startDate" + "&limit=" + limit + "&ts=" + my_ts + "&apikey=" + pubKey + "&hash=" + my_hash;
          if (response.data.results[0].thumbnail!==null){
            var myImgPath = response.data.results[0].thumbnail.path + "/landscape_incredible.jpg";
            $('.heroImg').css({'background-image': 'url(' + myImgPath + ')', 'background-repeat': 'no-repeat', 'background-position': '50% 50%'});
          }
        }else{
          // dummy image
          var myImgPath = "https://dummyimage.com/464x261/3b3b3b/ffffff.png&text=No+image+available";
          $('.heroInput').attr({'placeholder': 'Sorry, try a different superhero'});
          $('.heroImg').css({'background-image': 'url(' + myImgPath + ')', 'background-repeat': 'no-repeat', 'background-position': '50% 50%'});
        }

        //ajax call using above eventsUrl
        $.ajax({
          url: eventsUrl,
          type: "get",
          dataType: "json"
        }).done(function(res2){
          entityIds = {};
          var data = [];
          var startDate;
          var format = d3.time.format("%B %d, %Y");
          var newDate;
          var timeline = d3.select(".timeline");
          r2d = res2.data.results;

          $('timeline').empty();
          $('.timeline').html('<li></li>')

          // loop that creates the html list of events, using data from the response
          for (var i = 0; i < res2.data.count; i++){
            startDate = r2d[i].start;
            newDate = format(new Date(startDate));
            data.push(startDate);
            entityIds[r2d[i].title] = r2d[i].id;
            $('.timeline').append(
              "<li class='timeline_li'><div class='timeline-badge'><i class='glyphicon glyphicon-hand-left'></i></div><div class='timeline-panel'><div class='timeline-heading'><h4 class='timeline-title'>" + r2d[i].title + "</h4><h5 class='timeline-date'>First issue: " + newDate + "</h5></div><div class='timeline-body'><p>" + r2d[i].description + "</p></div><button class='btn btn-default btn-xs' type='button' data-eventid='" + r2d[i].id + "' data-toggle='modal' href='#myModal1'>Image</button></div></li>"
            )
            // delete button if thumbnail doesn't exist
            if (r2d[i].thumbnail.length == 0){
              $('timeline-panel.btn').remove();
            }
          }

          // invert timeline for odd list items
          $ ('ul.timeline li:even').addClass('timeline-inverted')
          $ ('ul.timeline li:even i').attr("class", "glyphicon glyphicon-hand-right")
        })
      }).fail(function(response){
        console.log("fail")
        $('.heroInput').attr({'placeholder': 'Sorry, try a different superhero'})
      });
      // Clear form
      event.target.value = "";
    }
  });

  $('#myModal1').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var eventId = button.data('eventid')
    var modal = $(this)
    var url = "https://gateway.marvel.com/v1/public/events/" + eventId + "?&ts=" + my_ts + "&apikey=" + pubKey + "&hash=" + my_hash;

    // ajax call for getting thumbnail of a specific event
    $.ajax({
      url: url,
      type: "get",
      dataType: "json"
    }).done(function(res){
      modal.find('.modal-title').html(res.data.results[0].title);
      modal.find('.modal-body img').attr('src', res.data.results[0].thumbnail.path + "/detail.jpg")
    }).fail(function(){
      console.log("fail!")
    });

    // Ajax call for getting a cover image of the first issue for that event

    // var url = "https://gateway.marvel.com/v1/public/events/" + eventId + "/comics?issueNumber=1&ts=" + my_ts + "&apikey=" + pubKey + "&hash=" + my_hash;
    // $.ajax({
    //   url: url,
    //   type: "get",
    //   dataType: "json"
    // }).done(function(res){
    //   if(res.data.results.length === 0){
    //     modal.find('.modal-title').html("");
    //     modal.find('.modal-body img').attr('src', "https://dummyimage.com/300x450/ebebeb/000000.png&text=No+image+available")
    //   }else{
    //     modal.find('.modal-title').html(res.data.results[0].title);
    //     modal.find('.modal-body img').attr('src', res.data.results[0].thumbnail.path + "/portrait_uncanny.jpg")
    //   }
    // }).fail(function(){
    //   console.log("fail!")
    // });
  })
});
