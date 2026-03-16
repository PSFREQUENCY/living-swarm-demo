// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title GhostTownVault — 81 Ghost Town Genesis Items
/// @notice ERC-1155 multi-edition game assets with vault-release mechanics
/// @dev Self-contained — no external imports required for deployment via Remix/cast
///
/// EDITION SIZES (Genesis): 3,6,9,11,12,13,21,30,33,36,42,69
/// ALPHA ITEMS: 3× supply, ~60% power, released from vault
/// SEASONS: 6 max, each can grow up to 9× original item count
/// VAULT: ETH deposits unlock new item batches from the vault
///
/// Deploy on Mainnet + Sepolia (same bytecode, different addresses)

contract GhostTownVault {

    // ─── ERC-1155 core ──────────────────────────────────────────────────────
    string public name     = "81 Ghost Town Vault";
    string public symbol   = "GTOWNV";
    string private _uri;

    mapping(uint256 => mapping(address => uint256)) private _balances;
    mapping(address => mapping(address => bool))    private _operatorApprovals;

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);

    // ─── Vault / Season / Item structs ──────────────────────────────────────
    struct Item {
        uint256 id;
        string  name;
        uint8   season;
        uint8   power;       // 1–100
        uint8   tier;        // 1=genesis  2=alpha
        string  category;    // weapon|armor|relic|vehicle|companion|skin|key
        uint256 maxSupply;
        uint256 minted;
        uint256 price;       // wei
        bool    vaultLocked; // requires vault threshold to unlock
        bool    active;
    }

    struct Listing {
        address seller;
        uint256 itemId;
        uint256 amount;
        uint256 priceEach; // wei
        bool    active;
    }

    // ─── State ───────────────────────────────────────────────────────────────
    address public owner;

    uint8  public constant MAX_SEASONS   = 6;
    uint8  public currentSeason          = 1;
    uint256 public constant SEASON_CAP_X = 9; // each season can grow up to 9× item count

    uint256 public itemCount;
    mapping(uint256 => Item) public items;

    // Genesis edition sizes — randomly assigned to items
    uint16[12] public GENESIS_EDITIONS = [3,6,9,11,12,13,21,30,33,36,42,69];

    // Vault
    uint256 public vaultBalance;
    uint256 public vaultThreshold = 0.05 ether; // per item unlock
    uint256 public nextVaultUnlock;              // itemId queued to unlock next

    // Marketplace
    uint256 public listingCount;
    mapping(uint256 => Listing) public listings;
    uint256 public constant ROYALTY_BPS = 500; // 5%

    // Events
    event ItemMinted(address indexed to, uint256 indexed itemId, uint256 amount, uint256 season);
    event VaultDeposit(address indexed from, uint256 amount);
    event ItemUnlockedFromVault(uint256 indexed itemId, string itemName);
    event Listed(uint256 indexed listingId, address seller, uint256 itemId, uint256 amount, uint256 priceEach);
    event Sale(uint256 indexed listingId, address buyer, uint256 amount, uint256 total);
    event SeasonAdvanced(uint8 newSeason);

    error NotOwner();
    error NotApproved();
    error BadInput();
    error SoldOut();
    error InsufficientFunds();
    error Locked();
    error SeasonCapped();

    constructor(string memory baseURI) {
        owner = msg.sender;
        _uri  = baseURI;
        _seedGenesisItems();
    }

    modifier onlyOwner() { if (msg.sender != owner) revert NotOwner(); _; }

    // ─── ERC-1155 interface ──────────────────────────────────────────────────
    function supportsInterface(bytes4 id) external pure returns (bool) {
        return id == 0xd9b67a26 // ERC-1155
            || id == 0x0e89341c // ERC-1155MetadataURI
            || id == 0x01ffc9a7; // ERC-165
    }

    function uri(uint256 id) external view returns (string memory) {
        return string(abi.encodePacked(_uri, _uint2str(id), ".json"));
    }

    function balanceOf(address account, uint256 id) external view returns (uint256) {
        return _balances[id][account];
    }

    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
        external view returns (uint256[] memory)
    {
        uint256[] memory out = new uint256[](accounts.length);
        for (uint i; i < accounts.length; i++) out[i] = _balances[ids[i]][accounts[i]];
        return out;
    }

    function setApprovalForAll(address operator, bool approved) external {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator) external view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata) external {
        if (from != msg.sender && !_operatorApprovals[from][msg.sender]) revert NotApproved();
        if (_balances[id][from] < amount) revert BadInput();
        _balances[id][from]  -= amount;
        _balances[id][to]    += amount;
        emit TransferSingle(msg.sender, from, to, id, amount);
    }

    function safeBatchTransferFrom(
        address from, address to,
        uint256[] calldata ids, uint256[] calldata amounts, bytes calldata
    ) external {
        if (from != msg.sender && !_operatorApprovals[from][msg.sender]) revert NotApproved();
        for (uint i; i < ids.length; i++) {
            if (_balances[ids[i]][from] < amounts[i]) revert BadInput();
            _balances[ids[i]][from]  -= amounts[i];
            _balances[ids[i]][to]    += amounts[i];
        }
        emit TransferBatch(msg.sender, from, to, ids, amounts);
    }

    // ─── Mint ────────────────────────────────────────────────────────────────
    /// @notice Mint `amount` copies of item `itemId`. Send ETH >= price × amount.
    function mint(uint256 itemId, uint256 amount) external payable {
        Item storage it = items[itemId];
        if (!it.active)                                revert Locked();
        if (it.vaultLocked)                            revert Locked();
        if (it.minted + amount > it.maxSupply)         revert SoldOut();
        if (msg.value < it.price * amount)             revert InsufficientFunds();

        it.minted += amount;
        _balances[itemId][msg.sender] += amount;
        emit TransferSingle(msg.sender, address(0), msg.sender, itemId, amount);
        emit ItemMinted(msg.sender, itemId, amount, it.season);

        // overflow goes to vault
        vaultBalance += msg.value;
        _checkVaultRelease();
    }

    // ─── Vault deposit ───────────────────────────────────────────────────────
    /// @notice Deposit ETH into the vault to help unlock the next locked item.
    function depositVault() external payable {
        if (msg.value == 0) revert BadInput();
        vaultBalance += msg.value;
        emit VaultDeposit(msg.sender, msg.value);
        _checkVaultRelease();
    }

    function _checkVaultRelease() internal {
        if (nextVaultUnlock == 0 || nextVaultUnlock > itemCount) return;
        Item storage nxt = items[nextVaultUnlock];
        if (!nxt.vaultLocked) { nextVaultUnlock++; return; }
        if (vaultBalance >= vaultThreshold) {
            vaultBalance  -= vaultThreshold;
            nxt.vaultLocked = false;
            emit ItemUnlockedFromVault(nextVaultUnlock, nxt.name);
            nextVaultUnlock++;
        }
    }

    // ─── Marketplace ─────────────────────────────────────────────────────────
    /// @notice List `amount` of `itemId` for sale at `priceEach` wei each.
    function list(uint256 itemId, uint256 amount, uint256 priceEach) external returns (uint256 lid) {
        if (_balances[itemId][msg.sender] < amount) revert BadInput();
        if (amount == 0 || priceEach == 0)          revert BadInput();
        _balances[itemId][msg.sender] -= amount;
        _balances[itemId][address(this)] += amount;
        lid = ++listingCount;
        listings[lid] = Listing(msg.sender, itemId, amount, priceEach, true);
        emit Listed(lid, msg.sender, itemId, amount, priceEach);
    }

    /// @notice Buy `amount` units from listing `lid`.
    function buy(uint256 lid, uint256 amount) external payable {
        Listing storage ls = listings[lid];
        if (!ls.active || amount == 0 || amount > ls.amount) revert BadInput();
        uint256 total = ls.priceEach * amount;
        if (msg.value < total) revert InsufficientFunds();
        ls.amount -= amount;
        if (ls.amount == 0) ls.active = false;
        _balances[ls.itemId][address(this)] -= amount;
        _balances[ls.itemId][msg.sender]    += amount;
        // royalty → vault
        uint256 royalty = total * ROYALTY_BPS / 10000;
        vaultBalance += royalty;
        // seller gets remainder
        (bool ok,) = ls.seller.call{value: total - royalty}("");
        require(ok, "transfer failed");
        if (msg.value > total) {
            (bool ok2,) = msg.sender.call{value: msg.value - total}("");
            require(ok2, "refund failed");
        }
        emit Sale(lid, msg.sender, amount, total);
        _checkVaultRelease();
    }

    /// @notice Cancel your listing and reclaim tokens.
    function cancelListing(uint256 lid) external {
        Listing storage ls = listings[lid];
        if (ls.seller != msg.sender) revert NotApproved();
        if (!ls.active)              revert BadInput();
        _balances[ls.itemId][address(this)] -= ls.amount;
        _balances[ls.itemId][msg.sender]    += ls.amount;
        ls.active = false;
    }

    // ─── Season management ───────────────────────────────────────────────────
    /// @notice Owner advances to the next season, optionally adding new items via addItem().
    function advanceSeason() external onlyOwner {
        if (currentSeason >= MAX_SEASONS) revert SeasonCapped();
        currentSeason++;
        emit SeasonAdvanced(currentSeason);
    }

    /// @notice Add a new item (genesis or alpha) to the vault.
    function addItem(
        string  calldata itemName,
        uint8   season,
        uint8   power,
        uint8   tier,         // 1=genesis 2=alpha
        string  calldata category,
        uint256 maxSupply,
        uint256 price,
        bool    vaultLocked
    ) external onlyOwner returns (uint256 id) {
        if (season > currentSeason) revert BadInput();
        id = ++itemCount;
        items[id] = Item({
            id:          id,
            name:        itemName,
            season:      season,
            power:       power,
            tier:        tier,
            category:    category,
            maxSupply:   maxSupply,
            minted:      0,
            price:       price,
            vaultLocked: vaultLocked,
            active:      true
        });
        if (vaultLocked && (nextVaultUnlock == 0 || nextVaultUnlock > id)) {
            nextVaultUnlock = id;
        }
        emit URI(string(abi.encodePacked(_uri, _uint2str(id), ".json")), id);
    }

    // ─── Admin ───────────────────────────────────────────────────────────────
    function setVaultThreshold(uint256 t) external onlyOwner { vaultThreshold = t; }
    function setURI(string calldata u)    external onlyOwner { _uri = u; }
    function withdrawVault(uint256 amt)   external onlyOwner {
        require(amt <= vaultBalance, "exceeds vault");
        vaultBalance -= amt;
        (bool ok,) = owner.call{value: amt}("");
        require(ok);
    }
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert BadInput();
        owner = newOwner;
    }

    // ─── Views ───────────────────────────────────────────────────────────────
    function getItem(uint256 id) external view returns (Item memory) { return items[id]; }

    function getAllItems() external view returns (Item[] memory) {
        Item[] memory out = new Item[](itemCount);
        for (uint256 i; i < itemCount; i++) out[i] = items[i + 1];
        return out;
    }

    function getListings(uint256 from, uint256 count) external view
        returns (Listing[] memory out, uint256[] memory ids)
    {
        uint256 n = 0;
        for (uint256 i = from; i <= listingCount && n < count; i++) {
            if (listings[i].active) n++;
        }
        out  = new Listing[](n);
        ids  = new uint256[](n);
        uint256 j;
        for (uint256 i = from; i <= listingCount && j < n; i++) {
            if (listings[i].active) { out[j] = listings[i]; ids[j] = i; j++; }
        }
    }

    // ─── Seed genesis items at deploy ────────────────────────────────────────
    /// @dev 12 genesis items (one per edition size), then 12 alpha items vault-locked.
    ///      Seasons 2-6 are added by the owner via addItem() after deploy.
    function _seedGenesisItems() internal {
        string[12] memory names = [
            "Void Katana","Ghost Armor Mk.I","Neural Crown",
            "Samaur-AI Scroll","Phantom Blade","Hex Shield",
            "Fleet Sigil","Zone Key: Void Core","Cyber Steed",
            "Signal Cloak","Oracle Lens","Swarm Drone"
        ];
        string[12] memory cats = [
            "weapon","armor","relic",
            "relic","weapon","armor",
            "relic","key","vehicle",
            "skin","relic","companion"
        ];
        uint8[12] memory pows = [95,92,88,85,82,80,75,72,70,68,65,60];
        // prices: rarer = higher  (in wei, ~0.001 ETH base)
        uint256[12] memory prices = [
            0.03 ether,0.025 ether,0.02 ether,
            0.018 ether,0.016 ether,0.015 ether,
            0.012 ether,0.01 ether,0.009 ether,
            0.008 ether,0.007 ether,0.005 ether
        ];

        for (uint i; i < 12; i++) {
            uint256 id = ++itemCount;
            items[id] = Item({
                id:          id,
                name:        names[i],
                season:      1,
                power:       pows[i],
                tier:        1,
                category:    cats[i],
                maxSupply:   GENESIS_EDITIONS[i],
                minted:      0,
                price:       prices[i],
                vaultLocked: false,
                active:      true
            });
        }

        // 12 Alpha items — 3× supply, ~60% power, vault-locked
        string[12] memory aNames = [
            "Void Katana α","Ghost Armor α","Neural Crown α",
            "Samaur-AI Scroll α","Phantom Blade α","Hex Shield α",
            "Fleet Sigil α","Zone Key α","Cyber Steed α",
            "Signal Cloak α","Oracle Lens α","Swarm Drone α"
        ];
        uint8[12] memory aPows = [57,55,53,51,49,48,45,43,42,41,39,36];
        // Alpha prices: slightly lower than genesis
        uint256[12] memory aPrices = [
            0.012 ether,0.01 ether,0.009 ether,
            0.008 ether,0.007 ether,0.006 ether,
            0.005 ether,0.004 ether,0.004 ether,
            0.003 ether,0.003 ether,0.002 ether
        ];

        nextVaultUnlock = itemCount + 1; // first alpha unlocks first

        for (uint i; i < 12; i++) {
            uint256 aid = ++itemCount;
            items[aid] = Item({
                id:          aid,
                name:        aNames[i],
                season:      1,
                power:       aPows[i],
                tier:        2,
                category:    cats[i],
                maxSupply:   uint256(GENESIS_EDITIONS[i]) * 3,
                minted:      0,
                price:       aPrices[i],
                vaultLocked: true,
                active:      true
            });
        }
    }

    // ─── Utility ─────────────────────────────────────────────────────────────
    function _uint2str(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 tmp = v; uint256 digits;
        while (tmp != 0) { digits++; tmp /= 10; }
        bytes memory buf = new bytes(digits);
        while (v != 0) { digits--; buf[digits] = bytes1(uint8(48 + v % 10)); v /= 10; }
        return string(buf);
    }

    receive() external payable { vaultBalance += msg.value; emit VaultDeposit(msg.sender, msg.value); }
}
