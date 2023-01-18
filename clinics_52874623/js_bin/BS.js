window.scrollTo(0,0)

function make_query(override=null) {

  var human = "placeholder";
  if (!(override in [1,2,3,4,5,6,7,8,9,10,11,12,13])){
    var busy = 1;
    var go = 0;
    if ((busy == 1) && (localStorage.getItem('human_ans')==null)){
      var human_prompt = "We're experienceing high traffic. Please help convence us you're human and part of the Suffolk community.\n\n";

      var question_pool = ["What is Suffolk's mascot?","What street is Sargent Hall on?"]

      human = prompt(human_prompt + question_pool[Math.floor(Math.random() * question_pool.length)]).trim().toLowerCase();
      if ((human != "") && (human != null)) {
        localStorage.setItem('human_ans', human);
        go = 1;
      }
    } else if (localStorage.getItem('human_ans')!=null){
      go = 1;
    }
  } else {
    go = 1;
  }

  if (go == 1){
    $('#response').hide();
    $('#loading').show();
    $('#footer').css("margin-bottom","100%");

    query = $("#text").val()

    if (((query == null) | (query.trim() == "")) && !(override in [1,2,3,4,5,6,7,8,9,10,11,12,13])) {
      alert("Please enter a question, and try again.")
      $('#loading').hide();
    } else if (override == 1) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> What clinical programs are offered at Suffolk?</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 2) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> I enjoyed constitutional law as a 1L; what classes might I like as a 2L?</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 3) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> Are there any classes on positive pyschology?</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 4) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 5) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 6) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 7) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 8) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 9) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 10) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 11) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 12) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else if (override == 13) {
      scroll2Q('output',900);
      var sources = `<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>`;
      sources += `<li><a href="" target="_blank">source one</a></li>`;
      sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`;
      $('#response').html("<p class='ai_question'><b>Q:</b> q here</p><p class='ai_answer'><b>A:</b> ans here</p>"+sources)
      setTimeout(function(){
          $('#loading').hide();
          $('#response').show()
      }, 1200);
    } else {
      scroll2Q('output',900);
      var Data = { "q": query, "human": localStorage.getItem('human_ans') }

      console.log(Data)

      $.ajax({
        type: "GET",
        url: "https://tools.suffolklitlab.org/bs/",
        data: Data,

        //dataType: "json",
        // --- OR ---
        dataType: "jsonp",
        jsonpCallback: 'callback',

        contentType : "application/json",
        success: function(data) {

          console.log(data)
          tmp_data = data

          $('#loading').hide();
          if (data["status"] == 200) {

            var sources = "<h3>Sources:</h3><p>For accuracy, double check the above against the sources below. <i>Note: Links to individual PDF pages may not work on mobile.</i></p><ol>"
            for (n in data["sources"]){
              sources += `<li><a href="`+data["sources"][n][1]+`" target="_blank">`+data["sources"][n][0]+`</a></li>`;
            }
            sources += `</ol><p style="text-align:center;">~ <a href="#bot">ask another</a> ~</p>`
            $('#response').html("<p class='ai_question'><b>Q:</b> "+query+"<p class='ai_answer'><b>A:</b> "+data["response"]+"</p>"+sources);
          } else if (data["status"] == 0) {
            localStorage.clear();
            $('#response').html("<h2>We're sorry, but you didn't pass the human / community test or your pass has expired.</h2><p>Please submit your question again.</p>");
            $('#response').show();
          } else {
            $('#response').html("<h2>We encountered a problem answering your question.</h2><p>It's probably due to heavy traffic. Please try again later.</p>");
          }
          //$('#response').html(JSON.stringify(data))
          $('#response').show()
        },
        error: function (jqXHR, exception) {
          err = JSON.parse(jqXHR.responseText)
          console.log(err)
          $('#loading').hide();
          if (err["message"]) {
            $('#response').html("<h2>There was an error...</h2><ul><li>"+err["message"]+"</li></ul>")
          } else {
            $('#response').html("<h2>There was an error...</h2>")
          }
          $('#response').show()
        }
      });
    }
  } else {
    alert("Sorry!")
  }
    return true

}

function scroll2Q(id,speed) {
  var top = document.getElementById(id).offsetTop; //Getting Y of target element
  //console.log("Jump to Y for ("+id+"): "+top);
  //adapted from https://github.com/Yappli/smooth-scroll
  var moving_frequency = 5; // Affects performance !
  var hop_count = speed/moving_frequency
      var getScrollTopDocumentAtBegin = document.documentElement.scrollTop + document.body.scrollTop;
      var gap = (top - getScrollTopDocumentAtBegin) / hop_count;
  for(var i = 1; i <= hop_count; i++)
      {
        (function()
          {
            var hop_top_position = gap*i;
              setTimeout(function(){  window.scrollTo(0, hop_top_position + getScrollTopDocumentAtBegin); }, moving_frequency*i);
           })();
      }
}
