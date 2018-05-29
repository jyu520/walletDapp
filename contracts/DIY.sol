pragma solidity ^0.4.21;

contract etherreceiver{       
    function etherreceiver() public{          
    }    
}

contract DIY {
    mapping (address => uint256) public balances;

    // event BalanceChanged(address indexed _address, uint256 _balance);
    address creator;

    // mapping (address => mapping (address => uint256)) public allowance;

    function DIY() public {
        balances[msg.sender] = msg.sender.balance;        // Give the creator initially all the tokens
        creator = msg.sender;
    }

    function deposit() payable returns(bool success){
        balances[msg.sender] += msg.value;
        return true;
    }
    
    function withdraw(uint value) returns(bool success) {
        if(balances[msg.sender] < value) throw;
        balances[msg.sender] -= value;
        msg.sender.transfer(value);
        return true;
    }

    function transfer(address to, uint value) returns(bool success) {
        if(balances[msg.sender] < value) throw;
        balances[msg.sender] -= value;
        to.transfer(value);
        return true;
    }

    function ethBalanceOf(address _owner) public view returns (uint256 balance) {
        return _owner.balance;
    }


    // function withdraw(address _receiver) public returns (bool) {
    //     msg.sender.transfer(msg.value);
    //     emit BalanceChanged(creator, creator.balance);
    //     emit BalanceChanged(_receiver, _receiver.balance);
    //     return true;
    // }

    // function() public payable {
    //     emit BalanceChanged(creator, creator.balance);
    //     approve(creator, msg.value);
    // }



 
    // function withdraw(address _destination, uint256 _value) public returns (bool) {
    //     require(msg.sender == creator);
        // if (_destination.balance >= _value){
        //     _destination.transfer(_value);
        //     return true;
        // }
        // return false;

        // if(!etherreceiver.send(_value)){
        //    return false;
        // }   
    //     return true; 
    // }
    

    // function approve(address _spender, uint256 _value) public
    //     returns (bool success) {
    //     allowance[msg.sender][_spender] = _value;
    //     return true;
    // }

    // function transfer(address _to, uint256 _value) public returns (bool success) {
    //     require(balances[msg.sender] >= _value);
    //     balances[msg.sender] -= _value;
    //     balances[_to] += _value;
    //     emit BalanceChanged(msg.sender, balances[msg.sender]);
    //     emit BalanceChanged(_to, balances[_to]);
    // return true;
    // }

    // function balanceOf(address _owner) public view returns (uint256 balance) {
    //     return balances[_owner];
    // }

    // function mint(uint256 _amount) public returns (bool success) {
    //     require(msg.sender == creator);
    //     totalSupply += _amount;
    //     balances[msg.sender] += _amount;
    //     emit BalanceChanged(msg.sender, balances[msg.sender]);
    // return true;
    // }
}