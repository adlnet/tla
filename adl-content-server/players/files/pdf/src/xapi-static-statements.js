(function(ADL){

    var debug = true;
    var log = function(message)
    {
      if (!debug) return false;
      try
      {
        console.log(message);
        return true;
      }
      catch(e) { return false; }
    }

    XAPIStaticStatements = function() {

      var actor = {"mbox":"mailto:anon@example.com", "name":"anonymous"};
      var videoActivity = {};

      this.changeConfig = function(options) {
        actor = options.actor;
        videoActivity = options.videoActivity;
      }

      this.onPlayerReady = function(event) {
        var message = "yt: player ready";
        log(message);
        ADL.XAPIStaticStatements.onPlayerReadyCallback(message);
      }

      this.onStateChange = function(event) {
        var curTime = player.getCurrentTime().toString();
        var ISOTime = "PT" + curTime.slice(0, curTime.indexOf(".")+3) + "S";
        var stmt = null;
        var e = "";
        switch(event.data) {
          case -1:
            e = "unstarted";
            log("yt: " + e);
            break;
          case 0:
            e = "ended";
            log("yt: " + e);
            stmt = completedContent(ISOTime);
            break;
          case 1:
            e = "passed";
            log("yt: " + e);
            stmt = passedContent(ISOTime);
            break;
          case 2:
            e = "paused";
            log("yt: " + e);
            stmt = pauseContent(ISOTime);
            break;
          case 3:
            e = "failed";
            log("yt: " + e);
            stmt = failedContent(ISOTime);
            break;
          case 4:
            e = "initialized";
            log("yt: " + e);
            stmt = initializedContent(ISOTime);
            break;
          case 5:
            e = "terminated";
            log("yt: " + e);
            stmt = terminatedContent(ISOTime);
            break;
          case 6:
            e = "suspended";
            log("yt: " + e);
            stmt = suspendedContent(ISOTime);
            break;
          case 7:
            e = "resumed";
            log("yt: " + e);
            stmt = resumedContent(ISOTime);
            break;
          case 8:
            e = "preferred";
            log("yt: " + e);
            stmt = preferredContent(ISOTime);
            break;
          case 9:
            e = "answered";
            log("yt: " + e);
            stmt = answeredContent(ISOTime);
            break;
          case 10:
            e = "recommended";
            log("yt: " + e);
            stmt = recommendedContent(ISOTime);
            break;
          case 11:
            e = "rated";
            log("yt: " + e);
            stmt = ratedContent(ISOTime);
            break;
          case 12:
            e = "voided";
            log("yt: " + e);
            stmt = voidedContent(ISOTime);
            break;
          default:
            break;
        }
        ADL.XAPIStaticStatements.onStateChangeCallback(e, stmt);
      }

      function buildStatement(stmt) {
        var stmt = stmt;
        stmt.actor = actor;
        stmt.object = staticActivity;
        return stmt;
      }

      function passedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.passed;
        return buildStatement(stmt);
      }

      function failedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.failed;
        return buildStatement(stmt);
      }

      function pauseContent(ISOTime) {
        var stmt = {};

        stmt.verb = ADL.verbs.suspended;
        stmt.result = {"extensions":{"resultExt:paused":ISOTime}};

        /*if (competency) {
            stmt["context"] = {"contextActivities":{"other" : [{"id": "compID:" + competency}]}};
        }*/
        return buildStatement(stmt);
      }

      function completedContent(ISOTime) {
        var stmt = {};

        stmt.verb = ADL.verbs.completed;
        stmt.result = {"duration":ISOTime, "completion": true};

        /*if (competency) {
            stmt["context"] = {"contextActivities":{"other" : [{"id": "compID:" + competency}]}};
        }*/
        return buildStatement(stmt);
      }

      function initializedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.initialized;
        return buildStatement(stmt);
      }

      function terminatedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.terminated;
        return buildStatement(stmt);
      }

      function suspendedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.suspended;
        return buildStatement(stmt);
      }

      function resumedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.resumed;
        return buildStatement(stmt);
      }

      function preferredContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.resumed;
        return buildStatement(stmt);
      }

      function answeredContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.answered;
        return buildStatement(stmt);
      }

      function recommendedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.recommended;
        return buildStatement(stmt);
      }

      function ratedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.rated;
        return buildStatement(stmt);
      }

      function voidedContent(ISOTime) {
        var stmt = {};
          stmt.verb = ADL.verbs.voided;
        return buildStatement(stmt);
      }

    }

    ADL.XAPIStaticStatements = new XAPIStaticStatements();

    ADL.XAPIStaticStatements.onPlayerReadyCallback = function(message) {};
    ADL.XAPIStaticStatements.onStateChangeCallback = function(stmt) {};

}(window.ADL = window.ADL || {}));
