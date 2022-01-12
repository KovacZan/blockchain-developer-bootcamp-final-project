# Avoiding Common Attacks

## Function Default Visibility ([SWC-100](https://swcregistry.io/docs/SWC-100))
Visibility has been set on all functions in both contracts (ArtistPass and NFTGallery).

## Outdated Compiler Version ([SWC-102](https://swcregistry.io/docs/SWC-102))
Use compiler pragma 0.8.10 to avoid any bug from outdated compiler version

## Floating Pragma ([SWC-103](https://swcregistry.io/docs/SWC-103))
Specific compiler pragma 0.8.10 is used in contracts to avoid 
accidental bug inclusion through outdated compiler versions.

## Unchecked Call Return Value ([SWC-104](https://swcregistry.io/docs/SWC-104))
The call return value in withdraw() function within the ArtistPass contract 
and buyArt() function within the NFTGallery contract
are checked using require, if it fails the transaction is rolled back.

## Unprotected Ether Withdrawal ([SWC-105](https://swcregistry.io/docs/SWC-105))
The withdraw() function within the ArtistPass contract is protected with onlyOwner modifier

## Reentrancy ([SWC-107](https://swcregistry.io/docs/SWC-107))
Use a reentrancy lock when calling external function in createArt() function in NFTGallery

## State Variable Default Visibility ([SWC-108](https://swcregistry.io/docs/SWC-108))
Visibility has been set on all state variables in both contracts (ArtistPass and NFTGallery).

## Authorization through tx.origin ([SWC-115](https://swcregistry.io/docs/SWC-115))
Use of msg.sender instead of tx.origin
