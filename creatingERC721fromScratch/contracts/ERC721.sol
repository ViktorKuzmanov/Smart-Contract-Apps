pragma solidity ^0.8.2;
contract ERC721 {


    mapping(address=>uint256) internal _balances;
    mapping(uint256=>address) internal _owners;

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
}