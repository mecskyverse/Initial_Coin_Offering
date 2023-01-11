//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";

contract cryptoDevToken is ERC20, Ownable {
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant tokensPerNft = 10 * 10 ** 18;
    uint256 public constant maxTotalSupply = 10000 * 10 ** 18;
    ICryptoDevs CryptoDevsNft;
    //mapping to keep track of which tookenId have been claimed
    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _cryptoDevsContract) ERC20("Crypto Dev Token", "CD") {
        CryptoDevsNft = ICryptoDevs(_cryptoDevsContract);
    }

    function mint(uint256 amount) public payable {
        require(msg.value >= tokenPrice * amount, "Ether sent is incorrect");
        uint256 amountWithDecimal = amount * 10 ** 18;
        require(
            totalSupply() + amountWithDecimal <= maxTotalSupply,
            "You've exceeded the total supply available"
        );
        _mint(msg.sender, amountWithDecimal);
    }

    function claim() public {
        uint256 balance = CryptoDevsNft.balanceOf(msg.sender);
        require(balance > 0, "you do not own any Crypto Dev NFT");
        uint256 amount = 0;
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = CryptoDevsNft.tokenOfOwnerByIndex(msg.sender, i);
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }
        require(amount > 0, "You have already claimed all the tokens");
        _mint(msg.sender, amount * tokensPerNft);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw balance is empty");
        address _owner = owner();
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Transaction failed");
    }

    receive() external payable {}

    fallback() external payable {}
}
