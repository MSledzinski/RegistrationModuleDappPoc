pragma solidity ^0.4.23;

contract Registration {

    event UserRegistered(address _address, bytes _name);

    struct User {
        address id;
        bytes32 mailHash; // important: establish comon hash function - sha3
        bytes name;
        uint256 createdAt;
    }

    address public owner;

    mapping (address => User) public users;

    mapping (bytes32 => bytes32) mailHashToChallange;
    mapping (bytes32 => bool) invitedMails;

    mapping (bytes32 => bool) public blacklist;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner required");
        _;
    }

    /**
    * @dev 'ownerOnly' as we need control over sent hashes - otherwise user could create hash herself. can be improved in future with zk
    * mail hash only - not to put raw mails here 
    * assumption all hashes are keccak256, from utf8 encoded data
    */
    function invite(bytes32 _mailHash, bytes32 _challangeHash) onlyOwner public {

        require(invitedMails[_mailHash] == false, "Already invited");
        require(mailHashToChallange[_mailHash] == 0, "Challange exist");

        invitedMails[_mailHash] = true;
        mailHashToChallange[_mailHash] = _challangeHash;
    }

    function activateMe(bytes32 _mailHash, bytes _nickName, bytes _challange) public {

        require(mailHashToChallange[_mailHash].length != 0, "Cannot activate");
        require(users[msg.sender].id != address(0), "Cannot activate, duplicate");
        
        //require(_mailHash.length == 0, "Mail hash empty");
        //require(_challange.length == 0, "Empty challange");

        bytes32 sentChallangeHash = keccak256(_challange);

        require(sentChallangeHash == mailHashToChallange[_mailHash], "Challange does not match");

        // now - used only for information, not part of business logic
        users[msg.sender] = User({ id: msg.sender, mailHash: _mailHash, name: _nickName, createdAt: now});

        emit UserRegistered(msg.sender, _nickName);
    }

    function isRegistered(address _address) public view returns (bool) {
        return users[_address].id != 0x0;
    }

    function amIRegistered() public view returns (bool) {
        return isRegistered(msg.sender);
    }

    function blacklist(bytes32 _mailHash) onlyOwner public {

    }

    function unblacklist(bytes32 _mailHash) onlyOwner public {

    }

    function() public payable {
        revert("Not payable contract");
    }
}