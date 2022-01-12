# Design Pattern Decisions

## Inter-Contract Execution 

The feature of `NFTGallery` contract is to burn `ArtisPass` to create nft Art. I have created simple
`IArtistPass` interface that represent `ArtisPass`.

Burn is called when creating art with `createArt()` function inside `NFTGallery`


## Access Control Design Patterns
`Ownable` design pattern is used to restrict calling some contract functionality only
to owner of the contract. 

### In `ArtistPass` Contract functions

- `changePrice()`
- `setArtistPassURI()`
- `setPaused()`
- `withdraw()`

### In `NFTGallery` Contract functions

- `setPaused()`


## Inheritance and Interfaces
Both `ArtistPass` and `NFTGallery` contracts use different imported contracts from OpenZeppelin.

### `ArtistPass` Contract 
It inherits `Ownable` contract to restrict some function access only to owner.
It inherits `Pausable` to make it possible to pause the contract if any major bug accrues.
It inherits from abstract `ERC721Enumerable` and leverages its `ERC721` inheritance, so you can initialize
`ERC721` inside this contract

### `ArtistPass` Contract
It inherits `Ownable` contract to restrict some function access only to owner.
It inherits `ReentrancyGuard` so it protect external call to `ArtistPass` when burning NFT.
It inherits `Pausable` to make it possible to pause the contract if any major bug accrues.
It inherits from abstract `ERC721Enumerable` and leverages its `ERC721` inheritance, so you can initialize
`ERC721` inside this contract
