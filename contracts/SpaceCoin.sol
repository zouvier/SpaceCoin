pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SpaceCoin is ERC20, Ownable {
    address public treasury;
    bool public taxIsActive = false;
    uint256 constant TOTAL_SUPPLY = 500_000 ether;
    uint256 constant TREASURY_SUPPLY = 350_000 ether;



    constructor(address _treasury) ERC20("SpaceCoin", "SPC") {
        treasury = _treasury;
        _mint(_treasury, TREASURY_SUPPLY);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        if (taxIsActive) {
            uint taxAmount = amount * 2 / 100;
            amount = amount - taxAmount;
            super._transfer(sender, treasury, taxAmount);
        }  
        super._transfer(sender, recipient, amount);
    }

    function mintToICO(address icoContract, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= TOTAL_SUPPLY, "SpaceCoin: Max supply exceeded");
        _mint(icoContract, amount);
    }

    function activateTax(bool state) public onlyOwner {
        taxIsActive = state;
    }

    function getTreasuryAmount() public view onlyOwner returns (uint) {
        return balanceOf(treasury);
    }
}