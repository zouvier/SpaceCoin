pragma solidity ^0.8.0;

import "./SpaceCoin.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "hardhat/console.sol";

contract SpaceCoinICO is Ownable, Pausable{
    enum Phase {SEED, GENERAL, OPEN}

    Phase public currentPhase = Phase.SEED;
    SpaceCoin public spaceCoin;
    address[] private seedAllowlist;
    mapping(address => uint256) public contributions;
    uint256 private seedPhaseCap = 15_000 ether;
    uint256 private generalPhaseCap = 30_000 ether;
    uint256 private openPhaseCap = 30_000 ether;
    uint256 public totalContributed;
    bool private phaseChangeRequested = false;


    constructor(address _spaceCoin, address[] memory _seedAllowlist) {
        seedAllowlist = _seedAllowlist;
        spaceCoin = SpaceCoin(_spaceCoin);

    }

    function contribute() external payable whenNotPaused{
        uint256 newTotal = totalContributed + msg.value;
        uint256 newUserContribution = contributions[msg.sender] + msg.value;

        if (currentPhase == Phase.SEED) {
            require(isAllowlisted(msg.sender), "SpaceCoinICO: Address not in allowlist");
            require(newUserContribution <= 1_500 ether, "SpaceCoinICO: Individual limit exceeded");
            require(newTotal <= seedPhaseCap, "SpaceCoinICO: Phase cap exceeded");
        } else if (currentPhase == Phase.GENERAL) {
            require(newUserContribution <= 1_000 ether, "SpaceCoinICO: Individual limit exceeded");
            require(newTotal <= generalPhaseCap, "SpaceCoinICO: Phase cap exceeded");
        } else if (currentPhase == Phase.OPEN) {
            require(newTotal <= openPhaseCap, "SpaceCoinICO: Phase cap exceeded");
        }

        contributions[msg.sender] = newUserContribution;
        totalContributed = newTotal;
    }

    function redeemTokens() external whenNotPaused{
        require(currentPhase == Phase.OPEN, "SpaceCoinICO: ICO is not in OPEN phase");
        uint256 userContribution = contributions[msg.sender];
        require(userContribution > 0, "SpaceCoinICO: No contribution to redeem");
        uint256 tokenAmount = userContribution * 5;
        contributions[msg.sender] = 0;
        spaceCoin.transfer(msg.sender, tokenAmount);
    }

    function advancePhase() external onlyOwner {
        require(!phaseChangeRequested, "SpaceCoinICO: Phase change already requested");
        require(currentPhase != Phase.OPEN, "SpaceCoinICO: Cannot advance past OPEN phase");
        phaseChangeRequested = true;
    }

    function confirmPhaseChange() external onlyOwner {
        require(phaseChangeRequested, "SpaceCoinICO: No phase change requested");
        currentPhase = Phase(uint8(currentPhase) + 1);
        phaseChangeRequested = false;
    }

    function isAllowlisted(address user) public view returns (bool) {
        for (uint256 i = 0; i < seedAllowlist.length; i++) {
            if (seedAllowlist[i] == user) {
                return true;
            }
        }
        return false;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() payable external {
        revert("Send Eth through the contribute function");
    }
}
