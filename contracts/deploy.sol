pragma solidity ^0.8.17;

import "./SpaceCoin.sol";
import "./Ico.sol";

contract SpaceCoinDeployer {
    SpaceCoin public spaceCoin;
    SpaceCoinICO public spaceCoinICO;

    event ContractCreation(address indexed erc20, address indexed ico);

    constructor(address[] memory _seedAllowlist, address _treasury) {
        // Deploy SpaceCoin contract
        spaceCoin = new SpaceCoin(_treasury);

        // Deploy SpaceCoinICO contract
        spaceCoinICO = new SpaceCoinICO(address(spaceCoin), _seedAllowlist);

        // Mint tokens for the ICO
        uint256 icoSupply = 150_000 ether;
        spaceCoin.mintToICO(address(spaceCoinICO), icoSupply);

        // Transfer ownership of SpaceCoin contract and the ICO to the msg.sender
        spaceCoinICO.transferOwnership(address(msg.sender));
        spaceCoin.transferOwnership(address(msg.sender));
        emit ContractCreation(address(spaceCoin), address(spaceCoinICO));
    }

}