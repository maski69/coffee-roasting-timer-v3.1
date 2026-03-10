window.onload=function() {
  var start = 0;
  var stop = 0;
  var interval = 0;
  var fcInterval = 0;
  var yellowInterval = 0;
  var timerRunning = 0;
  var yellowMark = 0;
  var firstCrack = 0;
  var startTime = 0;
  var yellowTime = 0;
  var firstCrackTime = 0;
  var dropTime = 0;

  function yellow() {
    if (start != 0 && timerRunning == 1) {
      yellowTime = Date.now();
      yellowMark = yellowTime;
      var dryingAtYellow = (yellowMark - startTime) / 1000;
      $("#yellow-time").text("Yellow Starts: " + timeToString(yellowMark - start));
      $("#drying").text("Drying Total Time: " + formatTime(dryingAtYellow));
      $("#drying-percent").text("Drying %: 100.0%");
      $("#maillard-percent, #yellow-percent").removeClass("label-warning");
      $("#maillard-percent, #yellow-percent").removeClass("label-danger");
      $("#maillard-percent, #yellow-percent").text("Maillard %: 0.0%");
      updatePhases();

      if (yellowInterval != 0) {
        clearInterval(yellowInterval);
      }
      yellowInterval = setInterval(function() {
        // Keep phase-derived values (like Drying %) live while roast is running.
        updatePhases();
      }, 1000);
    }
  }

  function drop() {
    if (start != 0 && timerRunning == 1 && dropTime == 0) {
      finalizeRoast(Date.now());
    }
  }

  function finalizeRoast(finalTime) {
    dropTime = finalTime;

    if (yellowTime == 0 && startTime) {
      yellowTime = dropTime;
      $("#yellow-time").text("Yellow Starts: " + timeToString(yellowTime - start));
    }

    updatePhases();

    if (firstCrackTime && startTime) {
      var finalDevelopment = (dropTime - firstCrackTime) / 1000;
      var finalTotal = (dropTime - startTime) / 1000;
      var finalDevPercent = 0;

      if (finalTotal > 0) {
        finalDevPercent = (finalDevelopment / finalTotal * 100).toFixed(2);
      }
      $("#development-time").text("Development %: " + finalDevPercent + "%");
    } else {
      $("#development-time").text("Development %: n/a (set First Crack)");
      if (startTime) {
        $("#drying").text("Drying Total Time: " + formatTime((dropTime - startTime) / 1000));
        $("#drying-percent").text("Drying %: 100.0%");
        $("#maillard-percent, #yellow-percent").text("Maillard %: 0.0%");
      }
      $("#maillard").text("Maillard Total Time: n/a");
      $("#development").text("Development (Time): n/a");
    }

    if (fcInterval != 0) {
      clearInterval(fcInterval);
    }
    if (yellowInterval != 0) {
      clearInterval(yellowInterval);
    }
  }
  
  $("#start-button").click(function() {
    if (interval == 0) {
      start = new Date().getTime();
      startTime = Date.now();
    }
  
    if (timerRunning == 1) {
      drop();
      timerRunning = 2;
      stop = new Date().getTime();
      $(this).text("Reset");
      $(this).removeClass("btn-danger");
      $(this).addClass("btn-warning");
  
      clearInterval(interval);
      clearInterval(fcInterval);
      clearInterval(yellowInterval);
    } else if (timerRunning == 2) {
      start = 0;
      stop = 0;
      interval = 0;
      fcInterval = 0;
      yellowInterval = 0;
      timerRunning = 0;
      yellowMark = 0;
      firstCrack = 0;
      startTime = 0;
      yellowTime = 0;
      firstCrackTime = 0;
      dropTime = 0;
      $(this).text("Start");
      $(this).removeClass("btn-warning");
      $(this).addClass("btn-primary");
      $(".jumbotron h1#timer").text("00:00");
      $("#yellow-time").text("Yellow Starts: ");
      $("#maillard-percent, #yellow-percent").text("Maillard %: ");
      $("#maillard-percent, #yellow-percent").removeClass("label-warning");
      $("#maillard-percent, #yellow-percent").removeClass("label-danger");
      $("#first-crack").text("First Crack Starts: ");
      $("#development-time").text("Development %: ");
      $("#development-time").removeClass("label-warning");
      $("#development-time").removeClass("label-danger");
      $("#drying").text("Drying Total Time: ");
      $("#drying-percent").text("Drying %: ");
      $("#maillard").text("Maillard Total Time: ");
      $("#development").text("Development (Time): ");
      $("#lowest").text("15.0%: ");
      $("#lower").text("17.5%: ");
      $("#low").text("20.0%: ");
      $("#mid").text("22.5%: ");
      $("#high").text("25.0%: ");
      $("#weight-loss").text("Weight Loss: ");
      $("#date-timestamp").text("Date: ");
    } else {
      timerRunning = 1;
      $(this).text("Stop");
      $(this).removeClass("btn-primary");
      $(this).addClass("btn-danger");
  
      interval = setInterval(function() {
        $(".jumbotron h1#timer").text(timeToString(new Date().getTime() - start));
      }, 100)
    }
  });

  $("#yellow-button").click(function() {
    yellow();
  });
  
  $("#first-crack-button").click(function() {
    if (start != 0 && timerRunning == 1) {
      firstCrackTime = Date.now();
      firstCrack = firstCrackTime;
      $("#first-crack").addClass("label-success");
      $("#first-crack").text("First Crack Starts: " + timeToString(firstCrack - start));
      $("#firstCrackButtons").toggle();
      $("#development-time").removeClass("label-warning");
      $("#development-time").removeClass("label-danger");
      updatePhases();

      if (yellowTime && startTime) {
        var maillardAtFirstCrack = (firstCrackTime - yellowTime) / 1000;
        var totalAtFirstCrack = (firstCrackTime - startTime) / 1000;
        var maillardPercentAtFirstCrack = 0;

        if (totalAtFirstCrack > 0) {
          maillardPercentAtFirstCrack = (maillardAtFirstCrack / totalAtFirstCrack * 100).toFixed(1);
        }

        $("#maillard").text("Maillard Total Time: " + formatTime(maillardAtFirstCrack));
        $("#maillard-percent, #yellow-percent").text("Maillard %: " + maillardPercentAtFirstCrack + "%");
      }
  
      if (fcInterval != 0) {
        clearInterval(fcInterval); 
      }

      if (yellowInterval != 0) {
        clearInterval(yellowInterval);
      }

      fcInterval = setInterval(function() {
        var firstCrackMillis = firstCrack - start;
        var firstCrackSeconds = Math.floor(firstCrackMillis / 1000);
        var currentTimeMillis = new Date().getTime() - start;
        var currentTimeSeconds = Math.floor(currentTimeMillis / 1000);
        var developmentTime = ((1 - (firstCrackSeconds / currentTimeSeconds)) * 100).toFixed(2);
  
        $("#development-time").text("Development %: " + developmentTime + "%");
        if (developmentTime > 15) {
          $("#development-time").addClass("label-warning");
        }
        if (developmentTime > 20) {
          $("#development-time").addClass("label-danger");
        }
      }, 1000)
  
      var developmentTimeMillis = firstCrack - start;
      $("#lowest").text("15.0%: " + timeToString(developmentTimeMillis / .85));
      $("#lower").text("17.5%: " + timeToString(developmentTimeMillis / .825));
      $("#low").text("20.0%: " + timeToString(developmentTimeMillis / .8));
      $("#mid").text("22.5%: " + timeToString(developmentTimeMillis / .775));
      $("#high").text("25.0%: " + timeToString(developmentTimeMillis / .75));
    }
  });

  $("#drop-button").click(function() {
    drop();
  });

  $("#calc-button").click(function() {
    var greenWeight = $("#green-weight").val() || 0;
    var roastWeight = $("#roast-weight").val() || 0;
    $("#weight-loss").text("Weight Loss: " + calcWeightLoss(greenWeight, roastWeight) + "%");
    $("#date-timestamp").text("Date: " + new moment().format('MMM Do YYYY, h:mm:ss a'));
  });

  function calcWeightLoss(greenWeight, roastWeight) {
    var weightLoss = 0;

    if (greenWeight != 0 && roastWeight !=0) {
      weightLoss = 100*((greenWeight - roastWeight)/greenWeight);
    }

    return weightLoss.toFixed(2);
  }

  function updatePhases() {
    if (yellowTime && startTime) {
      var drying = (yellowTime - startTime) / 1000;
      var totalForDryingPercent = ((dropTime || Date.now()) - startTime) / 1000;
      var maillardEndTime = firstCrackTime || dropTime || Date.now();
      var maillard = (maillardEndTime - yellowTime) / 1000;
      var totalForMaillardPercent = ((dropTime || Date.now()) - startTime) / 1000;
      var dryingPercent = 0;
      var maillardPercent = 0;

      if (totalForDryingPercent > 0) {
        dryingPercent = (drying / totalForDryingPercent * 100).toFixed(1);
      }

      if (totalForMaillardPercent > 0) {
        maillardPercent = (maillard / totalForMaillardPercent * 100).toFixed(1);
      }

      $("#drying").text("Drying Total Time: " + formatTime(drying));
      $("#drying-percent").text("Drying %: " + dryingPercent + "%");
      $("#maillard").text("Maillard Total Time: " + formatTime(maillard));
      $("#maillard-percent, #yellow-percent").text("Maillard %: " + maillardPercent + "%");
    }

    if (dropTime && firstCrackTime && startTime) {
      var development = (dropTime - firstCrackTime) / 1000;

      $("#development").text("Development (Time): " + formatTime(development));
    }
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  
  function timeToString(millis) {
    millis = Math.round(millis);
    var timeSeconds = Math.floor(millis / 1000);
    var timeMinutes = Math.floor(timeSeconds / 60);

    if (timeSeconds > 59) {
      timeSeconds = timeSeconds - (timeMinutes * 60);
    }
    if (timeSeconds < 10) {
      timeSeconds = "0" + timeSeconds;
    }
    if (timeMinutes < 10) {
      timeMinutes = "0" + timeMinutes;
    }
  
    return timeMinutes + ":" + timeSeconds;
  }
}
