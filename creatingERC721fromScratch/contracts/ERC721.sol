pragma solidity ^0.8.2;
contract ERC721 {


    mapping(address=>uint256) internal _balances;
    mapping(uint256=>address) internal _owners;
    mapping(address =>  mapping(address=>bool)) private _operatorApprovals; 

    // Returns the number of NFTs assigned to an owner
    function balanceOf(address owner) public view returns(uint256) {
        require(owner != address(0), "Address is zero");
        return _balances[owner];
    }

    // Find the owner of an NFT
    function ownerOf(uint256 tokenId) public view returns(address) {
        address owner = _owners[tokenId];
        require(owner!=address(0), "TokenID does not exist");
        return owner;
    }

    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    // These are functions that define an operator
    // Operator is any address that has the ability to manage NFTs for someone else
    // Enables or disables an operator to manage all of msg.senders assets
    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    // check if an address is an operator for another address
    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return _operatorApprovals[owner][operator];
    }
}