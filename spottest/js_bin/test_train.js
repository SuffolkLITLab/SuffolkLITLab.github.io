window.scrollTo(0,0)
var controlling_jur = "man_jur";
var jur_picked = "0";

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  console.log("Lat:"+position.coords.latitude+" Lon:"+position.coords.longitude)
  var location_uri = "https://nominatim.openstreetmap.org/reverse?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&format=json";
  console.log(location_uri)
  $.ajax({
    type: "GET",
    url: location_uri,
    success: function(data) {
       if (data.address.country_code == "us") {
          controlling_jur = "auto_jur";
          $('#unknown_jur').hide()
          $('#jurisdiction').html(data.address.state);
          $('#auto_jur').val('yes');
          $('#known_jur').show()
          console.log(data)
       }
     },
     error: function (jqXHR, exception) {
         console.log(jqXHR.responseText)
     }
    });
}
getLocation();

function find_abr(name) {
  var out;
  states.forEach(function(element) {
    if (name == element["name"]) {
      out = element["abr"]
    }
  });
  return out;
}

function find_name(abr) {
  var out;
  states.forEach(function(element) {
    if (abr == element["abr"]) {
      out = element["name"]
    }
  });
  return out;
}

function find_img(name) {
  var out = "";
  nsmi_translations["labels"].forEach(function(element) {
    if (name == element["name"]) {
      out = element["img"]
    }
  });
  if (out != "") {
      return out;
  } else {
      return find_child_img(name);
  }
}

function find_child_img(name) {
  var out;
  nsmi_translations["labels"].forEach(function(element) {
      if (element["children"]) {
        element["children"].forEach(function(child) {
            if (name == child["name"]) {
              out = child["img"]
            }
        });
      }
  });
  return out;
}

function find_avvo(name) {
  var out = "";
  nsmi_translations["labels"].forEach(function(element) {
    if (name == element["name"]) {
      out = element["name_avvo"]
    }
  });
  if (out != "") {
      return out;
  } else {
      return find_child_avvo(name);
  }
}

function find_child_avvo(name) {
  var out;
  nsmi_translations["labels"].forEach(function(element) {
      if (element["children"]) {
        element["children"].forEach(function(child) {
            if (name == child["name"]) {
              out = child["name_avvo"]
            }
        });
      }
  });
  return out;
}

function find_CL(name) {
  var out = "";
  nsmi_translations["labels"].forEach(function(element) {
    if (name == element["name"]) {
      out = element["name_CL"]
    }
  });
  if (out != "") {
      return out;
  } else {
      return find_child_CL(name);
  }
}

function find_child_CL(name) {
  var out;
  nsmi_translations["labels"].forEach(function(element) {
      if (element["children"]) {
        element["children"].forEach(function(child) {
            if (name == child["name"]) {
              out = child["name_CL"]
            }
        });
      }
  });
  return out;
}

function find_des(id) {
  var out = "";
  nsmi_translations["labels"].forEach(function(element) {
    if (id == element["id"]) {
      out = element["description"]
    }
  });
  if (out != "") {
      return out;
  } else {
      return find_child_des(id);
  }
}

function find_child_des(id) {
  var out;
  nsmi_translations["labels"].forEach(function(element) {
      if (element["children"]) {
        element["children"].forEach(function(child) {
            if (id == child["id"]) {
              out = child["description"]
            }
        });
      }
  });
  return out;
}

function find_nsmi_name(id) {
  var out = "";
  nsmi_translations["labels"].forEach(function(element) {
        if (id == element["id"]) {
          out = element["name"]
        }
  });
  if (out != "") {
      return out;
  } else {
      return find_nsmi_child_name(id);
  }

}

function find_nsmi_child_name(id) {
  var out;
  nsmi_translations["labels"].forEach(function(element) {
      if (element["children"]) {
        element["children"].forEach(function(child) {
            if (id == child["id"]) {
              out = child["name"]
            }
        });
      }
  });
  return out;
}

function make_query() {

  if ((controlling_jur == "man_jur") && ($('#man_jur').val() != 0)) {
      jur_picked = $('#man_jur').val();
      console.log(jur_picked)
  } else if (controlling_jur == "auto_jur") {
      if ($('#auto_jur').val()=="yes") {
        jur_picked = find_abr($('#jurisdiction').html());
      } else {
        jur_picked = $('#auto_jur').val();
      }
  } else {
    jur_picked = "0";
  }

  if ($('#result__words').html()>=10) {

    if (jur_picked != 0) {
      $('#response').hide();
      $('#loading').show();
      $('#footer').css("margin-bottom","100%");
      scroll2Q('output',900);

      var Data = { text: $("#text").val() }

      Object.assign(Data, {'save-text': 1})

      Object.assign(Data, {'test-train': 1})

      if ($('#cutoff-lower').val() != "") {
        Object.assign(Data, {'cutoff-lower': $('#cutoff-lower').val()*1})
      }
      if ($('#cutoff-pred').val() != "") {
        Object.assign(Data, {'cutoff-pred': $('#cutoff-pred').val()*1})
      }
      if ($('#cutoff-upper').val() != "") {
        Object.assign(Data, {'cutoff-upper': $('#cutoff-upper').val()*1})
      }

      console.log(Data)
      $.ajax({
        type: "POST",
        url: "https://spot.suffolklitlab.org/v0/entities-nested/",
        data: JSON.stringify(Data),
        dataType: "json",
        headers: {
          "Authorization": "Bearer "+$("#bearer").val()
        },
        contentType : "application/json",
        success: function(data) {
          console.log(data)
          $('#loading').hide();
          if (data["labels"].length == 0) {
            $('#response').html("<h2>We had a problem spotting issues in your text. Please try expanding on your explanation.</h2>")
          } else {
            returned_id = []
            $('#response').html("<h2>It looks like you may be looking for help with...</h2>")
            data["labels"].forEach(function(element) {
              $('#response').html($('#response').html()+"<div style=\"margin:15px 0px; padding:10px 5px 5px 5px; border-top: solid 1px #555;\"><table width=\"100%\"><tr><td width=\"1%\" valign=\"top\"><div style=\"float:left;border-radius: 8px;border: 2px solid #aaa;margin:0 15px 0px 0px;background-image:url('images/"+find_img(element["name"])+"');background-position: center;    background-size: 60px 60px;\"><img src=\"../images/space.gif\" width=\"60px\" height=\"60px\"></div></td><td><span class=\"subtitle\" style=\"float:right;margin:0px 0 4px 0;font-weight: normal;\"><a href=\"https://spot.suffolklitlab.org/performance/#uncertainty\" target=\"_blank\">How sure?</a>&nbsp;&nbsp;"+Math.round(element["lower"]*100)+"%-"+Math.round(element["upper"]*100)+"%</span><span style=\"font-weight: bold; font-size:18px;\">"+element["name"]+"</span><p>"+find_des(element["id"])+"</p><p>Help me find relevant: (1) <a href=\"https://www.qnamarkup.net/i/?source=https://raw.githubusercontent.com/SonyaCoding/LSC_Project/master/qna/civ/"+jur_picked+".txt#"+element["id"]+"\" target=\"_blank\">attorneys</a>; (2) <a href=\"https://community.lawyer/search?jurisdictions[]="+find_name(jur_picked)+"&taxonomy_categories[]="+find_CL(element["name"])+"\" target=\"_blank\">interactive self-help</a>; (3) <a href=\"https://www.google.com/search?q=legal+help+with+"+encodeURI(element["name"])+"+issues+in+"+find_name(jur_picked)+"+site%3A*.org+OR+site%3A*."+jur_picked+".us+OR+site%3A*.gov\" target=\"_blank\">resources on the web</a>.</p></td></tr></table></div>")
              returned_id.push(element["id"]);
              console.log(element);
              if (element["children"]) {
                element["children"].forEach(function(child) {
                  $('#response').html($('#response').html()+"<div style=\"margin:15px 0px; padding:10px 5px 5px 5px; border-top: solid 1px #555;\"><table width=\"100%\"><tr><td width=\"1%\" valign=\"top\"><div style=\"float:left;border-radius: 8px;border: 2px solid #aaa;margin:0 15px 0px 0px;background-image:url('images/"+find_img(child["name"])+"');background-position: center;    background-size: 60px 60px;\"><img src=\"../images/space.gif\" width=\"60px\" height=\"60px\"></div></td><td><span class=\"subtitle\" style=\"float:right;margin:0px 0 4px 0;font-weight: normal;\"><a href=\"https://spot.suffolklitlab.org/performance/#uncertainty\" target=\"_blank\">How sure?</a>&nbsp;&nbsp;"+Math.round(child["lower"]*100)+"%-"+Math.round(child["upper"]*100)+"%</span><span style=\"font-weight: bold; font-size:18px;\">"+element["name"]+" &raquo; "+child["name"]+"</span><p>"+find_des(child["id"])+"</p><p>Help me find relevant: (1) <a href=\"https://www.qnamarkup.net/i/?source=https://raw.githubusercontent.com/SonyaCoding/LSC_Project/master/qna/civ/"+jur_picked+".txt#"+child["id"]+"\" target=\"_blank\">attorneys</a>; (2) <a href=\"https://community.lawyer/search?jurisdictions[]="+find_name(jur_picked)+"&taxonomy_categories[]="+find_CL(child["name"])+"\" target=\"_blank\">interactive self-help</a>; (3) <a href=\"https://www.google.com/search?q=legal+help+with+"+encodeURI(child["name"])+"+issues+in+"+find_name(jur_picked)+"+site%3A*.org+OR+site%3A*."+jur_picked+".us+OR+site%3A*.gov\" target=\"_blank\">resources on the web</a>.</p></td></tr></table></div>")
                  returned_id.push(child["id"]);
                  console.log(child);
                });
              }
            });
            clear_arry = []
            nsmi_translations["labels"].forEach(function(element) {
                clear_arry.push("'"+element["id"]+"'");
                if (element["children"]) {
                   element["children"].forEach(function(child) {
                        clear_arry.push("'"+child["id"]+"'");
                   });
                }
            });
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
    } else {
      $('#man_jur').css('background-color', 'orange');
      alert("You must choose a place where this is happening (or did happen).");
    }
  } else {
     $('#text').css('background-color', 'orange');
     alert("Your reply must be at least ten words long.");
     document.getElementById('text').focus();
   }

   return true

}

function label(query,present,arry,name) {

    var pres_arry = []
    var not_pres_arry = []
    if (present==1) {
      pres_arry.push(arry[0])
    } else {
      not_pres_arry.push(arry[0])
    }

    arry.forEach(function(item) {
      $('[id='+item+']').css('background-color','yellow');
      $('[id=yes_'+item+']').css('background-color','yellow');
      $('[id=no_'+item+']').css('background-color','yellow');
      $('[id=yes_'+item+']').html("Yes, that's there.");
      $('[id=no_'+item+']').html("No, that's not there.");
    });

    if (present == 0 && arry[0].substring(3,5) == "00"){
      nsmi_translations["labels"].forEach(function(element) {
          if (element["id"] == arry[0]) {
              if (element["children"]) {
                element["children"].forEach(function(child) {
                  $('[id='+element["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+element["id"]+']').css('background-color','yellow');
                  $('[id=no_'+element["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+element["id"]+']').html("Yes, that's there.");
                  $('[id=no_'+element["id"]+']').html("No, that's not there.");
                  $('[id='+child["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+child["id"]+']').css('background-color','yellow');
                  $('[id=no_'+child["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+child["id"]+']').html("Yes, that's there.");
                  $('[id=no_'+child["id"]+']').html("No, that's not there.");
                  not_pres_arry.push(child["id"])
                });
              }
      }
      });
      console.log("parent deletes children");
    } else if (present == 1 && arry[0].substring(3,5) != "00") {
      nsmi_translations["labels"].forEach(function(element) {
          if (element["children"]) {
            element["children"].forEach(function(child) {
              if(child["id"] == arry[0]) {
                  $('[id='+element["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+element["id"]+']').css('background-color','yellow');
                  $('[id=no_'+element["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+element["id"]+']').html("Yes, that's there.");
                  $('[id=no_'+element["id"]+']').html("No, that's not there.");
                  $('[id='+child["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+child["id"]+']').css('background-color','yellow');
                  $('[id=no_'+child["id"]+']').css('background-color','yellow');
                  $('[id=yes_'+child["id"]+']').html("Yes, that's there.");
                  $('[id=no_'+child["id"]+']').html("No, that's not there.");
                  pres_arry.push(element["id"]);
              }
            });
          }
      });
      console.log("child adds parents");
    } else if (present == 0 && arry[0].substring(3,5) != "00") {
      nsmi_translations["labels"].forEach(function(element) {
          if (element["children"]) {
            element["children"].forEach(function(child) {
              if(child["id"] == arry[0]) {
                  var childText = $('#children_of_'+element["id"]).html();
                  var total = (childText.match(/<div/g) || []).length;
                  var there = (childText.match(/ADD/g) || []).length;
                  var red = (childText.match(/background-color: rgb\(255, 204, 204\);/g) || []).length;
                  var green = (childText.match(/background-color: rgb\(204, 255, 204\);/g) || []).length;
                  console.log("multi par",total,there,red,green);
                  if (green == 0) {
                      $('[id='+element["id"]+']').css('background-color','yellow');
                      $('[id=yes_'+element["id"]+']').css('background-color','yellow');
                      $('[id=no_'+element["id"]+']').css('background-color','yellow');
                      $('[id=yes_'+element["id"]+']').html("Yes, that's there.");
                      $('[id=no_'+element["id"]+']').html("No, that's not there.");
                      $('[id='+child["id"]+']').css('background-color','yellow');
                      $('[id=yes_'+child["id"]+']').css('background-color','yellow');
                      $('[id=no_'+child["id"]+']').css('background-color','yellow');
                      $('[id=yes_'+child["id"]+']').html("Yes, that's there.");
                      $('[id=no_'+child["id"]+']').html("No, that's not there.");
                      not_pres_arry.push(child["id"])
                      bulk_clear(query,[element["id"]])
                      console.log("Clear parent "+find_nsmi_name(element["id"])+" as there are no siblings");
                  }
              }
            });
          }
      });
    }

    var Data = { 'query-id': query }

    Object.assign(Data, {'present': pres_arry,'not-present': not_pres_arry});

    $.ajax({
    type: "POST",
    url: "https://spot.suffolklitlab.org/v0/opinions/",
    data: JSON.stringify(Data),
    dataType: "json",
    headers: {
      "Authorization": "Bearer "+$("#bearer").val()
    },
    contentType : "application/json",
    success: function(data) {
      console.log(data)
      pres_arry.forEach(function(item) {
          name = find_nsmi_name(item);
          $('#'+item).html("ADD "+name);
          $('[id=yes_'+item+']').css("background-color","cfc");
          $('[id=no_'+item+']').css("background-color","eee");
          $('[id=no_'+item+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',0,['"+item+"'],'"+name+"');$('[id=no_"+item+"]').css('background-color','yellow');\">No, that's not there.</a>");

          $('[id='+item+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',0,['"+item+"'],'"+name+"');$('[id="+item+"]').css('background-color','yellow');\">DELETE "+name+"</a>");
          $('[id='+item+']').css("background-color","cfc");
      });
      not_pres_arry.forEach(function(item) {
          name = find_nsmi_name(item);
          $('#'+item).html("DELETE "+name);
          $('[id=yes_'+item+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',1,['"+item+"'],'"+name+"');$('[id=yes_"+item+"]').css('background-color','yellow');\">Yes, that's there.</a>");
          $('[id=no_'+item+']').html("No, that's not there.");

          $('[id=yes_'+item+']').css("background-color","eee");
          $('[id=no_'+item+']').css("background-color","fcc");

          $('[id='+item+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',1,['"+item+"'],'"+name+"');$('[id="+item+"]').css('background-color','yellow');\">ADD "+name+"</a>");
          $('[id='+item+']').css("background-color","fcc");
      });
    },
    error: function (jqXHR, exception) {
      err = JSON.parse(jqXHR.responseText)
      console.log(err)
      pres_arry.forEach(function(item) {
          name = find_nsmi_name(item);
          $('[id=yes_'+item+']').css("background-color","eee");
          $('[id='+item+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',1,['"+item+"'],'"+name+"');$('[id="+item+"]').css('background-color','yellow');\">ADD "+name+"</a>");
          $('[id='+item+']').css("background-color","eee");
      });
      not_pres_arry.forEach(function(item) {
          name = find_nsmi_name(item);
          $('[id=no_'+item+']').css("background-color","eee");
          $('[id='+item+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',0,['"+item+"'],'"+name+"');$('[id="+item+"]').css('background-color','yellow');\">DELETE "+name+"</a>");
          $('[id='+item+']').css("background-color","eee");
      });
    }
  });

  return true
}

function bulk_clear(query,arry) {

    var Data = { 'query-id': query }

    Object.assign(Data, {'clear': arry});

    $.ajax({
    type: "POST",
    url: "https://spot.suffolklitlab.org/v0/opinions/",
    data: JSON.stringify(Data),
    dataType: "json",
    headers: {
      "Authorization": "Bearer "+$("#bearer").val()
    },
    contentType : "application/json",
    success: function(data) {
        arry.forEach(function(element) {
          name = find_nsmi_name(element)
          $('[id=yes_'+element+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',1,['"+element+"'],'"+name+"');$('[id=yes_"+element+"]').css('background-color','yellow');\">Yes, that's there.</a>");
          $('[id=no_'+element+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',0,['"+element+"'],'"+name+"');$('[id=no_"+element+"]').css('background-color','yellow');\">No, that's not there.</a>");
          $('[id=yes_'+element+']').css("background-color","eee");
          $('[id=no_'+element+']').css("background-color","eee");
          $('[id='+element+']').html("<a href=\"javascript:void('');\" onClick=\"label('"+query+"',1,['"+element+"'],'"+name+"');$('[id="+element+"]').css('background-color','yellow');\">ADD "+name+"</a>");
          $('[id='+element+']').css("background-color","eee");
          //console.log(element);
        });
        console.log(data)
    },
    error: function (jqXHR, exception) {
      err = JSON.parse(jqXHR.responseText)
      console.log(err)
    }
  });

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


var states = [
  	{ abr: "AL", name: "Alabama"},
  	{ abr: "AK", name: "Alaska"},
  	{ abr: "AS", name: "American Samoa"},
  	{ abr: "AZ", name: "Arizona"},
  	{ abr: "AR", name: "Arkansas"},
  	{ abr: "CA", name: "California"},
  	{ abr: "CO", name: "Colorado"},
  	{ abr: "CT", name: "Connecticut"},
  	{ abr: "DE", name: "Delaware"},
  	{ abr: "DC", name: "District of Columbia"},
  	{ abr: "FL", name: "Florida"},
  	{ abr: "GA", name: "Georgia"},
  	{ abr: "GU", name: "Guam"},
  	{ abr: "HI", name: "Hawaii"},
  	{ abr: "ID", name: "Idaho"},
  	{ abr: "IL", name: "Illinois"},
  	{ abr: "IN", name: "Indiana"},
  	{ abr: "IA", name: "Iowa"},
  	{ abr: "KS", name: "Kansas"},
  	{ abr: "KY", name: "Kentucky"},
  	{ abr: "LA", name: "Louisiana"},
  	{ abr: "ME", name: "Maine"},
  	{ abr: "MD", name: "Maryland"},
  	{ abr: "MA", name: "Massachusetts"},
  	{ abr: "MI", name: "Michigan"},
  	{ abr: "MN", name: "Minnesota"},
  	{ abr: "MS", name: "Mississippi"},
  	{ abr: "MO", name: "Missouri"},
  	{ abr: "MT", name: "Montana"},
  	{ abr: "NE", name: "Nebraska"},
  	{ abr: "NV", name: "Nevada"},
  	{ abr: "NH", name: "New Hampshire"},
  	{ abr: "NJ", name: "New Jersey"},
  	{ abr: "NM", name: "New Mexico"},
  	{ abr: "NY", name: "New York"},
  	{ abr: "NC", name: "North Carolina"},
  	{ abr: "ND", name: "North Dakota"},
  	{ abr: "MP", name: "Northern Mariana Islands"},
  	{ abr: "OH", name: "Ohio"},
  	{ abr: "OK", name: "Oklahoma"},
  	{ abr: "OR", name: "Oregon"},
  	{ abr: "PA", name: "Pennsylvania"},
  	{ abr: "PR", name: "Puerto Rico"},
  	{ abr: "RI", name: "Rhode Island"},
  	{ abr: "SC", name: "South Carolina"},
  	{ abr: "SD", name: "South Dakota"},
  	{ abr: "TN", name: "Tennessee"},
  	{ abr: "TX", name: "Texas"},
  	{ abr: "UT", name: "Utah"},
  	{ abr: "VT", name: "Vermont"},
  	{ abr: "VA", name: "Virginia"},
  	{ abr: "VI", name: "Virgin Islands"},
  	{ abr: "WA", name: "Washington"},
  	{ abr: "WV", name: "West Virginia"},
  	{ abr: "WI", name: "Wisconsin"},
  	{ abr: "WY", name: "Wyoming"}
  ]

// descriptions: https://docs.google.com/spreadsheets/d/1lsugsln0VGenzkLZux5utSbFGjyjmVrboWt48l-EZeo/edit#gid=0



nsmi_translations = {
  "labels": [
    {
    "id": "TO-00-00-00-00",
    "name": "Accidents, Injuries, and Torts (Problems with Others)",
    "description": "This category covers problems that one person has with another person (or animal), like when there is a car accident, a dog bite, bullying or possible harassment, or neighbors treating each other badly.",
    "name_avvo": "personal-injury-lawyer",
    "name_CL": "Accidents and Torts",
    "img": "accidents.jpg",
    "img_cred": "https://flic.kr/p/7HLu2V",
    "children": [
                  {
                    "id": "TO-01-00-00-00",
                    "name": "Being Physically Injured or Harmed",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "accidents.jpg",
                    "img_cred": "https://flic.kr/p/7HLu2V"
                  },
                  {
                    "id": "TO-02-00-00-00",
                    "name": "Having personal data breached",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "accidents.jpg",
                    "img_cred": "https://flic.kr/p/7HLu2V"
                  },
                  {
                    "id": "TO-03-00-00-00",
                    "name": "Getting Care and Coverage for an injury",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "accidents.jpg",
                    "img_cred": "https://flic.kr/p/7HLu2V"
                  },
                  {
                    "id": "TO-04-00-00-00",
                    "name": "Suing someone, or being sued, for an injury",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "accidents.jpg",
                    "img_cred": "https://flic.kr/p/7HLu2V"
                  },
                  {
                    "id": "TO-05-00-00-00",
                    "name": "Being harassed by another person",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "accidents.jpg",
                    "img_cred": "https://flic.kr/p/7HLu2V"
                  }
              ]
    },
    {
    "id": "BE-00-00-00-00",
    "name": "Benefits",
    "description": "This category covers benefits that people can get from the government, like for food, disability, old age, medical help, unemployment, child care, or other social needs.",
    "name_avvo": "government-lawyer",
    "name_CL": "Benefits",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
      "children": [
                    {
                      "id": "BE-01-00-00-00",
                      "name": "Disability benefits",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BE-02-00-00-00",
                      "name": "Food and cash benefits",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BE-03-00-00-00",
                      "name": "Health coverage benefits",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BE-04-00-00-00",
                      "name": "Unemployment Compensation and Insurance",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BE-05-00-00-00",
                      "name": "Utilities, Energy, and Heating benefits at home",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BE-06-00-00-00",
                      "name": "Veterans Affairs (VA) benefits",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "IM-03-00-00-00",
                      "name": "Benefits for immigrants",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "NA-07-00-00-00",
                      "name": "Benefits for Native Americans",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    }
                  ]
    },
    {
    "id": "RI-00-00-00-00",
    "name": "Civil and Human Rights",
    "description": "This category covers people's fundamental rights, that the government should protect and others should respect. It applies to situations of discrimination, abuse, due process, the first amendment, indigenous rights, and other key rights.",
    "name_avvo": "civil-rights-lawyer",
    "name_CL": "Civil and Human Rights",
    "img": "justice.jpg",
    "img_cred": "https://flic.kr/p/Ky8Wgq",
    "children": [
                  {
                    "id": "NA-08-00-00-00",
                    "name": "Rights and protections for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "justice.jpg",
                    "img_cred": "https://flic.kr/p/Ky8Wgq"
                  },
                  {
                    "id": "RI-01-00-00-00",
                    "name": "Discrimination and Equal Protection",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "justice.jpg",
                    "img_cred": "https://flic.kr/p/Ky8Wgq"
                  },
                  {
                    "id": "RI-03-00-00-00",
                    "name": "Disability Rights",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "justice.jpg",
                    "img_cred": "https://flic.kr/p/Ky8Wgq"
                  },
                  {
                    "id": "RI-11-00-00-00",
                    "name": "Women's Rights",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "justice.jpg",
                    "img_cred": "https://flic.kr/p/Ky8Wgq"
                  },
                  {
                    "id": "RI-16-00-00-00",
                    "name": "Rights of people who have been Trafficked",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "justice.jpg",
                    "img_cred": "https://flic.kr/p/Ky8Wgq"
                  }
                ]
    },
    {
    "id": "CO-00-00-00-00",
    "name": "Court and Lawyers",
    "description": "This category covers the logistics of how a person can interact with a lawyer or the court system. It applies to discussions of procedure, rules, and other practical matters about dealing with these systems.",
    "name_avvo": "lawsuits-disputes-lawyer",
    "name_CL": "Courts and Lawyers",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "CO-02-00-00-00",
                    "name": "Self-Help Resources to understand legal issues",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CO-03-00-00-00",
                    "name": "Representing oneself as Pro Se",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CO-06-00-00-00",
                    "name": "Legal Research",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CO-07-00-00-00",
                    "name": "Going to court and dealing with procedure",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CO-09-00-00-00",
                    "name": "Finding and hiring a lawyer to help you",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "CR-00-00-00-00",
    "name": "Crime & Prisons",
    "description": "This category covers issues in the criminal system including when people are charged with crimes, go to a criminal trial, go to prison, or are a victim of a crime.",
    "name_avvo": "criminal-defense-lawyer",
    "name_CL": "Crime and Prisons",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "CR-01-00-00-00",
                    "name": "Being a victim or witness to a crime",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CR-04-00-00-00",
                    "name": "Getting and having a lawyer in a criminal case",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CR-06-00-00-00",
                    "name": "Criminal Records",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CR-07-00-00-00",
                    "name": "Death Penalty",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CR-10-00-00-00",
                    "name": "Juvenile Justice",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CR-14-00-00-00",
                    "name": "Reentry after prison",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "CR-15-00-00-00",
                    "name": "Prisoners&rsquo; rights, services, and conditions",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-07-00-00-00",
                    "name": "Domestic Violence and Abuse",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "DI-00-00-00-00",
    "name": "Disaster Relief",
    "description": "This category covers issues related to natural disasters, including people's rights, getting benefits and assistance, clearing title to property, and dealing with insurance.",
    "name_avvo": "government-lawyer",
    "name_CL": "Disaster Relief",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "BU-07-00-00-00",
                    "name": "Help for Small Businesses after a Disaster",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "HO-10-00-00-00",
                    "name": "Housing after a Disaster",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "ED-00-00-00-00",
    "name": "Education",
    "description": "This category covers issues around school, including accommodations for special needs, discrimination, student debt, discipline, and other issues in education.",
    "name_avvo": "government-lawyer",
    "name_CL": "Education",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "ED-01-00-00-00",
                    "name": "Adult continuing education",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ED-03-00-00-00",
                    "name": "Paying for education",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ED-04-00-00-00",
                    "name": "Discipline, expulsion, or suspension from school",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ED-05-00-00-00",
                    "name": "Discrimination and access to education",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ED-06-00-00-00",
                    "name": "Privacy at school",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ED-07-00-00-00",
                    "name": "Students with disabilities",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ED-08-00-00-00",
                    "name": "School residency or enrollment",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ED-09-00-00-00",
                    "name": "Standards, testing, and requirements",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "NA-06-00-00-00",
                    "name": "Education issues for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "EN-00-00-00-00",
    "name": "Environmental Justice",
    "description": "This category covers issues around pollution, hazardous waste, poisons, and other issues with the environment.",
    "name_avvo": "lawsuits-disputes-lawyer",
    "name_CL": "Environmental Justice",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "HE-06-00-00-00",
                    "name": "Health issues from living conditions",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "ES-00-00-00-00",
    "name": "Estates & Wills",
    "description": "This category covers planning for end-of-life and special circumstances, including the wills, powers of attorney, advance directives, trusts, and other estate issues that people and families deal with.",
    "name_avvo": "estate-planning-lawyer",
    "name_CL": "Estates and Wills",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "ES-01-00-00-00",
                    "name": "Estate Planning and writing a will",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ES-02-00-00-00",
                    "name": "Dealing with an estate after a death",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ES-03-00-00-00",
                    "name": "Guardianship and Conservatorship",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ES-04-00-00-00",
                    "name": "Trusts",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ES-05-00-00-00",
                    "name": "Power of Attorney, Advance Directives, and Living Wills",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ES-06-00-00-00",
                    "name": "Funeral and Burial Issues",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ES-07-00-00-00",
                    "name": "Estate Planning for Military",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "FA-00-00-00-00",
    "name": "Family",
    "description": "This category covers issues that arise within a family, like divorce, adoption, name change, guardianship, domestic violence, child custody, and other issues.",
    "name_avvo": "family-lawyer",
    "name_CL": "Family",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "CR-10-00-00-00",
                    "name": "Juvenile Justice",
                    "description": "About minors who are in criminal proceedings, or dealing with discipline in school, including getting advocates and support.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "ES-03-00-00-00",
                    "name": "Guardianship and Conservatorship",
                    "description": "About getting decision-making authority over an adult or child's funds, health care, school enrollment, estate, and other concerns.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-01-00-00-00",
                    "name": "Adoption",
                    "description": "About adopting a child or adult, challenging an adoption, and other family members' rights around an adoption.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-02-00-00-00",
                    "name": "Birth Certificates and Identity Documents",
                    "description": "About getting certificates, cards, licenses, and other official documentation to prove something about yourself or someone else.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-04-00-00-00",
                    "name": "Child Custody and Parenting Plans",
                    "description": "About making child custody orders and parenting plans, modifying it and enforcing it, getting visitation for different family members, and dealing with abductions by a family member.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-05-00-00-00",
                    "name": "Child Support",
                    "description": "About creating child support orders, modifying and enforcing them, paying for other children's' expenses, and claiming children's expenses on taxes.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-06-00-00-00",
                    "name": "Divorce, Separation, and Annulment",
                    "description": "About filing for divorce, separation, or annulment, getting spousal support, splitting money and property, and following the court processes.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-07-00-00-00",
                    "name": "Domestic Violence and Abuse",
                    "description": "About getting protective orders, enforcing them, understanding abuse, reporting abuse, and getting resources and status if there is abuse.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-08-00-00-00",
                    "name": "Emancipation",
                    "description": "About a minor who requests to be emancipated from their parents, contesting it, rights afterward, and other situations of children (including adult children) breaking away from their parents.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-09-00-00-00",
                    "name": "Foster Care",
                    "description": "About getting foster care for children, and family members' rights in a foster care situation.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-10-00-00-00",
                    "name": "Marriages and civil unions",
                    "description": "About getting married or forming civil unions, getting a certificate to prove the union, and changing names for it.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-11-00-00-00",
                    "name": "Name or Gender Change",
                    "description": "About changing one's name or gender assignment.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-12-00-00-00",
                    "name": "Paternity",
                    "description": "About establishing paternity of a child, or responding to a paternity case filed against one.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-14-00-00-00",
                    "name": "Parental Rights (and Termination)",
                    "description": "About terminating parental rights, reporting child abuse or neglect, prisoners' parental rights, and reunification services for parents and children.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-15-00-00-00",
                    "name": "Elder Abuse",
                    "description": "About financial or physical abuse of elders, and evictions and rental house issues for the elderly.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "NA-03-00-00-00",
                    "name": "Family and child support for Native Americans",
                    "description": "About divorce and custody issues for Native Americans, and the Indian Child Welfare Act.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "GO-00-00-00-00",
    "name": "Government services",
    "description": "This category covers services that people request from the government, including licenses for firearms, businesses, and hunting, as well as requests for information, and other privileges from the government.",
    "name_avvo": "government-lawyer",
    "name_CL": "Government Services",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "MO-09-00-00-00",
                    "name": "Taxes",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "HE-00-00-00-00",
    "name": "Health",
    "description": "This category covers problems that arise when getting medical treatment, paying medical bills, being in a hospital or nursing home, or other issues.",
    "name_avvo": "personal-injury-lawyer",
    "name_CL": "Health",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "HE-03-00-00-00",
                    "name": "Problems with medical or nursing home care",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "HE-04-00-00-00",
                    "name": "Getting Nursing Home Care",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "HE-05-00-00-00",
                    "name": "Medical Records and Privacy",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "HE-06-00-00-00",
                    "name": "Health issues from living conditions",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "HE-07-00-00-00",
                    "name": "Workers with health or disability issues",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-02-00-00-00",
                    "name": "Paying for medical care",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "NA-09-00-00-00",
                    "name": "Health Care for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "RI-03-00-00-00",
                    "name": "Disability Rights",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "HO-00-00-00-00",
    "name": "Housing",
    "description": "This category covers issues with paying your rent or mortgage, landlord-tenant issues, housing subsidies and public housing, eviction, and other problems with your apartment, mobile home, or house.",
    "name_avvo": "real-estate-lawyer",
    "name_CL": "Housing %26 Real Estate",
    "img": "housing.jpg",
    "img_cred": "https://flic.kr/p/HdCzCt",
    "children": [
                  {
                    "id": "HO-01-00-00-00",
                    "name": "Discrimination around housing",
                    "description": "About how a person may be protected from discrimination based on certain characteristics, and what the law is.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-02-00-00-00",
                    "name": "Eviction from a home",
                    "description": "About landlords removing a tenant through a lawsuit or force, ways to counter an eviction, or being removed from a shelter, subsidized housing, a group home.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-03-00-00-00",
                    "name": "Housing Assistance and Subsidized Housing",
                    "description": "About financial support for housing, including vouchers, subsidized housing, Section 8, and the standards and procedures of living in subsidized housing (or being removed from it).",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-04-00-00-00",
                    "name": "Buying a Home",
                    "description": "About the process of buying a home, coop, condo, mobile home -- and dealing with problems with the purchase.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-05-00-00-00",
                    "name": "Problems with living conditions",
                    "description": "About problems that people have where they live, including health issues, environmental issues, security, and other habitability issues with an individual home or neighborhood.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-06-00-00-00",
                    "name": "Renting or leasing a home",
                    "description": "About the process of renting or leasing a home, and problems that may come up while renting a home, mobile home, or while living in a group home or homeless shelter.",
                    "name_avvo": "Renting or leasing a home",
                    "name_CL": "Renting or leasing a home",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-07-00-00-00",
                    "name": "Utilities, Energy, and Heating at home",
                    "description": "About electric, energy, gas, and water utilities at home, including financial assistance, utilities being shut off, payment to them, or terminating them.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-08-00-00-00",
                    "name": "Foreclosure on a Home",
                    "description": "About problems with homes you own or live in, that are going into foreclosure, how to defend against it, and the court process around it.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-09-00-00-00",
                    "name": "Owning a Home",
                    "description": "About issues for homeowners, like with improvements, contractors, neighbors, mortgages, taxes, and titles.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  },
                  {
                    "id": "HO-10-00-00-00",
                    "name": "Housing after a Disaster",
                    "description": "About owning, clearing title, rebuilding, and insuring a home when you have experienced or at risk of a natural disaster.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "housing.jpg",
                    "img_cred": "https://flic.kr/p/HdCzCt"
                  }
                ]
    },
    {
    "id": "IM-00-00-00-00",
    "name": "Immigration",
    "description": "This category covers visas, asylum, green cards, citizenship, migrant work and benefits, and other issues faced by people who are not full citizens in the US.",
    "name_avvo": "immigration-lawyer",
    "name_CL": "Immigration",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "IM-01-00-00-00",
                    "name": "Deportation or Removal of immigrants",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-02-00-00-00",
                    "name": "Detention of immigrants",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-03-00-00-00",
                    "name": "Benefits for immigrants",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-04-00-00-00",
                    "name": "Options for immigration status, work permits, and travel papers",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-05-00-00-00",
                    "name": "Political asylum",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-07-00-00-00",
                    "name": "Sponsoring an immigrant",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-08-00-00-00",
                    "name": "Border searches",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-11-00-00-00",
                    "name": "Undocumented immigrants",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "IM-12-00-00-00",
                    "name": "Immigration options for victims of domestic violence",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "RI-16-00-00-00",
                    "name": "Rights of people who have been Trafficked",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "MO-00-00-00-00",
    "name": "Money, Debt, and Consumer Issues",
    "description": "This category covers issues people are face regarding money, insurance, consumer goods and contracts.",
    "name_avvo": "consumer-protection-lawyer",
    "name_CL": "Money, Debt, and Consumer Issues",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "ED-03-00-00-00",
                    "name": "Paying for education",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "FA-05-00-00-00",
                    "name": "Child Support",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-02-00-00-00",
                    "name": "Paying for medical care",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-06-00-00-00",
                    "name": "Identity Theft and Lost Credit Cards",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-07-00-00-00",
                    "name": "Insurance",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-09-00-00-00",
                    "name": "Taxes",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-10-00-00-00",
                    "name": "Small Claims actions",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-11-00-00-00",
                    "name": "Discrimination against a customer",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-13-00-00-00",
                    "name": "Bankruptcy",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  },
                  {
                    "id": "MO-14-00-00-00",
                    "name": "Door-to-door solicitation and Telemarketing",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                  }
                ]
    },
    {
    "id": "NA-00-00-00-00",
    "name": "Native American Issues and Tribal Law",
    "description": "This category covers issues and laws specific to Native Americans and indigenous populations.",
    "name_avvo": "native-peoples-law-lawyer",
    "name_CL": "Native American Issues and Tribal Law",
    "img": "window_rock.jpg",
    "img_cred": "https://flic.kr/p/fKXvwT",
    "children": [
                  {
                    "id": "NA-01-00-00-00",
                    "name": "Government and lands of Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-02-00-00-00",
                    "name": "Native-based legal services",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-03-00-00-00",
                    "name": "Family and child support for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-04-00-00-00",
                    "name": "Tribal enrollment",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-05-00-00-00",
                    "name": "Native American crime victims",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-06-00-00-00",
                    "name": "Education issues for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-07-00-00-00",
                    "name": "Benefits for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-08-00-00-00",
                    "name": "Rights and protections for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  },
                  {
                    "id": "NA-09-00-00-00",
                    "name": "Health Care for Native Americans",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "window_rock.jpg",
                    "img_cred": "https://flic.kr/p/fKXvwT"
                  }
                ]
    },
    {
    "id": "BU-00-00-00-00",
    "name": "Small Business and IP",
    "description": "This category covers issues faced by people who run small businesses or nonprofits, including around incorporation, licenses, taxes, regulations, and other concerns.",
    "name_avvo": "intellectual-property-lawyer",
    "name_CL": "Business and Intellectual Property",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                    {
                      "id": "BU-01-00-00-00",
                      "name": "Business and Occupational Licenses",
                      "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BU-03-00-00-00",
                      "name": "Running a farm business",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BU-04-00-00-00",
                      "name": "Intellectual Property",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BU-05-00-00-00",
                      "name": "Owning or running a for-profit business",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BU-06-00-00-00",
                      "name": "Running a Nonprofit",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    },
                    {
                      "id": "BU-07-00-00-00",
                      "name": "Help for Small Businesses after a Disaster",
                      "description": "",
                      "name_avvo": "",
                      "name_CL": "",
                      "img": "court.jpg",
                      "img_cred": "https://flic.kr/p/7hgoPp"
                    }
                  ]
    },
    {
    "id": "TR-00-00-00-00",
    "name": "Traffic and Cars",
    "description": "This category covers problems with traffic and parking tickets, fees, and other issues experienced with the traffic system.",
    "name_avvo": "speeding-traffic-ticket-lawyer",
    "name_CL": "Traffic and Cars",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/4roETU",
    "children": [
                  {
                    "id": "TR-01-00-00-00",
                    "name": "Getting injured in or by a car",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "TR-02-00-00-00",
                    "name": "Dealing with traffic and parking tickets",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "TR-03-00-00-00",
                    "name": "Driver's licenses or permits",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "TR-04-00-00-00",
                    "name": "Ownership issues of a car",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "TR-05-00-00-00",
                    "name": "Car insurance",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  }
                ]
    },
    {
    "id": "VE-00-00-00-00",
    "name": "Veterans & Military",
    "description": "This category covers issues, laws, and services specific to people who have served in the military.",
    "name_avvo": "military-law-lawyer",
    "name_CL": "Veterans and Military",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "BE-06-00-00-00",
                    "name": "Veterans Affairs (VA) benefits",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "ES-07-00-00-00",
                    "name": "Estate Planning for Military",
                    "description": "",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  }
                ]
    },
    {
    "id": "WO-00-00-00-00",
    "name": "Work and Employment",
    "description": "This category covers issues related to working at a job, including discrimination and harassment, worker's compensation, worker's rights, unions, getting paid, pensions, being fired, and more.",
    "name_avvo": "employment-labor-lawyer",
    "name_CL": "Work and Employment Law",
    "img": "court.jpg",
    "img_cred": "https://flic.kr/p/7hgoPp",
    "children": [
                  {
                    "id": "BE-04-00-00-00",
                    "name": "Unemployment Compensation and Insurance",
                    "description": "About dealing with Unemployment benefit compensation and insurance, including eligibility, application, disqualification, and other matters.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-01-00-00-00",
                    "name": "Applying and interviewing for a job",
                    "description": "About issues that might arise while a person is trying to get a job, including rights and discrimination, background checks, criminal records, drug testing, affirmative action, and inappropriate behavior.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-02-00-00-00",
                    "name": "Problems at a Current Job",
                    "description": "About problems that might arise while working at a job, including around proper payment and benefits, discrimination, inappropriate behavior, health issues and disabilities, immigration, training, and more.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-03-00-00-00",
                    "name": "Problems regarding a Former Job",
                    "description": "About the period after leaving a job, including being fired or quitting, severance agreements, non-compete contracts, references, personnel files, getting back pay, and harassment.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-04-00-00-00",
                    "name": "Retirement and Pensions",
                    "description": "About getting payments and benefits after retiring a job or end of career, including around ERISA, vesting of benefits, managers of benefits, and railroad retirement.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-05-00-00-00",
                    "name": "Unions",
                    "description": "About forming unions, joining them, rights as a union member, dealing with possible problems, and opting out of a union.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-06-00-00-00",
                    "name": "Volunteering or interning at a job",
                    "description": "About rights and duties of people who are interning or volunteering at a job.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-07-00-00-00",
                    "name": "Being injured on the job",
                    "description": "About health and physical injuries that happen to an employee while on the job, including how to report it, how to get workers compensation coverage for it.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-08-00-00-00",
                    "name": "Discrimination around work and employment",
                    "description": "About possible discrimination around employment, based on disability, ethnicity, gender, marital status, race, religion, sexual harassment, sexual orientation, or age.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  },
                  {
                    "id": "WO-09-00-00-00",
                    "name": "Employment in prison",
                    "description": "About opportunities to work while in a prison.",
                    "name_avvo": "",
                    "name_CL": "",
                    "img": "court.jpg",
                    "img_cred": "https://flic.kr/p/4roETU"
                  }
                ]
    }
  ]
}
