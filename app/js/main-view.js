// anonymous, self-invoking function to limit scope
(function() {
  var MainView = {};

  MainView.render = function($body) {
    const homeButton = document.querySelector('#homeButton')
    homeButton.addEventListener('click', function(){
      $body.find('#create-view').css("display", "none");    
      DepositView.render($body.find('#deposit-view'));
    });
    DepositView.render($body.find('#deposit-view'));
  };
  console.log("hi")

  window.MainView = MainView;
})();
