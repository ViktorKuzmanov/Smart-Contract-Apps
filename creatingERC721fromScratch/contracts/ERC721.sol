pragma solidity ^0.8.2;
contract ERC721 {


    mapping(address=>uint256) internal _balances;
    mapping(uint256=>address) internal _owners;
    mapping(address=>mapping(address=>bool)) private _operatorApprovals; 
    mapping(uint256=>address) private _tokenApprovals;

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
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
    // Updates an approved address for an NFT
    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "Msg.sender is not the owner or an approved operator");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    // Gets the approved address for a singe NFT
    function getApproved(uint256 tokenId) public view returns(address) {
        require(_owners[tokenId] != address(0), "TokenId does not exist");
        return _tokenApprovals[tokenId];
    }

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    // transfer ownership of an NFT
    function transferFrom(address from, address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(
            msg.sender == owner ||
            getApproved(tokenId) == msg.sender ||
            isApprovedForAll(owner, msg.sender),
            "Msg.sender is not the owner or approved for transfer"
        );
        require(owner == from, "From address is not the owner");
        require(to != address(0), "Address is zero");
        require(_owners[tokenId] != address(0), "TokenId does not exist");
        approve(address(0), tokenId);
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    // this is a Standard transferFrom function but it also
    // checks if onERC721Received is implement WHEN sending to smart contracts
    // you need to do this check when you are sending NFT to smart contract and not to end user wallet
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        transferFrom(from, to, tokenId);
        require(checkOnERC721Received(), "Receiver not implemented");
    }
    
    // oversimplified function needs more work
    function checkOnERC721Received() private pure returns(bool) {
        return true;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    // EIP165 Query if a contract impoement another interface
    function supportsInterface(bytes4 interfaceId) public pure virtual returns(bool) {
        return interfaceId == 0x80ac58cd;
    }
}