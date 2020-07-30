pragma solidity ^0.6.0 ;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol' ;

contract ngotoken is ERC20 {
    
    address admin ;
    
    struct  jobDetail {
        address ngo ;
        uint identifier ;
        uint amount ;
        address freelancer ;
        //uint timeposted ;
    }
    
    modifier onlyAdmin() {
        require(admin == msg.sender) ;
        _;
    }
    
    mapping( uint => jobDetail) jobmapping ;
    
    
    
    constructor() ERC20("NGOCoin","NGC") public  {
        admin = msg.sender ;
        _mint(msg.sender,1000) ;
    }
    
    function sendToken(uint _amount, address _ngoaddress) external onlyAdmin {
        
        require( _amount <= balanceOf(msg.sender)) ;
        transfer(_ngoaddress,_amount) ;
        
    }
    
    function createJob(uint _identifier , uint _amount ) public {
        
        require(_amount <= balanceOf(msg.sender)) ;
        jobmapping[_identifier].identifier = _identifier ;
        jobmapping[_identifier].ngo = msg.sender ;
        jobmapping[_identifier].amount = _amount ;
        
        
    }
    
    function finishJob(uint _identifier, address _freelancer) public {
        
        require(jobmapping[_identifier].ngo == msg.sender) ;
        transfer(_freelancer, jobmapping[_identifier].amount) ;
        jobmapping[_identifier].freelancer = _freelancer ;
        
    }
    
}
