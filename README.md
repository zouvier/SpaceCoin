# ICO Project

## Setup

See [README-Setup.md](./README-Setup.md)

## Technical Spec

*Overview*:
---
SpaceCoin is a decentralized cryptocurrency project that consists of an ERC20 token, SpaceCoin (SPC), and an Initial Coin Offering (ICO) contract.

*SpaceCoin Contract*:
---
The SpaceCoin contract is an ERC20 token with an additional tax mechanism on token transfers. The tax collected on transfers is sent to a Treasury address.

Tax mechanism (2% tax on transfers) can be activated/deactivated by the owner
Minting function for ICO allocation (limited to the total supply)
Treasury address holds a portion of the total supply and accumulates tax revenue

*SpaceCoinICO Contract*:
---
The SpaceCoinICO contract handles the fundraising process and has three distinct phases: Seed, General, and Open. Contributors can participate in the ICO by sending ETH to the contract and receiving SPC tokens in return.


Three ICO phases with different contribution limits and caps
Seed phase has an allowlist of addresses that can participate
Function to redeem tokens during the Open phase
Function to advance the ICO phases (with owner confirmation)
Pause and unpause functionality for the contract





## Code Coverage Report

----------------|----------|----------|----------|----------|----------------|
File            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------|----------|----------|----------|----------|----------------|
 contracts/     |      100 |    69.23 |      100 |      100 |                |
  Ico.sol       |      100 |    71.43 |      100 |      100 |                |
  SpaceCoin.sol |      100 |       60 |      100 |      100 |                |
  deploy.sol    |      100 |      100 |      100 |      100 |                |
----------------|----------|----------|----------|----------|----------------|
All files       |      100 |    69.23 |      100 |      100 |                |
----------------|----------|----------|----------|----------|----------------|

## Design Exercise Answer

we can create a separate contract called TokenVesting that controls the token release schedule. This contract will keep track of individual vesting schedules for each user and release tokens according to the defined schedule.

Here are the main trade-offs and considerations of this design:

**Gas costs**: The added functionality and storage requirements in the TokenVesting contract will increase gas costs for deployment and token release transactions

**Controlled token release**: Vesting tokens can prevent sudden token dumps by contributors

**Complexity**: Introducing vesting adds complexity to the overall system.

Here is some code that could be used to implement this:
```
contract TokenVesting is Ownable {
    struct VestingSchedule {
        uint256 start;
        uint256 duration;
        uint256 totalAmount;
        uint256 releasedAmount;
    }

    SpaceCoin public spaceCoin;
    mapping(address => VestingSchedule) private vestingSchedules;

    constructor(address _spaceCoin) {
        spaceCoin = SpaceCoin(_spaceCoin);
    }

    function addVestingSchedule(
        address beneficiary,
        uint256 start,
        uint256 duration,
        uint256 totalAmount
    ) external onlyOwner {
        require(vestingSchedules[beneficiary].totalAmount == 0, "Vesting schedule already exists");

        // Transfer tokens from SpaceCoinICO to TokenVesting
        spaceCoin.transferFrom(msg.sender, address(this), totalAmount);

        // Create a new vesting schedule
        vestingSchedules[beneficiary] = VestingSchedule(start, duration, totalAmount, 0);
    }

    function releaseTokens(address beneficiary) external {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "No vesting schedule found");

        uint256 elapsedTime = block.timestamp - schedule.start;
        uint256 vestedAmount = (elapsedTime * schedule.totalAmount) / schedule.duration;
        uint256 unreleasedAmount = vestedAmount - schedule.releasedAmount;

        require(unreleasedAmount > 0, "No tokens to release");

        schedule.releasedAmount = vestedAmount;
        spaceCoin.transfer(beneficiary, unreleasedAmount);
    }
}

```

## Testnet Deploy Information

| Contract  | Address Etherscan Link |
| --------- | ---------------------- |
| SpaceCoin | `https://sepolia.etherscan.io/address/0x20bA1bF66e093Ea3f87c82Afdc6A0c53fFB551D1`           |
| ICO       | `https://sepolia.etherscan.io/address/0xe4e3d2e4dD43EB9b1c9041CB00F52012723e5239`           |
