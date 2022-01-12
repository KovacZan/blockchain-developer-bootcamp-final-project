// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @dev simple interface representing needed methods from ArtistsPass
interface IArtistPass {
    function burn(uint256 _tokenId) external;

    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract NFTGallery is Ownable, ReentrancyGuard, Pausable, ERC721Enumerable {
    using Counters for Counters.Counter;

    /// @dev Art struct containing name, description, imageURL and id of artistPass with which was minted
    struct Art {
        string name;
        string description;
        string imageURL;
        uint256 artistPass;
    }

    /// @dev Auction struct containing artID, price you want to get for selling it and if auction is already finished
    struct Auction {
        uint256 artID;
        uint256 price;
        bool isFinished;
    }

    IArtistPass private artistPass;

    Counters.Counter private _artIdCounter;
    mapping(uint256 => Art) private artData;

    Counters.Counter private _auctionCounter;
    mapping(uint256 => Auction) private auctions;
    mapping(uint256 => bool) private isArtOnAuction;


    /// @dev checks if NFT is on auction
    /// @param artID - NFT id to be checked
    modifier requireNotOnAuction(uint256 artID) {
        require(
            isArtOnAuction[artID] == false,
            "NFTGallery: Art is on Auction"
        );

        _;
    }

    /// @dev checks if NFT is not on auction
    /// @param artID - NFT id to be checked
    modifier requireOnAuction(uint256 artID) {
        require(
            isArtOnAuction[artID] == true,
            "NFTGallery: Art is not on Auction"
        );

        _;
    }
    /// @dev checks if you own this NFT
    /// @param artID - NFT id to be checked
    modifier requireOwnership(uint256 artID) {
        require(
            msg.sender == ownerOf(artID),
            "NFTGallery: NFT Ownership required"
        );

        _;
    }

    /// @dev checks if data provided is empty string
    /// @param data - string to be checked
    modifier noEmptyString(string memory data) {
        require(bytes(data).length > 0, "NFTGallery: String is empty");
        _;
    }

    /// @dev create contract and assign artistPass address to be used for burn
    /// Collection name and TAG are hardcoded
    constructor(address _artistPassAddress) ERC721("NFTGallery", "NG") {
        artistPass = IArtistPass(_artistPassAddress);
    }

    /// @notice create art from, burn Artist pass if you want to create NFT in this collection, you can do this
    /// when contract is not paused
    /// you should approve this contract in ArtistPass so it can burn your pass
    /// @param _name - name of the art
    /// @param _description - description for the art
    /// @param _imageURL - url to image of the art
    /// @param _artistPassID - artist pass to be burned so you can mint your art
    /// @dev check for empty strings and nonReentrant block
    function createArt(
        string memory _name,
        string memory _description,
        string memory _imageURL,
        uint256 _artistPassID
    )
        external
        noEmptyString(_name)
        noEmptyString(_description)
        noEmptyString(_imageURL)
        whenNotPaused
        nonReentrant
    {
        require(
            artistPass.ownerOf(_artistPassID) == msg.sender,
            "NFTGallery: ArtistPass not owned by sender"
        );

        // must call setApprovalForAll(THIS_CONTRACT_ADDRESS, true) for this to work
        artistPass.burn(_artistPassID);

        uint256 tokenID = _artIdCounter.current();
        artData[tokenID] = Art(_name, _description, _imageURL, _artistPassID);

        _safeMint(msg.sender, tokenID);
        _artIdCounter.increment();
    }

    /// @notice create auction for your art, you must own an art to do so
    /// and you can only do it when contract is not paused
    /// @param _artID - id of the art you want to create auction for
    /// @param _price - amount of ether you want to recieve for this art
    function createAuction(uint256 _artID, uint256 _price)
        external
        whenNotPaused
        requireOwnership(_artID)
        requireNotOnAuction(_artID)
    {
        auctions[_auctionCounter.current()] = Auction(_artID, _price, false);
        _auctionCounter.increment();
        isArtOnAuction[_artID] = true;
    }

    /// @notice cancel auction, to do so you have to be owner of the nft and your token has to be on unfinished auction
    /// you can do this when contract is not paused
    /// @param _auctionID - id of the auction you want to cancel
    /// @dev set the auction to finished and set isArtOnAuction for this id on false
    function cancelAuction(uint256 _auctionID)
        external
        whenNotPaused
        requireOwnership(auctions[_auctionID].artID)
        requireOnAuction(auctions[_auctionID].artID)
    {
        auctions[_auctionID].isFinished = true;
        isArtOnAuction[auctions[_auctionID].artID] = false;
    }

    /// @notice buy art which is on unfinished auction, you can do this when contract is not on pause
    /// you have to pay the amount specified on particular auction
    /// @param _auctionID - auction from which you want to buy nft
    /// @dev check if msg.value is higher or equal then price and make sure you set isArtOnAuction before you transfer
    function buyArt(uint256 _auctionID)
        external
        payable
        whenNotPaused
        requireOnAuction(auctions[_auctionID].artID)
    {
        Auction storage auction = auctions[_auctionID];
        require(msg.value >= auction.price, "NFTGallery: ETH Value to low");

        auction.isFinished = true;
        isArtOnAuction[auction.artID] = false;

        address owner = ownerOf(auction.artID);

        _transfer(owner, msg.sender, auction.artID);

        (bool succeed, ) = owner.call{value: msg.value}("");
        require(succeed, "NFTGallery: Failed to Transfer Ether");
    }

    /// @notice you can pause or un pause this contract, only owner can do this
    /// @param _setPaused - param if true contract will be paused, if false it will be unpause
    function setPaused(bool _setPaused) public onlyOwner {
        return (_setPaused) ? _pause() : _unpause();
    }

    /// @dev internal function providing security before transfer
    /// users will not be able to transfer if contract is on pause
    /// user will not be able to transfer if art is on auction
    /// @param from - from which address you want to send NFT
    /// @param to - to which address you want to transfer NFT
    /// @param tokenId - id of NFT to be transferred
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused requireNotOnAuction(tokenId) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @notice returns image of token art
    /// @param _tokenId - id for which you want to receive url to image
    /// @dev override tokenURI so it returns imageURL from artData and doesn't combine it with _baseURI
    /// @return string - url of art image
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return artData[_tokenId].imageURL;
    }

    /// @notice checks if art is on auction
    /// @param _artID - the id of the art you want to check if its on auction
    /// @return bool - return true if art is on auction and false if its not
    function checkIfArtOnAuction(uint256 _artID) public view returns (bool) {
        return isArtOnAuction[_artID];
    }

    /// @notice returns auction data
    /// @param _auctionID - id of the auction you want to return
    /// @return Auction - return Auction struct
    function getAuction(uint256 _auctionID)
        public
        view
        returns (Auction memory)
    {
        return auctions[_auctionID];
    }

    /// @notice returns data for particular art
    /// @param _artID - id of the art you want to return
    /// @return Art - Art struct to be returned
    function getArt(uint256 _artID) public view returns (Art memory) {
        return artData[_artID];
    }

    /// @notice you can list all arts from particular user
    /// @dev this function returns all arts which users contains, if you expect to set maxTokens in ArtistPass
    /// to very large number consider changing this method since it might return to much data
    /// @param owner - address which you want to check what arts it has
    /// @return uint256[] - array of art ids
    function artsOfOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 numOfArts = balanceOf(owner);

        uint256[] memory arts = new uint256[](numOfArts);
        for (uint256 i; i < numOfArts; i++) {
            arts[i] = tokenOfOwnerByIndex(owner, i);
        }

        return arts;
    }

    /// @notice returns the counter for how many arts were already minted
    /// @return uint256 - counter of arts
    function artIDCounter() public view returns (uint256) {
        return _artIdCounter.current();
    }

    /// @notice returns the counter for how many auctions were already created
    /// @return uint256 - counter of auctions
    function auctionIDCounter() public view returns (uint256) {
        return _auctionCounter.current();
    }
}
