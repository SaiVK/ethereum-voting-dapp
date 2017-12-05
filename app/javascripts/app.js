// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import vote_artifacts from '../../build/contracts/Vote.json'

var Vote = contract(vote_artifacts);

window.addCandidate = function(candidate){
  let candidateName = $("#candidate").val();
  $("#candidate").val("");
  try {
    Vote.deployed().then(function(contractInstance) {
      contractInstance.addCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function(x) {
        contractInstance.getLastCandidate.call().then(function(v) {
          var candidate = window.web3.toAscii(v);
          contractInstance.getNumberOfVotes.call(candidate).then(function(z) {
            $("#lista-candidatos").find('tbody').append($('<tr>').append($('<td>' + candidate + '</td><td id="'+ window.web3.toUtf8(v).replace(/\s/g, '') +'">'+ z +'</td><td><button class="btn btn-primary btn-small" onclick="voteForCandidate(\''+ window.web3.toUtf8(v) +'\')">+</button></td>' )));
          });
       });
       $('#hash-transacao').html(x.receipt.transactionHash);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.voteForCandidate = function(candidate){
  try {
    Vote.deployed().then(function(contractInstance) {
      contractInstance.voteForCandidate(candidate, {gas: 140000, from: web3.eth.accounts[0]}).then(function(x) {
        contractInstance.getNumberOfVotes.call(candidate).then(function(v) {
          var id = candidate.replace(/\s/g, '')
          $('#'+id).html(v.toString());
       });
       $('#hash-transacao').html(x.receipt.transactionHash);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

$( document ).ready(function() {
  $('.nav-tabs a:first').tab('show');
  $('.nav-tabs a[href="#add"]').tab('show');

  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Vote.setProvider(window.web3.currentProvider);

  try {
    Vote.deployed().then(function(contractInstance) {
        contractInstance.getCandidates.call().then(function(v) {
          jQuery.each(v, function(index, item) {
            if(item === "0x0000000000000000000000000000000000000000000000000000000000000000"){
              return false;
            }
            var candidate = window.web3.toAscii(item);
            contractInstance.getNumberOfVotes.call(candidate ).then(function(z) {
              $("#lista-candidatos").find('tbody')
              .append($('<tr>').append($('<td>' + candidate + '</td><td id="'+ window.web3.toUtf8(item).replace(/\s/g, '') +'">'+ z +'</td><td><button class="btn btn-primary btn-small" onclick="voteForCandidate(\''+ window.web3.toUtf8(item) +'\')">+</button></td>' )));
            });
          });
       });
    });
  } catch (err) {
    console.log(err);
  }
});