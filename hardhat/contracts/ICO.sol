// SPDX-License-Identifier:MIT
pragma solidity ^0.8.3;

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
}
