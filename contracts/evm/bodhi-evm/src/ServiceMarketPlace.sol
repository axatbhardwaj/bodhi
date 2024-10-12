// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

error invalidInputsProvided();
error insufficientFunds(address);
error insufficientAllowance();

//interface for burn function in bodhi token
interface IERC20Burn {
    function burn(uint256 amount) external;
}

contract ServiceMarketPlace is OwnableUpgradeable, UUPSUpgradeable {
    address public bodhiTokenAddress;
    address public tokenDistributionContractAddress;

    uint256 public serviceID;

    constructor() {
        _disableInitializers(); // Disable initializers to prevent direct calls
    }

    struct service {
        address owner;
        string serviceName;
        uint256 inputTokenPrice;
        uint256 outputTokenPrice;
        uint256 id;
    }
    mapping(uint256 => service) public services;

    // Events
    event ServiceAdded(
        uint256 serviceID,
        address owner,
        string serviceName,
        uint256 inputTokenPrice,
        uint256 outputTokenPrice
    );
    event TransactionProcessed(
        uint256 serviceID,
        address user,
        uint256 inputTokenUsed,
        uint256 outputTokenUsed,
        uint256 totalCost
    );
    event BodhiTokenAddressSet(address bodhiTokenAddress);
    event TokenDistributionContractAddressSet(
        address tokenDistributionContractAddress
    );

    function initialize(
        address _bodhiTokenAddress,
        address _tokenDistributionContractAddress
    ) external initializer {
        bodhiTokenAddress = _bodhiTokenAddress;
        tokenDistributionContractAddress = _tokenDistributionContractAddress;
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    function setBodyTokenAddress(address _bodhiToken) external onlyOwner {
        bodhiTokenAddress = _bodhiToken;
        emit BodhiTokenAddressSet(_bodhiToken);
    }

    function setTokenDistributionContractAddress(
        address _tokenDistributionContractAddress
    ) external onlyOwner {
        tokenDistributionContractAddress = _tokenDistributionContractAddress;
        emit TokenDistributionContractAddressSet(
            _tokenDistributionContractAddress
        );
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function addService(
        string memory _serviceName,
        uint256 _inputTokenPrice,
        uint256 _outputTokenPrice
    ) external onlyOwner {
        serviceID++;
        services[serviceID] = service(
            msg.sender,
            _serviceName,
            _inputTokenPrice,
            _outputTokenPrice,
            serviceID
        );
        emit ServiceAdded(
            serviceID,
            msg.sender,
            _serviceName,
            _inputTokenPrice,
            _outputTokenPrice
        );
    }

    function updateService(
        uint256 _serviceID,
        string memory _serviceName,
        uint256 _inputTokenPrice,
        uint256 _outputTokenPrice
    ) external onlyOwner {
        service memory updatedService = services[_serviceID];
        updatedService.serviceName = _serviceName;
        updatedService.inputTokenPrice = _inputTokenPrice;
        updatedService.outputTokenPrice = _outputTokenPrice;
        services[_serviceID] = updatedService;
    }

    function processTransaction(
        uint256 _serviceID,
        uint256 _inputTokenUsed,
        uint256 _outputTokenUsed
    ) external {
        if (IERC20(bodhiTokenAddress).balanceOf(msg.sender) < _inputTokenUsed) {
            revert insufficientFunds(msg.sender);
        }
        if (_inputTokenUsed < 0 || _outputTokenUsed < 0) {
            revert invalidInputsProvided();
        }

        uint256 totalCost = services[_serviceID].inputTokenPrice *
            _inputTokenUsed +
            services[_serviceID].outputTokenPrice *
            _outputTokenUsed;
        if (
            //check for token allowance via calling allowance function
            IERC20(bodhiTokenAddress).allowance(msg.sender, address(this)) <
            totalCost
        ) {
            revert insufficientAllowance();
        }

        // transfer tokens to this contract address
        IERC20(bodhiTokenAddress).transferFrom(
            msg.sender,
            address(this),
            totalCost
        );

        // burn the recived tokens
        IERC20Burn(bodhiTokenAddress).burn(totalCost);

        emit TransactionProcessed(
            _serviceID,
            msg.sender,
            _inputTokenUsed,
            _outputTokenUsed,
            totalCost
        );
    }
}
