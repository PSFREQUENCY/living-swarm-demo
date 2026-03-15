// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SwarmGenesis — Living Swarm // 3 Fully Onchain ERC-721 Art Tokens
/// @notice TokenURIs are data:text/html;base64 — self-contained interactive art stored in contract storage
contract SwarmGenesis {
    string public name = "Living Swarm Genesis";
    string public symbol = "LSG";

    address private _owner;
    uint256 public totalSupply;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _approvals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => string) private _uris;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    error NotOwner();
    error NotApproved();
    error NonExistent();

    constructor() { _owner = msg.sender; }

    modifier onlyOwner() { if (msg.sender != _owner) revert NotOwner(); _; }

    function supportsInterface(bytes4 id) external pure returns (bool) {
        return id == 0x80ac58cd || id == 0x5b5e139f || id == 0x01ffc9a7;
    }

    function balanceOf(address owner) external view returns (uint256) { return _balances[owner]; }

    function ownerOf(uint256 id) public view returns (address o) {
        o = _owners[id];
        if (o == address(0)) revert NonExistent();
    }

    function tokenURI(uint256 id) external view returns (string memory) {
        if (_owners[id] == address(0)) revert NonExistent();
        return _uris[id];
    }

    function approve(address to, uint256 id) external {
        if (msg.sender != _owners[id]) revert NotApproved();
        _approvals[id] = to;
        emit Approval(msg.sender, to, id);
    }

    function getApproved(uint256 id) external view returns (address) { return _approvals[id]; }

    function setApprovalForAll(address op, bool approved) external {
        _operatorApprovals[msg.sender][op] = approved;
        emit ApprovalForAll(msg.sender, op, approved);
    }

    function isApprovedForAll(address owner, address op) external view returns (bool) {
        return _operatorApprovals[owner][op];
    }

    function transferFrom(address from, address to, uint256 id) public {
        address owner = _owners[id];
        if (owner != from) revert NotApproved();
        if (msg.sender != from && msg.sender != _approvals[id] && !_operatorApprovals[from][msg.sender])
            revert NotApproved();
        _balances[from]--;
        _balances[to]++;
        _owners[id] = to;
        delete _approvals[id];
        emit Transfer(from, to, id);
    }

    function safeTransferFrom(address from, address to, uint256 id) external { transferFrom(from, to, id); }
    function safeTransferFrom(address from, address to, uint256 id, bytes calldata) external { transferFrom(from, to, id); }

    function mint(address to, string calldata uri) external onlyOwner {
        uint256 id = ++totalSupply;
        _balances[to]++;
        _owners[id] = to;
        _uris[id] = uri;
        emit Transfer(address(0), to, id);
    }
}
