// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// @title DIDManager - This contract allows you to create DID methods and DIDs for them
// based on the W3C standard https://www.w3.org/TR/did-core/
// @author Žan Kovač
// @dev Simple PoC on how DID method creation could be implemented

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DIDManager is Ownable, Pausable {
	struct DIDMethod {
		string name;
		address creator;
		uint256 fee;
		uint256 value;
	}

	struct DID {
		address controller;
		uint256 created;
		uint256 updated;
		Key[] keys;
	}

	struct Key {
		bytes[66] pubKey;
		KeyType purpose;
	}

	enum KeyType {
		Authentication,
		Signing,
		Encryption
	}

	uint256 public DIDMethodCreationFee;
	uint256 public feeFromDIDMethodCreation;

	mapping(string => DIDMethod) private _didMethods;
	string [] private _didMethodsList;

	mapping(string => mapping(address => DID)) private _DIDs;
	mapping(address => string[]) private _addressInMethod;


	// @dev checks if DID method creator is msg.sender
	// @param didName - the name of the DID method stored in _didMethods
	modifier onlyDIDMethodCreator(string memory didName) {
		require(_didMethods[didName].creator == msg.sender, "Sender is not creator");
		_;
	}

	// @notice checks if DID creator is sender
	// @param didName - the name of the DID method which can access _DIDs
	modifier onlyDIDController(string memory didName) {
		require(_DIDs[didName][msg.sender].controller == msg.sender, "Sender is not did Controller");
		_;
	}


	// @notice creates new contracts and assigns DID method creation fee
	// @param _DIDMethodCreationFee - which sets the fee users have to pay for DID method creation
	constructor(uint256 _DIDMethodCreationFee) {
		DIDMethodCreationFee = _DIDMethodCreationFee;
	}

	// @notice changes DID method creation fee
	// @notice only owner of the contract can submit this
	// @param fee - new fee amount to be assigned
	function changeDIDMethodCreationFee(uint256 fee) external onlyOwner {
		DIDMethodCreationFee = fee;
	}

	// @notice creates new DID method and pays the required fee for the creation
	// @notice can be only executed while its not paused
	// @param didName - the name of the DID method you want to assign
	// @param didFee - fee which users will have to pay to register their document under this DID method
	// @dev checks if name is not empty string
	// @dev checks if name is not larger then 10 characters
	// @dev checks if DID already exists
	// @dev checks if user payed enough fee for creation
	// @dev adds new method to _didMethods mapping and pushes it to _didMethodList,
	// adds value to feeFromDIDMethodCreation
	function createDIDMethod(
		string memory didName,
		uint256 didFee
	) external payable whenNotPaused {
		require(bytes(didName).length != 0, "DID Name should not be empty");
		require(bytes(didName).length <= 10, "DID Name to large");
		require(bytes(_didMethods[didName].name).length == 0, "DID already exits");
		require(msg.value >= DIDMethodCreationFee, "DID Method Creation fee to low");

		_didMethods[didName] = DIDMethod(didName, msg.sender, didFee, 0);
		_didMethodsList.push(didName);

        feeFromDIDMethodCreation += msg.value;
    }

	// @notice creates DID and adds it to the state, can only be executed when not paused
	// @notice user has to pay required fee for DID creation
	// @param didMethod - the name of the DID method you want to register your DID
	// @dev checks if the DID method exists
	// @dev checks if the DID method registration is to low
	// @dev checks if address already has DID registered under this method
	// @dev creates the DID and adds value to that DID method
	function createDID(string calldata didMethod) external payable whenNotPaused {
		require(bytes(_didMethods[didMethod].name).length != 0, "DID method doesn't exits");
		require(msg.value >= _didMethods[didMethod].fee, "DID Fee to low");
		require(_DIDs[didMethod][msg.sender].controller == address(0), "This address already has DID in this method");

		_DIDs[didMethod][msg.sender].controller = msg.sender;
		_DIDs[didMethod][msg.sender].created = block.timestamp;
		_DIDs[didMethod][msg.sender].updated = block.timestamp;

		_didMethods[didMethod].value += msg.value;
	}

	function addKey(
		string memory didName,
		bytes[66] memory key,
		KeyType keyType
	) external onlyDIDController(didName) whenNotPaused {
		_DIDs[didName][msg.sender].keys.push(Key(key, keyType));
		_DIDs[didName][msg.sender].updated = block.timestamp;
	}

	function withdrawDIDMethodCreationValue(uint256 value) external onlyOwner whenNotPaused {
		require(feeFromDIDMethodCreation >= value, "Fee to low");
		feeFromDIDMethodCreation -= value;

		_withdraw(value);
	}

	function withdrawDIDValue(string memory didName, uint256 value)
		external
		onlyDIDMethodCreator(didName)
		whenNotPaused
	{
		require(_didMethods[didName].value >= value, "Fee to low");
		_didMethods[didName].value -= value;
		_withdraw(value);
	}

	function emergencyWithdraw() external onlyOwner whenPaused {
		uint256 balance = address(this).balance;
		_withdraw(balance);
	}

	function _withdraw(uint256 value) internal {
		(bool succeed, ) = msg.sender.call{value: value}("");

		require(succeed, "Failed to withdraw Ether");
	}

	function pause() external onlyOwner {
		_pause();
	}

	function unpause() external onlyOwner {
		_unpause();
	}

	function listDIDMethods(uint256 startIndex, uint256 size) public view returns (string[] memory) {
		string[] memory methods = new string[](size);
		for(uint256 i = startIndex; i <= startIndex + size; i++){
			methods[i] = _didMethodsList[i];
		}

		return methods;
	}

	function getDIDMethod(string memory name) public view returns (DIDMethod memory) {
		return _didMethods[name];
	}

	function getDIDsOfAddress(address didOwner,uint256 startIndex, uint256 size) public view returns (string[] memory) {
		string[] memory dids = new string[](size);
		for(uint256 i = startIndex; i <= startIndex + size; i++){
			dids[i] = _addressInMethod[didOwner][i];
		}

		return dids;
	}

	function getDIDOfAddress(string memory name, address didOwner) public view returns (DID memory) {
		return _DIDs[name][didOwner];
	}
}
