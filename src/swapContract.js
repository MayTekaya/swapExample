var Contract={};
Contract.AbiSwap = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "firstContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "secondContract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "idSwap",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "inValue",
				"type": "uint256"
			}
		],
		"name": "swap",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newRule",
				"type": "uint256"
			}
		],
		"name": "updateRule",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idSwap",
				"type": "uint256"
			}
		],
		"name": "getSwap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSwapsNb",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rule",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

Contract.addressSwap = "0x83347e841266939a2a363836cc83ed38cd2b7521";
//Contract.addressSwap = "0xd1F83dD639C5cF78DC474a63efB3D6B62559A08f";
module.exports = Contract;

//0.005933BNB deploiement swap contract