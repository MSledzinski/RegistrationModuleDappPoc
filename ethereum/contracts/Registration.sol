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
    mapping (bytes32 => address) mailHashToAddress;

    mapping (bytes32 => bytes32) mailHashToChallange;

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

        require(mailHashToChallange[_mailHash] == 0, "Challange exist");

        mailHashToChallange[_mailHash] = _challangeHash;
    }

    // TODO: discuss if can remove activated user?
    function remove(bytes32 _mailHash) onlyOwner public {   

       address target = mailHashToAddress[_mailHash];

        if (target != address(0)) {
           // clear user data
           delete users[target];
           delete mailHashToAddress[_mailHash];
       }

        delete mailHashToChallange[_mailHash];
    }

    function activateMe(bytes32 _mailHash, bytes _nickName, bytes _challange) public {

        // challange/invitation does exist
        require(mailHashToChallange[_mailHash].length != 0, "Cannot activate");

        // however users is not activated - so user with this address does not exist
        require(users[msg.sender].id == address(0), "Cannot activate, duplicate");
        
        bytes32 sentChallangeHash = keccak256(_challange);

        require(sentChallangeHash == mailHashToChallange[_mailHash], "Challange does not match");

        // now - used only for information, not part of business logic
        users[msg.sender] = User({ id: msg.sender, mailHash: _mailHash, name: _nickName, createdAt: now});
        mailHashToAddress[_mailHash] = msg.sender;

        emit UserRegistered(msg.sender, _nickName);
    }

    function isRegistered(address _address) public view returns (bool) {
        return users[_address].id != 0x0;
    }

    function amIRegistered() public view returns (bool) {
        return isRegistered(msg.sender);
    }

    function() public payable {
        revert("Not payable contract");
    }
}