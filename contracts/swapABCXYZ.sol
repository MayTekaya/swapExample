// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;


library SafeMath {
      /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }


}


interface IERC20 {
  
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    function mint(address minter, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract swapContract {
    
     using SafeMath for uint256;
    
    struct Swap {
        uint256 swapID;
        uint256 swapDate;
        uint256 InValue;
        uint256 OutValue;
        address trader;
    }

    address owner;
    mapping (uint256 => Swap) private swaps;
    uint256[] tabSwaps;
    address private constant walletFees = 0xa3Cc23426e80492Dd1142Fa8078630b3E2b2BF8A;
    uint public rule=3;

    
    
    constructor (){
        owner= msg.sender;
    }
   
    modifier onlyOwner() {
       require(msg.sender == owner);
       _;
    }
    
    function swap(address firstContract, address secondContract, uint256 idSwap, uint256 inValue) public {
        
           uint256 valuePercent = ((inValue.mul(rule)).mul(3)).div(100);
        
           uint256 outvalue = inValue.mul(rule) - valuePercent;
          
           IERC20 firstERC20Contract = IERC20(firstContract);
           
           IERC20 secondERC20Contract = IERC20(secondContract); 
        
           swaps[idSwap].swapID = idSwap;
           
           swaps[idSwap].swapDate = block.timestamp;
           
           swaps[idSwap].InValue = inValue;
           
           swaps[idSwap].OutValue = outvalue;
           
           swaps[idSwap].trader = msg.sender;
           
           tabSwaps.push(idSwap);
           
           firstERC20Contract.transferFrom(msg.sender, address(this), inValue);
           
           secondERC20Contract.mint(msg.sender, outvalue);
           
           secondERC20Contract.mint(walletFees, valuePercent);
    }
    
    function updateRule(uint _newRule) public onlyOwner{
        rule= _newRule;
    }
    
    function getSwapsNb()public view returns(uint256[] memory) {
        return tabSwaps;
    }
    
    function getSwap( uint256 idSwap) public view returns(uint256, uint256, uint256, address){
        return ( swaps[idSwap].swapDate, swaps[idSwap].InValue, swaps[idSwap].OutValue, swaps[idSwap].trader);
    }


}