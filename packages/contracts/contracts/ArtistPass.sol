// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @author Žan Kovač
/// @title ArtistPass
/// @notice NFT Collection which will be used in combination with NFTGallery
contract ArtistPass is Ownable, Pausable, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public maxTokens = 0;
    uint256 public price = 0;
    string public artistPassURI = "";

    /// @dev creates a contract and assignees some parameters, name of NFT and TAG are hardcoded
    /// @param _maxTokens - maximum number of NFT passes to be minted
    /// @param _price - price you will have to pay for minting and ArtistPass NFT
    /// @param _artistPassURI - uri to ArtistPass NFT image
    constructor(
        uint256 _maxTokens,
        uint256 _price,
        string memory _artistPassURI
    ) ERC721("ArtistPass", "AP") {
        maxTokens = _maxTokens;
        price = _price;
        artistPassURI = _artistPassURI;
    }

    /// @notice you can mint an NFT paying the right price, mint is possible when contract is not paused
    /// @dev check if msg.value is higher or equal to the price required
    /// check if there are still tokens available to mint
    function mint() external payable whenNotPaused {
        require(price <= msg.value, "ArtistPass: ETH amount is not sufficient");
        require(
            _tokenIdCounter.current() < maxTokens,
            "ArtistPass: Maximum amount has been reached"
        );

        _safeMint(msg.sender, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    /// @notice you can burn the NFT, if you do so you will not be able to use this NFT anymore
    /// you can do that if contract is not paused
    /// @dev this will be used to mint NFTs from NFTGallery
    /// checks if its owner or approved
    /// @param _tokenId - ID of an NFT you want to burn
    function burn(uint256 _tokenId) external whenNotPaused {
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId),
            "ArtistPass: Caller is not owner nor approved"
        );
        _burn(_tokenId);
    }

    /// @notice you can change the price for minting, only owner of contract can do that
    /// @param _newPrice - new price for minting
    function changePrice(uint256 _newPrice) external onlyOwner {
        price = _newPrice;
    }

    /// @notice you can change uri for NFT metadata, only owner can do this
    /// @param _artistPassURI - new uri to be set
    function setArtistPassURI(string memory _artistPassURI) external onlyOwner {
        artistPassURI = _artistPassURI;
    }

    /// @notice you can pause or un pause this contract, only owner can do this
    /// @param _setPaused - param if true contract will be paused, if false it will be unpause
    function setPaused(bool _setPaused) public onlyOwner {
        return (_setPaused) ? _pause() : _unpause();
    }

    /// @notice withdraw the collected founds from the contract, only owner can do this
    /// @dev founds are transferred do the contract owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool succeed, ) = msg.sender.call{value: balance}("");

        require(succeed, "ArtistPass: Failed to withdraw Ether");
    }

    /// @dev internal function providing security before transfer
    /// users will not be able to transfer if contract is on pause
    /// @param from - from which address you want to send NFT
    /// @param to - to which address you want to transfer NFT
    /// @param tokenId - id of NFT to be transferred
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @dev internal function returning artistPassURI
    /// @return string - returns artistPassURI set in constructor or changed with setArtistPassURI
    function _baseURI() internal view virtual override returns (string memory) {
        return artistPassURI;
    }

    /// @notice you can list all NFTs from particular user
    /// @dev this function returns all NFTs which users contains, if you expect to set maxTokens
    /// to very large number consider changing this method since it might return to much data
    /// @param owner - address which you want to check what NFTs it has
    /// @return uint256[] - array of NFT ids
    function tokensOfOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 numOfPasses = balanceOf(owner);

        uint256[] memory passes = new uint256[](numOfPasses);
        for (uint256 i; i < numOfPasses; i++) {
            passes[i] = tokenOfOwnerByIndex(owner, i);
        }

        return passes;
    }
}
