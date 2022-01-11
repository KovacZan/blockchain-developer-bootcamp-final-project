// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtistPass is Ownable, Pausable, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public maxTokens = 0;
    uint256 public price = 0;
    string private _passURI = "";

    constructor(uint256 _maxTokens, uint256 _price, string memory _passURI) ERC721("ArtistPass", "AP") {
        maxTokens = _maxTokens;
        price = _price;
        _passURI = _passURI;
    }

    function mint() external payable whenNotPaused {
        require(price <= msg.value, "ETH amount is not sufficient");
        require(_tokenIdCounter.current() < maxTokens, "Maximum amount has been reached!");

        _safeMint(msg.sender, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "caller is not owner nor approved");
        _burn(tokenId);
    }

    function changePrice(uint256 newPrice) external onlyOwner {
        price = newPrice;
    }

    function setPassURI(string memory _newPassURI) external onlyOwner {
        _passURI = _passURI;
    }

    function setPaused(bool _setPaused) public onlyOwner {
        return (_setPaused) ? _pause() : _unpause();
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool succeed,) = msg.sender.call{value : balance}("");

        require(succeed, "Failed to withdraw Ether");
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _passURI;
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 numOfPasses = balanceOf(owner);

        uint256[] memory passes = new uint256[](numOfPasses);
        for (uint256 i; i < numOfPasses; i++) {
            passes[i] = tokenOfOwnerByIndex(owner, i);
        }

        return passes;
    }
}
