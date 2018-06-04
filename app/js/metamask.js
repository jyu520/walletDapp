function app() {
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
    web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
    console.log("Using web3 version: " + Web3.version);
	
	var contract;
	var contractAddress;

	var userAccount;
	var divisor = 1000000000000000000;
  
    var contractDataPromise = $.getJSON('build/contracts/DIY.json');
    var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
	var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts

    Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
      .then(function initApp(results) {
        var contractData = results[0];
        var networkId = results[1];
        var accounts = results[2];
		userAccount = accounts[0];
		console.log(userAccount)
  
		// (todo) Make sure the contract is deployed on the network to which our provider is connected
		if (!(networkId in contractData.networks)) {
			throw new Error("Contract not found in selected Ethereum network on MetaMask.");
		}
  
        contractAddress = contractData.networks[networkId].address;
        contract = new web3.eth.Contract(contractData.abi, contractAddress);
      })
      .then(refreshBalance)
	  .catch(console.error);

    function refreshBalance() { // Returns web3's PromiEvent
		// Calling the contract (try with/without declaring view)
		contract.methods.ethBalanceOf(userAccount).call().then(function (balance) {
		balance = (balance / divisor).toFixed(2)
		console.log(userAccount, balance)
		$('#display').attr("balance", Number(balance));
		$('#display').text(balance + " ETH");
		});
		
		contract.methods.ethBalanceOf(contractAddress).call().then(function (balance) {
		balance = (balance / divisor).toFixed(2)
		console.log(contractAddress, balance)
		$('#ethDisplay').text("Your Index Balance: " + balance + " ETH");
		$('#ethDisplay').attr("balance", Number(balance));
		$("#loader").hide();
		});

	}

	function deposit(amount){
		console.log("depositing " + amount + " eth to smart contract")
		// var etherAmount = web3.utils.toBN(amount);
		var weiValue = web3.utils.toWei(amount,'ether');
		contract.methods.deposit().send({from: userAccount, value:weiValue})
		.then(refreshBalance)
		.catch(function (e) {
			$("#loader").hide();
			web3.eth.getBalance(contractAddress, (err, balance) => {
			balance = web3.utils.fromWei(balance, "ether") + " ETH"
			console.log(balance)
			})
		});
	}
	

	function withdraw(amount){
		console.log("withdrawing " + amount + " eth to metamask")
		// var etherAmount = web3.utils.toBN(amount);
		var weiValue = web3.utils.toWei(amount,'ether');
		
		contract.methods.withdraw(weiValue).send({from: userAccount})
		.then(refreshBalance)
		.catch(function (e) {
			$("#loader").hide();
			web3.eth.getBalance(contractAddress, (err, balance) => {
			balance = web3.utils.fromWei(balance, "ether") + " ETH"
			console.log(balance)
			})
		});

	}  
	
	$("#deposit").click(function(){
		let amount = $("#eth_value").val()
		deposit(amount);
	})

	$("#withdraw").click(function(){
		let amount = $("#eth_value").val()
		withdraw(amount);
	})

	$("#checkBalance").click(function(){
		web3.eth.getBalance(userAccount, function(err, balance){
			if (err) {
				console.log(`getBalance error: ${err}`);
			} else {
				console.log(`Balance [${userAccount}]: ${web3.utils.fromWei(balance, "ether")}`);
			}
		});
		web3.eth.getBalance(contractAddress, function(err, balance2){
			if (err) {
				console.log(`getBalance error: ${err}`);
			} else {
				console.log(`Balance [${contractAddress}]: ${web3.utils.fromWei(balance2, "ether")}`);
			}
		});
	})

	// var next = 1;
    // $("#b1").click(function(e){
	// 	e.preventDefault();
	// 	var addSel = '#selectToken' + next;
	// 	var addto = "#field" + next;
	// 	var addRemove = "#field" + (next);
	// 	next = next + 1;
	// 	var selButton = '<select id="selectToken' + next + '"></select>';
	// 	var selectButton = $(selButton);
    //     var newIn = '<input autocomplete="off" class="input form-control" placeholder="Enter a numerical percentage" id="field' + next + '" name="field' + next + '" type="text">';
    //     var newInput = $(newIn);
    //     var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
	// 	var removeButton = $(removeBtn);

	// 	$(addto).after(newInput);
	// 	$(addto).after(selectButton);
    //     $(addRemove).after(removeButton);
    //     $("#field" + next).attr('data-source',$(addto).attr('data-source'));
    //     $("#count").val(next);  
        
    //         $('.remove-me').click(function(e){
    //             e.preventDefault();
    //             var fieldNum = this.id.charAt(this.id.length-1);
	// 			var fieldID = "#field" + fieldNum;
	// 			var selectID =  '#selectToken' + fieldNum;
    //             $(this).remove();
	// 			$(fieldID).remove();
	// 			$(selectID).remove();
	// 		});

	// 	getTokens(selectButton[0]);
	// });

	// var select = document.getElementById("selectToken1"); 

	// function getTokens(select){

	// 	var options = [];
	// 	let request = new XMLHttpRequest();
	// 	let url = 'https://api.coinmarketcap.com/v2/ticker/?limit=20';

	// 	request.onreadystatechange = function() {
	// 	  if (this.readyState === 4 && this.status === 200) {
	// 		let response = JSON.parse(this.responseText);
	// 		for (var id in response.data){
	// 			options.push(response.data[id].name);
	// 		}
	// 		for (let i = 0; i < options.length; i++){
	// 			var opt = options[i]
	// 			var el = document.createElement("option");
	// 			el.textContent = opt;
	// 			el.value = opt;
	// 			select.appendChild(el);
	// 		}
	// 	  }
	// 	}
	
	// 	request.open("GET", url, true);
	// 	request.send();

	// }

	// getTokens(select);



}
$(document).ready(app);