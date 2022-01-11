// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IPass {
    function burn(uint256 _tokenId) external;

    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract NFTGallery is Ownable, ReentrancyGuard, Pausable, ERC721Enumerable {
    struct Art {
        string name;
        string description;
        string imageURL;
        uint256 pass;
    }

    struct Auction {
        uint256 tokenID;
        uint256 price;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    IPass private artistsPass;

    mapping(uint256 => Art) private artData;

    Counters.Counter private _auctionCounter;
    mapping(uint256 => Auction) private auctions;
    mapping(uint256 => uint256) private tokenIDAuction;


    modifier notOnAuction(uint256 tokenID) {
        require(tokenIDAuction[tokenID] == 0, "Token is on Auction");
        _;
    }

    modifier noEmptyString(string memory data) {
        require(bytes(data).length > 0, "String is empty");
        _;
    }

    constructor(address _pass) ERC721("NFTGallery", "NG") {
        artistsPass = IPass(_pass);
    }

    function createArt(string memory _name, string memory _description, string memory _imageURL, uint256 _passID) external whenNotPaused nonReentrant {
        require(artistsPass.ownerOf(_passID) == msg.sender, "Pass not owned by sender");

        //must call setApprovalForAll(THIS_CONTRACT_ADDRESS, true) for this to work
        artistsPass.burn(_passID);

        uint256 tokenID = _tokenIdCounter.current();
        artData[tokenID] = Art(_name, _description, _imageURL, _passID);

        _safeMint(msg.sender, tokenID);
        _tokenIdCounter.increment();
    }

    function createAuction(uint256 tokenID, uint256 price) external whenNotPaused nonReentrant notOnAuction(tokenID) {
        require(msg.sender == ownerOf(tokenID), "NFT Ownership required");
        _auctionCounter.increment();

        tokenIDAuction[tokenID] = _auctionCounter.current();
        auctions[_auctionCounter.current()] = Auction(tokenID, price);
    }

    function cancelAuction(uint256 auctionID) external whenNotPaused nonReentrant {
        Auction storage auction = auctions[auctionID];
        require(msg.sender == ownerOf(auction.tokenID), "NFT Ownership required");
        require(tokenIDAuction[auction.tokenID] != 0, "NFT not on Auction");

        tokenIDAuction[auction.tokenID] = 0;
    }

    function buyArt(uint256 auctionID) external payable whenNotPaused nonReentrant {
        Auction storage auction = auctions[auctionID];
        require(tokenIDAuction[auction.tokenID] != 0, "NFT not on Auction");
        require(msg.value >= auction.price, "Value to low");

        tokenIDAuction[auction.tokenID] = 0;
        _transfer(ownerOf(auction.tokenID), msg.sender, auction.tokenID);

        (bool succeed,) = ownerOf(auction.tokenID).call{value: msg.value}("");

        require(succeed, "Failed to withdraw Ether");
    }

    function setPaused(bool _setPaused) public onlyOwner {
        return (_setPaused) ? _pause() : _unpause();
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return artData[_tokenId].imageURL;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused notOnAuction(tokenId) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
