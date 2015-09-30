$(document).ready(function(){
  $('.heroInput').on('keypress', function(event) {
    if(event.which == 13){
      event.preventDefault();
      $('.heroInput').attr({'placeholder': 'Type in the name of a Marvel superhero'});

      // var privKey = "";
      pubKey = "e687d607d622b25c31d6ae38f2f42597";
      var name = event.target.value;
      // ts = parseInt(Date.now()/1000, 10);
      // var preHash = ts + privKey + pubKey;
      // my_hash = CryptoJS.MD5(preHash).toString();
      my_ts = gon.my_ts;
      my_hash = gon.my_hash;
      console.log(my_ts)
      console.log(my_hash)
      var url = "http://gateway.marvel.com:80/v1/public/characters?name=" + name + "&ts=" + my_ts + "&apikey=" + pubKey + "&hash=" + my_hash
      console.log(url)
      $.ajax({
        url: url,
        type: "get",
        dataType: "json"
      }).done(function(response){
        var limit = 50;
        //if doesn't exist, then try again
        if (response.data.results.length!==0){
          var heroId = response.data.results[0].id;
          var testUrl = "http://gateway.marvel.com:80/v1/public/characters/" + heroId + "/events?orderBy=-startDate" + "&limit=" + limit + "&ts=" + my_ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + my_hash;
          if (response.data.results[0].thumbnail!==null){
            var myImgPath = response.data.results[0].thumbnail.path + "/landscape_incredible.jpg";
            $('.heroImg').css({'background-image': 'url(' + myImgPath + ')', 'background-repeat': 'no-repeat', 'background-position': '50% 50%'});
          }
        }else{
          var myImgPath = "http://dummyimage.com/464x261/3b3b3b/ffffff.png&text=No+image+available";
          $('.heroInput').attr({'placeholder': 'Sorry, try a different superhero'});
          $('.heroImg').css({'background-image': 'url(' + myImgPath + ')', 'background-repeat': 'no-repeat', 'background-position': '50% 50%'});
          console.log("else")
        }

        console.log(heroId)

        $.ajax({
          url: testUrl,
          type: "get",
          dataType: "json"
        }).done(function(res2){
          console.log(res2)
          entityIds = {};
          var data = [];
          var startDate;
          var format = d3.time.format("%B %d, %Y");
          var newDate;
          var timeline = d3.select(".timeline");
          var r2d = res2.data.results;

          $('timeline').empty();
          $('.timeline').html('<li></li>')
          for (var i = 0; i < res2.data.count; i++){
            startDate = r2d[i].start;
            newDate = format(new Date(startDate));
            data.push(startDate);
            entityIds[r2d[i].title] = r2d[i].id;
            // console.log(r2d[i].thumbnail);
            // append button only if image exists?
            $('.timeline').append(
              "<li class='timeline_li'><div class='timeline-badge'><i class='glyphicon glyphicon-hand-left'></i></div><div class='timeline-panel'><div class='timeline-heading'><h4 class='timeline-title'>" + r2d[i].title + "</h4><h5 class='timeline-date'>First issue: " + newDate + "</h5></div><div class='timeline-body'><p>" + r2d[i].description + "</p></div><button class='btn btn-default btn-xs' type='button' data-eventid='" + r2d[i].id + "' data-toggle='modal' href='#myModal1'>Cover</button></div></li>"
            )
            if (r2d[i].thumbnail.length !== 0){
              // console.log(r2d[i].thumbnail.path);
            }
          }
          $ ('ul.timeline li:even').addClass('timeline-inverted')
          $ ('ul.timeline li:even i').attr("class", "glyphicon glyphicon-hand-right")
          console.log(entityIds);
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
    // if issue exists?
    var url = "http://gateway.marvel.com:80/v1/public/events/" + eventId + "/comics?issueNumber=1&ts=" + my_ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + my_hash;
    $.ajax({
      url: url,
      type: "get",
      dataType: "json"
    }).done(function(res){
      console.log(eventId);
      if(res.data.results.length === 0){
        modal.find('.modal-title').html("");
        modal.find('.modal-body img').attr('src', "http://dummyimage.com/300x450/ebebeb/000000.png&text=No+image+available")
        console.log("No data")
      }else{
        modal.find('.modal-title').html(res.data.results[0].title);
        modal.find('.modal-body img').attr('src', res.data.results[0].thumbnail.path + "/portrait_uncanny.jpg")
      }
    }).fail(function(){
      console.log("fail!")
    });
  })
});
