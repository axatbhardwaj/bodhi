// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";

contract BodhiToken is
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ERC20PermitUpgradeable,
    ERC20PausableUpgradeable
{
    address public tokenDistributionContractAddress;

    function initialize(
        address _tokenDistributionContractAddress,
        uint256 _initialSupply
    ) public initializer {
        __ERC20_init("Bodhi", "BOD");
        __ERC20Permit_init("Bodhi");
        __ERC20Pausable_init();
        _mint(_tokenDistributionContractAddress, _initialSupply);
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);
    }

    event tokensMinted(address indexed _beneficiary, uint256 _amount);
    event tokensBurned(address indexed _beneficiary, uint256 _amount);

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        super._update(from, to, value); // Call parent update functions
    }

    /**
     * @dev Authorizes a contract upgrade.
     * Can only be called by admin.
     * @param newImplementation Address of the new implementation contract.
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
    constructor() {
        _disableInitializers(); // Disable initializers to prevent direct calls
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function mint(uint256 amount) external onlyOwner {
        _mint(tokenDistributionContractAddress, amount);
    }
}
