// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DIDManager is AccessControl {
	struct DID {
		address controller;
		uint256 created;
		uint256 updated;
		Key[] keys;
	}

	enum KeyType {
		Authentication,
		Signing,
		Encryption
	}

	struct Key {
		bytes[66] pubKey;
		KeyType purpose;
	}

	struct DIDMethod {
		string name;
		address creator;
		address[] managers;
	}

	//    bytes32 public constant DID_MANAGER_ADMIN = keccak256("DID_MANAGER_ADMIN");
	uint256 public DIDMethodCreationFee;
	mapping(string => DIDMethod) private _didMethods;

	constructor(uint256 _DIDMethodCreationFee) {
		DIDMethodCreationFee = _DIDMethodCreationFee;
		_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
	}

	function changeDIDMethodCreationFee(uint256 fee) external onlyRole(DEFAULT_ADMIN_ROLE) {}

	function createDIDMethod(string memory didName, uint256 maxNumOfManagers) external {
		require(bytes(didName).length != 0, "DID Name should not be empty");
		require(bytes(didName).length <= 10, "DID Name to large");
		require(bytes(_didMethods[didName]).length == 0, "DID already exits");

		address[] memory managers = new address[](maxNumOfManagers);
		_didMethods[didName] = DIDMethod(didName, msg.sender, managers);
	}

	function setDIDMethodManager(string memory didName, address manager) external {}

	function deleteDIDMethod(string memory didName) external {}

	function createDID() external {}

	function removeDID() external {}

	function addKey() external {}

	function removeKey() external {}

	//    function grandDIDManagerAdminRole(address adminAddress) public onlyRole(DID_MANAGER_ADMIN) {
	//        grantRole(DID_MANAGER_ADMIN, adminAddress);
	//    }
}
